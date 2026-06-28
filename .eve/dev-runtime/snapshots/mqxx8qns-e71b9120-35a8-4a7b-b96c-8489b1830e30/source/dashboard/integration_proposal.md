# Technical Integration Proposal: Real-Time SaaS Connections

This proposal details the implementation strategy for Gaps 1, 2, and 3, enabling real-time integration between the **Precedent CLI**, the **Web Dashboard**, the **API Gateway**, and the **GitHub App**.

---

## 1. System Communication Map

```
┌────────────────────────────────────────────────────────────────────────┐
│                              LOCAL SYSTEM                              │
│                                                                        │
│  ┌─────────────────┐                 ┌─────────────────────────────┐   │
│  │  Precedent CLI  ├────────────────►│  Local Vercel Eve Agent     │   │
│  │ (git diff read) │ (Spawns/Direct) │ (http://localhost:3000/eve) │   │
│  └─────────────────┘                 └──────────────┬──────────────┘   │
└─────────────────────────────────────────────────────┼──────────────────┘
                                                      │ (JSON Sync)
                                                      ▼
┌─────────────────┐      ┌─────────────────┐     ┌───────────────────────┐
│   GitHub App    │◄────►│   API Gateway   │◄───►│     Web Dashboard     │
│ (PR Webhook/API)│      │  (Next.js Host) │     │ (Vercel SSE Consumer) │
└─────────────────┘      └─────────────────┘     └───────────────────────┘
```

---

## 2. Gap 1: Real-Time Dashboard & Engine Connection (SSE)

Instead of using simulated log lists, the Dashboard Onboarding and Settings pages will connect to Eve's session stream using a proxy endpoint.

### Real-Time Build Flow (SSE Handshake)

1. **Start Session**: The Web Dashboard sends a `POST /api/build` to the API Gateway.
2. **Initiate Agent**: The Gateway generates a `sessionId` and forwards the instruction to the Eve agent:
   ```typescript
   // Gateway handler
   const res = await fetch(`http://localhost:3000/eve/v1/session/${sessionId}`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ message: `Build memory for ${repo}` })
   });
   ```
3. **SSE Proxy Endpoint**: The Dashboard opens an `EventSource` connection to the Gateway to stream output:
   ```typescript
   // dashboard/src/components/Onboarding.tsx
   const eventSource = new EventSource(`/api/build/stream?sessionId=${sessionId}`);
   
   eventSource.onmessage = (event) => {
     const data = JSON.parse(event.data);
     if (data.text) {
       setBuildLogs(prev => [...prev, data.text]);
     }
     if (data.done) {
       eventSource.close();
       onBuildComplete();
     }
   };
   ```

---

## 3. Gap 2: Production API Gateway (Backend routes)

The Gateway (built as serverless Next.js API routes or a lightweight Express handler) brokers security, database checks, and communication.

### Required Endpoints

#### 1. `POST /api/build`
*   **Payload**: `{ repo: string, count: number, token?: string }`
*   **Action**: Initializes a session with the Eve agent to trigger `github_fetcher` and Phase 1 subagents.
*   **Response**: `{ sessionId: string }`

#### 2. `GET /api/build/stream?sessionId=<id>`
*   **Action**: Sets up SSE headers (`text/event-stream`) and pipes the remote `/eve/v1/session/:sessionId/stream` content directly back to the dashboard client.

#### 3. `POST /api/review`
*   **Payload**: `{ repo: string, diff: string }`
*   **Action**: Triggers Phase 2 agents on the diff, returns the final mergeability report JSON payload.

#### 4. `GET /api/memory?repo=<owner/name>`
*   **Action**: Serves compiled structured memory JSON files (`architecture.json`, `known_pitfalls.json`) directly to the Dashboard's Memory Explorer view.

---

## 4. Gap 3: GitHub App & Actions Hook Integration

Enables automated PR checks that run and report directly on GitHub.

```
┌──────────┐              ┌───────────────┐              ┌──────────────────┐
│  GitHub  │              │  API Gateway  │              │ Vercel Eve Agent │
└────┬─────┘              └───────┬───────┘              └────────┬─────────┘
     │                            │                               │
     │ 1. pull_request.opened     │                               │
     ├───────────────────────────►│                               │
     │                            │ 2. POST /api/review           │
     │                            ├──────────────────────────────►│
     │                            │                               │
     │                            │ 3. Return report JSON         │
     │                            │◄──────────────────────────────┤
     │ 4. Post comment + Status   │                               │
     │◄───────────────────────────┤                               │
```

### Webhook Handling Steps (`/api/github/webhook`)

1. **Verification**: Verify the request signature using the GitHub App's Webhook Secret.
2. **Event Parsing**: Listen to `pull_request` (`opened`, `synchronize`).
3. **PR Diff Fetch**: Retrieve the PR diff via the GitHub REST API:
   ```typescript
   const diffRes = await octokit.rest.pulls.get({
     owner,
     repo,
     pull_number: prNumber,
     headers: { mediaType: { format: "diff" } }
   });
   ```
4. **Trigger Review**: Post the diff to `/api/review`.
5. **Post Comments & Statuses**:
   *   **PR Comment**: Post a formatted markdown report matching the **Mergeability Report** layout:
       ```typescript
       await octokit.rest.issues.createComment({
         owner,
         repo,
         issue_number: prNumber,
         body: generateMarkdownComment(report)
       });
       ```
   *   **Commit Status Check**: Set the commit check status:
       ```typescript
       await octokit.rest.checks.create({
         owner,
         repo,
         name: "Precedent Memory Check",
         head_sha: headSha,
         status: "completed",
         conclusion: report.score === "BLOCK" ? "failure" : "success",
         output: {
           title: `Gate Check: ${report.score}`,
           summary: `Found ${report.summary.critical_blockers} blockers and ${report.summary.missing_tests} test gaps.`
         }
       });
       ```
