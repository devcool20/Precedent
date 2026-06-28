# Review Heuristics Skill

When performing general code reviews, evaluate logic, boundaries, and type safety:

1. **Logic & Conditions**:
   - Audit all condition statements for off-by-one errors (e.g. `<` vs `<=`).
   - Check if variables could be null, undefined, or empty, and ensure proper checks exist.
   - Verify parameter types and counts match function declarations.
2. **Boundary Conditions**:
   - Check how loops handle empty collections, negative numbers, or maximum boundaries.
   - Ensure defaults exist for missing object keys.
3. **State Integrity**:
   - Watch for side effects inside getter functions or callbacks.
   - Audit state updates for potential stale closures (e.g. in React hooks or async callbacks).
