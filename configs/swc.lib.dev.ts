import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { buildLib } from "./swc.lib.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const libDir = path.resolve(__dirname, "../lib");

const DEBOUNCE_MS = 150;
let timer: NodeJS.Timeout | null = null;
let building = false;
let rebuildQueued = false;

const doBuild = async () => {
  if (building) {
    rebuildQueued = true;
    return;
  }
  building = true;
  try {
    await buildLib({ mode: "dev" });
  } catch (err) {
    console.error("[swc][dev] build failed:", err);
  } finally {
    building = false;
    if (rebuildQueued) {
      rebuildQueued = false;
      doBuild();
    }
  }
};

const scheduleBuild = () => {
  if (timer) clearTimeout(timer);
  timer = setTimeout(doBuild, DEBOUNCE_MS);
};

const startWatch = async () => {
  console.log("[swc][dev] building lib (watch mode)");
  console.log("[swc][dev] changes will trigger rebuilds automatically");
  await doBuild();

  const watcher = fs.watch(libDir, { recursive: true }, (_event, filename) => {
    if (!filename) return;
    scheduleBuild();
  });

  process.on("SIGINT", () => {
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    process.exit(0);
  });

  watcher.on("error", (err) => {
    console.error("[swc][dev] watcher error:", err);
  });
};

startWatch();