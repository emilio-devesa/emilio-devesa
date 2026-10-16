// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://emiliodevesa.com',
  // Una sola forma de URL: siempre con barra final (coherente con
  // los enlaces internos y con la canónica de PrimaryLayout).
  trailingSlash: 'always',
  integrations: [
    mdx(),
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
