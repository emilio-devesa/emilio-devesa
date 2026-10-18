import rss from '@astrojs/rss';
import {
  BLOG_CATEGORIES,
  blogPostUrl,
  getAllPosts,
  postBodyImage,
  postFirstImage,
} from '../lib/blog.js';
import { SITE_FALLBACK } from '../lib/site.js';
import { OG_WIDTH, OG_HEIGHT } from '../lib/constants.js';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({ html: false, linkify: true });

// El feed publica el artículo completo (content:encoded) para leerlo sin salir
// del lector. Las imágenes del cuerpo del markdown apuntan a rutas relativas
// que en el sitio construido no existen (viven en /_astro/ con nombre
// hasheado), así que se resuelven por el pipeline de imágenes de Astro; sin
// eso darían un 404 en el lector.
async function resolveBodyImages(html, post, site) {
  const rels = [...new Set([...html.matchAll(/<img[^>]*src="([^"]+)"/g)].map((m) => m[1]))].filter(
    (src) => !/^(https?:|data:)/i.test(src),
  );
  const resolved = new Map();
  for (const rel of rels) {
    const img = await postBodyImage(post, rel.split('#')[0].trim());
    if (img) resolved.set(rel, { ...img, src: new URL(img.src, `${site}/`).href });
  }
  return html.replace(/<img([^>]*?)src="([^"]+)"([^>]*)>/g, (match, before, src, after) => {
    const img = resolved.get(src);
    if (!img) return match;
    return `<img${before}src="${img.src}" width="${img.width}" height="${img.height}"${after}>`;
  });
}

async function toFeedHtml(markdown, post, postUrl, site) {
  const raw = parser.render(markdown ?? '');
  // Las imágenes se resuelven ANTES de absolutizar las URLs: si no, su src ya
  // sería absoluto y no se reconocería como ruta del post.
  const withImages = await resolveBodyImages(raw, post, site);
  const withAbsUrls = withImages.replace(
    /(src|href)="(?!https?:|mailto:|#|data:)([^"]+)"/g,
    (_m, attr, url) => `${attr}="${new URL(url, postUrl).href}"`,
  );
  // sanitize-html no incluye 'img' en sus etiquetas por defecto.
  return sanitizeHtml(withAbsUrls, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
  });
}

// Portada del post al principio del contenido. Es la misma imagen 1200×630 que
// ya genera la OG de cada artículo, así que reutilizarla no añade trabajo al
// build.
function coverHtml(cover, title, site) {
  if (!cover) return '';
  const src = new URL(cover.src, `${site}/`).href;
  const alt = String(title).replace(/"/g, '&quot;');
  return `<p><img src="${src}" alt="${alt}" width="${cover.width}" height="${cover.height}"></p>`;
}

// Etiquetas legibles de las categorías del front-matter (misma agrupación que
// el filtro del blog, donde 'sin-categoria' es 'Más'). Sin coincidencias, el
// ítem se queda con la categoría de reserva en vez de salir sin ninguna.
function toCategoryLabels(categories) {
  const cats = categories ?? [];
  const labels = BLOG_CATEGORIES.filter((cat) => cats.some((c) => cat.match.includes(c))).map(
    (cat) => cat.label,
  );
  return labels.length > 0 ? labels : [BLOG_CATEGORIES[BLOG_CATEGORIES.length - 1].label];
}

// Texto plano del cuerpo como excerpt de reserva, cortado por palabra.
function toExcerpt(markdown, max = 280) {
  const text = (markdown ?? '').replace(/!?\[[^\]]*\]\([^)]+\)/g, ' ').replace(/[#>*_`]/g, ' ');
  const single = text.replace(/\s+/g, ' ').trim();
  if (single.length <= max) return single;
  const cut = single.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(' ')) || cut}…`;
}

export async function GET(context) {
  const site = String(context.site ?? SITE_FALLBACK).replace(/\/$/, '');
  const posts = await getAllPosts();
  const items = await Promise.all(
    posts.map(async (post) => {
      const link = blogPostUrl(post.id);
      const cover = await postFirstImage(post, OG_WIDTH, OG_HEIGHT);
      const body = await toFeedHtml(post.body, post, new URL(link, `${site}/`).href, site);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ?? toExcerpt(post.body),
        link,
        categories: toCategoryLabels(post.data.categories),
        content: `${coverHtml(cover, post.data.title, site)}${body}`,
      };
    }),
  );
  return rss({
    title: 'Emilio Devesa – Blog',
    description: 'Artículos del blog de Emilio Devesa',
    site,
    items,
  });
}
