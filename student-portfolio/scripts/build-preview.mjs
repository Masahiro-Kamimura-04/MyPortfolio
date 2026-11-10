import { build } from "vite";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const pagesBuild = process.argv.includes("--pages");
const target = resolve(projectRoot, pagesBuild ? "dist/pages/index.html" : "../previews/index.html");
// A classic IIFE script and inline CSS also work when index.html is opened via file://.
// No dev server, Cloudflare runtime, module requests, or network fonts are required.
const result = await build({
  root: projectRoot,
  configFile: false,
  publicDir: false,
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    write: false,
    emptyOutDir: false,
    cssCodeSplit: false,
    sourcemap: false,
    lib: {
      entry: resolve(projectRoot, "preview/main.tsx"),
      name: "PortfolioPreview",
      formats: ["iife"],
      fileName: "portfolio-preview",
    },
  },
});
const outputs = (Array.isArray(result) ? result : [result]).flatMap(bundle => {
  if (!("output" in bundle)) throw new Error("Unexpected preview build result.");
  return bundle.output;
});
const scripts = outputs.filter(item => item.type === "chunk");
const styles = outputs.filter(item => item.type === "asset" && item.fileName.endsWith(".css"));
const unexpected = outputs.filter(item => item.type === "asset" && !item.fileName.endsWith(".css"));
if (scripts.length !== 1 || !styles.length || unexpected.length) {
  throw new Error("Preview must contain exactly one script, CSS, and no external assets.");
}
const css = styles.map(item => typeof item.source === "string" ? item.source : Buffer.from(item.source).toString("utf8")).join("\n");
const icon = await readFile(resolve(projectRoot, "public/favicon.svg"));
const template = await readFile(resolve(projectRoot, "preview/index.html"), "utf8");
const html = template
  .replace("__PORTFOLIO_ICON__", () => `data:image/svg+xml;base64,${icon.toString("base64")}`)
  .replace("/* __PORTFOLIO_CSS__ */", () => css.replace(/<\/style/gi, "<\\/style"))
  .replace("/* __PORTFOLIO_JS__ */", () => scripts[0].code.replace(/<\/script/gi, "<\\/script"));
if (/__PORTFOLIO_(ICON|CSS|JS)__/.test(html)) throw new Error("Unfilled preview template.");
await mkdir(dirname(target), { recursive: true });
await writeFile(target, html, "utf8");
if (pagesBuild) {
  await writeFile(resolve(dirname(target), ".nojekyll"), "", "utf8");
}
console.log(`\n${pagesBuild ? "GitHub Pages build" : "Standalone HTML preview"}: ${target}\nOpen this file directly in your browser.\n`);
