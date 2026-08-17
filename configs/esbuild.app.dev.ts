import { ctxFn } from "./esbuild.config";

const buildDevApp = async () => {
  const result = await ctxFn({ mode: "dev", target: "app" });
  const context = Array.isArray(result) ? result[0]! : result!;

  console.log("[dev] building app (watch mode)");
  console.log("[dev] changes will trigger rebuilds automatically");

  context.watch();

  process.on("SIGINT", async () => {
    console.log("\n[dev] stopping watch...");
    await context.dispose();
    process.exit(0);
  });
};

buildDevApp();
