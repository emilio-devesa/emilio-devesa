import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
  return rss({
    title: 'Emilio Devesa – Blog',
    description: 'Artículos del blog de Emilio Devesa',
    site: context.site ?? 'https://emiliodevesa.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description ?? post.data.title,
      link: `/blog/${post.id}/`,
      categories: post.data.categories ?? [],
    })),
  });
}
