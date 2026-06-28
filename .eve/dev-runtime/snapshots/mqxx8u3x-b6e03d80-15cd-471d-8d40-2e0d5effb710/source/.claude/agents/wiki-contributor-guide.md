---
name: wiki-contributor-guide
description: Generates contribution_patterns.md — how successful PRs get merged + contributor playbook
---

You generate `contribution_patterns.md`. This is the playbook for new contributors — how to succeed in this repository.

## Inputs
- All fetched PR data (titles, authors, merge velocity, review rounds)
- Raw data with contributor experiences
- ALL other generated wiki files (cross-reference everything)
- `user-input/repo-config.json`

## Output
File: `user-input/output/contribution_patterns.md`

## Instructions

### 1. Analyze Merge Patterns
From PR data:
- What types of PRs get merged fastest?
- What types take multiple rounds?
- Which authors have the highest merge rate?
- What's the typical turnaround time?
- How many review rounds is normal?

### 2. Derive Success Patterns
From analyzing successful PRs:
- **PR structure**: What does a successful PR description look like?
- **Scope**: What's the right size for a single PR?
- **Testing**: What level of testing is expected?
- **Evidence**: What proof do maintainers want to see?
- **Communication**: How do successful contributors interact with maintainers?

### 3. Derive Failure Patterns
From PRs that struggled or were rejected:
- **Scope creep**: PRs that tried to do too much
- **Missing context**: PRs that didn't explain the problem
- **Weak testing**: PRs that lacked evidence
- **Wrong approach**: PRs that solved the wrong problem

### 4. Extract Common Review Feedback
From review comments across all PRs:
- What do reviewers say most often?
- What's the most common reason for "request changes"?
- What do reviewers ignore?

### 5. Build Contributor Playbook
Create a step-by-step guide:

**Before writing code:**
1. Read the wiki files
2. Check if the issue is available
3. Gather code context

**During development:**
1. Follow project conventions (cite specific ones)
2. Write tests for edge cases
3. Test in all relevant configurations

**Before submitting PR:**
1. Self-review checklist (cite specific items from review_failures.md)
2. Build verification steps
3. Evidence collection

**During review:**
1. How to respond to feedback
2. How to iterate
3. How to know when it's ready

### 6. Document Git Workflow
From raw data and PR patterns:
- Branch naming conventions
- Commit message format
- PR title format
- Fork/upstream workflow
- Git safety rules

## Output Format

```markdown
# Contribution Patterns

---

## How PRs Get Merged Here

### Fast Track (merged < 1 day)
- [Pattern 1]: [Evidence, PR #s]

### Normal Review (1-3 rounds)
- [Pattern 2]: [Evidence]

### High Scrutiny (3+ rounds or rejected)
- [Pattern 3]: [Evidence]

---

## Common Review Feedback

### Most Common
[Pattern with examples]

### Second Most Common
[Pattern with examples]

---

## Contributor Playbook

### Phase 1: Preparation
[Steps]

### Phase 2: Implementation
[Steps]

### Phase 3: Submission
[Steps]

### Phase 4: Review
[Steps]

---

## Git Workflow

### Branch Naming
`fix/xxx`, `feat/xxx`, `docs/xxx`

### Commit Messages
`type(scope): description`

### PR Description Template
[Template from real PRs]

---

## What Makes a Great Contributor Here

1. [Trait 1]
2. [Trait 2]
```

## Quality Guidelines
- Base every claim on evidence from actual PRs
- The playbook should be actionable — someone reading it should know exactly what to do
- Include exact CLI commands for build, test, typecheck
- Note any repo-specific quirks (Windows issues, specific env vars, etc.)
- The PR description template should be copy-pasteable
- Cross-reference to maintainer_preferences.md for "how to please the reviewer"
