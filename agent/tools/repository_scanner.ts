import { defineTool } from "eve/tools";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

export default defineTool({
  description: "Scan local repository files, read configurations, and ingest raw markdown logs or readme documents.",
  inputSchema: z.object({
    directoryPath: z.string().describe("The absolute path of the directory to scan."),
    scanType: z.enum(["config", "raw-logs", "readme", "all"]).default("all").describe("Type of scanning to perform.")
  }) as any,
  async execute({ directoryPath, scanType }: { directoryPath: string; scanType: "config" | "raw-logs" | "readme" | "all" }) {
    const results: Record<string, any> = {};

    const fileExists = async (filePath: string) => {
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    };

    // 1. Scan config
    if (scanType === "config" || scanType === "all") {
      const configPath = path.join(directoryPath, "user-input", "repo-config.json");
      if (await fileExists(configPath)) {
        const raw = await fs.readFile(configPath, "utf-8");
        try {
          results.config = JSON.parse(raw);
        } catch {
          results.config = { error: "Failed to parse repo-config.json as JSON." };
        }
      } else {
        results.config = null;
      }
    }

    // 2. Scan readmes
    if (scanType === "readme" || scanType === "all") {
      const readmePath = path.join(directoryPath, "README.md");
      const contribPath = path.join(directoryPath, "CONTRIBUTING.md");
      
      if (await fileExists(readmePath)) {
        results.readme = (await fs.readFile(readmePath, "utf-8")).slice(0, 10000); // Truncate if massive
      }
      if (await fileExists(contribPath)) {
        results.contributing = (await fs.readFile(contribPath, "utf-8")).slice(0, 10000);
      }
    }

    // 3. Scan raw logs
    if (scanType === "raw-logs" || scanType === "all") {
      const logsDir = path.join(directoryPath, "user-input", "raw-data");
      const rawLogs: { fileName: string; content: string }[] = [];

      try {
        const files = await fs.readdir(logsDir);
        for (const file of files) {
          if (file.endsWith(".md") || file.endsWith(".txt")) {
            const content = await fs.readFile(path.join(logsDir, file), "utf-8");
            rawLogs.push({ fileName: file, content: content.slice(0, 20000) });
          }
        }
        results.rawLogs = rawLogs;
      } catch {
        results.rawLogs = []; // logs dir doesn't exist
      }
    }

    return results;
  }
});
