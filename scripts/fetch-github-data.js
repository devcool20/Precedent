/**
 * repo-wiki-generator — GitHub Data Fetcher
 *
 * Fetches the most recently merged PRs from any public GitHub repository
 * and saves them as structured JSON for wiki generation.
 *
 * Usage:
 *   node fetch-github-data.js <owner/repo> [count] [--token=ghp_xxx]
 *
 * Examples:
 *   node fetch-github-data.js microsoft/vscode 100
 *   node fetch-github-data.js user/my-repo 50 --token=ghp_abc123
 *
 * Output: ./fetched-prs.json (relative to cwd, or customizable via OUTPUT_PATH env)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// --- Config ---
const args = process.argv.slice(2);
const repo = args[0];
const count = parseInt(args[1], 10) || 30;
const tokenArg = args.find((a) => a.startsWith('--token='));
const GITHUB_TOKEN = tokenArg ? tokenArg.split('=')[1] : process.env.GITHUB_TOKEN || '';
const OUTPUT_PATH = process.env.OUTPUT_PATH || path.join(process.cwd(), 'fetched-prs.json');

if (!repo) {
  console.error('Usage: node fetch-github-data.js <owner/repo> [count] [--token=ghp_xxx]');
  console.error('  GITHUB_TOKEN environment variable also works for authentication.');
  process.exit(1);
}

// --- GraphQL Query ---
// Fetches merged PRs with review comments, file changes, and author info.
// Pagination is handled automatically to reach the requested count.
const PER_PAGE = 100; // max per GraphQL node

function buildQuery(cursor) {
  const after = cursor ? `after: "${cursor}"` : '';
  return `
    query {
      repository(owner: "${repo.split('/')[0]}", name: "${repo.split('/')[1]}") {
        pullRequests(first: ${PER_PAGE}, states: MERGED, orderBy: {field: UPDATED_AT, direction: DESC}${after ? ',' + after : ''}) {
          totalCount
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            number
            title
            state
            closedAt
            createdAt
            mergedAt
            body
            url
            comments { totalCount }
            reviews { totalCount }
            author {
              login
              ... on User { name }
            }
            authorAssociation
            changedFiles
            labels(first: 10) {
              nodes { name }
            }
            additions
            deletions
            commits { totalCount }
          }
        }
      }
    }
  `.trim();
}

function graphqlRequest(query) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query });
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
        'User-Agent': 'repo-wiki-generator/1.0',
        Authorization: GITHUB_TOKEN ? `Bearer ${GITHUB_TOKEN}` : '',
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        if (res.statusCode === 403) {
          const rateLimitRemaining = res.headers['x-ratelimit-remaining'];
          const rateLimitReset = res.headers['x-ratelimit-reset'];
          const waitSeconds = rateLimitReset ? Math.max(1, Math.ceil(Number(rateLimitReset) - Date.now() / 1000)) : 'unknown';
          return reject(
            new Error(
              `Rate limited. ${rateLimitRemaining || 0} remaining. Reset in ${waitSeconds}s.\n` +
                'Tip: Use a GitHub token for 5,000 req/hr: --token=ghp_xxx'
            )
          );
        }
        try {
          const json = JSON.parse(body);
          if (json.errors) {
            return reject(new Error(json.errors.map((e) => e.message).join('\n')));
          }
          resolve(json);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${body.slice(0, 500)}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function fetchAllPRs() {
  console.log(`Fetching up to ${count} merged PRs from ${repo}...`);
  if (GITHUB_TOKEN) {
    console.log('Using GitHub token (5,000 req/hr rate limit).');
  } else {
    console.log('No token — 60 req/hr limit. Consider --token=ghp_xxx for faster fetching.');
  }

  const allPRs = [];
  let cursor = null;
  let hasNextPage = true;
  let totalAvailable = 0;

  while (hasNextPage && allPRs.length < count) {
    const result = await graphqlRequest(buildQuery(cursor));
    const prs = result.data.repository.pullRequests;
    totalAvailable = prs.totalCount;
    const pageInfo = prs.pageInfo;

    for (const pr of prs.nodes) {
      if (allPRs.length >= count) break;
      allPRs.push({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        author: pr.author ? pr.author.login : 'unknown',
        author_name: pr.author && pr.author.name ? pr.author.name : null,
        author_association: pr.authorAssociation,
        created_at: pr.createdAt,
        closed_at: pr.closedAt,
        merged_at: pr.mergedAt,
        body: pr.body,
        url: pr.url,
        comment_count: pr.comments.totalCount,
        review_count: pr.reviews.totalCount,
        changed_files: pr.changedFiles,
        labels: pr.labels ? pr.labels.nodes.map((l) => l.name) : [],
        additions: pr.additions,
        deletions: pr.deletions,
        commit_count: pr.commits.totalCount,
      });
    }

    hasNextPage = pageInfo.hasNextPage && allPRs.length < count;
    cursor = pageInfo.endCursor;

    console.log(`  Fetched ${allPRs.length}/${count} PRs...`);
  }

  return { prs: allPRs, totalAvailable };
}

// --- Entry Point ---
async function main() {
  try {
    const { prs, totalAvailable } = await fetchAllPRs();

    const output = {
      metadata: {
        repo,
        fetched_at: new Date().toISOString(),
        total_available: totalAvailable,
        fetched_count: prs.length,
        github_token_used: !!GITHUB_TOKEN,
      },
      prs,
    };

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2), 'utf-8');
    console.log(`\nSaved ${prs.length}/${totalAvailable} PRs to ${OUTPUT_PATH}`);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();
