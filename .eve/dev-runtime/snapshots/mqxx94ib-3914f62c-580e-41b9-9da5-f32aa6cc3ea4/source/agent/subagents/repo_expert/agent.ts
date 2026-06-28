import { defineAgent } from "eve";

export default defineAgent({
  model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
  description: "Phase 2 subagent for answering architecture, history, and CDD questions using structured repository memory."
});
