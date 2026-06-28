import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 2 subagent for finding hidden, fragile assumptions in PR diffs (permissions, caching, async, concurrency, etc.) that could break in production."
});
