# Known Pitfalls Wiki Prompt

Generate `known_pitfalls.md` — the "danger database" of every trap, edge case, and landmine discovered in this project. This is the "what NOT to do" guide.

## Data Sources

1. **Bug fix PRs** — every fix PR describes something that was broken. Extract the trap.
2. **Review comments** — reviewers often catch edge cases before they ship. These are pre-shipped pitfalls.
3. **`review_failures.md`** — every failure entry can be recontextualized as a pitfall. The "Detection" and "Trigger" fields are especially useful.
4. **Raw data** — chat logs often contain troubleshooting sessions that reveal obscure traps.
5. **Error messages** mentioned in PRs or raw data — these are how users discover pitfalls.

## Conversion from Failures

Every entry in `review_failures.md` should also appear as a pitfall entry, but rephrased:
- Failure perspective: "Someone made this mistake"
- Pitfall perspective: "If you do X, Y will break"

## Categorization

Group pitfalls by the area of the system they affect:

- **Database**: SQLite, Postgres, migrations, query issues
- **API/Backend**: REST, GraphQL, WebSocket, server logic
- **UI/Frontend**: Rendering, state management, user experience
- **Security/Auth**: Authentication, authorization, secrets
- **Caching**: Redis, in-memory, stale data
- **Concurrency**: Race conditions, deadlocks, goroutines/threads
- **Configuration**: Environment variables, config files, settings
- **Deployment**: Multi-instance, scaling, platform-specific
- **Testing**: Flaky tests, mock issues, wrong assertions
- **Dependencies**: Library versions, compatibility

## For Each Pitfall

```markdown
### Pitfall: [Name — should describe the danger clearly]
- **Trigger**: What action, configuration, or condition causes this trap to spring
  (e.g. "Deploying multiple replicas without Redis configured")
  
- **Symptoms**: What the user or developer sees when this triggers
  (e.g. "401 errors on approvals; held approvals unreachable from different replica")
  
- **Root Cause**: Why it happens — the chain of events
  (e.g. "Process-local memory is used as Redis fallback; nonce minted on Instance A fails on Instance B")
  
- **Fix**: How to resolve or prevent it
  (e.g. "Fail closed at startup if route_set is proxy_lite but no clustered store configured")
  
- **Test/Verification**: How to confirm the fix works
  (e.g. "Deploy two replicas, submit approval on A, consume on B → succeeds with fix, fails without")
  
- **Cross-Reference**: Link to related failures or PRs
  (e.g. "See review_failures.md — Failure: Multi-Instance Nonce Desync")
```

## Quality Guidelines

- Every pitfall needs a clear TRIGGER — someone reading should know "when will I hit this?"
- Symptoms must be USER-VISIBLE, not code-level (what does the user see?)
- The Fix must be ACTIONABLE (specific steps or code pattern)
- Cross-reference to review_failures.md by exact failure name
- Include test steps that reproduce the pitfall (proves the understanding)
- If no real fix exists, note the workaround honestly
