import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src", "!src/examples"],
  splitting: false,
  sourcemap: true,
  clean: true,
  skipNodeModulesBundle: true,
  format: "esm",
  dts: true,
  platform: "node",
  keepNames: true,
})
