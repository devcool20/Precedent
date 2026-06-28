import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 1 subagent for profiling maintainer philosophies, review styles, rejection patterns, and communication preferences."
});
