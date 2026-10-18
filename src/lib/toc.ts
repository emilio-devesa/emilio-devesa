// Cabecera del Markdown (sin cercas de código) a slug compatible con
// los ids que genera Astro (minúsculas, sin puntuación, acentos intactos).
// Es una reimplementación del slugger de Astro (github-slugger sobre el texto
// sin formato), así que no se puede garantizar al 100 %: `npm run check:toc`
// verifica sobre el sitio construido que todos los anclajes del índice
// resuelven contra los ids reales del artículo.
export interface TocHeading {
  depth: number;
  text: string;
  slug: string;
}

function headingSlug(text: string) {
  return text
    .toLowerCase()
    .normalize('NFC')
    .replace(/[^\p{L}\p{N}\s\-_]/gu, '')
    .trim()
    .replace(/\s/g, '-');
}

// Apartados de plantilla (no secciones de contenido): ni cuentan
// para mostrar el índice ni aparecen en él.
const TEMPLATE = /^(NOTA|Ficha técnica|Lo mejor|Lo peor|Requisitos)\b/i;

export function postHeadings(markdown: string | undefined): TocHeading[] {
  const headings: TocHeading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;
  for (const line of (markdown ?? '').split('\n')) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match || TEMPLATE.test(match[2])) continue;
    const base = headingSlug(match[2]);
    const n = seen.get(base) ?? 0;
    seen.set(base, n + 1);
    headings.push({ depth: match[1].length, text: match[2], slug: n ? `${base}-${n}` : base });
  }
  return headings;
}
