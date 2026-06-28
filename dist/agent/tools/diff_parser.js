import { defineTool } from "eve/tools";
import { z } from "zod";
export default defineTool({
    description: "Parse a git diff string into a structured array of file changes.",
    inputSchema: z.object({
        diffString: z.string().describe("The raw git diff content.")
    }),
    async execute({ diffString }) {
        if (!diffString) {
            return { files: [] };
        }
        const files = [];
        const lines = diffString.split("\n");
        let currentFile = null;
        let currentHunk = null;
        for (const line of lines) {
            if (line.startsWith("diff --git")) {
                // Save previous file if exists
                if (currentFile) {
                    files.push(currentFile);
                }
                // Find filename
                const match = line.match(/b\/(.+)$/);
                const filePath = match ? match[1] : "unknown";
                currentFile = {
                    filePath,
                    additions: 0,
                    deletions: 0,
                    hunks: []
                };
                currentHunk = null;
                continue;
            }
            if (!currentFile)
                continue;
            if (line.startsWith("@@ ")) {
                currentHunk = {
                    header: line,
                    lines: []
                };
                currentFile.hunks.push(currentHunk);
                continue;
            }
            if (currentHunk) {
                currentHunk.lines.push(line);
            }
            if (line.startsWith("+") && !line.startsWith("+++")) {
                currentFile.additions++;
            }
            else if (line.startsWith("-") && !line.startsWith("---")) {
                currentFile.deletions++;
            }
        }
        if (currentFile) {
            files.push(currentFile);
        }
        return { files };
    }
});
