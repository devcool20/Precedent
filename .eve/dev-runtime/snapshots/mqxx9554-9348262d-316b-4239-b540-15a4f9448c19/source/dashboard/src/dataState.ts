import type { Repository, CddItem, ChecklistItem, TimelineEvent, PrRun, MemoryConflict } from './mockData';

export interface RepoData {
  cdds: CddItem[];
  checklists: ChecklistItem[];
  timeline: TimelineEvent[];
  prRuns: PrRun[];
  conflicts: MemoryConflict[];
  threshold: 'strict' | 'balanced' | 'alert';
  apiKeys: {
    openai: string;
    gemini: string;
    github: string;
  };
}

export const initialRepositories: Repository[] = [
  {
    id: '1',
    owner: 'pmndrs',
    name: 'zustand',
    status: 'Idle',
    lastBuild: 'Never built',
    activePRCheck: 'NONE',
    stats: { auditedPRs: 0, blockersCaught: 0, memoryRecords: 0 }
  },
  {
    id: '2',
    owner: 'valibot',
    name: 'valibot',
    status: 'Idle',
    lastBuild: 'Never built',
    activePRCheck: 'NONE',
    stats: { auditedPRs: 0, blockersCaught: 0, memoryRecords: 0 }
  },
  {
    id: '3',
    owner: 'honojs',
    name: 'hono',
    status: 'Idle',
    lastBuild: 'Never built',
    activePRCheck: 'NONE',
    stats: { auditedPRs: 0, blockersCaught: 0, memoryRecords: 0 }
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

export const zustandRepoData: RepoData = {
  threshold: 'balanced',
  apiKeys: {
    openai: 'sk-proj-ZustandOpenAIKey123',
    gemini: 'AIzaSy-ZustandGeminiKey456',
    github: 'ghp_ZustandGithubToken789'
  },
  cdds: [
    {
      id: 'cdd-zs-1',
      title: 'Transient State Updates',
      description: 'Implement selector-based subscriptions to prevent components from re-rendering on irrelevant store changes.',
      context: 'Subscribing to the entire store state caused all mounted components to re-render whenever any slice updated, degrading rendering performance in complex UI sections.',
      alternatives: [
        'Component-level local contexts (makes global state sharing complex).',
        'State event broadcasting (increases code boilerplate).'
      ],
      tradeoffs: 'Guarantees component re-renders are triggered only when selected state values change, but requires developers to write selectors for every store subscription hook.',
      sourcePR: '#405: "Optimize transient state selector subscriptions"'
    },
    {
      id: 'cdd-zs-2',
      title: 'Slices Pattern Store Middleware',
      description: 'Encapsulate state segments into individual slice creators, merging them into a single unified global store.',
      context: 'Single store definition files grew to over 1,500 lines of code, making maintenance, type safety, and parallel feature development extremely difficult.',
      alternatives: [
        'Multiple isolated stores (breaks centralized global state consistency).',
        'Direct module namespaces (lacked unified typescript definitions).'
      ],
      tradeoffs: 'Allows isolated slice definitions while exposing a single store hook, but increases typescript type-resolution complexity during store composition.',
      sourcePR: '#512: "Implement composition slices store middleware pattern"'
    }
  ],
  checklists: [
    {
      id: 'chk-zs-1',
      category: 'Store Selectors',
      question: 'Does this component subscription specify granular, memoized state selectors?',
      context: 'Returning non-primitive objects directly from selectors triggers infinite render loops unless a shallow comparison helper is passed to the store hook.',
      refPR: '#405'
    },
    {
      id: 'chk-zs-2',
      category: 'State Mutability',
      question: 'Does the store state update return a new state object instead of mutating the current store properties directly?',
      context: 'Mutating states directly in Zustand prevents component listeners from detecting store changes, preventing UI updates.',
      refPR: '#512'
    }
  ],
  timeline: [
    {
      id: 't-zs-1',
      prNumber: '#405',
      title: 'Optimize transient state selector subscriptions',
      date: 'May 12, 2026',
      author: 'dai-shi',
      impact: 'High',
      description: 'Refactored hook listeners to run shallow equality comparisons on selectors. Dropped redraw cycles.'
    },
    {
      id: 't-zs-2',
      prNumber: '#512',
      title: 'Implement composition slices store middleware pattern',
      date: 'May 22, 2026',
      author: 'joshua-dev',
      impact: 'Medium',
      description: 'Introduced centralized store creator slices. Segmented authentication and UI store blocks.'
    }
  ],
  prRuns: [
    {
      id: 'run-zs-1',
      prNumber: '#580',
      title: 'Refactor store state with selector subscriptions',
      date: '3 hours ago',
      author: 'dai-shi',
      status: 'PASS',
      blockers: [],
      agentInsights: {
        assumption_hunter: 'Safe. Selectors utilize primitive keys. No circular reference issues.',
        test_gap: 'Verified unit tests cover slice subscription logic at 92%.',
        maintainer: 'Adheres to style preferences. Approved.',
        pr_reviewer: 'Approved.'
      }
    }
  ],
  conflicts: []
};

export const valibotRepoData: RepoData = {
  threshold: 'balanced',
  apiKeys: {
    openai: 'sk-proj-ValibotOpenAIKey224',
    gemini: 'AIzaSy-ValibotGeminiKey778',
    github: 'ghp_ValibotGithubToken001'
  },
  cdds: [
    {
      id: 'cdd-vb-1',
      title: 'Modular Schema Tree-Shaking',
      description: 'Export validation schemas as independent functions instead of methods on a centralized class builder.',
      context: 'Zod imports required loading the full library core, which added 15-20KB of un-shakable bundle payload to the client-side form validator scripts.',
      alternatives: [
        'Class namespace separation (still restricted complete bundler tree-shaking).',
        'Custom lightweight validation regexes (risked security parser bypasses).'
      ],
      tradeoffs: 'Allows bundlers to shake off unused validation helpers, reducing bundle size to less than 1KB for simple forms, but changes builder syntax to functional composition.',
      sourcePR: '#210: "Enable tree-shakable functional schema definitions"'
    },
    {
      id: 'cdd-vb-2',
      title: 'Pipeline Transformation Actions',
      description: 'Apply input cleanup operations (e.g. trim, toLowerCase) as sequential validation pipe handlers.',
      context: 'Merging raw input formatting with strict validation created side-effect bugs during type coercion.',
      alternatives: [
        'Pre-validation custom formatting functions (required manual hook integration).',
        'Implicit format schemas (made schema rules difficult to document).'
      ],
      tradeoffs: 'Separates content verification from structural parsing, but adds validation overhead to compose validation arrays.',
      sourcePR: '#324: "Add pipeline parser action transformations"'
    }
  ],
  checklists: [
    {
      id: 'chk-vb-1',
      category: 'Validator Imports',
      question: 'Are validation methods imported individually from the package path?',
      context: 'Importing the entire module namespace via `import * as v` bypasses tree-shaking, rendering the library advantages null.',
      refPR: '#210'
    },
    {
      id: 'chk-vb-2',
      category: 'Schema Safety',
      question: 'Does the schema definition use strict keys validation instead of silent object parsing?',
      context: 'Allowing unlisted properties in validation pipelines creates a risk for database payload insertion injections.',
      refPR: '#324'
    }
  ],
  timeline: [
    {
      id: 't-vb-1',
      prNumber: '#210',
      title: 'Enable tree-shakable functional schema definitions',
      date: 'April 05, 2026',
      author: 'fabian-hiller',
      impact: 'High',
      description: 'Wrote functional composition validators. Decreased default bundle size by 90%.'
    },
    {
      id: 't-vb-2',
      prNumber: '#324',
      title: 'Add pipeline parser action transformations',
      date: 'April 15, 2026',
      author: 'hiller-f',
      impact: 'Medium',
      description: 'Merged transformation pipeline and validation steps. Standardized trim and validation sequences.'
    }
  ],
  prRuns: [
    {
      id: 'run-vb-1',
      prNumber: '#389',
      title: 'Add strict parser validation check to input fields',
      date: '1 hour ago',
      author: 'junior-coder',
      status: 'BLOCK',
      blockers: [
        {
          id: 'b-vb-1',
          file: 'src/routes/client.ts',
          line: 87,
          severity: 'CRITICAL',
          message: 'Direct DB connection instantiated. Instantiating direct `new Client()` bypasses PgBouncer transaction pool, risking database socket starvation.',
          fix: 'Import connection pool from `src/db/pool` and use `pool.query()` instead of creating a fresh client.'
        },
        {
          id: 'b-vb-2',
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
    }
  ],
  conflicts: [
    {
      id: 'conf-vb-1',
      type: 'Valibot Schema Formatting',
      description: 'Contradiction between validation syntax preferences extracted from PR #210 and PR #324.',
      leftStatement: {
        text: 'Schema validation pipes should place transformation helpers (e.g. trim) at the beginning of the validator array.',
        sourcePr: 'PR #210: "Enable tree-shakable functional schema definitions"',
        date: 'April 05, 2026'
      },
      rightStatement: {
        text: 'Pipeline transformations must run only after structural types are checked to avoid runtime errors on undefined fields.',
        sourcePr: 'PR #324: "Add pipeline parser action transformations"',
        date: 'April 15, 2026'
      }
    }
  ]
};

export const honoRepoData: RepoData = {
  threshold: 'balanced',
  apiKeys: {
    openai: 'sk-proj-HonoOpenAIKey556',
    gemini: 'AIzaSy-HonoGeminiKey112',
    github: 'ghp_HonoGithubToken334'
  },
  cdds: [
    {
      id: 'cdd-hn-1',
      title: 'RegExpRouter Routing Table',
      description: 'Compile routing paths into a single unified Regular Expression matching structure.',
      context: 'Linear routing table scanning degraded matching performance as route lists expanded beyond 100 paths, causing high latency spikes.',
      alternatives: [
        'Standard Radix Tree routing (faster than linear, but slower than unified regexp compilation).',
        'Hashmap routing keys (failed to resolve dynamic path variables).'
      ],
      tradeoffs: 'Boosts routing speeds to O(1) matching, but increases memory overhead for RegExp graph generation during application initialization.',
      sourcePR: '#95: "Implement RegExpRouter compiled matching engine"'
    },
    {
      id: 'cdd-hn-2',
      title: 'Fetch API Standardization',
      description: 'Expose standard request/response adapters to run on any JS execution platform (Edge, Node, Bun).',
      context: 'Legacy Node.js HTTP adapters tied middleware to standard Node socket APIs, preventing deployment on Cloudflare Workers or Web Workers.',
      alternatives: [
        'Platform-specific routing wrappers (increased core bundle size and required separate exports).',
        'Custom edge proxy wrappers (slowed development cycles).'
      ],
      tradeoffs: 'Allows hono to run anywhere, but requires a polyfill layer for legacy Node environments lacking native Fetch support.',
      sourcePR: '#152: "Port routing request layer to standard Web Fetch API"'
    }
  ],
  checklists: [
    {
      id: 'chk-hn-1',
      category: 'Route Definitions',
      question: 'Are route parameters isolated from overlapping wildcard regular expression definitions?',
      context: 'Wildcard paths that overlap with static routes create ambiguity in RegExp router generation, bypassing validation routes.',
      refPR: '#95'
    },
    {
      id: 'chk-hn-2',
      category: 'Edge Portability',
      question: 'Does the routing middleware read request payloads using standard Fetch interfaces?',
      context: 'Using Node specific `fs` or `process` methods inside the routing controller prevents middleware from executing on Cloudflare Workers.',
      refPR: '#152'
    }
  ],
  timeline: [
    {
      id: 't-hn-1',
      prNumber: '#95',
      title: 'Implement RegExpRouter compiled matching engine',
      date: 'May 01, 2026',
      author: 'yusukebe',
      impact: 'High',
      description: 'Replaced Radix trees with RegExpRouter path matching. Handled path parameters.'
    },
    {
      id: 't-hn-2',
      prNumber: '#152',
      title: 'Port routing request layer to standard Web Fetch API',
      date: 'May 10, 2026',
      author: 'hono-team',
      impact: 'High',
      description: 'Unified request/response interface under Fetch standards. Enabled Cloudflare support.'
    }
  ],
  prRuns: [
    {
      id: 'run-hn-1',
      prNumber: '#215',
      title: 'Optimize RegExp routing compiled matching table',
      date: '2 hours ago',
      author: 'yusukebe',
      status: 'PASS',
      blockers: [],
      agentInsights: {
        assumption_hunter: 'Safe. RegExps are compiled statically. No runtime regex injection risk.',
        test_gap: 'Verified route matching unit test coverage is 95%.',
        maintainer: 'Approved route optimizations.',
        pr_reviewer: 'Approved.'
      }
    }
  ],
  conflicts: []
};

export const initialRepoData: Record<string, RepoData> = {
  '1': { threshold: 'balanced', apiKeys: { openai: '', gemini: '', github: '' }, cdds: [], checklists: [], timeline: [], prRuns: [], conflicts: [] },
  '2': { threshold: 'balanced', apiKeys: { openai: '', gemini: '', github: '' }, cdds: [], checklists: [], timeline: [], prRuns: [], conflicts: [] },
  '3': { threshold: 'balanced', apiKeys: { openai: '', gemini: '', github: '' }, cdds: [], checklists: [], timeline: [], prRuns: [], conflicts: [] },
  '4': { threshold: 'balanced', apiKeys: { openai: '', gemini: '', github: '' }, cdds: [], checklists: [], timeline: [], prRuns: [], conflicts: [] }
};

// Data loaded for Precedent AFTER onboarding/rebuild finishes
export const precedentRepoData: RepoData = {
  threshold: 'balanced',
  apiKeys: {
    openai: 'sk-proj-PrecedentOpenAIKey998877',
    gemini: 'AIzaSy-PrecedentGeminiKey4455',
    github: 'ghp_PrecedentGithubToken1122'
  },
  cdds: [
    {
      id: 'cdd-pr-1',
      title: 'PgBouncer Connection Pooling',
      description: 'Force transaction-mode pooling for database operations.',
      context: 'Serverless functions spawning direct SQL clients were exhausting database socket limits within minutes. Transacting via PgBouncer resolves this.',
      alternatives: [
        'Direct connection mapping (exhausted sockets instantly).',
        'Vercel Postgres helper wrappers (lacked granular transaction controls).'
      ],
      tradeoffs: 'Disables prepared statement caching, adding 3-4ms overhead, but guarantees 100% database availability.',
      sourcePR: '#45: "Refactor database pool with transaction support"'
    },
    {
      id: 'cdd-pr-2',
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
  ],
  checklists: [
    {
      id: 'chk-pr-1',
      category: 'Database Connection',
      question: 'Does this PR create database connections outside the centralized pooled helper?',
      context: 'Historically, 4 separate PRs (#4, #24, #45, #51) failed in production due to db connection exhaustion. Any raw `new Client()` commands will fail review.',
      refPR: '#45'
    },
    {
      id: 'chk-pr-2',
      category: 'State Machine',
      question: 'Does the action dispatcher include a timeout parameter and rollback handler?',
      context: 'PR #89 introduced a deadlock where the orchestrator stayed stuck in "PENDING" indefinitely because the subagent failed to respond. Timeout handlers are now strict requirements.',
      refPR: '#89'
    }
  ],
  timeline: [
    {
      id: 't-pr-1',
      prNumber: '#45',
      title: 'Refactor database pool with transaction support',
      date: 'June 12, 2026',
      author: 'devcool20',
      impact: 'High',
      description: 'Migrated database adapter layer to use PgBouncer in transaction mode. Resolved pool timeouts.'
    },
    {
      id: 't-pr-2',
      prNumber: '#77',
      title: 'Integrate Eve durable agent workflows',
      date: 'June 18, 2026',
      author: 'sharm-s',
      impact: 'High',
      description: 'Ported agent execution from direct script calls to Vercel Eve workflows. Durable runs enabled.'
    }
  ],
  prRuns: [
    {
      id: 'run-pr-1',
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
    }
  ],
  conflicts: []
};
