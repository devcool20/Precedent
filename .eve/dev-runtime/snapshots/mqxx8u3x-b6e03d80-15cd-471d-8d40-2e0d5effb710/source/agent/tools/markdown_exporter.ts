import { defineTool } from "eve/tools";
import { z } from "zod";
import * as fs from "fs/promises";
import * as path from "path";

export default defineTool({
  description: "Export structured JSON repository memory into 6 compatible human-readable markdown wiki files.",
  inputSchema: z.object({
    projectRoot: z.string().describe("The absolute path to the project root."),
    outputPath: z.string().describe("The absolute path where the markdown files should be saved.")
  }) as any,
  async execute({ projectRoot, outputPath }: { projectRoot: string; outputPath: string }) {
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

    // Ensure output directory exists
    await fs.mkdir(outputPath, { recursive: true });

    // 1. Export Architecture
    const archData = await readJson("architecture.json");
    if (archData) {
      let md = `# Architecture\n\n`;
      if (archData.system_overview) {
        md += `> ${archData.system_overview.core_purpose || archData.system_overview.description || ""}\n\n`;
      }
      
      md += `## Tech Stack\n\n`;
      md += `| Layer | Technology | Version | Purpose |\n`;
      md += `|-------|-----------|---------|---------|\n`;
      if (archData.tech_stack) {
        for (const item of archData.tech_stack) {
          md += `| ${item.layer} | ${item.technology} | ${item.version || "N/A"} | ${item.purpose} |\n`;
        }
      }
      md += `\n`;

      md += `## Directory Structure\n\n`;
      md += `\`\`\`\n.\n`;
      if (archData.directory_structure) {
        for (const dir of archData.directory_structure) {
          md += `├── ${dir.path} # ${dir.purpose}\n`;
        }
      }
      md += `\`\`\`\n\n`;

      md += `## Component Map\n\n`;
      md += `| Component | Responsibility | Key Files | Consumed By |\n`;
      md += `|-----------|---------------|-----------|-------------|\n`;
      if (archData.components) {
        for (const comp of archData.components) {
          md += `| ${comp.name} | ${comp.responsibility} | ${comp.key_files?.join(", ") || "None"} | ${comp.consumed_by?.join(", ") || "None"} |\n`;
        }
      }
      md += `\n`;

      md += `## Data Flow\n\n`;
      if (archData.data_flows) {
        for (const flow of archData.data_flows) {
          md += `### ${flow.name}\n`;
          md += `**Trigger**: ${flow.trigger}\n`;
          md += `**Path**: ${flow.path?.join(" → ") || ""}\n`;
          md += `**Result**: ${flow.result}\n\n`;
          md += `${flow.description || ""}\n\n`;
        }
      }

      md += `## Key Design Decisions\n\n`;
      if (archData.design_decisions) {
        for (const cdd of archData.design_decisions) {
          md += `### ${cdd.id || "CDD"}: ${cdd.title}\n`;
          md += `- **Context**: ${cdd.context}\n`;
          md += `- **Decision**: ${cdd.decision}\n`;
          md += `- **Alternatives**: ${cdd.alternatives}\n`;
          md += `- **Tradeoffs**: ${cdd.tradeoffs}\n`;
          md += `- **Source**: ${cdd.source}\n\n`;
        }
      }

      md += `## Constraints\n\n`;
      if (archData.constraints) {
        if (archData.constraints.platform) {
          for (const c of archData.constraints.platform) {
            md += `- **Platform**: ${c}\n`;
          }
        }
        if (archData.constraints.technical) {
          for (const c of archData.constraints.technical) {
            md += `- **Technical**: ${c}\n`;
          }
        }
      }
      md += `\n`;

      md += `## Terminology\n\n`;
      md += `| Term | Definition |\n`;
      md += `|------|------------|\n`;
      if (archData.terminology) {
        for (const term of archData.terminology) {
          md += `| ${term.term} | ${term.definition} |\n`;
        }
      }

      await fs.writeFile(path.join(outputPath, "architecture.md"), md, "utf-8");
    }

    // 2. Export Review Failures
    const failuresData = await readJson("review_failures.json");
    if (failuresData) {
      let md = `# Review Failures\n\n`;
      if (failuresData.failures) {
        for (const fail of failuresData.failures) {
          md += `### Failure: ${fail.title}\n`;
          md += `- **Category**: ${fail.category}\n`;
          md += `- **Context**: ${fail.context}\n`;
          md += `- **Root Cause**: ${fail.root_cause}\n`;
          md += `- **Why Contributor Missed It**: ${fail.why_contributor_missed_it}\n`;
          md += `- **Why Reviewer Found It**: ${fail.why_reviewer_found_it}\n`;
          md += `- **Detection**: ${fail.detection}\n`;
          md += `- **Fix**: ${fail.fix}\n`;
          md += `- **Prevention Rule**: ${fail.prevention_rule}\n`;
          md += `- **Checklist Item**: ${fail.checklist_item}\n`;
          md += `- **Severity**: ${fail.severity}\n`;
          md += `- **Related Files**: ${fail.related_files?.join(", ") || "None"}\n\n`;
        }
      }

      md += `## Categories Summary\n\n`;
      md += `| Category | Count |\n`;
      md += `|----------|-------|\n`;
      if (failuresData.categories_summary) {
        for (const cat of failuresData.categories_summary) {
          md += `| ${cat.category} | ${cat.count} |\n`;
        }
      }

      await fs.writeFile(path.join(outputPath, "review_failures.md"), md, "utf-8");
    }

    // 3. Export Maintainer Preferences
    const preferencesData = await readJson("maintainer_preferences.json");
    if (preferencesData) {
      let md = `# Maintainer Preferences\n\n`;
      if (preferencesData.maintainers) {
        for (const maint of preferencesData.maintainers) {
          md += `## ${maint.name}\n\n`;
          md += `### Core Philosophy\n${maint.core_philosophy}\n\n`;
          
          md += `### Review Style\n`;
          if (maint.review_style) {
            for (const r of maint.review_style) md += `- ${r}\n`;
          }
          md += `\n`;

          md += `### Specific Technical Preferences\n`;
          if (maint.technical_preferences) {
            for (const tp of maint.technical_preferences) {
              md += `- **${tp.area}**: ${tp.preference} (${tp.evidence})\n`;
            }
          }
          md += `\n`;

          md += `### What They Will Reject Fast\n`;
          if (maint.rejections) {
            for (const r of maint.rejections) {
              md += `- **${r.pattern}**: ${r.why} (PR Ref: ${r.evidence_pr})\n`;
            }
          }
          md += `\n`;

          md += `### Communication Preferences\n`;
          if (maint.communication_preferences) {
            for (const c of maint.communication_preferences) md += `- ${c}\n`;
          }
          md += `\n---\n\n`;
        }
      }
      
      if (preferencesData.global_patterns) {
        md += `## Repetition Pattern\n\n`;
        md += `${preferencesData.global_patterns}\n`;
      }

      await fs.writeFile(path.join(outputPath, "maintainer_preferences.md"), md, "utf-8");
    }

    // 4. Export Previous PRs
    const prsData = await readJson("previous_prs.json");
    if (prsData) {
      let md = `# Previous PRs\n\n`;
      if (prsData.pull_requests) {
        for (const pr of prsData.pull_requests) {
          md += `## [PR #${pr.number}] — ${pr.title}\n`;
          md += `- **Author**: ${pr.author}\n`;
          md += `- **Merged**: ${pr.merged_at}\n`;
          md += `- **Type**: ${pr.type}\n`;
          md += `- **Comments**: ${pr.comment_count}\n\n`;
          
          md += `### What It Does\n${pr.what_it_does}\n\n`;
          
          md += `### Key Decisions\n`;
          if (pr.key_decisions) {
            for (const d of pr.key_decisions) md += `- ${d}\n`;
          }
          md += `\n`;

          md += `### Review Notes\n${pr.review_notes || "None"}\n\n`;

          md += `### Files Changed\n`;
          if (pr.files_changed) {
            for (const file of pr.files_changed) {
              md += `- \`${file.path}\` — ${file.change_description}\n`;
            }
          }
          md += `\n`;

          md += `### Lessons\n`;
          if (pr.lessons) {
            for (const l of pr.lessons) md += `- ${l}\n`;
          }
          md += `\n---\n\n`;
        }
      }

      md += `## PR Timeline\n\n`;
      md += `| Date | PR # | Title | Author |\n`;
      md += `|------|------|-------|--------|\n`;
      if (prsData.timeline) {
        for (const t of prsData.timeline) {
          md += `| ${t.date} | #${t.number} | ${t.title} | ${t.author} |\n`;
        }
      }

      await fs.writeFile(path.join(outputPath, "previous_prs.md"), md, "utf-8");
    }

    // 5. Export Known Pitfalls
    const pitfallsData = await readJson("known_pitfalls.json");
    if (pitfallsData) {
      let md = `# Known Pitfalls\n\n`;
      if (pitfallsData.pitfalls) {
        const severityGroups: Record<string, typeof pitfallsData.pitfalls> = {};
        for (const p of pitfallsData.pitfalls) {
          const sev = p.severity || "Medium";
          if (!severityGroups[sev]) severityGroups[sev] = [];
          severityGroups[sev].push(p);
        }

        const levels = ["Critical", "High", "Medium", "Low"];
        for (const lvl of levels) {
          if (severityGroups[lvl]) {
            md += `## ${lvl}\n\n`;
            for (const p of severityGroups[lvl]) {
              md += `### Pitfall: ${p.name}\n`;
              md += `- **Area**: ${p.area}\n`;
              md += `- **Trigger**: ${p.trigger}\n`;
              md += `- **Symptoms**: ${p.symptoms}\n`;
              md += `- **Root Cause**: ${p.root_cause}\n`;
              md += `- **Fix**: ${p.fix}\n`;
              md += `- **Test**: ${p.test_verification}\n`;
              md += `- **Cross-Reference**: ${p.cross_reference || "None"}\n\n`;
            }
          }
        }
      }

      await fs.writeFile(path.join(outputPath, "known_pitfalls.md"), md, "utf-8");
    }

    // 6. Export Contribution Patterns
    const contributorData = await readJson("contribution_patterns.json");
    if (contributorData) {
      let md = `# Contribution Patterns\n\n`;
      if (contributorData.merge_patterns) {
        md += `## How PRs Get Merged Here\n\n`;
        md += `### Fast Track (merged < 1 day)\n`;
        if (contributorData.merge_patterns.fast_track) {
          for (const p of contributorData.merge_patterns.fast_track) md += `- ${p}\n`;
        }
        md += `\n`;
        md += `### Normal Review (1-3 rounds)\n`;
        if (contributorData.merge_patterns.normal_review) {
          for (const p of contributorData.merge_patterns.normal_review) md += `- ${p}\n`;
        }
        md += `\n`;
        md += `### High Scrutiny (3+ rounds or rejected)\n`;
        if (contributorData.merge_patterns.high_scrutiny) {
          for (const p of contributorData.merge_patterns.high_scrutiny) md += `- ${p}\n`;
        }
        md += `\n`;
      }

      md += `## Common Review Feedback\n\n`;
      if (contributorData.common_review_feedback) {
        for (const f of contributorData.common_review_feedback) {
          md += `### ${f.feedback}\n`;
          if (f.examples_evidence) {
            for (const ex of f.examples_evidence) md += `- ${ex}\n`;
          }
          md += `\n`;
        }
      }

      md += `## Contributor Playbook\n\n`;
      if (contributorData.playbook) {
        md += `### Phase 1: Preparation\n`;
        if (contributorData.playbook.preparation) {
          for (const step of contributorData.playbook.preparation) md += `- ${step}\n`;
        }
        md += `\n`;
        md += `### Phase 2: Implementation\n`;
        if (contributorData.playbook.implementation) {
          for (const step of contributorData.playbook.implementation) md += `- ${step}\n`;
        }
        md += `\n`;
        md += `### Phase 3: Submission\n`;
        if (contributorData.playbook.submission) {
          for (const step of contributorData.playbook.submission) md += `- ${step}\n`;
        }
        md += `\n`;
        md += `### Phase 4: Review\n`;
        if (contributorData.playbook.review) {
          for (const step of contributorData.playbook.review) md += `- ${step}\n`;
        }
        md += `\n`;
      }

      md += `## Git Workflow\n\n`;
      if (contributorData.git_workflow) {
        md += `### Branch Naming\n\`${contributorData.git_workflow.branch_naming || "N/A"}\`\n\n`;
        md += `### Commit Messages\n\`${contributorData.git_workflow.commit_messages || "N/A"}\`\n\n`;
        md += `### PR Description Template\n\`\`\`\n${contributorData.git_workflow.pr_description_template || ""}\n\`\`\`\n\n`;
      }

      md += `## What Makes a Great Contributor Here\n\n`;
      if (contributorData.great_contributor_traits) {
        for (const t of contributorData.great_contributor_traits) md += `1. ${t}\n`;
      }

      await fs.writeFile(path.join(outputPath, "contribution_patterns.md"), md, "utf-8");
    }

    return { success: true };
  }
});
