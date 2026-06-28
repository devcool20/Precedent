# Maintainer Profiling Skill

Apply these heuristics when reverse-engineering maintainer behaviors:

1. **Activity Level**:
   - Count reviews, approvals, and merges per user profile.
2. **Comment Focus**:
   - Categorize what they review (styling, performance, security, architecture).
   - Trace comment style (e.g. directive suggestion vs questions).
3. **Rejection Triggers**:
   - Extract patterns from rejected or heavily contested PRs (e.g. "Do not add dependencies without approval", "Must include integration test").
