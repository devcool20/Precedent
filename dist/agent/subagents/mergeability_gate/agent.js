import { defineAgent } from "eve";
export default defineAgent({
    model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
    description: "Phase 2 lead maintainer subagent responsible for consolidating all PR review findings and producing a final mergeability score."
});
