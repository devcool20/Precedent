# Maintainer Preferences Wiki Prompt

Generate `maintainer_preferences.md` — reverse-engineer the maintainer's thinking patterns, review style, and what they value. This tells contributors "what will make the maintainer happy."

## Data Sources

1. **Review comments** — the most direct source. Look for:
   - Specific phrasing: "I prefer...", "We should...", "This should..."
   - What they praise vs criticize
   - What they ignore (formatting, style, naming)
   - How specific they are (line numbers, exact fix suggestions)

2. **PR merge patterns** — reveals preferences indirectly:
   - Which PRs get merged fast vs slow?
   - Which authors get fast approvals?
   - What types of changes get priority?

3. **PR descriptions that get positive responses** — what does the maintainer like to see?

4. **Raw data** — chat logs where you've interacted with the maintainer are the richest source

## Analysis Framework

### For Each Active Maintainer

**1. Core Philosophy (1-2 paragraphs)**
Synthesize their approach into principles:
- "Prefers smaller, scoped solutions over complex multi-component designs"
- "Explicit > implicit"
- "Fail closed, fail loud"
- "Test surface matters more than test volume"

**2. Review Style**
- How do they review? (every line, high-level only, security-focused)
- What do they catch? (logic bugs, edge cases, security, performance)
- How do they communicate? (direct, questioning, collaborative, terse)
- Do they cite evidence? (line numbers, test output, running the app)

**3. Specific Technical Preferences**
For each area of the codebase, what do they prefer?
- Database: SQLite vs Postgres preferences
- Architecture: Monolith vs microservices, patterns
- Testing: Unit vs integration, mock vs real
- State management: Patterns they like
- Error handling: How they want errors surfaced

**4. What They Reject Fast**
List patterns that trigger immediate rejection:
- Non-compiling code
- Mock-only testing
- Global mutable state modifications
- Wrong patterns (full store subscriptions, etc.)

**5. Communication Preferences**
- How should contributors interact with them?
- Direct vs deferential? Evidence vs reasoning?
- What format do they want PR descriptions in?

## Output Structure

Organize per-maintainer if there are multiple. Always include:

1. **Core Philosophy** — their fundamental approach
2. **Review Style** — how they review
3. **Specific Technical Preferences** — per-area
4. **Rejection Profile** — what gets blocked fast
5. **Communication Patterns** — how they interact

End with a **Repetition Pattern** section that identifies preferences that appear across multiple contexts (confirming they're core, not one-off opinions).

## Quality Rules

- Every claim must be backed by evidence (cite PR #, quote, or specific observation)
- Distinguish between hard rules ("will not merge without tests") and soft preferences ("prefers explicit over implicit")
- If a preference only appeared once, flag it as tentative
- The most valuable output: "What would this maintainer notice in 5 seconds of looking at a PR?"
- If there are multiple maintainers with different styles, document each separately and note the differences
