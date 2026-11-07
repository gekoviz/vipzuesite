// Monta a pasta publicada (site-vercel/) só com o que a página usa: index.html, as folhas e scripts locais que ele
// carrega e os arquivos que eles referenciam (assets/…, fonts/…). Documentação, ferramentas e originais não entram.
// Uso: node tools/build-site.mjs   (a Vercel roda o mesmo comando a cada envio; ver vercel.json)
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import { dirname, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "site-vercel");
// Páginas publicadas: a principal e as páginas próprias (ex.: /privacidade → privacidade/index.html, servida pela
// Vercel como índice da pasta).
const PAGES = ["index.html", "privacidade/index.html"];

// scripts e folhas locais de cada página (os de CDN ficam como estão), resolvidos a partir da pasta da página
const local = (url) => !/^(https?:)?\/\//.test(url) && !url.startsWith("data:") && !url.startsWith("#");
const files = new Set(PAGES);
for (const page of PAGES) {
  const html = readFileSync(join(root, page), "utf8");
  for (const [, url] of html.matchAll(/<(?:script|link)[^>]+(?:src|href)="([^"]+)"/g)) {
    if (local(url)) files.add(posix.normalize(posix.join(posix.dirname(page), url.split("?")[0])).replace(/^\/+/, ""));
  }
}

// arquivos referenciados por HTML, CSS e JS (no CSS e nas páginas, relativos ao próprio arquivo; no JS, relativos à
// página principal). Um .json referenciado (ex.: assets/hero/voo/manifest.json, a lista de quadros do prólogo da Hero)
// também é lido, e os caminhos dentro dele entram — o Set é percorrido enquanto cresce.
const refs = /(?:\.\.\/)?(?:assets|fonts)\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|svg|avif|woff2?|mp4|webm|glb|json)/g;
for (const file of files) {
  if (!/\.(?:html|css|js|json)$/.test(file) || !existsSync(join(root, file))) continue;
  const text = readFileSync(join(root, file), "utf8");
  const base = file.endsWith(".css") || file.endsWith(".html") ? posix.dirname(file) : ".";
  for (const [ref] of text.matchAll(refs)) files.add(posix.normalize(posix.join(base, ref)));
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
