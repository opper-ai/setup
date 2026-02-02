import { execSync } from "node:child_process";

export async function setupSkills() {
  console.log("\n--- Skills Setup ---\n");
  console.log("Installing Opper skills for Claude Code...\n");

  execSync("npx skills add opper-ai/opper-skills", {
    stdio: "inherit",
  });

  console.log("\nSkills installed successfully.");
}
