import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export const BLOG_PAGE_SIZE = 20;

// Todos los posts, de más reciente a más antiguo
export async function getAllPosts() {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

// Navegación compartida de las páginas del blog
export const BLOG_NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: 'https://github.com/emilio-devesa', label: 'GitHub' },
];

// Navegación de la home (anclas); la 404 la reutiliza con prefijo '/'
export const HOME_NAV_LINKS = [
  { href: '#sobre-mi', label: 'Quién soy' },
  { href: '#clases', label: 'Clases de Batería' },
  { href: '#opiniones', label: 'Opiniones' },
  { href: '#compromiso', label: 'Mi compromiso' },
  { href: '#music', label: 'Discografía' },
  { href: '#contact', label: 'Contacto' },
];

export const NOT_FOUND_NAV_LINKS = HOME_NAV_LINKS.map((link) => ({
  ...link,
  href: `/${link.href}`,
}));

// Posts pertenecientes a una categoría del filtro
export function postsInCategory(posts: CollectionEntry<'blog'>[], cat: BlogCategory) {
  return posts.filter((post) => (post.data.categories ?? []).some((c) => cat.match.includes(c)));
}

export interface BlogCategory {
  slug: string;
  label: string;
  // categorías del front-matter incluidas en el filtro
  match: string[];
}

// 'mas' agrupa sin-categoria y cualquier otra futura categoría menor
export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: 'hardware', label: 'Hardware', match: ['hardware'] },
  { slug: 'software', label: 'Software', match: ['software'] },
  { slug: 'videojuegos', label: 'Videojuegos', match: ['videojuegos'] },
  { slug: 'mas', label: 'Más', match: ['sin-categoria'] },
];

// Primera imagen del cuerpo optimizada en build. Sin imagen o con
// error devuelve undefined para que la llamada pinte sin miniatura.
const postImages = import.meta.glob<{ default: ImageMetadata }>(
  '../content/**/*.{jpg,jpeg,png,gif,webp}',
);

export function postFirstImageRel(body: string | undefined): string | undefined {
  const match = /!\[[^\]]*\]\(([^)]+)\)/.exec(body ?? '');
  const rel = match?.[1].split('#')[0].trim();
  return rel && !/^(https?:|data:)/i.test(rel) ? rel : undefined;
}

export interface OptimizedImage {
  src: string;
  width: number;
  height: number;
}

export async function postFirstImage(
  post: CollectionEntry<'blog'>,
  width: number,
  height: number,
): Promise<OptimizedImage | undefined> {
  const rel = postFirstImageRel(post.body);
  if (!rel) return undefined;
  const dir = (post.filePath ?? '')
    .replace(/^src\//, '')
    .split('/')
    .slice(0, -1)
    .join('/');
  const load = postImages[`../${dir}/${rel}`];
  if (!load) return undefined;
  try {
    const mod = await load();
    const img = await getImage({ src: mod.default, width, height, fit: 'cover', format: 'webp' });
    return { src: img.src, width: img.attributes.width, height: img.attributes.height };
  } catch {
    return undefined;
  }
}

export function blogPageUrl(page: number) {
  return page === 1 ? '/blog/' : `/blog/pagina/${page}/`;
}

export function blogCategoryUrl(slug: string, page = 1) {
  return page === 1 ? `/blog/categoria/${slug}/` : `/blog/categoria/${slug}/${page}/`;
}

// post.id conserva la forma NFD del nombre del fichero (p. ej. la ñ como
// n + tilde combinada); la ruta publicada usa NFC.
export function blogPostUrl(id: string) {
  return `/blog/${id.normalize('NFC')}/`;
}

// Minutos de lectura estimados (200 palabras/min, mínimo 1)
export function readingMinutes(body: string | undefined) {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

// Etiqueta de categoría para mostrar (primera coincidencia con el filtro;
// 'Más' si no hay ninguna conocida)
export function postCategoryLabel(categories: string[] | undefined) {
  const cats = categories ?? [];
  for (const cat of BLOG_CATEGORIES) {
    if (cats.some((c) => cat.match.includes(c))) return cat.label;
  }
  return 'Más';
}

// Slug del filtro al que pertenece el post (para enlazar la categoría)
export function postCategorySlug(categories: string[] | undefined) {
  const cats = categories ?? [];
  for (const cat of BLOG_CATEGORIES) {
    if (cats.some((c) => cat.match.includes(c))) return cat.slug;
  }
  return 'mas';
}
