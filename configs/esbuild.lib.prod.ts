import { build } from "./esbuild.config";

const buildProdLib = async () => {
  console.log("[prod] building lib...");
  await build({ mode: "prod", target: "lib" });
  console.log("[prod] lib build complete");
};

buildProdLib();
