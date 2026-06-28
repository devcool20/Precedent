import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 2 subagent for finding gaps in test coverage and recommending specific test cases for code changes."
});
