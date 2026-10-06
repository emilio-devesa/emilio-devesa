// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://emiliodevesa.com',
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
