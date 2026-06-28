import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 1 validation subagent checking structured repository memory for logical duplicates, contradictions, and gaps."
});
