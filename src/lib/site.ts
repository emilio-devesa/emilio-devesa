// URL pública canónica del sitio. Es el respaldo de `Astro.site` (definido en
// astro.config.mjs) para los contextos donde esa API no está disponible, como
// el feed RSS.
export const SITE_FALLBACK = 'https://emiliodevesa.com';

// URL canónica de una ruta del sitio: siempre con barra final (coherente con
// `trailingSlash: 'always'`). `site` es `Astro.site`; si falta, se usa el
// respaldo.
export function canonicalUrl(pathname: string, site: URL | string | undefined) {
  const path = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return new URL(path, site ?? SITE_FALLBACK).toString();
}
