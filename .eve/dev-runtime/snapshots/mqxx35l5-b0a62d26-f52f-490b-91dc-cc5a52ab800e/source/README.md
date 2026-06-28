# Precedent

<<<<<<< HEAD
A self-contained agent system that ingests any GitHub repository's history (PRs, issues, chat logs) and produces a comprehensive 6-file institutional wiki. This wiki becomes the permanent memory for AI agents contributing to that repo no more starting from scratch every session.

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
## Before v/s After

### Before using Precedent:

<img width="1019" height="795" alt="Screenshot 2026-06-24 174105" src="https://github.com/user-attachments/assets/1d8f7635-377e-4fe9-a673-588b96cdb0ee" />

### After using Precedent:

<img width="1048" height="794" alt="Screenshot 2026-06-24 174145" src="https://github.com/user-attachments/assets/a3f2cab8-4877-414e-b3d4-e227ec437a73" />

=======
A two-phase agent system that gives AI agents permanent institutional memory for any GitHub repository.

- **Phase 1 (Wiki Generation)**: Ingests repo history (PRs, issues, chat logs) and produces 6 wiki files encoding architecture, past failures, maintainer preferences, PR history, pitfalls, and contribution patterns.
- **Phase 2 (PR Analysis)**: Given a PR diff, runs 6 specialized agents in parallel — each reading the wiki for context — then consolidates everything into a mergeability score with blocker list.
>>>>>>> adcd3f9 (Add 6 runtime PR analysis agents + precedent-run orchestrator)

## How It Works

### Phase 1: Wiki Generation (Setup — run once per repo)

```
┌──────────────────────────────────────────────────┐
│  YOU PROVIDE                                     │
│  • Repo name (e.g. different-ai/openwork)        │
│  • PR count to fetch (e.g. 50)                   │
│  • Chat logs, notes, past conversations (opt)    │
└──────────────────┬───────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────┐
│  wiki-orchestrator reads inputs, delegates to:    │
│                                                   │
│  ┌──────────┬──────────┬──────────┬──────────┐   │
│  │  wiki-   │  wiki-   │  wiki-   │  wiki-   │   │
│  │architect │failure-  │maintaine-│historian │   │
│  │          │analyst   │r-profiler│          │   │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘   │
│       │          │          │          │          │
│  ┌────▼──────────▼────┬─────▼──────────▼─────┐    │
│  │  wiki-pitfall-mapper│  wiki-contributor-   │    │
│  │                    │  guide                │    │
│  └────────────────────┴───────────────────────┘   │
└──────────────────┬────────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────┐
│  6 Wiki Files                                    │
│  architecture.md  review_failures.md             │
│  maintainer_preferences.md  previous_prs.md      │
│  known_pitfalls.md  contribution_patterns.md     │
└──────────────────────────────────────────────────┘
```

### Phase 2: PR Analysis (Runtime — run per PR)

```
┌──────────────────────────────────────────────────┐
│  precedent-run receives PR diff + wiki files     │
│                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ repo_    │ │pr_reviewer│ │maintainer│  ← all  │
│  │ expert   │ │          │ │          │    read   │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘    wiki  │
│       │            │            │           files │
│  ┌────▼─────┐ ┌────▼─────┐ ┌────▼─────┐          │
│  │assumptio-│ │test_gap  │ │          │          │
│  │n_hunter  │ │          │ │          │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │                 │
│       └────────────┴────────────┘                 │
│                        │                          │
│                   ┌────▼─────┐                    │
│                   │mergeabil-│ ← consumes all     │
│                   │ity_gate  │   5 agent outputs  │
│                   └────┬─────┘                    │
└────────────────────────┼──────────────────────────┘
                         ▼
┌──────────────────────────────────────────────────┐
│  Mergeability Report                             │
│  Score: PASS / FLAG / BLOCK                      │
│  Issues: CRITICAL / MAJOR / MINOR                │
│  Wiki cross-refs: failures, pitfalls, preferences│
└──────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites
- Node.js 18+ (for GitHub data fetching)
- An AI agent platform that supports markdown agent files (OpenCode, Gemini CLI, etc.)
- A GitHub personal access token (for API, optional but recommended)

### Setup in 2 Minutes (Recommended)

```powershell
# Phase 1: Wiki generation — one command sets up everything
.\init-repo-wiki.ps1 -Repo "owner/repo-name" -PrCount 50 -Token "ghp_xxx"

# Drop chat logs into: user-input/raw-data/
# Then run: "Run the wiki-orchestrator agent"
# → Produces 6 wiki files in user-input/output/
```

### Phase 2: Analyze a PR

```
Tell your AI: "Run the precedent-run agent on this diff"
→ All 6 runtime agents analyze independently using wiki context
→ mergeability_gate produces: PASS / FLAG / BLOCK with blocker list
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

### `.claude/agents/` — Agent Definitions (14 agents)

Markdown agent files compatible with Gemini CLI, Claude Code, and OpenCode. Two orchestrators + 12 worker agents.

#### Phase 1: Wiki Generation (7 agents)

| Agent | Role |
|-------|------|
| `wiki-orchestrator` | Reads PR data + raw data, delegates to 6 wiki generators, validates output |
| `wiki-architect` | Generates `architecture.md` — system overview, CDDs, data flows |
| `wiki-failure-analyst` | Generates `review_failures.md` — categorized failure database |
| `wiki-maintainer-profiler` | Generates `maintainer_preferences.md` — maintainer style + pet peeves |
| `wiki-historian` | Generates `previous_prs.md` — PR timeline + spotlight PRs |
| `wiki-pitfall-mapper` | Generates `known_pitfalls.md` — traps, edge cases, reproduction steps |
| `wiki-contributor-guide` | Generates `contribution_patterns.md` — playbook for new contributors |

#### Phase 2: PR Analysis (7 agents)

| Agent | Role |
|-------|------|
| `precedent-run` | Runtime orchestrator — takes a PR diff, runs 6 agents, produces mergeability score |
| `repo_expert` | Repository historian — answers architecture/decision questions from wiki |
| `pr_reviewer` | Critical PR reviewer — finds logic bugs, edge cases, regressions, security issues |
| `maintainer` | Maintainer simulator — evaluates merge-worthiness, architecture fit, debt |
| `assumption_hunter` | Hidden edge-case detector — finds false assumptions in production paths |
| `test_gap` | Missing test finder — generates failure scenarios, checks test coverage |
| `mergeability_gate` | Final gate — consolidates all agent outputs into PASS/FLAG/BLOCK score |

### `prompts/` — Detailed System Prompts

These are the full prompts for Phase 1 wiki generation agents. They are more detailed than the agent files and serve as the "instruction manual" for each generation task. Phase 2 runtime agents (`repo_expert`, `pr_reviewer`, etc.) contain their instructions inline in the agent file since they are simpler and don't need external prompts.

| Prompt | Purpose |
|--------|---------|
| `orchestrator_prompt.md` | How to coordinate all wiki generation agents |
| `architecture_prompt.md` | How to extract architecture from codebase data |
| `review_failures_prompt.md` | How to categorize and document failures |
| `maintainer_preferences_prompt.md` | How to reverse-engineer maintainer patterns |
| `previous_prs_prompt.md` | How to build a PR timeline database |
| `known_pitfalls_prompt.md` | How to identify traps and edge cases |
| `contribution_patterns_prompt.md` | How to derive contribution patterns |

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

## The Two-Phase Workflow

### Phase 1: Generate the Wiki
```
1. Configure → user-input/repo-config.json
2. Fetch PRs  → node scripts/fetch-github-data.js owner/repo 50
3. Add logs   → drop chat transcripts into user-input/raw-data/
4. Tell AI    → "Run the wiki-orchestrator agent"
5. Output     → 6 wiki files in user-input/output/
```

### Phase 2: Analyze a PR
```
1. Provide    → git diff of the PR
2. Tell AI    → "Run the precedent-run agent on this diff"
3. Agents run → repo_expert, pr_reviewer, maintainer, assumption_hunter, test_gap (parallel)
4. Final gate → mergeability_gate consolidates all outputs
5. Output     → Mergeability Report with PASS/FLAG/BLOCK + blocker list
```

After generation, the wiki files become permanent agent context:
- **repo_expert**: "Read the wiki at `user-input/output/`"
- **pr_reviewer**: "Use the wiki at `user-input/output/` for context — cross-reference past failures"
- **maintainer**: "Check against preferences in the wiki"
- **assumption_hunter**: "Check known pitfalls from the wiki"
- **test_gap**: "Prioritize tests that would have caught past failures"
- **mergeability_gate**: "Cross-reference all findings against wiki patterns"

---

## Advanced Workflows

### Workflow: Full PR Review Pipeline
```powershell
# 1. Fetch new PRs since last run to keep wiki fresh
node scripts/fetch-github-data.js owner/repo 50 --token=ghp_xxx

# 2. Run wiki-orchestrator to update wiki with new data
# Tell AI: "Update wiki - new PR data in fetched-prs.json"

# 3. For a specific PR, run precedent-run
# Tell AI: "Run precedent-run on this diff: [paste diff]"
```

### Workflow: Multi-Repo Setup
Create one `user-input/` directory per repo. The agents are shared:
```
my-multi-repo/
├── repo-alpha/
│   ├── input/
│   │   ├── repo-config.json
│   │   ├── pr-data/
│   │   └── raw-data/
│   └── output/              ← wiki files
├── repo-beta/
│   ├── input/
│   │   ├── repo-config.json
│   │   ├── pr-data/
│   │   └── raw-data/
│   └── output/              ← wiki files
└── .claude/agents/          ← shared agents (link or copy)
```

### Workflow: CI/CD Integration
- Run `fetch-github-data.js` weekly in CI to refresh PR data
- Trigger `wiki-orchestrator` to update wiki with new context
- For each new PR, run `precedent-run` automatically and post the mergeability report as a PR comment

---

## Design Principles

1. **Two-phase separation** — wiki generation (one-time setup) and PR analysis (per-PR) are independent pipelines
2. **Every useful piece of data appears somewhere** — no information is discarded
3. **Repeated patterns across PRs are important** — they indicate project norms
4. **Maintainer signals are gold** — every review comment, preference, and rejection teaches something
5. **Architecture decisions should include tradeoffs** — not just what was chosen, but what was rejected
6. **Failures teach more than successes** — the failure database is the most valuable file
7. **Templates must be opinionated** — give agents a clear structure to fill
8. **Customization is a dial, not a rewrite** — start with defaults, tweak as needed
9. **Runtime agents read wiki, not raw data** — wiki abstracts complexity; agents stay focused
10. **The mergeability gate is the single source of truth** — it consolidates all agent outputs into one decision
