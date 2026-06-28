<!-- AGENT: wiki-failure-analyst — fill all sections below -->

# {{PROJECT_NAME}} Review Failures

> <!-- AGENT: 1-paragraph overview: the purpose of this file, how failures are categorized, and the review culture -->

## Failure Categories

<!-- AGENT: list the categories found in this project (see prompt for default set) -->

| Category | Count | Description |
|----------|-------|-------------|
| <!-- e.g. Security --> | <!-- # --> | <!-- Auth, injection, credential bugs --> |
| <!-- fill... --> | | |

## Failures by Category

### Security

<!-- AGENT: group failures into their respective category sections below -->

#### Failure: [Specific Failure Title]
- **Context**: <!-- PR #, review round, reviewer -->
- **Root Cause**: <!-- Chain of events that caused the bug -->
- **Why Contributor Missed It**: <!-- Testing gap or blind spot -->
- **Why Reviewer Found It**: <!-- How was it caught -->
- **Detection**: <!-- What the user sees / error message -->
- **Fix**: <!-- File + approach that resolved it -->
- **Prevention Rule**: <!-- "Always do X" — actionable -->
- **Checklist Item**: <!-- Yes/no question for future reviews -->
- **Severity**: <!-- Blocker / Critical / High / Medium / Low -->
- **Related Files**: <!-- File paths mentioned -->

<!-- Repeat for each failure in this category -->

### State Management

...

### Concurrency

...

### Performance

...

### Database

...

### Compilation/Build

...

### API/Integration

...

### UI/Rendering

...

### Testing

...

### Process

...

## Failure Statistics

<!-- AGENT: aggregate stats about failures found -->

- **Total Failures Documented**: <!-- # -->
- **Categories Represented**: <!-- # -->
- **Most Common Category**: <!-- category name -->
- **Most Severe Pattern**: <!-- brief description -->
