import { defineAgent } from "eve";
export default defineAgent({
    model: process.env.EVE_MODEL || "google/gemini-2.5-flash",
    description: "Precedent root orchestrator agent responsible for knowledge generation, validation, and PR reviews."
});
