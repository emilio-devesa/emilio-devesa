import rss from '@astrojs/rss';
import { getAllPosts, blogPostUrl } from '../lib/blog.js';
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
  const posts = await getAllPosts();
  return rss({
    title: 'Emilio Devesa – Blog',
    description: 'Artículos del blog de Emilio Devesa',
    site,
    items: posts.map((post) => {
      const link = blogPostUrl(post.id);
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
