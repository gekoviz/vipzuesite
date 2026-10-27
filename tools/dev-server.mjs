// Servidor estático de desenvolvimento, sem dependências.
// Uso: node tools/dev-server.mjs [porta]
// POST /__save?path=assets/... grava arquivos gerados pelas ferramentas em tools/ (somente em assets/).
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import { extname, join, normalize, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2]) || 5173;

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

function safePath(urlPath) {
  const p = normalize(join(root, decodeURIComponent(urlPath)));
  return p.startsWith(root) ? p : null;
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (req.method === "POST" && url.pathname === "/__save") {
    const target = safePath(url.searchParams.get("path") || "");
    if (!target || !target.startsWith(join(root, "assets") + sep)) {
      res.writeHead(400).end("caminho inválido");
      return;
    }
    const chunks = [];
    for await (const c of req) chunks.push(c);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, Buffer.concat(chunks));
    res.writeHead(200).end("ok");
    return;
  }

  let file = safePath(url.pathname);
  if (!file) return res.writeHead(403).end();
  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const body = await readFile(file);
    const headers = {
      "Content-Type": types[extname(file).toLowerCase()] || "application/octet-stream",
      "Cache-Control": "no-store",
      "Accept-Ranges": "bytes",
    };
    // Range: necessário para o navegador buscar (seek) em vídeos.
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range) {
      const start = range[1] ? Number(range[1]) : body.length - Number(range[2]);
      const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
      res.writeHead(206, { ...headers, "Content-Range": `bytes ${start}-${end}/${body.length}` });
      res.end(body.subarray(start, end + 1));
      return;
    }
    res.writeHead(200, headers);
    res.end(body);
  } catch {
    res.writeHead(404).end("não encontrado");
  }
}).listen(port, "127.0.0.1", () => {
  console.log(`VIPZUE dev: http://localhost:${port}`);
});
