// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://emiliodevesa.com',
  // Una sola forma de URL: siempre con barra final (coherente con
  // los enlaces internos y con la canónica de PrimaryLayout).
  trailingSlash: 'always',
  // Fase 5 (Astro 5 → 7): v7 estrena `compressHTML: 'jsx'` por defecto y elimina
  // los espacios en los bordes de los nodos de texto (reglas JSX de React).
  // Con `true` se mantiene la compresión HTML de v5/v6 (un único espacio entre
  // elementos inline), que es lo que había antes del upgrade: cero cambios de
  // aspecto. La guía oficial de v7 documenta esta válvula de escape.
  compressHTML: true,
  integrations: [
    sitemap({
      // Solo la home debe indexarse (robots.txt + noindex en el resto).
      // Se excluye blog, clases, 404 y rss del sitemap.
      filter: (page) =>
        !page.includes('/blog') &&
        !page.includes('/clases') &&
        !page.includes('/404') &&
        !page.includes('/rss'),
    }),
  ],
});
