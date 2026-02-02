#!/usr/bin/env node

import { checkbox, Separator } from "@inquirer/prompts";
import { setupOpenCode } from "./opencode.js";
import { setupSkills } from "./skills.js";
import { setupApiKey } from "./apikey.js";
import { installPackage, installCli } from "./install.js";

async function main() {
  console.log();

  await setupApiKey();

  const selections = await checkbox({
    message: "What would you like to set up? (space to select/deselect, enter to confirm)",
    choices: [
      new Separator(" "),
      new Separator("── AI Code Editors ──"),
      {
        name: "Skills — Add Opper skills to your AI code editor",
        value: "skills" as const,
        checked: true,
      },
      {
        name: "OpenCode — Use Opper models in OpenCode",
        value: "opencode" as const,
      },
      new Separator(" "),
      new Separator("── SDKs ──"),
      {
        name: "Node SDK — AI functions, RAG, and tracing for TypeScript (opperai)",
        value: "node-sdk" as const,
      },
      {
        name: "Node Agent SDK — Build agents with tool use and reasoning (@opperai/agents)",
        value: "node-agents" as const,
      },
      {
        name: "Python SDK — AI functions, RAG, and tracing for Python (opperai)",
        value: "python-sdk" as const,
      },
      {
        name: "Python Agent SDK — Build agents with tool use and reasoning (opper-agents)",
        value: "python-agents" as const,
      },
      new Separator(" "),
      new Separator("── Tools ──"),
      {
        name: "Opper CLI — Call functions, manage indexes, and track usage from the terminal",
        value: "cli" as const,
      },
    ],
  });

  if (selections.length === 0) {
    console.log("Nothing selected. Exiting.");
    return;
  }

  if (selections.includes("skills")) {
    await setupSkills();
  }

  if (selections.includes("opencode")) {
    await setupOpenCode();
  }

  if (selections.includes("node-sdk")) {
    await installPackage("npm", "opperai", "Opper Node SDK");
  }

  if (selections.includes("node-agents")) {
    await installPackage("npm", "@opperai/agents", "Opper Node Agent SDK");
  }

  if (selections.includes("python-sdk")) {
    await installPackage("pip", "opperai", "Opper Python SDK");
  }

  if (selections.includes("python-agents")) {
    await installPackage("pip", "opper-agents", "Opper Python Agent SDK");
  }

  if (selections.includes("cli")) {
    await installCli();
  }

  console.log("\nDone!");
}

main().catch((error) => {
  if (error instanceof Error && error.name === "ExitPromptError") {
    console.log("\nSetup cancelled.");
    process.exit(0);
  }
  console.error("\nSetup failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
