# Testing Heuristics Skill

Use these guidelines when verifying test coverage:

1. **Test Scenarios**:
   - Write scenarios for happy paths, negative boundaries, and network errors.
   - For every async action, identify what happens if it times out or returns out-of-order.
2. **Mocking Audits**:
   - Verify if tests mock too much. Mocks that duplicate the implementation logic mask real failures.
   - Prefer integration tests using local databases (e.g. SQLite) over deep mock objects.
3. **Flakiness Detection**:
   - Watch for tests using hardcoded timeouts or polling without wait limitations.
