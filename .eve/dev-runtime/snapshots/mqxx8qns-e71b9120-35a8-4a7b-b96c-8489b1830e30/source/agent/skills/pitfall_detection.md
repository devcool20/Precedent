# Pitfall Detection Skill

When mapping or finding pitfalls, look for recurring bug patterns in history:

1. **Concurrency Lock Traps**:
   - Sharing mutable state without sync mutices or channels.
   - Nested locks that could cause deadlocks.
2. **Caching & Stale Gaps**:
   - Writing to databases without invalidating the cache.
   - Assuming cached items are always available or populated.
3. **Environment Quirks**:
   - Path operations using backslashes vs forward slashes (breaking on Windows vs Linux).
   - Local-only variables missing from CI/CD environments.
4. **Failure Manifestations**:
   - Note down exactly how a failure manifests (error codes, memory leaks, timeouts).
