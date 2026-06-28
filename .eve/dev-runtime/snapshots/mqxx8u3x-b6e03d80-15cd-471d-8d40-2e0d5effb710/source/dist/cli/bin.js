#!/usr/bin/env node
import { Command } from "commander";
import { initCommand, buildCommand, updateCommand, reviewCommand, explainCommand, doctorCommand } from "./commands.js";
const program = new Command();
program
    .name("precedent")
    .description("Repository memory and intelligence layer for AI software engineering.")
    .version("1.0.0");
program
    .command("init <repo>")
    .description("Initialize a new repository memory folder structure.")
    .option("-t, --token <token>", "GitHub Personal Access Token.")
    .option("-c, --count <count>", "Number of merged PRs to fetch.", "50")
    .action((repo, options) => {
    initCommand(repo, { token: options.token, count: parseInt(options.count, 10) });
});
program
    .command("build")
    .description("Generate repository intelligence memory files and markdown wikis.")
    .option("-t, --token <token>", "GitHub Personal Access Token.")
    .action((options) => {
    buildCommand({ token: options.token });
});
program
    .command("update")
    .description("Refresh repository intelligence memory files with new changes.")
    .option("-t, --token <token>", "GitHub Personal Access Token.")
    .action((options) => {
    updateCommand({ token: options.token });
});
program
    .command("review")
    .description("Analyze a git diff and output a mergeability report.")
    .option("-d, --diff <diff>", "Custom diff string to analyze.")
    .action((options) => {
    reviewCommand({ diff: options.diff });
});
program
    .command("explain <query>")
    .description("Answer questions about the repository architecture, decisions, and history.")
    .action((query) => {
    explainCommand(query);
});
program
    .command("doctor")
    .description("Validate repository memory for duplicates, contradictions, and integrity gaps.")
    .action(() => {
    doctorCommand();
});
program.parse(process.argv);
