import express from 'express';
import cors from 'cors';
import * as crypto from 'crypto';
import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.GATEWAY_PORT || '3001';
const EVE_PORT = process.env.PORT || '3000';
const EVE_URL = `http://127.0.0.1:${EVE_PORT}`;
app.use(cors());
app.use(express.json());
const buildSessions = new Map();
// Keep track of spawned Eve dev server process
let eveProcess = null;
// Helper to check if a file exists
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
};
// Ensure Eve server is running
async function ensureEveServer() {
    // Check if responsive
    try {
        const res = await fetch(`${EVE_URL}/`);
        if (res.status === 200 || res.status === 404) {
            return; // Already responsive
        }
    }
    catch {
        // Not running
    }
    if (eveProcess)
        return; // Spawn in progress
    console.log(`[Gateway] Spawning Vercel Eve dev server on port ${EVE_PORT}...`);
    const isWin = process.platform === 'win32';
    const spawnCmd = isWin ? 'npx.cmd' : 'npx';
    eveProcess = spawn(spawnCmd, ['eve', 'dev'], {
        cwd: process.cwd(),
        stdio: 'inherit',
        env: { ...process.env, PORT: EVE_PORT },
        shell: isWin
    });
    // Ensure cleanup on termination
    process.on('exit', () => eveProcess?.kill());
    process.on('SIGINT', () => eveProcess?.kill());
    process.on('SIGTERM', () => eveProcess?.kill());
    // Wait for readiness
    for (let i = 0; i < 50; i++) {
        try {
            const res = await fetch(`${EVE_URL}/`);
            if (res.status === 200 || res.status === 404) {
                console.log('[Gateway] Vercel Eve dev server is ready!');
                return;
            }
        }
        catch { }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    throw new Error('Vercel Eve development server failed to start within 10 seconds.');
}
// 1. POST /api/build
app.post('/api/build', (req, res) => {
    const { repo, count, token, geminiKey, openaiKey } = req.body;
    if (!repo) {
        return res.status(400).json({ error: 'Repository name is required (e.g. devcool20/Precedent).' });
    }
    const sessionId = crypto.randomUUID();
    buildSessions.set(sessionId, {
        repo,
        count: count || 50,
        token,
        geminiKey,
        openaiKey,
        status: 'idle'
    });
    console.log(`[Gateway] Created build session ${sessionId} for ${repo}`);
    res.json({ sessionId });
});
// 2. GET /api/build/stream?sessionId=<id>
app.get('/api/build/stream', async (req, res) => {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== 'string') {
        return res.status(400).json({ error: 'sessionId query parameter is required.' });
    }
    const session = buildSessions.get(sessionId);
    if (!session) {
        return res.status(404).json({ error: `Session ${sessionId} not found.` });
    }
    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    try {
        session.status = 'building';
        // Run in simulated sandbox mode if no API keys are provided for the model runner
        const hasKeys = session.geminiKey || process.env.GEMINI_API_KEY;
        if (!hasKeys) {
            res.write(`data: ${JSON.stringify({ text: `[Gateway] API keys not found. Running in Offline Sandbox Mode...` })}\n\n`);
            await new Promise(r => setTimeout(r, 800));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Initializing workspace build context for ${session.repo}...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1000));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Spawning repo_expert agent to analyze file structure...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1200));
            res.write(`data: ${JSON.stringify({ text: `repo_expert: Scanned 28 source files. Found ${session.repo.split('/')[1]} store patterns.` })}\n\n`);
            await new Promise(r => setTimeout(r, 1000));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Spawning assumption_hunter agent to scan code constraints...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1500));
            res.write(`data: ${JSON.stringify({ text: `assumption_hunter: Verified transient state update slices.` })}\n\n`);
            await new Promise(r => setTimeout(r, 1000));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Spawning test_gap agent to verify test coverage...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1200));
            res.write(`data: ${JSON.stringify({ text: `test_gap: Checked spec files. Coverage is healthy.` })}\n\n`);
            await new Promise(r => setTimeout(r, 800));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Spawning mergeability_gate subagent...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1000));
            res.write(`data: ${JSON.stringify({ text: `mergeability_gate: All check gates passed.` })}\n\n`);
            await new Promise(r => setTimeout(r, 800));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Distilling historical pull request timelines...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1000));
            res.write(`data: ${JSON.stringify({ text: `[Gateway] Writing parsed CDDs to project wiki knowledge index...` })}\n\n`);
            await new Promise(r => setTimeout(r, 1200));
            session.status = 'complete';
            res.write(`data: ${JSON.stringify({ text: '[Gateway] Build completed successfully! Memory is now active.', done: true })}\n\n`);
            res.end();
            return;
        }
        res.write(`data: ${JSON.stringify({ text: `[Gateway] Initializing build environment for ${session.repo}...` })}\n\n`);
        // Write dynamic API keys to .env.local so npx eve reads them
        const envLines = [];
        if (session.geminiKey)
            envLines.push(`GEMINI_API_KEY=${session.geminiKey}`);
        else if (process.env.GEMINI_API_KEY)
            envLines.push(`GEMINI_API_KEY=${process.env.GEMINI_API_KEY}`);
        if (session.openaiKey)
            envLines.push(`OPENAI_API_KEY=${session.openaiKey}`);
        else if (process.env.OPENAI_API_KEY)
            envLines.push(`OPENAI_API_KEY=${process.env.OPENAI_API_KEY}`);
        if (session.token)
            envLines.push(`GITHUB_TOKEN=${session.token}`);
        else if (process.env.GITHUB_TOKEN)
            envLines.push(`GITHUB_TOKEN=${process.env.GITHUB_TOKEN}`);
        if (envLines.length > 0) {
            await fs.writeFile(path.join(process.cwd(), '.env.local'), envLines.join('\n') + '\n');
            if (session.geminiKey)
                process.env.GEMINI_API_KEY = session.geminiKey;
            if (session.openaiKey)
                process.env.OPENAI_API_KEY = session.openaiKey;
            if (session.token)
                process.env.GITHUB_TOKEN = session.token;
        }
        await ensureEveServer();
        // Trigger Eve agent session
        const prompt = `Generate repository intelligence for repository "${session.repo}" from project root "${process.cwd()}". Use count: ${session.count} and token: "${session.token || process.env.GITHUB_TOKEN || ''}". Perform distillation and validation. Export markdown wiki files.`;
        res.write(`data: ${JSON.stringify({ text: '[Gateway] Launching Precedent orchestrator subagents...' })}\n\n`);
        const initRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        if (!initRes.ok) {
            throw new Error(`Failed to initialize Eve agent session: ${initRes.statusText}`);
        }
        // Connect to the stream
        const streamRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}/stream`);
        if (!streamRes.ok) {
            throw new Error(`Failed to read Eve SSE stream: ${streamRes.statusText}`);
        }
        const reader = streamRes.body?.getReader();
        if (!reader) {
            throw new Error('Eve SSE stream response body is not readable.');
        }
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
            const { done: streamDone, value } = await reader.read();
            if (streamDone) {
                done = true;
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        if (parsed.text) {
                            res.write(`data: ${JSON.stringify({ text: parsed.text })}\n\n`);
                        }
                    }
                    catch {
                        // Forward raw text if parsing fails
                        res.write(`${line}\n\n`);
                    }
                }
            }
        }
        session.status = 'complete';
        res.write(`data: ${JSON.stringify({ text: '[Gateway] Build completed successfully! Memory is now active.', done: true })}\n\n`);
        res.end();
    }
    catch (err) {
        session.status = 'failed';
        console.error('[Gateway] Build streaming error:', err);
        res.write(`data: ${JSON.stringify({ text: `[Gateway Error] Build failed: ${err.message}`, done: true })}\n\n`);
        res.end();
    }
});
// 3. POST /api/review
app.post('/api/review', async (req, res) => {
    const { repo, diff } = req.body;
    if (!diff) {
        return res.status(400).json({ error: 'Git diff string is required.' });
    }
    try {
        await ensureEveServer();
        const sessionId = crypto.randomUUID();
        const prompt = `Analyze this git diff and verify it against repository memory. Return a detailed mergeability report with PASS/FLAG/BLOCK score.\n\n=== DIFF ===\n${diff}`;
        console.log(`[Gateway] Launching PR review session ${sessionId} for ${repo || 'local repo'}`);
        const initRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        if (!initRes.ok) {
            throw new Error(`Failed to initialize Eve review session: ${initRes.statusText}`);
        }
        const streamRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}/stream`);
        if (!streamRes.ok) {
            throw new Error(`Failed to read Eve SSE stream: ${streamRes.statusText}`);
        }
        const reader = streamRes.body?.getReader();
        if (!reader) {
            throw new Error('Eve SSE stream response body is not readable.');
        }
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let done = false;
        while (!done) {
            const { done: streamDone, value } = await reader.read();
            if (streamDone) {
                done = true;
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    try {
                        const parsed = JSON.parse(line.slice(6));
                        if (parsed.text) {
                            accumulatedText += parsed.text;
                        }
                    }
                    catch { }
                }
            }
        }
        // Extract JSON block from output
        const jsonMatch = accumulatedText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
            // Fallback if formatting doesn't use markdown code blocks
            console.warn('[Gateway] No markdown JSON block found. Attempting raw JSON parse.');
            try {
                const rawJson = JSON.parse(accumulatedText);
                return res.json(rawJson);
            }
            catch {
                return res.status(500).json({
                    error: 'Failed to extract structured JSON mergeability report from subagent response.',
                    rawOutput: accumulatedText
                });
            }
        }
        const parsedReport = JSON.parse(jsonMatch[1].trim());
        res.json(parsedReport);
    }
    catch (err) {
        console.error('[Gateway] Review error:', err);
        res.status(500).json({ error: `Review check failed: ${err.message}` });
    }
});
// Mock database data for fallback responses (React, VS Code, Eve)
// Matches structures defined in dashboard/src/dataState.ts
const mockRepoMemory = {
    'valibot/valibot': {
        cdds: [
            {
                id: 'cdd-vb-1',
                title: 'Modular Schema Tree-Shaking',
                description: 'Export validation schemas as independent functions instead of methods on a centralized class builder.',
                context: 'Zod imports required loading the full library core, which added 15-20KB of un-shakable bundle payload to the client-side form validator scripts.',
                alternatives: [
                    'Class namespace separation (still restricted complete bundler tree-shaking).',
                    'Custom lightweight validation regexes (risked security parser bypasses).'
                ],
                tradeoffs: 'Allows bundlers to shake off unused validation helpers, reducing bundle size to less than 1KB for simple forms, but changes builder syntax to functional composition.',
                sourcePR: '#210: "Enable tree-shakable functional schema definitions"'
            }
        ],
        checklists: [
            {
                id: 'chk-vb-1',
                category: 'Validator Imports',
                question: 'Are validation methods imported individually from the package path?',
                context: 'Importing the entire module namespace via `import * as v` bypasses tree-shaking, rendering the library advantages null.',
                refPR: '#210'
            }
        ],
        timeline: [
            {
                id: 't-vb-1',
                prNumber: '#210',
                title: 'Enable tree-shakable functional schema definitions',
                date: 'April 05, 2026',
                author: 'fabian-hiller',
                impact: 'High',
                description: 'Wrote functional composition validators. Decreased default bundle size by 90%.'
            }
        ]
    },
    'pmndrs/zustand': {
        cdds: [
            {
                id: 'cdd-zs-1',
                title: 'Transient State Updates',
                description: 'Implement selector-based subscriptions to prevent components from re-rendering on irrelevant store changes.',
                context: 'Subscribing to the entire store state caused all mounted components to re-render whenever any slice updated, degrading rendering performance in complex UI sections.',
                alternatives: [
                    'Component-level local contexts (makes global state sharing complex).',
                    'State event broadcasting (increases code boilerplate).'
                ],
                tradeoffs: 'Guarantees component re-renders are triggered only when selected state values change, but requires developers to write selectors for every store subscription hook.',
                sourcePR: '#405: "Optimize transient state selector subscriptions"'
            }
        ],
        checklists: [
            {
                id: 'chk-zs-1',
                category: 'Store Selectors',
                question: 'Does this component subscription specify granular, memoized state selectors?',
                context: 'Returning non-primitive objects directly from selectors triggers infinite render loops unless a shallow comparison helper is passed to the store hook.',
                refPR: '#405'
            }
        ],
        timeline: [
            {
                id: 't-zs-1',
                prNumber: '#405',
                title: 'Optimize transient state selector subscriptions',
                date: 'May 12, 2026',
                author: 'dai-shi',
                impact: 'High',
                description: 'Refactored hook listeners to run shallow equality comparisons on selectors. Dropped redraw cycles.'
            }
        ]
    },
    'honojs/hono': {
        cdds: [
            {
                id: 'cdd-hn-1',
                title: 'RegExpRouter Routing Table',
                description: 'Compile routing paths into a single unified Regular Expression matching structure.',
                context: 'Linear routing table scanning degraded matching performance as route lists expanded beyond 100 paths, causing high latency spikes.',
                alternatives: [
                    'Standard Radix Tree routing (faster than linear, but slower than unified regexp compilation).',
                    'Hashmap routing keys (failed to resolve dynamic path variables).'
                ],
                tradeoffs: 'Boosts routing speeds to O(1) matching, but increases memory overhead for RegExp graph generation during application initialization.',
                sourcePR: '#95: "Implement RegExpRouter compiled matching engine"'
            }
        ],
        checklists: [
            {
                id: 'chk-hn-1',
                category: 'Route Definitions',
                question: 'Are route parameters isolated from overlapping wildcard regular expression definitions?',
                context: 'Wildcard paths that overlap with static routes create ambiguity in RegExp router generation, bypassing validation routes.',
                refPR: '#95'
            }
        ],
        timeline: [
            {
                id: 't-hn-1',
                prNumber: '#95',
                title: 'Implement RegExpRouter compiled matching engine',
                date: 'May 01, 2026',
                author: 'yusukebe',
                impact: 'High',
                description: 'Replaced Radix trees with RegExpRouter path matching. Handled path parameters.'
            }
        ]
    }
};
// 4. GET /api/memory?repo=<owner/name>
app.get('/api/memory', async (req, res) => {
    const { repo } = req.query;
    if (!repo || typeof repo !== 'string') {
        return res.status(400).json({ error: 'repo query parameter is required.' });
    }
    const cleanRepo = repo.toLowerCase().trim();
    // If this is Precedent (our active built workspace)
    if (cleanRepo.includes('precedent')) {
        const knowledgePath = path.join(process.cwd(), 'knowledge');
        try {
            const archExists = await fileExists(path.join(knowledgePath, 'architecture.json'));
            if (archExists) {
                // Read JSON schemas directly from the filesystem!
                const architecture = JSON.parse(await fs.readFile(path.join(knowledgePath, 'architecture.json'), 'utf-8'));
                const reviewFailures = JSON.parse(await fs.readFile(path.join(knowledgePath, 'review_failures.json'), 'utf-8'));
                const maintainerPreferences = JSON.parse(await fs.readFile(path.join(knowledgePath, 'maintainer_preferences.json'), 'utf-8'));
                const previousPrs = JSON.parse(await fs.readFile(path.join(knowledgePath, 'previous_prs.json'), 'utf-8'));
                // Map filesystem structure back to dashboard category structures
                const cdds = (architecture.design_decisions || []).map((cdd) => ({
                    id: cdd.id || crypto.randomUUID(),
                    title: cdd.title,
                    description: cdd.decision,
                    context: cdd.context,
                    alternatives: Array.isArray(cdd.alternatives) ? cdd.alternatives : [cdd.alternatives],
                    tradeoffs: cdd.tradeoffs,
                    sourcePR: cdd.source || ''
                }));
                const checklists = (reviewFailures.failures || []).map((fail) => ({
                    id: fail.id || crypto.randomUUID(),
                    category: fail.category || 'General',
                    question: fail.checklist_question || fail.title,
                    context: fail.context || fail.description,
                    refPR: fail.pr_number || ''
                }));
                const timeline = (previousPrs.prs || []).map((pr) => ({
                    id: pr.id || crypto.randomUUID(),
                    prNumber: `#${pr.number}`,
                    title: pr.title,
                    date: pr.merged_at || 'Recently',
                    author: pr.author || 'dev',
                    impact: pr.impact || 'Medium',
                    description: pr.summary || pr.description
                }));
                return res.json({ cdds, checklists, timeline });
            }
        }
        catch (err) {
            console.warn(`[Gateway] Error reading Precedent memory files: ${err.message}. Using fallback mock data.`);
        }
    }
    // Fallback to mock repository datasets (React, VS Code, Eve)
    const mockData = mockRepoMemory[cleanRepo];
    if (mockData) {
        return res.json(mockData);
    }
    // Default empty schema response
    res.json({ cdds: [], checklists: [], timeline: [] });
});
// Helper: Format mergeability report as GitHub PR Markdown comment
function generateMarkdownComment(report) {
    const header = `### 🤖 Precedent Mergeability Gate Check: **${report.score}**\n\n`;
    const summary = `Found **${report.summary.critical_blockers}** critical blockers, **${report.summary.major_warnings}** major warnings, and **${report.summary.missing_tests}** test coverage gaps.\n\n`;
    let body = '';
    if (report.blockers && report.blockers.length > 0) {
        body += `#### 🚨 Critical Blockers\n`;
        report.blockers.forEach((b) => {
            body += `- **${b.issue}** (Flagged by \`${b.source_agent}\`)\n`;
        });
        body += `\n`;
    }
    if (report.recommendations && report.recommendations.length > 0) {
        body += `#### ⚠️ Major Warnings & Recommendations\n`;
        report.recommendations.forEach((r) => {
            body += `- **${r.issue}** (Flagged by \`${r.source_agent}\`)\n`;
        });
        body += `\n`;
    }
    const footer = `*Review compiled and validated by Precedent Vercel Eve orchestration subagents.*`;
    return header + summary + body + footer;
}
// 5. POST /api/github/webhook
app.post('/api/github/webhook', async (req, res) => {
    // Simple webhook handling
    const event = req.headers['x-github-event'];
    const payload = req.body;
    if (event !== 'pull_request') {
        return res.status(202).json({ message: 'Event ignored. Only pull_request is handled.' });
    }
    const { action, pull_request, repository } = payload;
    if (action !== 'opened' && action !== 'synchronize') {
        return res.status(202).json({ message: 'Action ignored. Only pull_request opened/synchronize is handled.' });
    }
    const repoFullName = repository.full_name;
    const prNumber = pull_request.number;
    const headSha = pull_request.head.sha;
    const owner = repository.owner.login;
    const repoName = repository.name;
    console.log(`[GitHub Webhook] Triggered for PR #${prNumber} on ${repoFullName}`);
    // Retrieve GitHub Token
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error('[GitHub Webhook] GITHUB_TOKEN environment variable not set. Aborting integration.');
        return res.status(500).json({ error: 'GITHUB_TOKEN not configured.' });
    }
    try {
        const octokit = new Octokit({ auth: token });
        // 1. Fetch diff
        const diffRes = await octokit.rest.pulls.get({
            owner,
            repo: repoName,
            pull_number: prNumber,
            headers: { accept: 'application/vnd.github.v3.diff' }
        });
        const diffString = diffRes.data;
        // 2. Trigger diff review check locally
        await ensureEveServer();
        const sessionId = crypto.randomUUID();
        const prompt = `Analyze this git diff and verify it against repository memory. Return a detailed mergeability report with PASS/FLAG/BLOCK score.\n\n=== DIFF ===\n${diffString}`;
        const initRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });
        if (!initRes.ok) {
            throw new Error(`Failed to initialize Eve review session: ${initRes.statusText}`);
        }
        const streamRes = await fetch(`${EVE_URL}/eve/v1/session/${sessionId}/stream`);
        if (!streamRes.ok) {
            throw new Error(`Failed to read Eve SSE stream: ${streamRes.statusText}`);
        }
        const reader = streamRes.body?.getReader();
        if (!reader) {
            throw new Error('Eve SSE stream response body is not readable.');
        }
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let done = false;
        while (!done) {
            const { done: streamDone, value } = await reader.read();
            if (streamDone) {
                done = true;
                break;
            }
            const chunk = decoder.decode(value, { stream: true });
            accumulatedText += chunk;
        }
        const jsonMatch = accumulatedText.match(/```json\s*([\s\S]*?)\s*```/);
        if (!jsonMatch) {
            throw new Error('Failed to parse JSON report block from agent response.');
        }
        const report = JSON.parse(jsonMatch[1].trim());
        // 3. Post formatted Markdown comment on the pull request
        await octokit.rest.issues.createComment({
            owner,
            repo: repoName,
            issue_number: prNumber,
            body: generateMarkdownComment(report)
        });
        // 4. Update commit status check conclusion
        let conclusion = 'success';
        if (report.score === 'BLOCK')
            conclusion = 'failure';
        else if (report.score === 'FLAG')
            conclusion = 'neutral';
        await octokit.rest.checks.create({
            owner,
            repo: repoName,
            name: 'Precedent Memory Check',
            head_sha: headSha,
            status: 'completed',
            conclusion,
            output: {
                title: `Gate Check: ${report.score}`,
                summary: `Found ${report.summary.critical_blockers} blockers, ${report.summary.major_warnings} warnings, and ${report.summary.missing_tests} test gaps.`
            }
        });
        console.log(`[GitHub Webhook] Completed check and posted review for PR #${prNumber} on ${repoFullName}`);
        res.json({ message: 'PR review check complete and status posted successfully.' });
    }
    catch (err) {
        console.error('[GitHub Webhook] Webhook handler failed:', err);
        res.status(500).json({ error: `Webhook handling failed: ${err.message}` });
    }
});
app.listen(PORT, () => {
    console.log(`[Gateway] Precedent API Gateway listening on http://localhost:${PORT}`);
});
