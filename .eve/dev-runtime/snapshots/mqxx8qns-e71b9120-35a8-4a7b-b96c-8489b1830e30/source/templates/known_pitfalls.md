<!-- AGENT: wiki-pitfall-mapper — fill all sections below -->

# {{PROJECT_NAME}} Known Pitfalls

> <!-- AGENT: 1-paragraph overview — what this file contains, who should read it, and when to consult it -->

## Pitfalls by Area

### Database

#### Pitfall: [Pitfall Name]
- **Trigger**: <!-- Action/config/condition that springs the trap -->
- **Symptoms**: <!-- What the user/developer sees -->
- **Root Cause**: <!-- Chain of events -->
- **Fix**: <!-- Code pattern or configuration change -->
- **Test/Verification**: <!-- Steps to confirm the fix -->
- **Cross-Reference**: <!-- review_failures.md → Failure Name, PR # -->

#### Pitfall: [Pitfall Name]
...

### API/Backend

...

### UI/Frontend

...

### Security/Auth

...

### Caching

...

### Concurrency

...

### Configuration

...

### Deployment

...

### Testing

...

### Dependencies

...

## Quick Reference: Most Dangerous Pitfalls

<!-- AGENT: top 3-5 pitfalls that new contributors must know -->

| Priority | Pitfall | Area | Impact | Prevention |
|----------|---------|------|--------|------------|
| 🔴 P0 | <!-- name --> | <!-- area --> | <!-- e.g. Data loss --> | <!-- e.g. Always use transactions --> |
| 🟡 P1 | <!-- name --> | <!-- area --> | <!-- e.g. Silent failure --> | <!-- e.g. Monitor error logs --> |
| ... | | | | |

## Pitfall-to-Failure Map

<!-- AGENT: mapping between pitfalls and the failures that discovered them -->

| Pitfall | Discovered In | Related Failure |
|---------|--------------|-----------------|
| <!-- name --> | <!-- PR # --> | <!-- review_failures.md → Failure Name --> |
| ... | | |
