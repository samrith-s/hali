import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";

export default defineConfig({
  input: ["src/index.ts"],
  output: {
    dir: "lib",
  },
  plugins: [typescript()],
});
