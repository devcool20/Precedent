import { defineTool } from "eve/tools";
import { z } from "zod";
export default defineTool({
    description: "Parse PR data and generate a sorted chronological timeline.",
    inputSchema: z.object({
        prs: z.array(z.any()).describe("List of pull requests to sort and format.")
    }),
    async execute({ prs }) {
        if (!prs || prs.length === 0) {
            return { timeline: [] };
        }
        const timeline = prs
            .filter((pr) => pr.merged_at || pr.closed_at)
            .map((pr) => {
            const dateStr = pr.merged_at || pr.closed_at;
            return {
                date: dateStr ? new Date(dateStr).toISOString().split("T")[0] : "unknown",
                number: pr.number,
                title: pr.title,
                author: pr.author
            };
        })
            .sort((a, b) => a.date.localeCompare(b.date));
        return { timeline };
    }
});
