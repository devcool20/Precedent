# Architecture Wiki Prompt

Generate a comprehensive `architecture.md` that teaches a new contributor how this system works, what decisions shaped it, and what constraints it operates under.

## Data Sources

1. **PR data**: Extract from PR titles, bodies, and file paths:
   - Which directories exist and what they contain
   - Which files are mentioned most frequently (key files)
   - Architecture-focused PRs (titles containing "architecture", "refactor", "redesign")
   - File paths reveal module structure

2. **PR descriptions** often contain:
   - Data flow descriptions ("when X happens, Y calls Z which updates A")
   - Component interactions
   - Why certain approaches were chosen

3. **Raw data** (chat logs) often contains:
   - Architecture explanations given to newcomers
   - Design rationales that didn't make it into PRs
   - Pain points and areas people find confusing

## Extraction Strategy

### For System Overview
Look for README extracts, project descriptions in PR bodies, and raw data introductions. Combine into a cohesive 1-paragraph summary.

### For Components
Scan all file paths in PR data. Group by directory. For each directory:
- What files does it contain?
- How often is it modified?
- What PRs touch it (for understanding its role)?

Key files are those that appear in multiple PRs or are described in detail in PR bodies.

### For Data Flows
PR bodies that describe features often trace the flow. Look for:
- "When user does X..." → describes user-initiated flows
- "The system periodically..." → describes background processes
- "X calls Y which..." → describes API/internal flows

Map each flow as: Input → Component → Processing → Storage → Output → User-visible result

### For Design Decisions
Search PR bodies and review comments for:
- "We chose X over Y because..."
- "The tradeoff is..."
- "X approach was considered but rejected because..."
- "This follows the pattern established in PR #..."

Each CDD should be self-contained (can be understood without reading the PR).

### For Constraints
Look for:
- Platform-specific fixes (Windows paths, macOS-only features)
- Version requirements (Node 18+, specific library versions)
- Rate limits, API quotas
- Security requirements (auth, encryption)
- Deployment architecture (single vs multi-instance)

## Output File
Write to `user-input/output/architecture.md`

## Quality Checklist
- [ ] At least 5 CDDs (or 3 for new/small repos)
- [ ] Each CDD includes: Context, Decision, Alternatives, Tradeoffs, Source PR
- [ ] Terminology section defines every domain-specific term
- [ ] Data flows trace from user action to user-visible result
- [ ] File paths are accurate (extracted from actual PR data)
- [ ] Tech stack is complete (language, framework, database, middleware)
