import esbuild from "esbuild";
import * as path from "path";
import { fileURLToPath } from "url";

type Target = "app" | "lib";
type Mode = "dev" | "prod";

interface BuildOptions {
  mode: Mode;
  target: Target;
}

type Ctx = Awaited<ReturnType<typeof esbuild.context>>;

export function createBuild(options: BuildOptions): esbuild.BuildOptions | esbuild.BuildOptions[] | undefined {
  const { mode, target } = options;
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const isDev = mode === "dev";

  const base: esbuild.BuildOptions = {
    bundle: true,
    metafile: true,
    target: "es2020",
    platform: target === "app" ? "browser" : "neutral",
    format: "esm",
    logLevel: "info",
  };

  if (target === "app") {
    return {
      ...base,
      entryPoints: [path.resolve(__dirname, "../app/index.ts")],
      outdir: path.resolve(__dirname, "../dist/app"),
      entryNames: "app",
      chunkNames: "chunk-[hash]",
      splitting: true,
      minify: !isDev,
      sourcemap: true,
    };
  }

  if (target === "lib") {
    const libDir = path.resolve(__dirname, "../lib");
    const outDir = path.resolve(__dirname, "../dist/lib");
    const entries = {
      index: path.join(libDir, "index.ts"),
      math: path.join(libDir, "math.ts"),
      string: path.join(libDir, "string.ts"),
    };

    return [
      {
        ...base,
        entryPoints: entries,
        outdir: outDir,
        entryNames: "[dir]/[name]",
        minify: !isDev,
        sourcemap: true,
        external: ["react", "lodash"],
      },
      {
        ...base,
        entryPoints: entries,
        outdir: outDir,
        entryNames: "[dir]/[name]",
        outExtension: { ".js": ".cjs" },
        format: "cjs",
        minify: !isDev,
        sourcemap: true,
        external: ["react", "lodash"],
      },
    ];
  }

  return undefined;
}

export async function build(opts: BuildOptions): Promise<void> {
  const cfg = createBuild(opts);
  if (!cfg) throw new Error("Unknown target");
  const configs = Array.isArray(cfg) ? cfg : [cfg];

  if (configs.length === 1) {
    await esbuild.build(configs[0] as esbuild.BuildOptions);
    return;
  }

  await Promise.all(configs.map((c) => esbuild.build(c as esbuild.BuildOptions)));
}

export async function ctxFn(opts: BuildOptions): Promise<Ctx | Ctx[]> {
  const cfg = createBuild(opts);
  if (!cfg) throw new Error("Unknown target");
  const configs = Array.isArray(cfg) ? cfg : [cfg];

  if (configs.length === 1) {
    return esbuild.context(configs[0] as esbuild.BuildOptions);
  }

  return Promise.all(configs.map((c) => esbuild.context(c as esbuild.BuildOptions)));
}
