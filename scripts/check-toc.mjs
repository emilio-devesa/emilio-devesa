// Comprueba que los anclajes del índice (ToC) de cada artículo resuelven
// contra los ids reales de los encabezados del HTML construido. Uso:
// npm run check:toc
// Requiere un `npm run build` previo: lee dist/. Salvaguarda la parte frágil
// de lib/toc.ts (su slugger reimplementa el de Astro, ver comentario allí).
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

if (!existsSync(DIST)) {
  console.error('No hay dist/: ejecuta `npm run build` antes de `npm run check:toc`.');
  process.exit(1);
}

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (e === 'index.html') out.push(p);
  }
  return out;
}

const TOC = /<details[^>]*class="[^"]*\btoc\b[^"]*"[\s\S]*?<\/details>/;
const ARTICLE = /<article\b[^>]*>([\s\S]*?)<\/article>/;
const HEADING_ID = /<h[1-6]\b[^>]*\sid="([^"]+)"/g;
const HREF = /href="#([^"]+)"/g;

let indexes = 0;
let anchors = 0;
const broken = [];

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  const toc = html.match(TOC)?.[0];
  if (!toc) continue;
  indexes++;
  const article = html.match(ARTICLE)?.[1] ?? '';
  const ids = new Set([...article.matchAll(HEADING_ID)].map((m) => m[1]));
  for (const m of toc.matchAll(HREF)) {
    anchors++;
    if (!ids.has(m[1])) broken.push({ file: file.replace(DIST, ''), anchor: m[1] });
  }
}

console.log(`Índices comprobados: ${indexes} (anclajes: ${anchors}, rotos: ${broken.length})`);
for (const b of broken.slice(0, 100)) console.log(`- TOC ${b.file} -> #${b.anchor}`);
if (broken.length > 0) process.exitCode = 1;
