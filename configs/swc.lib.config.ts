import { transformFile } from "@swc/core";
import * as path from "path";
import * as fs from "fs";
import { fileURLToPath } from "url";

type Mode = "dev" | "prod";

interface BuildOptions {
  mode: Mode;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libDir = path.resolve(__dirname, "../lib");
const outDir = path.resolve(__dirname, "../dist/lib");

const entries = {
  index: path.join(libDir, "index.ts"),
  math: path.join(libDir, "math.ts"),
  string: path.join(libDir, "string.ts"),
};

const isDev = (mode: Mode) => mode === "dev";

function baseOptions(mode: Mode) {
  return {
    sourceMaps: true,
    minify: !isDev(mode),
    swcrc: false,
  };
}

function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

async function compileEntry(
  entryName: string,
  entryPath: string,
  format: "es6" | "commonjs",
  outExt: string,
  mode: Mode,
  outSubdir = "esm"
): Promise<void> {
  const options = {
    ...baseOptions(mode),
    module: { type: format },
  };

  const result = await transformFile(entryPath, options);
  const outDirForFormat = path.resolve(outDir, outSubdir);
  ensureDir(outDirForFormat);

  const fileName = path.basename(entryName, path.extname(entryName)) + outExt;
  const outFile = path.join(outDirForFormat, fileName);

  fs.writeFileSync(outFile, result.code);

  if (result.map) {
    fs.writeFileSync(outFile + ".map", result.map);
  }

  console.log(`[swc] ${format} -> ${path.relative(outDir, outFile)}`);
}

export async function buildLib(options: BuildOptions): Promise<void> {
  const { mode } = options;
  const entriesArr = Object.entries(entries);

  // ESM (module.type = es6)
  await Promise.all(
    entriesArr.map(([name, file]) =>
      compileEntry(name, file, "es6", ".js", mode, "esm")
    )
  );

  // CJS (module.type = commonjs)
  await Promise.all(
    entriesArr.map(([name, file]) =>
      compileEntry(name, file, "commonjs", ".cjs", mode, "cjs")
    )
  );

  console.log(
    `[swc] lib build complete (${isDev(mode) ? "dev" : "prod"}) ESM + CJS`
  );
}