import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const backendDir = resolve(rootDir, "apps/backend/.medusa/server");
const storefrontDir = rootDir;

function startProcess(name, command, args, options) {
  const child = spawn(command, args, {
    ...options,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  child.on("error", (error) => {
    console.error(`[${name}] failed to start:`, error);
    shutdown(1);
  });

  child.on("exit", (code, signal) => {
    if (shuttingDown) {
      return;
    }

    console.error(`[${name}] exited with ${signal || code}`);
    shutdown(code || 1);
  });

  return child;
}

function shutdown(code = 0) {
  shuttingDown = true;

  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(code), 250);
}

if (!existsSync(resolve(backendDir, "package.json"))) {
  console.error("Backend production build not found. Run `yarn build` first.");
  process.exit(1);
}

if (!existsSync(resolve(backendDir, "node_modules"))) {
  console.error("Backend production dependencies not found. Run `yarn build` first.");
  process.exit(1);
}

let shuttingDown = false;
const children = [
  startProcess("backend", "yarn", ["run", "start"], {
    cwd: backendDir,
    env: process.env,
  }),
  startProcess("storefront", "yarn", ["workspace", "@dtc/storefront", "run", "start"], {
    cwd: storefrontDir,
    env: process.env,
  }),
];

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
