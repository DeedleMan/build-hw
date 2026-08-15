import { buildLib } from "./swc.lib.config";

const buildProdLib = async () => {
  console.log("[swc][prod] building lib...");
  await buildLib({ mode: "prod" });
  console.log("[swc][prod] lib build complete");
};

buildProdLib();