# Review Failures Wiki Prompt

Generate `review_failures.md` — the permanent database of every mistake, bug, correction, and reviewer criticism. This is the most important file you'll create. It prevents contributors from repeating the same errors.

## Data Sources (in priority order)

1. **Review comments on PRs** — these are the richest source. Look for:
   - Maintainer comments requesting changes
   - "Blocker" or "CRITICAL" labeled comments
   - Bug descriptions in review threads
   - Back-and-forth discussions about what's wrong

2. **Bug fix PR bodies** — PRs that fix bugs often describe:
   - What was wrong
   - Root cause analysis
   - How it was detected
   - How it was fixed

3. **Revert commits/PRs** — something was merged then undone. Why?

4. **CI failure discussions** — what tests failed and why

5. **Raw data** (chat logs) — often contain the most candid descriptions of:
   - What went wrong
   - What the contributor was thinking
   - What the maintainer pointed out

## Finding Failures in PR Data

Not every PR contains a failure. Focus on:

### Bug Fix PRs (titles starting with "fix:")
- These are the most obvious source
- Extract the root cause and fix approach

### PRs with 2+ review comments
- Multiple rounds suggest something was wrong in the first round
- Look for "requested changes" reviews

### PRs with long descriptions
- Detailed root cause sections are gold
- Look for sections labeled "Root Cause", "Why", "The Problem"

### PRs that touch sensitive areas
- Security fixes (SQL injection, auth, credential handling)
- Concurrency fixes (race conditions, deadlocks)
- Data integrity fixes (corruption, loss, wrong values)

## Categorization

Create categories based on what you find, but START with this default set and only modify if needed:

| Category | When to Use |
|----------|-------------|
| Security | Credentials, injection, auth, encryption, data exposure |
| State Management | Wrong state, stale state, state lost, re-render storms |
| Concurrency | Race conditions, deadlocks, goroutine/thread bugs |
| Performance | Slow queries, resource leaks, N+1, unbounded loops |
| Database | Wrong queries, migration issues, data loss, contention |
| Compilation/Build | Broken builds, type errors, dependency problems |
| API/Integration | Wrong payload format, wrong protocol, version mismatch |
| UI/Rendering | Broken display, wrong behavior, visual bugs |
| Testing | Missing tests, flaky tests, wrong assertions, test gaps |
| Process | Communication failures, scope creep, wrong approach |

## Writing Each Failure Entry

For each failure, write:

```markdown
### Failure: [Title — should be specific enough to search for later]

- **Context**: Which PR(s), which review round, which conversation this came from
  (e.g. "PR #2337 review round 2 — evanklem review")
  
- **Root Cause**: What actually caused the issue. Trace through the actual chain of events.
  (e.g. "The effect dependency array included the store, and each check() call updated store state, causing re-render, changing the dependency, recreating the timeout, creating a 5-second loop")
  
- **Why Contributor Missed It**: What blind spot or testing gap let this through
  (e.g. "Only tested with static mock states, not during active download")
  
- **Why Reviewer Found It**: How was it caught? Specific action or observation.
  (e.g. "Ran console.count() in the check path and saw continuous firing")
  
- **Detection**: How does this manifest? Error message, crash, wrong behavior?
  (e.g. "Network tab shows continuous requests every 5 seconds")
  
- **Fix**: What change resolved it. File + approach.
  (e.g. "Select only stable checkForUpdates function; use useRef for dynamic options")
  
- **Prevention Rule**: One sentence that prevents recurrence.
  (e.g. "Always use selectors with Zustand stores; never subscribe to the full store object")
  
- **Checklist Item**: Yes/no question for future PR reviews.
  (e.g. "Can concurrent requests cause timestamp regression?")
  
- **Severity**: Blocker / Critical / High / Medium / Low

- **Related Files**: File paths mentioned in the failure
```

## Quality Rules

1. **Every failure needs a Root Cause AND a Prevention Rule**
2. If the same failure happened twice, merge them but note both occurrences
3. Quotes from reviewers add authority — include them when possible
4. Severity: "Blocker" = PR cannot merge without fixing this
5. The "Why Contributor Missed It" field reveals systematic blind spots — be honest
6. Prevention rules must be ACTIONABLE — "always do X" not "be more careful"
