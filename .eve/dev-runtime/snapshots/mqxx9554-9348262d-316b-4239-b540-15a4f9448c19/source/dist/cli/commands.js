import * as fs from "fs/promises";
import * as path from "path";
import { execSync } from "child_process";
import { runEveAgent } from "./runner.js";
import chalk from "chalk";
const fileExists = async (filePath) => {
    try {
        await fs.access(filePath);
        return true;
    }
    catch {
        return false;
    }
};
export async function initCommand(repo, options) {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Initialize ===`));
    console.log(`Repo: ${repo}`);
    // Create dirs
    const userInputDir = path.join(root, "user-input");
    const rawDataDir = path.join(userInputDir, "raw-data");
    const prDataDir = path.join(userInputDir, "pr-data");
    const outputDir = path.join(userInputDir, "output");
    const templatesDir = path.join(root, "templates");
    const knowledgeDir = path.join(root, "knowledge");
    await fs.mkdir(rawDataDir, { recursive: true });
    await fs.mkdir(prDataDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });
    await fs.mkdir(templatesDir, { recursive: true });
    await fs.mkdir(knowledgeDir, { recursive: true });
    // Write default config
    const config = {
        repo,
        pr_count: options.count || 50,
        include_issues: false,
        include_chat_logs: true,
        created_at: new Date().toISOString(),
        output_path: "./user-input/output",
        project_name: repo.split("/")[1] || "repository"
    };
    await fs.writeFile(path.join(userInputDir, "repo-config.json"), JSON.stringify(config, null, 2), "utf-8");
    console.log(chalk.green(`✓ Created user-input/repo-config.json`));
    // Write basic templates if not present
    const defaultTemplates = [
        "architecture.md",
        "review_failures.md",
        "maintainer_preferences.md",
        "previous_prs.md",
        "known_pitfalls.md",
        "contribution_patterns.md"
    ];
    for (const t of defaultTemplates) {
        const tPath = path.join(templatesDir, t);
        if (!(await fileExists(tPath))) {
            await fs.writeFile(tPath, `<!-- AGENT: fill this section -->\n# ${t.replace(".md", "")}\n`, "utf-8");
        }
    }
    console.log(chalk.green(`✓ Initialized templates and directories.`));
    console.log(`\nNext steps:`);
    console.log(`  1. Add any developer logs or chats under ${chalk.yellow("user-input/raw-data/")}`);
    console.log(`  2. Run ${chalk.cyan("precedent build")} to extract repository memory.`);
}
export async function buildCommand(options) {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Build: Repository Memory Generation ===`));
    const configPath = path.join(root, "user-input", "repo-config.json");
    if (!(await fileExists(configPath))) {
        console.error(chalk.red("Error: repo-config.json not found. Run 'precedent init <repo>' first."));
        process.exit(1);
    }
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    const token = options.token || process.env.GITHUB_TOKEN || "";
    const count = config.pr_count || 50;
    const prompt = `Generate repository intelligence for repository "${config.repo}" from project root "${root}". Use count: ${count} and token: "${token}". Perform distillation and validation. Export markdown wiki files.`;
    console.log(`Bootstrapping Vercel Eve agent to build memory...`);
    try {
        const response = await runEveAgent({
            projectRoot: root,
            message: prompt,
            onChunk: (chunk) => {
                process.stdout.write(chunk);
            }
        });
        console.log(chalk.green(`\n\n✓ Repository memory build completed successfully!`));
    }
    catch (err) {
        console.error(chalk.red(`\nBuild failed: ${err.message}`));
        process.exit(1);
    }
}
export async function updateCommand(options) {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Update ===`));
    const configPath = path.join(root, "user-input", "repo-config.json");
    if (!(await fileExists(configPath))) {
        console.error(chalk.red("Error: repo-config.json not found. Run 'precedent init <repo>' first."));
        process.exit(1);
    }
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));
    const token = options.token || process.env.GITHUB_TOKEN || "";
    const prompt = `Update repository intelligence for repository "${config.repo}" from project root "${root}". Fetch new updates using token "${token}". Run distillation, validation, and export markdown.`;
    console.log(`Bootstrapping Vercel Eve agent to update memory...`);
    try {
        await runEveAgent({
            projectRoot: root,
            message: prompt,
            onChunk: (chunk) => {
                process.stdout.write(chunk);
            }
        });
        console.log(chalk.green(`\n\n✓ Repository memory updated successfully!`));
    }
    catch (err) {
        console.error(chalk.red(`\nUpdate failed: ${err.message}`));
        process.exit(1);
    }
}
export async function reviewCommand(options) {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Pull Request Review ===`));
    let diff = options.diff;
    if (!diff) {
        try {
            diff = execSync("git diff HEAD", { encoding: "utf-8" });
        }
        catch {
            console.error(chalk.red("Error: git diff command failed or not a git repository. Provide a diff manually via --diff option."));
            process.exit(1);
        }
    }
    if (!diff || diff.trim() === "") {
        console.log(chalk.yellow("No local changes detected. Diff is empty."));
        return;
    }
    const prompt = `Analyze this git diff and verify it against repository memory. Return a detailed mergeability report with PASS/FLAG/BLOCK score.\n\n=== DIFF ===\n${diff}`;
    console.log(`Bootstrapping Vercel Eve runtime agents for PR analysis...`);
    try {
        await runEveAgent({
            projectRoot: root,
            message: prompt,
            onChunk: (chunk) => {
                process.stdout.write(chunk);
            }
        });
        console.log(`\n`);
    }
    catch (err) {
        console.error(chalk.red(`\nReview failed: ${err.message}`));
        process.exit(1);
    }
}
export async function explainCommand(query) {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Repository Q&A ===`));
    console.log(`Question: ${query}\n`);
    const prompt = `Answer this question about the repository using repository memory: "${query}". Explain architecture, decisions, and patterns. Cite source JSON files.`;
    try {
        await runEveAgent({
            projectRoot: root,
            message: prompt,
            onChunk: (chunk) => {
                process.stdout.write(chunk);
            }
        });
        console.log(`\n`);
    }
    catch (err) {
        console.error(chalk.red(`\nQuery failed: ${err.message}`));
        process.exit(1);
    }
}
export async function doctorCommand() {
    const root = process.cwd();
    console.log(chalk.cyan(`=== Precedent Doctor: Memory Integrity Verification ===`));
    const prompt = `Perform validation checks on the repository memory in project root "${root}". Audit confidence, completeness, duplicates, and conflicts.`;
    try {
        await runEveAgent({
            projectRoot: root,
            message: prompt,
            onChunk: (chunk) => {
                process.stdout.write(chunk);
            }
        });
        console.log(`\n`);
    }
    catch (err) {
        console.error(chalk.red(`\nDoctor verification failed: ${err.message}`));
        process.exit(1);
    }
}
