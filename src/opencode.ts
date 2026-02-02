import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { confirm } from "@inquirer/prompts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function setupOpenCode() {
  console.log("\n--- OpenCode Setup ---\n");

  // Read embedded config template
  const templatePath = join(__dirname, "..", "data", "opencode.json");
  const config = readFileSync(templatePath, "utf-8");

  const configDir = join(homedir(), ".config", "opencode");
  const configPath = join(configDir, "opencode.json");

  // Check if config already exists with opper provider
  if (existsSync(configPath)) {
    try {
      const existing = JSON.parse(readFileSync(configPath, "utf-8"));
      if (existing?.provider?.opper) {
        const overwrite = await confirm({
          message: "OpenCode config already has an Opper provider. Overwrite?",
          default: false,
        });
        if (!overwrite) {
          console.log("Skipping OpenCode setup.");
          return;
        }
      }
    } catch {
      // If we can't parse the existing file, proceed with overwrite
    }
  }

  // Write config
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, config, "utf-8");
  console.log(`Wrote config to ${configPath}`);

  // Check for API key
  if (!process.env.OPPER_API_KEY) {
    console.log(
      "\n⚠ OPPER_API_KEY is not set. Add it to your shell profile:\n" +
        "\n  export OPPER_API_KEY=<your-api-key>\n" +
        "\nGet your API key at https://platform.opper.ai\n"
    );
  } else {
    console.log("OPPER_API_KEY is set.");
  }

  const parsed = JSON.parse(config);
  console.log(`Default model: ${parsed.model}`);
}
