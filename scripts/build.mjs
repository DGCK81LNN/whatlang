import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { build } from "esbuild"

const require = createRequire(import.meta.url)
const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const es5Dir = resolve(rootDir, "es5")
const esmOut = resolve(rootDir, "whatlang_interpreter.js")
mkdirSync(es5Dir, { recursive: true })

const argv = new Set(process.argv.slice(2))
const onlyEsm = argv.has("--esm")
const onlyEs5 = argv.has("--es5")
const buildEsm = !onlyEs5
const buildEs5 = !onlyEsm

if (buildEsm || !existsSync(esmOut)) {
  await build({
    entryPoints: [resolve(rootDir, "node_modules/whatlang-interpreter/src/whatlang_interpreter.ts")],
    bundle: true,
    platform: "browser",
    format: "esm",
    target: ["es2020"],
    minify: true,
    sourcemap: true,
    outfile: esmOut,
  })
}

if (buildEs5) {
  const webpack = require("webpack")
  const config = require(resolve(rootDir, "webpack.es5.config.js"))
  const compiler = webpack(config)
  await new Promise((resolve, reject) => {
    compiler.run((error, stats) => {
      if (error) return reject(error)
      const info = stats?.toJson({ all: false, warnings: true, errors: true })
      if (stats?.hasErrors()) {
        return reject(new Error(info?.errors?.map((entry) => entry.message).join("\n") || "Webpack build failed"))
      }
      resolve()
    })
  })
  //writeFileSync(resolve(es5Dir, "index.html"), html.replace("./style.css", "../style.css"))
}
