import { defineAgent } from "eve";
export default defineAgent({
    model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
    description: "Phase 2 subagent for simulating repository maintainer feedback on PR diffs, focusing on architectural fit, technical debt, and simplicity."
});
