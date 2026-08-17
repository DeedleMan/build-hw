import esbuild from "esbuild";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libDir = path.resolve(__dirname, "../lib");
const outDir = path.resolve(__dirname, "../dist/lib");

const entries = {
  index: path.join(libDir, "index.ts"),
  math: path.join(libDir, "math.ts"),
  string: path.join(libDir, "string.ts"),
};

// --- ESM ---
esbuild
  .build({
    entryPoints: entries,
    bundle: true,
    minify: true,
    sourcemap: true,
    outdir: outDir,
    entryNames: "[dir]/[name]",
    format: "esm",
    target: "es2020",
    platform: "neutral",
    external: ["react", "lodash"],
  })
  .then(() => {
    // --- CJS ---
    return esbuild.build({
      entryPoints: entries,
      bundle: true,
      minify: true,
      sourcemap: true,
      outdir: outDir,
      entryNames: "[dir]/[name]",
      outExtension: { ".js": ".cjs" },
      format: "cjs",
      target: "es2020",
      platform: "neutral",
      external: ["react", "lodash"],
    });
  })
  .then(() => {
    console.log("Library build completed: ESM + CJS");
  })
  .catch((error) => {
    console.error("Library build failed:", error);
    process.exit(1);
  });
