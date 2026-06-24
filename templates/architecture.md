<!-- AGENT: wiki-architect — fill all sections below -->

# {{PROJECT_NAME}} Architecture

> <!-- AGENT: fill with a 1-paragraph overview of what this system is and its core purpose -->

## Tech Stack

<!-- AGENT: fill with language, framework, database, middleware, key libraries -->

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| <!-- e.g. Runtime --> | <!-- e.g. Node.js --> | <!-- e.g. 20.x --> | <!-- e.g. Server execution --> |
| <!-- fill... --> | | | |

## Directory Structure

<!-- AGENT: list the top-level directories, what each contains, and the key files within each -->

```
.
├── src/               # <!-- e.g. Application source code -->
│   ├── components/    # <!-- e.g. Reusable UI components -->
│   └── ...
├── ...
```

- **`src/`**: <!-- description -->
  - `src/components/`: <!-- description -->
  - ...

## Component Map

<!-- AGENT: for each major component, describe its responsibility, the files it comprises, and what interacts with it -->

| Component | Responsibility | Key Files | Consumed By |
|-----------|---------------|-----------|-------------|
| <!-- e.g. Auth Service --> | <!-- e.g. Handles user auth --> | <!-- e.g. auth.ts --> | <!-- e.g. API Gateway --> |
| <!-- fill... --> | | | |

## Data Flow

<!-- AGENT: trace at least 3 key flows from trigger to completion -->

### Flow 1: [Flow Name]
**Trigger**: <!-- e.g. User submits form -->
**Path**: <!-- e.g. Frontend → API Gateway → Auth Service → Database → Response -->
**Result**: <!-- e.g. User is created and welcome email sent -->

### Flow 2: [Flow Name]
...

### Flow 3: [Flow Name]
...

## Key Design Decisions

<!-- AGENT: each CDD should have context, decision, alternatives, tradeoffs, and source -->

### CDD 1: [Decision Title]
- **Context**: <!-- Why this decision needed to be made -->
- **Decision**: <!-- What was chosen -->
- **Alternatives**: <!-- What else was considered -->
- **Tradeoffs**: <!-- What was gained and lost -->
- **Source**: <!-- PR # or chat log reference -->

### CDD 2: [Decision Title]
...

### CDD 3: [Decision Title]
...

## Constraints

<!-- AGENT: platform constraints, version requirements, rate limits, security reqs -->

- <!-- e.g. Node.js 18+ required -->
- <!-- e.g. Windows path handling in file operations -->
- <!-- e.g. GitHub API: 60 req/hr (unauthenticated), 5,000 req/hr (token) -->

## Terminology

| Term | Definition |
|------|-----------|
| <!-- e.g. PR --> | <!-- Pull Request — a proposed code change --> |
| <!-- fill... --> | |
