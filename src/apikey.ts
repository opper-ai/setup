import { confirm, input } from "@inquirer/prompts";
import { exec } from "node:child_process";

function openBrowser(url: string) {
  const cmd =
    process.platform === "darwin"
      ? `open "${url}"`
      : process.platform === "win32"
        ? `start "${url}"`
        : `xdg-open "${url}"`;
  exec(cmd);
}

export async function setupApiKey() {
  if (process.env.OPPER_API_KEY) {
    console.log("OPPER_API_KEY is set.\n");
    return;
  }

  console.log("OPPER_API_KEY is not set.\n");

  const wantsKey = await confirm({
    message: "Would you like to set up your Opper API key now?",
    default: true,
  });

  if (!wantsKey) {
    console.log();
    return;
  }

  const openSite = await confirm({
    message: "Open https://platform.opper.ai to get your API key?",
    default: true,
  });

  if (openSite) {
    openBrowser("https://platform.opper.ai");
    console.log("\nOpening browser...\n");
  }

  const key = await input({
    message: "Paste your API key:",
    validate: (value) => (value.trim().length > 0 ? true : "API key cannot be empty"),
  });

  const shell = process.env.SHELL || "";
  const rcFile = shell.includes("zsh")
    ? "~/.zshrc"
    : shell.includes("bash")
      ? "~/.bashrc"
      : "your shell profile";

  console.log(`\nAdd this to ${rcFile}:\n`);
  console.log(`  export OPPER_API_KEY=${key.trim()}\n`);
  console.log(`Then run: source ${rcFile}\n`);
}
