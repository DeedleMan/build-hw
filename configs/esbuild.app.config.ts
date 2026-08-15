import esbuild from "esbuild";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: esbuild.BuildOptions = {
  entryPoints: [path.resolve(__dirname, "../app/index.ts")],
  bundle: true,
  minify: true,
  sourcemap: true,
  outdir: path.resolve(__dirname, "../dist"),
  entryNames: "app",
  chunkNames: "chunk-[hash]",
  splitting: true,
  format: "esm",
  target: "chrome90",
  platform: "browser",
  metafile: true,
};

esbuild
  .build(config)
  .then((result) => {
    if (result.metafile) {
      console.log("Build completed successfully");
      console.log("Outputs:", Object.keys(result.metafile.outputs));
    }
  })
  .catch((error) => {
    console.error("Build failed:", error);
    process.exit(1);
  });
