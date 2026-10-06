// Informe de enlaces internos en src/content (solo lectura, no modifica nada).
// Uso: npm run check:links
// Compara cada enlace relativo ../../../AAAA/MM/slug/ con las rutas
// normalizadas que Astro genera (minúsculas, sin puntuación, con guiones),
// más las imágenes images/* contra el sistema de ficheros.
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, resolve, sep, posix } from 'node:path';
import { fileURLToPath } from 'node:url';

const CONTENT = fileURLToPath(new URL('../src/content/', import.meta.url));

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.mdx?$/.test(e)) out.push(p);
  }
  return out;
}

// Imita la normalización de slugs de Astro (minúsculas, sin puntuación, con guiones)
function slugify(seg) {
  return seg
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

const files = walk(CONTENT);
// ruta normalizada de cada post: 2005/11/Quake 4.md -> 2005/11/quake-4
const routes = new Set(
  files.map((f) => {
    const rel = f.replace(CONTENT, '').replace(/\.mdx?$/, '');
    return rel
      .split(sep)
      .filter(Boolean)
      .map(slugify)
      .join('/');
  }),
);

const linkRe = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
const imgRe = /!\[[^\]]*\]\(([^)]+)\)/g;
let checkedLinks = 0;
let checkedImgs = 0;
const brokenLinks = [];
const brokenImgs = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const rel = file.replace(CONTENT, '');
  const postDir = dirname(rel);

  for (const m of raw.matchAll(linkRe)) {
    const target = m[2].trim();
    if (/^(https?:|mailto:|#|data:)/i.test(target)) continue;
    checkedLinks++;
    const clean = target.split('#')[0].split('?')[0].replace(/\/$/, '');
    // resuelve ../../../AAAA/MM/slug respecto a la URL del post (/blog/AAAA/MM/slug/),
    // no respecto al fichero (que está un nivel menos profundo)
    const base = posix.join('/blog', postDir.split(sep).join('/'), 'x/');
    const absUrl = clean.startsWith('/')
      ? posix.normalize(clean)
      : posix.normalize(posix.join(base, clean));
    if (!absUrl.startsWith('/blog/')) {
      // enlaces absolutos fuera del blog (/files/…): se verifican en public/
      const pub = join(
        fileURLToPath(new URL('../public/', import.meta.url)),
        absUrl.replace(/^\//, ''),
      );
      if (!existsSync(pub)) brokenLinks.push({ file: rel, target });
      continue;
    }
    const route = absUrl.replace(/^\/blog\//, '');
    const norm = route
      .split('/')
      .filter(Boolean)
      .map(slugify)
      .join('/');
    if (!routes.has(norm)) brokenLinks.push({ file: rel, target });
  }

  for (const m of raw.matchAll(imgRe)) {
    const target = m[1].trim();
    if (/^(https?:|data:)/i.test(target)) continue;
    checkedImgs++;
    const abs = resolve(dirname(file), target.split('#')[0]);
    if (!existsSync(abs)) brokenImgs.push({ file: rel, target });
  }
}

console.log(`Archivos revisados: ${files.length}`);
console.log(`Enlaces internos comprobados: ${checkedLinks} (rotos: ${brokenLinks.length})`);
console.log(`Imágenes comprobadas: ${checkedImgs} (rotas: ${brokenImgs.length})`);
for (const b of brokenLinks.slice(0, 100)) console.log(`- ENLACE ${b.file} -> ${b.target}`);
for (const b of brokenImgs.slice(0, 100)) console.log(`- IMAGEN ${b.file} -> ${b.target}`);
if (brokenLinks.length + brokenImgs.length > 100)
  console.log(`… y ${brokenLinks.length + brokenImgs.length - 100} más`);
