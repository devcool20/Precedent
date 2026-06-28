<!-- AGENT: wiki-contributor-guide — fill all sections below -->
<!-- NOTE: This file must be generated LAST, after all other wiki files are complete -->

# {{PROJECT_NAME}} Contribution Patterns

> <!-- AGENT: 1-paragraph overview — what this file is, who it's for, what they'll learn -->

## How PRs Get Merged Here

<!-- AGENT: merge culture — turnaround times, expected review rounds, what gets fast-tracked/delayed -->

- **Typical turnaround**: <!-- e.g. 1-3 days -->
- **Expected review rounds**: <!-- e.g. 1-2 for most PRs -->
- **Fast-tracked (0-1 rounds)**: <!-- e.g. Simple docs, CI-only changes -->
- **Delayed (3+ rounds)**: <!-- e.g. Complex features, first-time contributors -->

## Common Review Feedback Categories

<!-- AGENT: most frequent review comments, extracted from review_failures.md and PR reviews -->

| Frequency | Feedback Type | Example | Source |
|-----------|--------------|---------|--------|
| 🔴 Most common | <!-- e.g. Missing error handling --> | <!-- e.g. "What happens if the API fails?" --> | <!-- #PRs --> |
| 🟡 Moderate | <!-- e.g. Missing tests --> | <!-- e.g. "Please add tests for this path" --> | <!-- #PRs --> |
| 🟢 Less common | <!-- e.g. Style nits --> | <!-- e.g. "Prefer const over let here" --> | <!-- #PRs --> |

## Contributor Playbook

### Before Coding
1. <!-- e.g. Read the wiki files in order: architecture → maintainer_preferences → known_pitfalls -->
2. <!-- e.g. Check if the issue is already assigned -->
3. <!-- e.g. Gather context — read relevant source files, existing PRs -->

### During Implementation
1. <!-- e.g. Create a branch: `fix/description` or `feat/description` -->
2. <!-- e.g. Make focused commits with clear messages -->
3. <!-- e.g. Run the build/tests/typecheck before pushing -->

### Before Submitting
- [ ] <!-- Code compiles without errors -->
- [ ] <!-- All existing tests pass -->
- [ ] <!-- New code has tests covering happy path, error state, edge cases -->
- [ ] <!-- PR description follows the template (see below) -->
- [ ] <!-- Screenshots or logs attached for user-visible changes -->
- [ ] <!-- No commented-out code, console.log, or TODO stubs -->
- [ ] <!-- <!-- Derived from review_failures.md prevention rules --> -->

### During Review
1. <!-- e.g. Respond to all feedback within 24 hours -->
2. <!-- e.g. If you disagree, explain with evidence -->
3. <!-- e.g. Make requested changes in new commits (don't force-push until final) -->

## Git Workflow

- **Branch naming**: <!-- e.g. `fix/description`, `feat/description`, `docs/description` -->
- **Commit format**: <!-- e.g. `type(scope): description` — see conventional commits -->
- **PR title format**: <!-- e.g. Same as commit: `fix(auth): handle token refresh` -->
- **Workflow**: <!-- Fork-based or branch-based? -->
- **Rebase rule**: <!-- e.g. Squash and merge; no force-push on shared branches -->

## PR Description Template

```markdown
## Summary
[One-line description of the change]

## Root Cause
[For bug fixes — trace the failure path from trigger to symptom]

## Changes
- `path/to/file`: [What changed and why]

## Testing
- `command` — result

## Evidence
[Screenshots, logs, E2E test output]

Closes #[issue_number]
```

## What Makes a Great Contributor

<!-- AGENT: 7-10 traits backed by PR data -->

1. **<!-- e.g. Ships small, focused PRs -->** — <!-- e.g. These get merged 2x faster (#231, #402) -->
2. **<!-- e.g. Includes test evidence in PR descriptions -->** — ...
3. **<!-- fill... -->**
4.
5.
6.
7.
8.
9.
10.

## Quick Reference

<!-- AGENT: essential commands for development -->

| Task | Command |
|------|---------|
| Install | `<!-- e.g. npm install -->` |
| Build | `<!-- e.g. npm run build -->` |
| Test | `<!-- e.g. npm test -->` |
| Typecheck | `<!-- e.g. npm run typecheck -->` |
| Lint | `<!-- e.g. npm run lint -->` |
| <!-- fill... --> | |
