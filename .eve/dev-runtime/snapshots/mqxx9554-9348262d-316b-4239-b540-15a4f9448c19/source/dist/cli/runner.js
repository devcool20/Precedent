import { spawn } from "child_process";
import * as crypto from "crypto";
export async function runEveAgent({ projectRoot, message, onChunk }) {
    const port = process.env.PORT || "3000";
    const url = `http://127.0.0.1:${port}`;
    // 1. Start eve dev in background
    const eveProcess = spawn("npx", ["eve", "dev"], {
        cwd: projectRoot,
        stdio: "pipe",
        env: { ...process.env, PORT: port }
    });
    let ended = false;
    const cleanup = () => {
        if (!ended) {
            ended = true;
            eveProcess.kill("SIGTERM");
        }
    };
    // Ensure process terminates on exits
    process.on("exit", cleanup);
    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
    // 2. Wait for server to be responsive
    let ready = false;
    for (let i = 0; i < 50; i++) {
        try {
            const res = await fetch(`${url}/`);
            if (res.status === 200 || res.status === 404) {
                ready = true;
                break;
            }
        }
        catch {
            // Not ready yet
        }
        await new Promise((resolve) => setTimeout(resolve, 200));
    }
    if (!ready) {
        cleanup();
        throw new Error("Vercel Eve development server failed to start within 10 seconds.");
    }
    // 3. Initiate agent session
    const sessionId = crypto.randomUUID();
    const sessionUrl = `${url}/eve/v1/session/${sessionId}`;
    try {
        // We send a POST request with the initial instruction message.
        const res = await fetch(sessionUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        if (!res.ok) {
            throw new Error(`Failed to initialize session: ${res.statusText}`);
        }
        // 4. Stream output from the session stream
        const streamRes = await fetch(`${sessionUrl}/stream`);
        if (!streamRes.ok) {
            throw new Error(`Failed to open SSE stream: ${streamRes.statusText}`);
        }
        const reader = streamRes.body?.getReader();
        if (!reader) {
            throw new Error("Response body is not readable.");
        }
        const decoder = new TextDecoder();
        let accumulatedResponse = "";
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            const chunk = decoder.decode(value, { stream: true });
            accumulatedResponse += chunk;
            // Extract text content from SSE event lines (looks like data: {"text": "..."})
            const lines = chunk.split("\n");
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    try {
                        const data = JSON.parse(line.slice(6));
                        if (data.text && onChunk) {
                            onChunk(data.text);
                        }
                    }
                    catch {
                        // Raw text or partial data, pass it if needed
                    }
                }
            }
        }
        cleanup();
        return accumulatedResponse;
    }
    catch (error) {
        cleanup();
        throw error;
    }
}
