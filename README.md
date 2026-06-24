# Repo Wiki Generator

A self-contained agent system that ingests any GitHub repository's history (PRs, issues, chat logs) and produces a comprehensive 6-file institutional wiki. This wiki becomes the permanent memory for AI agents contributing to that repo — no more starting from scratch every session.

## The Problem

Every time an AI agent starts working on a new repo, it knows nothing:
- What architecture decisions were made?
- What bugs keep recurring?
- What does the maintainer actually care about?
- What edge cases have been hit before?

Without this context, agents make the same mistakes, miss the same edge cases, and produce low-quality contributions.

## The Solution

This system generates **6 files** that encode everything an agent needs to contribute effectively:

| File | What It Contains | Why It Matters |
|------|------------------|----------------|
| `architecture.md` | System overview, components, data flows, design decisions | Agent understands the big picture |
| `review_failures.md` | Every bug, mistake, and reviewer criticism found in PRs | Agent doesn't repeat known mistakes |
| `maintainer_preferences.md` | Maintainer's thinking patterns, review style, pet peeves | Agent aligns with what the maintainer wants |
| `previous_prs.md` | Database of every PR with timeline, decisions, lessons | Agent learns from history |
| `known_pitfalls.md` | Every trap, edge case, and landmine discovered | Agent avoids known problems |
| `contribution_patterns.md` | How successful PRs get merged + contributor playbook | Agent follows winning patterns |

---

## How It Works

```
┌─────────────────────────────────────────────────┐
│              YOU PROVIDE                         │
│  • Repo name (e.g. different-ai/openwork)       │
│  • Number of PRs to fetch (e.g. 50)             │
│  • (Optional) Raw data: chat logs, notes, etc.  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          STEP 1: DATA INTAKE                     │
│  • `scripts/fetch-github-data.js` pulls N PRs   │
│  • Place raw chat logs in `user-input/raw-data/` │
│  • Configure repo in `user-input/repo-config.json`│
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          STEP 2: ORCHESTRATOR LAUNCHES           │
│  • wiki-orchestrator agent reads all inputs      │
│  • Delegates to 6 specialized sub-agents         │
│  • Each sub-agent generates one wiki file        │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          STEP 3: 6 WIKI FILES GENERATED          │
│  • Placed in `user-input/output/`               │
│  • Ready to use as agent context                 │
└─────────────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│          STEP 4: USE IN FUTURE SESSIONS          │
│  • Point repo_expert agent at the wiki files     │
│  • PR reviewer uses wiki for context             │
│  • Maintainer gates PRs against known patterns   │
│  • New contributors read wiki before coding      │
└─────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Node.js 18+ (for GitHub data fetching)
- An AI agent platform that supports markdown agent files (OpenCode, Gemini CLI, etc.)
- A GitHub personal access token (for API, optional but recommended)

### Setup in 2 Minutes (Recommended)

```powershell
# One-command init — creates dirs, config, fetches PRs, copies agents
.\init-repo-wiki.ps1 -Repo "owner/repo-name" -PrCount 50 -Token "ghp_xxx"
# (Token is optional — without it you get 60 req/hr instead of 5000)

# Then drop any chat logs or notes into: user-input/raw-data/
# Finally tell your AI: "Run the wiki-orchestrator agent"
```

### Manual Setup (5 Minutes)

```powershell
# 1. Create your repo directory
mkdir my-repo-wiki
cd my-repo-wiki

# 2. Copy this project's contents into it
# (Or just use the repo-wiki-generator folder directly)

# 3. Configure your repo
# Edit user-input/repo-config.json:
# {
#   "repo": "owner/repo-name",
#   "pr_count": 50,
#   "include_issues": true,
#   "include_chat_logs": true
# }

# 4. Fetch PR data from GitHub
node scripts/fetch-github-data.js owner/repo-name 50 --token=ghp_xxx
# Output saves to fetched-prs.json in current directory

# 5. (Optional) Place raw data
# Copy your chat logs, notes, etc. into user-input/raw-data/

# 6. Run the orchestrator
# Tell your AI agent: "Run the wiki-orchestrator agent
# for the repo configured in user-input/repo-config.json"
```

### Output
All 6 wiki files appear in `user-input/output/` ready to use.

---

## File Reference

### `.claude/agents/` — Agent Definitions

These are markdown agent files compatible with both Gemini and OpenCode agent frameworks. Each agent has a specific role:

| Agent File | Role | Delegates To |
|-----------|------|-------------|
| `wiki-orchestrator.md` | **Master coordinator** — reads all inputs, delegates to sub-agents, validates output | All 6 sub-agents |
| `wiki-architect.md` | Generates `architecture.md` | — |
| `wiki-failure-analyst.md` | Generates `review_failures.md` | — |
| `wiki-maintainer-profiler.md` | Generates `maintainer_preferences.md` | — |
| `wiki-historian.md` | Generates `previous_prs.md` | — |
| `wiki-pitfall-mapper.md` | Generates `known_pitfalls.md` | — |
| `wiki-contributor-guide.md` | Generates `contribution_patterns.md` | — |

Each agent file contains:
- **Frontmatter**: `name`, `description` (framework-agnostic)
- **Input specification**: What data this agent needs
- **Output specification**: Exact format for the wiki file
- **Analysis instructions**: How to extract insights from raw data

### `prompts/` — Detailed System Prompts

These are the full prompts each agent runs on. They are more detailed than the agent files and serve as the "instruction manual" for each generation task. Edit these to customize the output:

| Prompt | Purpose |
|--------|---------|
| `architecture_prompt.md` | How to extract architecture from codebase data |
| `review_failures_prompt.md` | How to categorize and document failures |
| `maintainer_preferences_prompt.md` | How to reverse-engineer maintainer patterns |
| `previous_prs_prompt.md` | How to build a PR timeline database |
| `known_pitfalls_prompt.md` | How to identify traps and edge cases |
| `contribution_patterns_prompt.md` | How to derive contribution patterns |
| `orchestrator_prompt.md` | How to coordinate all agents |

### `templates/` — Output Templates

These are the **skeleton templates** for each wiki file. They define the structure, sections, and format but leave the content blank for the agents to fill. Use these as a starting point — customize the sections to match your domain.

### `scripts/` — Automation Scripts

| Script | Purpose |
|--------|---------|
| `fetch-github-data.js` | `node fetch-github-data.js <owner/repo> <count> --token=ghp_xxx` — Fetches N merged PRs via GraphQL API (paginated, rate-limit aware) |
| `init-repo-wiki.ps1` | `.\init-repo-wiki.ps1 -Repo owner/repo -PrCount 50 -Token ghp_xxx` — One-command init: creates dirs, config, fetches PRs, copies agents |

### `user-input/` — Your Data Goes Here

| Path | Purpose |
|------|---------|
| `repo-config.json` | Repo configuration (name, PR count, etc.) |
| `raw-data/` | Place chat logs, notes, previous agent conversations here |
| `output/` | Generated wiki files appear here |

### `examples/` — Real-World References

Contains the actual Clawvisor and OpenWork wiki outputs as reference examples. Study these to understand the level of detail expected.

---

## Data Sources & Quality

### Source 1: GitHub PR Data (Automated — Required)
The system fetches merged PRs via the GitHub API. This gives you:
- PR titles, descriptions, and bodies
- Merge dates and authors
- File changes (from diff)
- Review comments (if available)

**Recommended count**: 30-100 PRs. Too few = thin wiki. Too many = noise.

### Source 2: Raw Data (Manual — Highly Recommended)
Your previous conversations with AI agents about this repo are **gold**. They contain:
- Real back-and-forth with maintainers
- Bugs discovered and fixed
- Design decisions explained
- Context that never makes it into PRs

**How to collect**: Save your chat transcripts as `.md` files in `user-input/raw-data/`.

### Source 3: Repository Files (Optional)
If your agent has file access, it can also read:
- `CONTRIBUTING.md` — contribution guidelines
- `README.md` — project overview
- `ARCHITECTURE.md` — if it exists
- Issue templates, PR templates

---

## Customization Guide

### Adding a New Section to a Wiki File
1. Edit the template in `templates/` to add your section
2. Update the corresponding prompt in `prompts/` to describe what data should fill it
3. The agent will automatically populate it on next generation

### Changing the Output Format
- The templates use Markdown by default
- Each template has `<!-- AGENT: fill with X -->` markers
- Edit these markers to change what the agent fills in

### Adding a New Agent
1. Create a new agent file in `.claude/agents/`
2. Create a corresponding prompt in `prompts/`
3. Add it to the orchestrator's delegation list
4. Wire its output into the workflow

### Using with Different AI Frameworks
The agent files use standard Markdown with YAML frontmatter, compatible with:
- **OpenCode**: Place in `.claude/agents/`
- **Gemini CLI**: Place in `.gemini/agents/` or reference via `--agent`
- **Cubic**: Add as skills
- **Claude Code**: Reference as CLAUDE.md knowledge

---

## The Agent Ecosystem

This system works best when all agents in the ecosystem can reference the generated wiki:

```
┌────────────────────────────────────────────────────┐
│                   YOUR AI ECOSYSTEM                │
│                                                    │
│  repo_expert ───reads──► repo-wiki (6 files)       │
│       ▲                           │                │
│       │                           ▼                │
│  pr_reviewer ◄───context──── wiki-orchestrator     │
│       ▲                           │                │
│       │                           ▼                │
│  maintainer ◄───context──── 6 sub-agents           │
│       ▲                                            │
│       │                                            │
│  assumption_hunter ◄───context                     │
│       ▲                                            │
│       │                                            │
│  test_gap ◄───context                              │
│       ▲                                            │
│       │                                            │
│  mergeability_gate ◄───context                     │
└────────────────────────────────────────────────────┘
```

After generation, update your agent configurations to reference the wiki:
- **repo_expert**: "Read the wiki at `user-input/output/`"
- **pr_reviewer**: "Use the wiki at `user-input/output/` for context"
- **maintainer**: "Check against patterns in the wiki"

---

## Advanced Workflows

### Workflow: Weekly Wiki Update
```powershell
# 1. Fetch new PRs since last run
node scripts/fetch-github-data.js --since last-run-date

# 2. Run the orchestrator update mode
# Tell agent: "Update wiki using existing files + new data"
```

### Workflow: Multi-Repo Setup
Create one `user-input/` directory per repo:
```
my-multi-repo/
├── repo-alpha/
│   ├── repo-config.json
│   ├── raw-data/
│   └── output/
├── repo-beta/
│   ├── repo-config.json
│   ├── raw-data/
│   └── output/
└── shared-agents/  ← link to templates/.claude/agents/
```

### Workflow: CI/CD Integration
- Run `fetch-github-data.js` weekly in CI
- Commit updated raw data
- Trigger agent to regenerate wiki
- PR the updated wiki files

---

## Design Principles

1. **Every useful piece of data appears somewhere** — no information is discarded
2. **Repeated patterns across PRs are important** — they indicate project norms
3. **Maintainer signals are gold** — every review comment, preference, and rejection teaches something
4. **Architecture decisions should include tradeoffs** — not just what was chosen, but what was rejected
5. **Failures teach more than successes** — the failure database is the most valuable file
6. **Templates must be opinionated** — give agents a clear structure to fill
7. **Customization is a dial, not a rewrite** — start with defaults, tweak as needed
