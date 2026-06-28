import { defineTool } from "eve/tools";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

export default defineTool({
  description: "Perform programmatic consistency and integrity checks on extracted repository memory JSON data.",
  inputSchema: z.object({
    projectRoot: z.string().describe("The absolute path to the project root."),
    prDataPath: z.string().describe("The absolute path to the fetched PRs JSON data.")
  }) as any,
  async execute({ projectRoot, prDataPath }: { projectRoot: string; prDataPath: string }) {
    const knowledgePath = path.join(projectRoot, "knowledge");
    
    const fileExists = async (filePath: string) => {
      try {
        await fs.access(filePath);
        return true;
      } catch {
        return false;
      }
    };

    const readJson = async (fileName: string) => {
      const p = path.join(knowledgePath, fileName);
      if (!(await fileExists(p))) return null;
      try {
        return JSON.parse(await fs.readFile(p, "utf-8"));
      } catch {
        return null;
      }
    };

    const integrityReport: {
      checks_run: string[];
      invalid_pr_references: string[];
      empty_sections: string[];
      validation_warnings: string[];
    } = {
      checks_run: [],
      invalid_pr_references: [],
      empty_sections: [],
      validation_warnings: []
    };

    // Load fetched PRs list to verify references
    let fetchedPRNumbers = new Set<number>();
    if (await fileExists(prDataPath)) {
      try {
        const data = JSON.parse(await fs.readFile(prDataPath, "utf-8"));
        const prList = data.prs || [];
        for (const pr of prList) {
          fetchedPRNumbers.add(pr.number);
        }
        integrityReport.checks_run.push("loaded-pr-database");
      } catch {
        integrityReport.validation_warnings.push("Failed to parse fetched PR database. Cannot verify references.");
      }
    } else {
      integrityReport.validation_warnings.push("Fetched PR database not found. Skipping reference verification.");
    }

    // Verify Architecture
    const arch = await readJson("architecture.json");
    if (arch) {
      integrityReport.checks_run.push("architecture-validation");
      if (!arch.system_overview || !arch.system_overview.core_purpose) {
        integrityReport.empty_sections.push("architecture.system_overview");
      }
      if (arch.design_decisions) {
        for (const cdd of arch.design_decisions) {
          const match = cdd.source?.match(/#(\d+)/);
          if (match) {
            const prNum = parseInt(match[1], 10);
            if (fetchedPRNumbers.size > 0 && !fetchedPRNumbers.has(prNum)) {
              integrityReport.invalid_pr_references.push(`architecture.design_decisions: PR #${prNum} is cited but does not exist in fetched PR data.`);
            }
          }
        }
      }
    } else {
      integrityReport.empty_sections.push("architecture.json");
    }

    // Verify Review Failures
    const failures = await readJson("review_failures.json");
    if (failures) {
      integrityReport.checks_run.push("review-failures-validation");
      if (!failures.failures || failures.failures.length === 0) {
        integrityReport.empty_sections.push("review_failures.failures");
      } else {
        for (const fail of failures.failures) {
          const match = fail.context?.match(/#(\d+)/);
          if (match) {
            const prNum = parseInt(match[1], 10);
            if (fetchedPRNumbers.size > 0 && !fetchedPRNumbers.has(prNum)) {
              integrityReport.invalid_pr_references.push(`review_failures.failures: PR #${prNum} in failure '${fail.title}' does not exist in fetched PR data.`);
            }
          }
        }
      }
    } else {
      integrityReport.empty_sections.push("review_failures.json");
    }

    // Verify Pitfalls
    const pitfalls = await readJson("known_pitfalls.json");
    if (pitfalls) {
      integrityReport.checks_run.push("known-pitfalls-validation");
      if (!pitfalls.pitfalls || pitfalls.pitfalls.length === 0) {
        integrityReport.empty_sections.push("known_pitfalls.pitfalls");
      }
    } else {
      integrityReport.empty_sections.push("known_pitfalls.json");
    }

    return integrityReport;
  }
});
