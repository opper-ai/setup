import { execSync } from "node:child_process";

export async function installPackage(
  manager: "npm" | "pip",
  pkg: string,
  label: string,
) {
  console.log(`\n--- ${label} ---\n`);

  const cmd = manager === "npm" ? `npm install ${pkg}` : `pip install ${pkg}`;

  console.log(`Running: ${cmd}\n`);
  execSync(cmd, { stdio: "inherit" });
  console.log(`\n${label} installed.`);
}

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
