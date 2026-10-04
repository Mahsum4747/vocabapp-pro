import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { resolve as resolvePath } from "node:path";
import ts from "typescript";
export async function resolve(specifier, context, next) {
  const candidate = specifier.startsWith("@/")
    ? pathToFileURL(resolvePath("src", specifier.slice(2))).href
    : specifier.startsWith(".") && context.parentURL
      ? new URL(specifier, context.parentURL).href
      : null;
  if (candidate?.startsWith("file:")) {
    for (const suffix of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
      if (existsSync(fileURLToPath(candidate + suffix)))
        return { url: candidate + suffix, shortCircuit: true };
    }
  }
  return next(specifier, context);
}
export async function load(url, context, next) {
  if (/\.(ts|tsx)$/.test(url) && !url.includes("/node_modules/")) {
    const source = await readFile(new URL(url), "utf8");
    return {
      format: "module",
      shortCircuit: true,
      source: ts.transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ESNext,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText,
    };
  }
  return next(url, context);
}
