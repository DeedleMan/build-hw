import { build } from "./esbuild.config";

const buildProdApp = async () => {
  console.log("[prod] building app...");
  await build({ mode: "prod", target: "app" });
  console.log("[prod] app build complete");
};

buildProdApp();
