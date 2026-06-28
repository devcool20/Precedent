import { defineAgent } from "eve";
export default defineAgent({
    model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
    description: "Phase 1 subagent for extracting structured repository architecture, components, data flows, and design decisions."
});
