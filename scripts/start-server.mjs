import { execSync, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const serverPath = ".next/standalone/server.js";

function runBuild() {
  console.log("Standalone bundle missing — running npm run build...");
  execSync("npm run build", {
    stdio: "inherit",
    env: { ...process.env, NODE_ENV: "production" },
  });
}

if (!existsSync(serverPath)) {
  try {
    runBuild();
  } catch (error) {
    console.error("Production build failed:", error);
  }
}

if (!existsSync(serverPath)) {
  console.error("Cannot start: .next/standalone/server.js not found.");
  console.error(
    "Set Amvera build command to: npm ci --include=dev && npm run build"
  );
  console.error("Remove artifacts * -> / from the Amvera UI if present.");
  process.exit(1);
}

const result = spawnSync(process.execPath, [serverPath], { stdio: "inherit" });
process.exit(result.status ?? 1);
