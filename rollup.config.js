/* eslint-disable import/no-anonymous-default-export */

import typescript from "rollup-plugin-typescript2";
import postcss from "rollup-plugin-postcss";
import dts from "rollup-plugin-dts";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
// import peerDepsExternal from "rollup-plugin-peer-deps-external";
import pkg from "./package.json";

function createExternal(dependencies) {
  return Object.keys(dependencies).flatMap(
    (dependency) => new RegExp(`^${dependency}(\\/.+)?`)
  );
}

function filterDependencies(dependencies, filterList) {
  return Object.keys(dependencies)
    .filter((key) => !filterList.includes(key))
    .reduce((acc, key) => ({ ...acc, [key]: dependencies[key] }), {});
}

const input = "src/index.ts";

const external = [
  ...createExternal(
    filterDependencies(pkg.dependencies, ["hot-formula-parser"])
  ),
  ...createExternal(pkg.peerDependencies),
];

export default [
  {
    input,
    output: {
      dir: "dist",
      format: "cjs",
      exports: "named",
      sourcemap: true,
    },
    plugins: [typescript(), nodeResolve(), commonjs(), postcss(), terser()],
    external,
  },
  {
    input,
    output: {
      dir: "dist/es",
      format: "es",
      exports: "named",
      sourcemap: true,
    },
    plugins: [typescript(), nodeResolve(), commonjs(), postcss(), terser()],
    external,
  },
  {
    input,
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
    external: [...external, /\.css$/],
  },
];
