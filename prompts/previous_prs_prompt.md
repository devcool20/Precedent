# Previous PRs Wiki Prompt

Generate `previous_prs.md` — the public historical record of every PR, its decisions, and its lessons. This helps contributors understand the project's evolution and avoid repeating past discussions.

## Data Sources

1. **Fetched PR data** — the primary source. Each PR has:
   - Number, title, author, dates, body, comments count
   - Review comments if fetched

2. **Raw data** — may contain additional context about specific PRs

3. **Already-generated wiki files** — cross-reference failures, maintainer preferences, and pitfalls to specific PRs

## Organization Strategy

### For 1-20 PRs: Detailed per-PR treatment
Each PR gets its own section with:
- Title, author, merge date, type
- Full summary of what it did
- Key decisions made
- Review notes (if any)
- Files changed
- Lessons for future contributors

### For 20-50 PRs: Tables + Spotlight
Use tables for the bulk listing, then spotlight the most important 5-10 PRs with detailed sections. Group by theme or time period.

### For 50+ PRs: Grouped by theme
Create thematic tables (Security PRs, Feature PRs, Bug Fix PRs, Docs PRs) plus a comprehensive timeline. Spotlight only landmark PRs.

## What to Extract from Each PR

Not every field needs to be in the output. Extract:

### Always include:
- PR number, title, author, merge date
- Type (Feature / Bug Fix / Security / Docs / CI / Refactor)

### Include if available and interesting:
- Key decisions made
- Review controversy (multiple rounds, disagreements)
- Approach taken (and alternatives rejected)
- Testing approach
- E2E evidence mentioned

### Include only for important PRs:
- Full root cause analysis
- Before/after behavior comparison
- Timeline of review rounds
- Quotes from maintainers

## Timeline

Always include a chronological timeline at the end:
```
Date              PR #     Author    Description
----------------- -------- --------- ---------------------------
2026-01-31        #342     benjamin  OPENCODE_BIN_PATH override
```

## Cross-References

After each significant PR, add links to related wiki entries:
- "See review_failures.md — Failure: [X]" for bug fix PRs
- "See maintainer_preferences.md" for PRs that reveal maintainer patterns
- "See known_pitfalls.md — [X]" for PRs that discovered pitfalls

## Quality Rules

- Every fetched PR must appear somewhere in the output
- PRs that had major impact deserve spotlight treatment
- Note which PRs were fast-tracked vs which took multiple rounds
- The timeline should be scannable at a glance
- Cross-references must use exact PR numbers
