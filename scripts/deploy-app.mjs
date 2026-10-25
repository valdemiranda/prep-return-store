import { spawn } from "node:child_process";
import { constants } from "node:os";

// Buildpack deploys (Heroku CNB on Easypanel) always run the root package.json
// scripts and the root Procfile, so each service picks its workspace through
// DEPLOY_APP instead of building/starting the whole monorepo.
const apps = ["backend", "storefront"];
const commands = {
  build: (app) => ["turbo", "run", "build", `--filter=@dtc/${app}`],
  start: (app) => ["workspace", `@dtc/${app}`, "run", "start"],
};

const action = process.argv[2];
const app = process.env.DEPLOY_APP;

if (!Object.hasOwn(commands, action)) {
  console.error(`Usage: node scripts/deploy-app.mjs <${Object.keys(commands).join("|")}>`);
  process.exit(1);
}

if (!apps.includes(app)) {
  console.error(`DEPLOY_APP must be one of: ${apps.join(", ")} (got "${app ?? ""}").`);
  process.exit(1);
}

const child = spawn("yarn", commands[action](app), {
  stdio: "inherit",
  shell: process.platform === "win32",
});

// The container stops this process, not yarn, so forward the signal to let
// Medusa/Next shut down gracefully.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => child.kill(signal));
}

child.on("error", (error) => {
  console.error(`[deploy-app] failed to run ${action}:`, error);
  process.exit(1);
});

// 128 + signal number is the shell convention, so a forwarded SIGTERM reads as
// a normal stop (143) rather than a generic failure.
child.on("exit", (code, signal) =>
  process.exit(signal ? 128 + constants.signals[signal] : code ?? 1),
);
