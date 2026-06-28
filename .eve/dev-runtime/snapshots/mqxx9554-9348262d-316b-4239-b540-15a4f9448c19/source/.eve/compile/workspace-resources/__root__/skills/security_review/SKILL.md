# Security Review Skill

Apply these heuristics when reviewing code changes for security flaws:

1. **Input Sanitization**:
   - Verify all database queries use parameterized parameters (no raw SQL interpolation).
   - Sanitize user-provided HTML, URLs, or markdown elements before rendering to prevent XSS.
2. **Access Control**:
   - Ensure auth checks are performed in the backend runtime, not just hidden in UI elements.
   - Verify API routes enforce tenant separation (user A cannot fetch user B's organization data).
3. **Information Disclosure**:
   - Ensure logs do not print secrets, passwords, or personal user data (PII).
