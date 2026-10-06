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
      // El blog no debe indexarse (robots.txt + noindex).
      // Lo excluimos también del sitemap.
      filter: (page) => !page.includes('/blog'),
    }),
  ],
});
