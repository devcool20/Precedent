import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Analyze pull request reviews to extract metrics, identify core maintainers, and map out turnaround times.",
  inputSchema: z.object({
    prs: z.array(z.any()).describe("List of pull requests with review comments.")
  }) as any,
  async execute({ prs }: { prs: any[] }) {
    if (!prs || prs.length === 0) {
      return { metrics: null };
    }

    const maintainerReviews: Record<string, { commentsCount: number; approvedCount: number }> = {};
    let totalComments = 0;
    let totalReviews = 0;
    let fastTrackCount = 0;
    let highScrutinyCount = 0;

    for (const pr of prs) {
      totalComments += pr.comment_count || 0;
      totalReviews += pr.review_count || 0;

      // Classify review cycles
      if ((pr.comment_count || 0) <= 2) {
        fastTrackCount++;
      } else if ((pr.comment_count || 0) >= 8) {
        highScrutinyCount++;
      }

      // Track maintainer activity
      const author = pr.author || "unknown";
      if (pr.author_association === "MEMBER" || pr.author_association === "OWNER" || pr.author_association === "COLLABORATOR") {
        if (!maintainerReviews[author]) {
          maintainerReviews[author] = { commentsCount: 0, approvedCount: 0 };
        }
        maintainerReviews[author].commentsCount += pr.comment_count || 0;
        maintainerReviews[author].approvedCount++;
      }
    }

    return {
      metrics: {
        total_prs: prs.length,
        total_review_comments: totalComments,
        total_reviews: totalReviews,
        avg_comments_per_pr: Number((totalComments / prs.length).toFixed(1)),
        fast_track_percentage: Number(((fastTrackCount / prs.length) * 100).toFixed(1)),
        high_scrutiny_percentage: Number(((highScrutinyCount / prs.length) * 100).toFixed(1))
      },
      maintainers: Object.entries(maintainerReviews).map(([name, stats]) => ({
        name,
        comments_posted: stats.commentsCount,
        prs_reviewed: stats.approvedCount
      }))
    };
  }
});
