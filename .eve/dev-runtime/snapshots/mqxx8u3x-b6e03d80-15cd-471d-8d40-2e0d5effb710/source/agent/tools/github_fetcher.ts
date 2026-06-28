import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Fetch merged pull request data from a public GitHub repository.",
  inputSchema: z.object({
    repo: z.string().describe("The owner/repository name (e.g. microsoft/vscode)."),
    count: z.number().default(30).describe("The number of pull requests to fetch."),
    token: z.string().optional().describe("An optional GitHub Personal Access Token for rate limits.")
  }) as any,
  async execute({ repo, count, token }: { repo: string; count: number; token?: string }) {
    const GITHUB_TOKEN = token || process.env.GITHUB_TOKEN || "";
    const [owner, name] = repo.split("/");
    if (!owner || !name) {
      throw new Error(`Invalid repo format: ${repo}. Expected owner/name.`);
    }

    const PER_PAGE = Math.min(count, 100);
    const prs: any[] = [];
    let cursor: string | null = null;
    let hasNextPage = true;
    let totalCount = 0;

    const buildQuery = (afterCursor: string | null) => {
      const afterParam = afterCursor ? `, after: "${afterCursor}"` : "";
      return {
        query: `
          query {
            repository(owner: "${owner}", name: "${name}") {
              pullRequests(first: ${PER_PAGE}, states: MERGED, orderBy: {field: UPDATED_AT, direction: DESC}${afterParam}) {
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
        `.trim()
      };
    };

    while (hasNextPage && prs.length < count) {
      const queryPayload = buildQuery(cursor);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "User-Agent": "precedent-vercel-eve/1.0"
      };
      if (GITHUB_TOKEN) {
        headers["Authorization"] = `Bearer ${GITHUB_TOKEN}`;
      }

      const res = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers,
        body: JSON.stringify(queryPayload)
      });

      if (res.status === 403) {
        throw new Error(
          "GitHub API rate limit exceeded or access forbidden. Please provide a valid GitHub Token."
        );
      }

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`GitHub API request failed: ${res.statusText} (${errorText})`);
      }

      const body = (await res.json()) as any;
      if (body.errors) {
        throw new Error(`GitHub GraphQL errors: ${body.errors.map((e: any) => e.message).join(", ")}`);
      }

      const pullRequests = body.data?.repository?.pullRequests;
      if (!pullRequests) {
        throw new Error("Repository not found or no pull requests retrieved.");
      }

      totalCount = pullRequests.totalCount;
      const nodes = pullRequests.nodes || [];

      for (const pr of nodes) {
        if (prs.length >= count) break;
        prs.push({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          author: pr.author?.login || "unknown",
          author_name: pr.author?.name || null,
          author_association: pr.authorAssociation,
          created_at: pr.createdAt,
          closed_at: pr.closedAt,
          merged_at: pr.mergedAt,
          body: pr.body,
          url: pr.url,
          comment_count: pr.comments?.totalCount || 0,
          review_count: pr.reviews?.totalCount || 0,
          changed_files: pr.changedFiles,
          labels: pr.labels?.nodes?.map((l: any) => l.name) || [],
          additions: pr.additions,
          deletions: pr.deletions,
          commit_count: pr.commits?.totalCount || 0
        });
      }

      hasNextPage = pullRequests.pageInfo.hasNextPage && prs.length < count;
      cursor = pullRequests.pageInfo.endCursor;
    }

    return {
      metadata: {
        repo,
        fetched_at: new Date().toISOString(),
        total_available: totalCount,
        fetched_count: prs.length
      },
      prs
    };
  }
});
