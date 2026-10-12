import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

// One command starts both the private auth API and the Vite development site.
// Keep the API on 127.0.0.1; Vite forwards /api/auth requests to it.
const authScript = fileURLToPath(new URL("./authServer.mjs", import.meta.url));
const viteScript = resolve("node_modules/vite/bin/vite.js");
const children = [];
let stopping = false;

function stopAll(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) child.kill(signal);
  }
}

function start(name, script, args = []) {
  const child = spawn(process.execPath, [script, ...args], {
    stdio: "inherit",
    env: process.env,
  });
  children.push(child);
  child.on("error", (error) => {
    console.error(`[dev] Unable to start ${name}:`, error.message);
    stopAll();
    process.exitCode = 1;
  });
  child.on("exit", (code, signal) => {
    if (stopping) return;
    console.error(`[dev] ${name} stopped (${signal || `exit ${code}`}); shutting down both services.`);
    process.exitCode = code || 1;
    stopAll();
  });
  return child;
}

process.on("SIGINT", () => stopAll("SIGINT"));
process.on("SIGTERM", () => stopAll("SIGTERM"));

console.log("[dev] Starting portal authentication and website together...");
start("Authentication API", authScript);
start("Vite website", viteScript, process.argv.slice(2));
