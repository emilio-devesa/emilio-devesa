// Informe de enlaces internos en src/content (solo lectura, no modifica nada).
// Uso: npm run check:links
// Compara cada enlace relativo ../../../AAAA/MM/slug/ con las rutas
// normalizadas que Astro genera (minúsculas, sin puntuación, con guiones),
// más las imágenes images/* contra el sistema de ficheros. Avisa también de
// encabezados '#' de nivel 1 en el cuerpo (producirían un segundo <h1>).
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

// Imita la normalización de slugs de Astro (minúsculas, sin puntuación, con
// guiones). NFC primero: las rutas publicadas usan la forma compuesta (ver
// blogPostUrl), así que un nombre en NFD debe compararse en la misma forma.
function slugify(seg) {
  return seg
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s_-]/gu, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-');
}

// Encabezados de nivel 1 en el cuerpo (el título ya lo aporta el front-matter,
// así que un '#' produciría un segundo <h1>). Ignora cercas de código y
// bloques indentados para no marcar comentarios de shell o ejemplos.
function bodyH1Lines(raw) {
  const lines = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '').split('\n');
  const hits = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence || /^( {4,}|\t)/.test(line)) continue;
    if (/^#\s+\S/.test(line)) hits.push(i + 1);
  }
  return hits;
}

const files = walk(CONTENT);
// ruta normalizada de cada post: 2005/11/Quake 4.md -> 2005/11/quake-4
const routes = new Set(
  files.map((f) => {
    const rel = f.replace(CONTENT, '').replace(/\.mdx?$/, '');
    return rel.split(sep).filter(Boolean).map(slugify).join('/');
  }),
);

const linkRe = /(?<!!)\[([^\]]*)\]\(([^)]+)\)/g;
const imgRe = /!\[[^\]]*\]\(([^)]+)\)/g;
let checkedLinks = 0;
let checkedImgs = 0;
const brokenLinks = [];
const brokenImgs = [];
const bodyH1 = [];

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const rel = file.replace(CONTENT, '');
  const postDir = dirname(rel);

  for (const line of bodyH1Lines(raw)) bodyH1.push({ file: rel, line });

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
    const norm = route.split('/').filter(Boolean).map(slugify).join('/');
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
console.log(`Encabezados '#' de nivel 1 en el cuerpo: ${bodyH1.length}`);
for (const b of brokenLinks.slice(0, 100)) console.log(`- ENLACE ${b.file} -> ${b.target}`);
for (const b of brokenImgs.slice(0, 100)) console.log(`- IMAGEN ${b.file} -> ${b.target}`);
for (const b of bodyH1.slice(0, 100)) console.log(`- H1 ${b.file}:${b.line}`);
if (brokenLinks.length + brokenImgs.length > 100)
  console.log(`… y ${brokenLinks.length + brokenImgs.length - 100} más`);
// El CI debe fallar si hay algo roto: sin exit code el chequeo es decorativo.
if (brokenLinks.length + brokenImgs.length + bodyH1.length > 0) process.exitCode = 1;
