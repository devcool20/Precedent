# Contribution Patterns Wiki Prompt

Generate `contribution_patterns.md` — the playbook for successful contributions. This should be the first thing a new contributor reads.

## Data Sources

1. **PR data** — analyze every PR for patterns:
   - Which got merged fast vs slow?
   - Which needed multiple review rounds?
   - Which authors succeed consistently?

2. **`maintainer_preferences.md`** — the review style section feeds directly into "how to please the reviewer"

3. **`review_failures.md`** — the prevention rules become contribution checklist items

4. **Raw data** — chat logs about contribution experiences, setup issues, workflow pain points

5. **`user-input/repo-config.json`** — for repo-specific setup instructions

## Analysis

### Merge Speed Analysis
Group PRs by time to merge:
- Fast (< 1 day): What's common about them?
- Normal (1-3 days): What's typical?
- Slow (> 3 days): What caused delays?

### Review Round Analysis
- Count review rounds per PR
- What determines the number of rounds?
- What PRs need 0-1 rounds? (simple docs, CI changes)
- What PRs need 3+ rounds? (complex features, first-time contributors)

### Author Analysis
- Who are the most active contributors?
- What's their success pattern?
- What do they do differently?

## Output Sections

### 1. How PRs Get Merged Here
Describe the merge culture:
- Typical turnaround times
- Expected review rounds
- What gets fast-tracked
- What gets delayed

### 2. Common Review Feedback Categories
Extract from review comments:
- What do reviewers say most often?
- What's the number one reason for "request changes"?
- What's completely ignored?

### 3. Contributor Playbook
Step-by-step guide:

**Before coding:**
- Which wiki files to read in which order
- How to verify the issue is available
- How to gather context

**During implementation:**
- Development workflow (branch, commit, test)
- Testing expectations
- Documentation expectations

**Before submitting:**
- Self-review checklist (derived from review_failures.md prevention rules)
- Build verification (exact commands)
- Evidence collection (screenshots, logs, test output)

**During review:**
- How to respond to feedback
- How to iterate
- When to push back vs accept

### 4. Git Workflow
- Branch naming conventions
- Commit message format
- PR title format
- Fork/upstream workflow
- Safety rules (force-push, rebase)

### 5. PR Description Template
Create a template from the best PR descriptions found in the data:
```markdown
## Summary
[One-line description]

## Root Cause
[For bugs — trace the failure path]

## Changes
- [File]: [What changed]

## Testing
- `command` — result

## Evidence
[Link to E2E results, screenshots, logs]

Closes #[issue]
```

### 6. What Makes a Great Contributor
List 7-10 traits that correlate with success in this repo.

## Quality Rules
- Every claim must cite specific PR numbers as evidence
- The playbook must be actionable — concrete steps, not principles
- Include exact CLI commands for build, test, typecheck
- The PR description template should be copy-pasteable
- Note any repo-specific quirks (Windows, env vars, etc.)
