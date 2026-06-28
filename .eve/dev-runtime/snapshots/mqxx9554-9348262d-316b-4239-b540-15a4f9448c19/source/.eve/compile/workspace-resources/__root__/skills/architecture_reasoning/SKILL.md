# Architecture Reasoning Skill

When analyzing a codebase's architecture, look for patterns across file paths, import structures, and PR descriptions:

1. **Layer Identification**: Group directories into logical layers (e.g. CLI, Server Runtime, Storage, UI components).
2. **Component Mapping**: Identify the single responsibility of each component. Trace what consumes it (its clients) and what it consumes (its dependencies).
3. **Data Flow Tracing**: Map sequential operations from user action (Trigger) through intermediate services (Path) to databases or output interfaces (Result).
4. **CDD Extraction**: Scan discussions for phrases like "we decided to", "the tradeoff is", "we chose X instead of Y". A valid Critical Design Decision contains:
   - Context: The problem prompting the decision.
   - Decision: The solution chosen.
   - Alternatives Considered: What other paths were rejected.
   - Tradeoffs: What benefits were gained and what was compromised.
   - Source: PR or issue numbers.
