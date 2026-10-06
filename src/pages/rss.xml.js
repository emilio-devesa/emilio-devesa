import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({ html: false, linkify: true });

// Convierte el markdown del cuerpo a HTML saneado, sin imágenes y con
// URLs absolutas y normalizadas, para publicarlo como content:encoded.
function toFeedHtml(markdown, postUrl) {
  const raw = parser.render(markdown ?? '');
  const withAbsUrls = raw.replace(
    /(src|href)="(?!https?:|mailto:|#|data:)([^"]+)"/g,
    (_m, attr, url) => `${attr}="${new URL(url, postUrl).href}"`,
  );
  return sanitizeHtml(withAbsUrls, {
    allowedTags: sanitizeHtml.defaults.allowedTags.filter((tag) => tag !== 'img'),
  });
}

function toExcerpt(markdown, max = 280) {
  const text = (markdown ?? '').replace(/!?\[[^\]]*\]\([^)]+\)/g, ' ').replace(/[#>*_`]/g, ' ');
  const single = text.replace(/\s+/g, ' ').trim();
  return single.length > max ? `${single.slice(0, max)}…` : single;
}

export async function GET(context) {
  const site = String(context.site ?? 'https://emiliodevesa.com/').replace(/\/$/, '');
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: 'Emilio Devesa – Blog',
    description: 'Artículos del blog de Emilio Devesa',
    site,
    items: posts.map((post) => {
      // post.id conserva la forma NFD del nombre del fichero (p. ej. la
      // ñ como n + tilde combinada); la ruta publicada usa NFC.
      const slug = post.id.normalize('NFC');
      const link = `/blog/${slug}/`;
      const excerpt = toExcerpt(post.body);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ?? excerpt,
        link,
        categories: post.data.categories ?? [],
        content: toFeedHtml(post.body, new URL(link, `${site}/`).href),
      };
    }),
  });
}
