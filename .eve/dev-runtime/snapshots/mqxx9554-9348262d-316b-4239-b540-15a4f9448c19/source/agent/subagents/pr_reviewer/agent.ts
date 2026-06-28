import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 2 subagent for auditing code changes (PR diffs) for logic, edge cases, race conditions, regressions, and security issues."
});
