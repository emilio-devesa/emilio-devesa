import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import MarkdownIt from 'markdown-it';
import sanitizeHtml from 'sanitize-html';

const parser = new MarkdownIt({ html: false, linkify: true });

// Convierte el markdown del cuerpo a HTML saneado con URLs absolutas,
// para publicarlo como content:encoded en el feed.
function toFeedHtml(markdown, site, postDir) {
  const raw = parser.render(markdown ?? '');
  const withAbsUrls = raw.replace(
    /(src|href)="(?!https?:|mailto:|#|data:)([^"]+)"/g,
    (_m, attr, url) => {
      const abs = url.startsWith('/')
        ? `${site}${url}`
        : `${site}/blog/${postDir}/${url}`;
      return `${attr}="${abs}"`;
    },
  );
  return sanitizeHtml(withAbsUrls, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height'],
    },
  });
}

function toExcerpt(markdown, max = 280) {
  const text = (markdown ?? '').replace(/!?\[[^\]]*\]\([^)]+\)/g, ' ').replace(/[#>*_`]/g, ' ');
  const single = text.replace(/\s+/g, ' ').trim();
  return single.length > max ? `${single.slice(0, max)}…` : single;
}

export async function GET(context) {
  const site = context.site ?? 'https://emiliodevesa.com';
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: 'Emilio Devesa – Blog',
    description: 'Artículos del blog de Emilio Devesa',
    site,
    items: posts.map((post) => {
      const postDir = post.id.split('/').slice(0, -1).join('/');
      const excerpt = toExcerpt(post.body);
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description ?? excerpt,
        link: `/blog/${post.id}/`,
        categories: post.data.categories ?? [],
        content: toFeedHtml(post.body, site, postDir),
      };
    }),
  });
}
