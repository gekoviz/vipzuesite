// Monta a pasta publicada (site-vercel/) só com o que a página usa: index.html, as folhas e scripts locais que ele
// carrega e os arquivos que eles referenciam (assets/…, fonts/…). Documentação, ferramentas e originais não entram.
// Uso: node tools/build-site.mjs   (a Vercel roda o mesmo comando a cada envio; ver vercel.json)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site-vercel");
const html = readFileSync(join(root, "index.html"), "utf8");

// scripts e folhas locais (os de CDN ficam como estão)
const local = (url) => !/^(https?:)?\/\//.test(url) && !url.startsWith("data:") && !url.startsWith("#");
const files = new Set(["index.html"]);
for (const [, url] of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)) if (local(url)) files.add(url.split("?")[0]);

// arquivos referenciados por HTML, CSS e JS (caminhos relativos ao arquivo que os cita)
const refs = /(?:\.\.\/)?(?:assets|fonts)\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg|avif|woff2?|mp4|webm)/g;
for (const file of [...files]) {
  const text = readFileSync(join(root, file), "utf8");
  for (const [ref] of text.matchAll(refs)) files.add(posix.normalize(posix.join(posix.dirname(file), ref)));
}

const missing = [...files].filter((f) => !existsSync(join(root, f)));
if (missing.length) {
  console.error("Arquivos referenciados que não existem:\n  " + missing.join("\n  "));
  process.exit(1);
}

rmSync(out, { recursive: true, force: true });
for (const f of files) {
  mkdirSync(dirname(join(out, f)), { recursive: true });
  cpSync(join(root, f), join(out, f));
}
console.log(`site-vercel/: ${files.size} arquivos`);
