import { ctxFn } from "./esbuild.config";

const buildDevLib = async () => {
  const result = await ctxFn({ mode: "dev", target: "lib" });
  const ctxs = Array.isArray(result) ? result : [result];

  console.log("[dev] building lib (watch mode)");
  console.log("[dev] changes will trigger rebuilds automatically");

  for (const c of ctxs) {
    c.watch();
  }

  process.on("SIGINT", async () => {
    console.log("\n[dev] stopping watch...");
    for (const c of ctxs) {
      await c.dispose();
    }
    process.exit(0);
  });
};

buildDevLib();
