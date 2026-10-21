// Comprueba que el menú burger sin JS (Popover API) sigue cumpliendo los
// invariantes de los que depende. Uso: npm run check:menu
// Requiere un `npm run build` previo: lee dist/.
//
// Es frágil por diseño, así que conviene blindarlo:
//   · el panel <div popover data-menu-state class="menu-panel"> contiene
//     .nav-links (los enlaces) y va DESPUÉS del botón en el DOM (el glifo
//     ☰/✕ se actualiza con :has);
//   · el botón tiene que apuntar con popovertarget al id del panel, y
//     .nav-links ser el de aria-controls;
//   · el panel no puede ser `inert`: contiene los enlaces focusables;
//   · nada de JavaScript: sin <script> en el header, sin .menu-open y sin
//     aria-expanded en el botón (lo aporta popovertarget de forma nativa);
//   · la hoja construida tiene que traer el panel bajo la cabecera, el
//     objetivo táctil de 44 px, el glifo :popover-open y el respaldo
//     @supports not selector(:popover-open).
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = fileURLToPath(new URL('../dist/', import.meta.url));

if (!existsSync(DIST)) {
  console.error('No hay dist/: ejecuta `npm run build` antes de `npm run check:menu`.');
  process.exit(1);
}

// Los duplicados de iCloud («nombre 2.html») no son código: se ignoran.
function walk(dir, re, out = []) {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, re, out);
    else if (re.test(e) && !/ \d+\.[^./]+$/.test(e)) out.push(p);
  }
  return out;
}

const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1] ?? null;

const HEADER = /<header\b[\s\S]*?<\/header>/i;
const PILL = /<div\b[^>]*\bdata-menu-state\b[^>]*>/i;
const PANEL_BODY = /<div\b[^>]*\bdata-menu-state\b[^>]*>([\s\S]*?)<\/div>/i;
const TOGGLE = /<button\b[^>]*\bclass="[^"]*\bmenu-toggle\b[^"]*"[^>]*>/i;
const NAVLINKS = /<div\b[^>]*\bclass="[^"]*\bnav-links\b[^"]*"[^>]*>/gi;

const failures = [];
let pages = 0;
let menus = 0;

for (const file of walk(DIST, /^(index|404)\.html$/)) {
  pages++;
  const html = readFileSync(file, 'utf8');
  const page = file.replace(DIST, '');
  const fail = (msg) => failures.push(`${page}: ${msg}`);

  const header = html.match(HEADER)?.[0] ?? '';
  const pill = header.match(PILL)?.[0];
  const panelBody = header.match(PANEL_BODY)?.[1] ?? '';
  const toggle = header.match(TOGGLE)?.[0];
  const navlinks =
    [...header.matchAll(NAVLINKS)].map((match) => match[0]).find((tag) => attr(tag, 'id')) ?? null;

  if (!pill || !toggle || !navlinks) {
    fail('falta el panel, el botón o .nav-links en el <header>');
    continue;
  }
  menus++;

  const pillId = attr(pill, 'id');
  const navId = attr(navlinks, 'id');

  if (!/\bpopover\b/.test(pill)) fail('el panel no lleva el atributo popover');
  if (/\binert\b/.test(pill)) fail('el panel no debe ser inert: contiene los enlaces');
  if (!pillId) fail('el panel no tiene id');
  if (attr(toggle, 'popovertarget') !== pillId)
    fail(`el botón no apunta con popovertarget al id del panel (${pillId})`);
  if (!navId) fail('.nav-links no tiene id');
  if (attr(toggle, 'aria-controls') !== navId)
    fail(`el botón no apunta con aria-controls al id de .nav-links (${navId})`);

  if (!(header.indexOf(toggle) < header.indexOf(pill))) fail('el panel no va después del botón');
  if (!(header.indexOf(pill) < header.indexOf(navlinks)))
    fail('el panel no va antes de .nav-links');
  if (!panelBody.includes(navlinks)) fail('.nav-links debe estar dentro del panel popover');

  if (/<script\b/i.test(header)) fail('el header sigue teniendo <script>');
  if (/menu-open/.test(html)) fail('queda una clase .menu-open');
  if (/\baria-expanded=/.test(toggle))
    fail('el botón lleva aria-expanded (lo aporta popovertarget; sobra)');
}

// Reglas de las que depende el mecanismo, en la hoja construida.
const css = walk(DIST, /\.css$/)
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n');
const cssChecks = [
  [/\.menu-panel\s*\{[^}]*top:\s*var\(--header-height\)/, 'panel colocado bajo la cabecera'],
  [
    /\.menu-panel\s+\.nav-links\s+a\s*\{[^}]*min-height:\s*44px/,
    'objetivo táctil de 44 px en el panel',
  ],
  [
    /header:has\(\.menu-panel:popover-open\)\s+\.menu-toggle:{1,2}before\s*\{\s*content:\s*["']?✕/,
    'glifo ✕ al abrir',
  ],
  [/\.menu-toggle:{1,2}before\s*\{\s*content:\s*["']?☰/, 'glifo ☰ al cerrar'],
  [/@supports\s+not\s+selector\(:popover-open\)/, 'respaldo @supports not selector(:popover-open)'],
];
for (const [re, label] of cssChecks) {
  if (!re.test(css)) failures.push(`CSS: falta ${label}`);
}
if (/menu-open/.test(css)) failures.push('CSS: queda una regla .menu-open');

console.log(`Páginas comprobadas: ${pages} (menús válidos: ${menus}, fallos: ${failures.length})`);
for (const f of failures.slice(0, 100)) console.log(`- ${f}`);
if (failures.length > 0) process.exitCode = 1;
