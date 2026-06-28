export interface Repository {
  id: string;
  owner: string;
  name: string;
  status: 'Healthy' | 'Conflicts' | 'Idle';
  lastBuild: string;
  activePRCheck: 'PASS' | 'BLOCK' | 'FLAG' | 'NONE';
  stats: {
    auditedPRs: number;
    blockersCaught: number;
    memoryRecords: number;
  };
}

export interface CddItem {
  id: string;
  title: string;
  description: string;
  context: string;
  alternatives: string[];
  tradeoffs: string;
  sourcePR: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  question: string;
  context: string;
  refPR: string;
}

export interface TimelineEvent {
  id: string;
  prNumber: string;
  title: string;
  date: string;
  author: string;
  impact: 'High' | 'Medium' | 'Low';
  description: string;
}

export interface Blocker {
  id: string;
  file: string;
  line: number;
  severity: 'CRITICAL' | 'WARNING';
  message: string;
  fix: string;
}

export interface PrRun {
  id: string;
  prNumber: string;
  title: string;
  date: string;
  author: string;
  status: 'PASS' | 'FLAG' | 'BLOCK';
  blockers: Blocker[];
  agentInsights: {
    assumption_hunter: string;
    test_gap: string;
    maintainer: string;
    pr_reviewer: string;
  };
}

export interface MemoryConflict {
  id: string;
  type: string;
  description: string;
  leftStatement: {
    text: string;
    sourcePr: string;
    date: string;
  };
  rightStatement: {
    text: string;
    sourcePr: string;
    date: string;
  };
}

export const mockRepositories: Repository[] = [
  {
    id: '1',
    owner: 'pmndrs',
    name: 'zustand',
    status: 'Healthy',
    lastBuild: '2 hours ago',
    activePRCheck: 'PASS',
    stats: { auditedPRs: 240, blockersCaught: 14, memoryRecords: 1250 }
  },
  {
    id: '2',
    owner: 'valibot',
    name: 'valibot',
    status: 'Conflicts',
    lastBuild: '1 day ago',
    activePRCheck: 'BLOCK',
    stats: { auditedPRs: 98, blockersCaught: 7, memoryRecords: 540 }
  },
  {
    id: '3',
    owner: 'honojs',
    name: 'hono',
    status: 'Healthy',
    lastBuild: '10 mins ago',
    activePRCheck: 'PASS',
    stats: { auditedPRs: 41, blockersCaught: 3, memoryRecords: 195 }
  },
  {
    id: '4',
    owner: 'devcool20',
    name: 'Precedent',
    status: 'Idle',
    lastBuild: 'Never built',
    activePRCheck: 'NONE',
    stats: { auditedPRs: 0, blockersCaught: 0, memoryRecords: 0 }
  }
];

export const simulatedBuildLogs = [
  'Initializing Precedent Engine v1.0.0...',
  'Connecting to Vercel Eve session handshaker...',
  'Session handshake established: session_eve_8f992a1c',
  'Fetching Git history for repository: devcool20/Precedent',
  'Retrieved 150 pull requests, 42 issues, 8 branches',
  'Initializing Subagents: [wiki-architect, wiki-failure-analyst, wiki-historian]',
  '[wiki-architect] Parsing codebase layout, routing, and data flow models...',
  '[wiki-failure-analyst] Scraping reviewer comments and PR rejections...',
  '[wiki-historian] Building release timeline and major refactoring branches...',
  'Processing PR #12: "Fix memory leakage in scheduler" - Merged by admin',
  'Processing PR #45: "Refactor database pool with transaction support" - Merged',
  'Processing PR #89: "Migrate state machine to Redux saga" - Rejected due to complexity',
  '[wiki-failure-analyst] Flagged repeat failure: Unreleased database connection pool. Ref PR #45',
  'Extracting Critical Design Decisions (CDDs)...',
  'CDD Detected: "Chose PostgreSQL transaction pooling over Client mapping" - Ref PR #45',
  'Running compiler validation on distilled markdown wiki template...',
  'Memory structures generated:',
  '  - architecture.json (4.2 KB)',
  '  - review_failures.json (8.1 KB)',
  '  - maintainer_preferences.json (2.9 KB)',
  '  - previous_prs.json (12.4 KB)',
  '  - known_pitfalls.json (5.0 KB)',
  'Validation checks: PASS (Completeness Score: 98%, Confidence: 94%)',
  'Pushing memory snapshot to Precedent Vercel KV store...',
  'Repository build complete! Memory is now active.'
];

export const mockCdds: CddItem[] = [
  {
    id: 'cdd-1',
    title: 'PostgreSQL Transaction Pooling',
    description: 'Use a single central connection manager with Transaction Mode in PgBouncer.',
    context: 'We faced heavy memory leakages and socket starvation under parallel build requests. Prior to this, each serverless function spun up a fresh connection pool, exhausting database socket limits within minutes.',
    alternatives: [
      'Direct Client connection mapping (exhausted sockets instantly).',
      'Vercel Postgres helper wrappers (did not support raw transaction scopes).'
    ],
    tradeoffs: 'Transaction mode disables prepared statement caching, increasing query overhead by roughly 4ms, but guarantees 100% database availability under load.',
    sourcePR: '#45: "Refactor database pool with transaction support"'
  },
  {
    id: 'cdd-2',
    title: 'SSE for Terminal Log Streaming',
    description: 'Use Server-Sent Events (SSE) instead of WebSockets for live terminal builds.',
    context: 'Real-time terminal logs require unidirectional streaming from server to client. WebSockets introduce unnecessary state handshake, heartbeat checks, and scaling issues on serverless functions.',
    alternatives: [
      'Short polling (created heavy API load).',
      'WebSockets (complex socket proxy setup required in Vercel Serverless).'
    ],
    tradeoffs: 'SSE has a maximum connection limit of 6 on HTTP/1.1 browsers, but since HTTP/2 is active everywhere, this limitation is bypassed. SSE is easier to deploy and autoscale.',
    sourcePR: '#29: "Add Server-Sent Events log streaming"'
  },
  {
    id: 'cdd-3',
    title: 'Durable Workflows for Agent Orchestration',
    description: 'Implemented Vercel Eve workflow orchestration to allow agent sessions to pause/resume.',
    context: 'Agent runs take anywhere from 1 to 5 minutes, which exceeds serverless function timeout limits. Durable execution keeps state in KV, allowing pauses during approval gates.',
    alternatives: [
      'Standard long-running server instance (high maintenance cost).',
      'Firebase listener polling (slow state synchronization).'
    ],
    tradeoffs: 'Increases KV database read/write counts but guarantees resilience against worker crashes.',
    sourcePR: '#77: "Integrate Eve durable agent workflows"'
  }
];

export const mockChecklists: ChecklistItem[] = [
  {
    id: 'chk-1',
    category: 'Database Connection',
    question: 'Does this PR create database connections outside the centralized pooled helper?',
    context: 'Historically, 4 separate PRs (#4, #24, #45, #51) failed in production due to db connection exhaustion. Any raw `new Client()` commands will fail review.',
    refPR: '#45'
  },
  {
    id: 'chk-2',
    category: 'State Machine',
    question: 'Does the action dispatcher include a timeout parameter and rollback handler?',
    context: 'PR #89 introduced a deadlock where the orchestrator stayed stuck in "PENDING" indefinitely because the subagent failed to respond. Timeout handlers are now strict requirements.',
    refPR: '#89'
  },
  {
    id: 'chk-3',
    category: 'OAuth Callback',
    question: 'Does the GitHub callback router properly validate the CSRF state token before exchanging auth codes?',
    context: 'Discovered during security audit in PR #114. Added strict state validation checks.',
    refPR: '#114'
  }
];

export const mockTimeline: TimelineEvent[] = [
  {
    id: 't-1',
    prNumber: '#45',
    title: 'Refactor database pool with transaction support',
    date: 'June 12, 2026',
    author: 'devcool20',
    impact: 'High',
    description: 'Migrated database adapter layer to use PgBouncer in transaction mode. Resolved recurring pool timeout crashes.'
  },
  {
    id: 't-2',
    prNumber: '#77',
    title: 'Integrate Eve durable agent workflows',
    date: 'June 18, 2026',
    author: 'sharm-s',
    impact: 'High',
    description: 'Ported agent execution from direct script calls to Vercel Eve workflows. Introduced durability and run sessions.'
  },
  {
    id: 't-3',
    prNumber: '#89',
    title: 'Migrate state machine to Redux saga',
    date: 'June 20, 2026',
    author: 'claudio-dev',
    impact: 'Medium',
    description: 'Introduced Redux saga for state handling. Rejected once, refactored, and successfully merged to handle background task states.'
  },
  {
    id: 't-4',
    prNumber: '#102',
    title: 'Add status check API integration',
    date: 'June 25, 2026',
    author: 'devcool20',
    impact: 'Medium',
    description: 'Wired Precedent checks directly to GitHub Commit Status API. Repo now fails PR merges if Precedent yields BLOCK.'
  }
];

export const mockPrRuns: PrRun[] = [
  {
    id: 'run-1',
    prNumber: '#142',
    title: 'Implement incremental code segment indexing',
    date: '2 hours ago',
    author: 'claudio-dev',
    status: 'PASS',
    blockers: [],
    agentInsights: {
      assumption_hunter: 'No hazardous assumptions found. Code operates purely within the diff boundaries and utilizes cached indexing trees.',
      test_gap: 'Verified unit tests cover incremental indexing code at 92% statement coverage. Test cases check edge cases (empty repository, zero-length files).',
      maintainer: 'Code adheres strictly to the 2-space indentation rule, exports modular types, and avoids deprecated modules. Approved.',
      pr_reviewer: 'Overall architectural alignment: 100%. Code fits cleanly inside the parser layer.'
    }
  },
  {
    id: 'run-2',
    prNumber: '#143',
    title: 'Expose direct SQL adapter on router client',
    date: '1 hour ago',
    author: 'junior-coder',
    status: 'BLOCK',
    blockers: [
      {
        id: 'b-1',
        file: 'src/routes/client.ts',
        line: 87,
        severity: 'CRITICAL',
        message: 'Direct DB connection instantiated. Instantiating direct `new Client()` bypasses PgBouncer transaction pool, risking database socket starvation.',
        fix: 'Import connection pool from `src/db/pool` and use `pool.query()` instead of creating a fresh client.'
      },
      {
        id: 'b-2',
        file: 'src/routes/client.ts',
        line: 94,
        severity: 'WARNING',
        message: 'Raw query execution lacks SQL injection protection on `userId` path variable.',
        fix: 'Replace inline template string with parameterized queries e.g. `pool.query("SELECT * FROM users WHERE id = $1", [userId])`'
      }
    ],
    agentInsights: {
      assumption_hunter: 'Critical: The author assumes that direct DB clients are automatically cleaned up by garbage collection. In serverless execution contexts, connection sockets persist, quickly overwhelming database connections.',
      test_gap: 'Code lacks unit tests for the SQL adapter client. Zero test coverage on database failure states.',
      maintainer: 'Reject: Direct DB execution breaks architecture standards established in PR #45.',
      pr_reviewer: 'PR fails review. Blocker caught: connection leak risks and SQL injection vulnerability.'
    }
  },
  {
    id: 'run-3',
    prNumber: '#144',
    title: 'Update markdown layout wrapper',
    date: '10 mins ago',
    author: 'designer-bob',
    status: 'FLAG',
    blockers: [
      {
        id: 'b-3',
        file: 'templates/markdown.css',
        line: 12,
        severity: 'WARNING',
        message: 'Font-size uses absolute pixel definitions instead of rem/em variables.',
        fix: 'Replace `font-size: 16px` with `font-size: var(--font-base)`.'
      }
    ],
    agentInsights: {
      assumption_hunter: 'Low risk. Minor accessibility layout inconsistencies.',
      test_gap: 'No CSS testing active in project.',
      maintainer: 'Preference Warning: Please use variable styles to ensure theme switcher compatibility.',
      pr_reviewer: 'Fails preference checks slightly. Warned author, code is safe to merge if updated.'
    }
  }
];

export const mockConflicts: MemoryConflict[] = [
  {
    id: 'conf-1',
    type: 'Code Style Preference',
    description: 'Contradiction between preferred formatter styles extracted from PR #56 and PR #112.',
    leftStatement: {
      text: 'Maintainer prefers raw tab spacing (4-spaces) for all TypeScript config files.',
      sourcePr: 'PR #56: "Migrate typescript config to strict node"',
      date: 'June 10, 2026'
    },
    rightStatement: {
      text: 'Maintainer prefers prettier standard (2-spaces) with double-quotes for TS files.',
      sourcePr: 'PR #112: "Format files using Prettier standards"',
      date: 'June 26, 2026'
    }
  },
  {
    id: 'conf-2',
    type: 'Architectural Data Flow',
    description: 'Conflicting assertions on repository state persistence models.',
    leftStatement: {
      text: 'Memory Explorer reads schemas dynamically from Vercel KV store directly.',
      sourcePr: 'PR #77: "Integrate Eve durable agent workflows"',
      date: 'June 18, 2026'
    },
    rightStatement: {
      text: 'Memory Explorer reads architecture schemas from local generated JSON exports.',
      sourcePr: 'PR #102: "Add status check API integration"',
      date: 'June 25, 2026'
    }
  }
];
