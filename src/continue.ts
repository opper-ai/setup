import { readFileSync, mkdirSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { homedir } from "node:os";
import { fileURLToPath } from "node:url";
import { confirm } from "@inquirer/prompts";
import { parse, stringify } from "yaml";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OPPER_API_BASE = "https://api.opper.ai/v2/openai";

export async function setupContinue(location: "global" | "local") {
  console.log("\n--- Continue.dev Setup ---\n");

  // Read embedded template
  const templatePath = join(__dirname, "..", "data", "continue.yaml");
  const template = parse(readFileSync(templatePath, "utf-8")) as {
    models: Array<Record<string, unknown>>;
  };

  const configDir =
    location === "global"
      ? join(homedir(), ".continue")
      : join(process.cwd(), ".continue");
  const configPath = join(configDir, "config.yaml");

  let config: Record<string, unknown> = {};

  if (existsSync(configPath)) {
    try {
      config = parse(readFileSync(configPath, "utf-8")) || {};
    } catch {
      // If we can't parse, start fresh
    }

    // Check if any Opper entries already exist
    const models = Array.isArray(config.models) ? config.models : [];
    const hasOpper = models.some(
      (m: Record<string, unknown>) => m.apiBase === OPPER_API_BASE,
    );

    if (hasOpper) {
      const overwrite = await confirm({
        message: "Continue config already has Opper models. Overwrite them?",
        default: false,
      });
      if (!overwrite) {
        console.log("Skipping Continue.dev setup.");
        return;
      }
      // Remove existing Opper entries
      config.models = models.filter(
        (m: Record<string, unknown>) => m.apiBase !== OPPER_API_BASE,
      );
    }
  }

  // Inject actual API key into template models
  const apiKey = process.env.OPPER_API_KEY;
  if (!apiKey) {
    console.log(
      "⚠ OPPER_API_KEY is not set. Cannot write Continue config without it.\n" +
        "\n  export OPPER_API_KEY=<your-api-key>\n" +
        "\nGet your API key at https://platform.opper.ai\n" +
        "Then re-run this setup.\n",
    );
    return;
  }

  const models = template.models.map((m) => ({
    ...m,
    apiKey,
  }));

  // Add Opper models
  if (!Array.isArray(config.models)) {
    config.models = [];
  }
  (config.models as unknown[]).push(...models);

  // Write config
  mkdirSync(configDir, { recursive: true });
  writeFileSync(configPath, stringify(config), "utf-8");
  console.log(`Wrote ${template.models.length} Opper models to ${configPath}`);

  console.log("API key written to config.");
}
