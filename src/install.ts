import { execSync } from "node:child_process";

export async function installCli() {
  console.log("\n--- Opper CLI ---\n");

  if (process.platform !== "darwin") {
    console.log("The Opper CLI is currently available via Homebrew on macOS.");
    console.log("For other platforms, download from:");
    console.log("  https://github.com/opper-ai/oppercli/releases/latest\n");
    return;
  }

  console.log("Installing via Homebrew...\n");
  execSync("brew tap opper-ai/oppercli git@github.com:opper-ai/oppercli && brew install opper", {
    stdio: "inherit",
  });
  console.log("\nOpper CLI installed. Run `opper config add default <your-api-key>` to configure.");
}
