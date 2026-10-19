import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { WORDS_PER_MINUTE } from './constants';

export const BLOG_PAGE_SIZE = 20;

// Todos los posts, de más reciente a más antiguo
export async function getAllPosts() {
  return (await getCollection('blog')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );
}

// Navegación compartida de las páginas del blog
export const BLOG_NAV_LINKS = [
  { href: '/blog/', label: 'Blog' },
  { href: 'https://github.com/emilio-devesa', label: 'GitHub' },
];

// Navegación de la home (anclas); la 404 la reutiliza con prefijo '/'
export const HOME_NAV_LINKS = [
  { href: '#sobre-mi', label: 'Quién soy' },
  { href: '#clases', label: 'Clases' },
  { href: '#opiniones', label: 'Opiniones' },
  { href: '#compromiso', label: 'Mi compromiso' },
  { href: '#music', label: 'Discografía' },
  { href: '#contact', label: 'Contacto' },
];

export const NOT_FOUND_NAV_LINKS = HOME_NAV_LINKS.map((link) => ({
  ...link,
  href: `/${link.href}`,
}));

export interface BlogCategory {
  slug: string;
  label: string;
  // categorías del front-matter incluidas en el filtro
  match: string[];
}

// 'mas' agrupa sin-categoria y cualquier otra futura categoría menor
const MAS_CATEGORY: BlogCategory = { slug: 'mas', label: 'Más', match: ['sin-categoria'] };

export const BLOG_CATEGORIES: BlogCategory[] = [
  { slug: 'hardware', label: 'Hardware', match: ['hardware'] },
  { slug: 'software', label: 'Software', match: ['software'] },
  { slug: 'videojuegos', label: 'Videojuegos', match: ['videojuegos'] },
  MAS_CATEGORY,
];

// Categoría del filtro a la que pertenece un post: primera coincidencia con
// las categorías conocidas y 'Más' si no hay ninguna. Única fuente de la
// agrupación: de aquí salen la etiqueta, el slug y los relacionados.
export function postCategory(categories: string[] | undefined): BlogCategory {
  const cats = categories ?? [];
  return BLOG_CATEGORIES.find((cat) => cats.some((c) => cat.match.includes(c))) ?? MAS_CATEGORY;
}

// Etiqueta de categoría para mostrar
export function postCategoryLabel(categories: string[] | undefined) {
  return postCategory(categories).label;
}

// Slug del filtro al que pertenece el post (para enlazar la categoría)
export function postCategorySlug(categories: string[] | undefined) {
  return postCategory(categories).slug;
}

// Posts pertenecientes a una categoría del filtro
export function postsInCategory(posts: CollectionEntry<'blog'>[], cat: BlogCategory) {
  return posts.filter((post) => (post.data.categories ?? []).some((c) => cat.match.includes(c)));
}

// Posts de la misma categoría del filtro que unas categorías dadas
// (misma agrupación que el filtro y que postCategoryLabel/Slug)
export function postsInSameCategory(
  posts: CollectionEntry<'blog'>[],
  categories: string[] | undefined,
) {
  return postsInCategory(posts, postCategory(categories));
}

// Número total de páginas para una lista (mínimo 1: siempre hay una página).
export function pageCount(total: number, size = BLOG_PAGE_SIZE) {
  return Math.max(1, Math.ceil(total / size));
}

// Trocea una lista en páginas de tamaño fijo. La página pedida se acota al
// rango [1, totalPages] para que el llamador no tenga que repetir la cuenta.
export function paginate<T>(items: T[], page: number, size = BLOG_PAGE_SIZE) {
  const totalPages = pageCount(items.length, size);
  const currentPage = Math.min(Math.max(1, page), totalPages);
  return {
    posts: items.slice((currentPage - 1) * size, currentPage * size),
    currentPage,
    totalPages,
  };
}

// Primera imagen del cuerpo optimizada en build. Sin imagen o con
// error devuelve undefined para que la llamada pinte sin miniatura.
const postImages = import.meta.glob<{ default: ImageMetadata }>(
  '../content/**/*.{jpg,jpeg,png,gif,webp,avif}',
);

function postFirstImageRel(body: string | undefined): string | undefined {
  const match = /!\[[^\]]*\]\(([^)]+)\)/.exec(body ?? '');
  const rel = match?.[1].split('#')[0].trim();
  return rel && !/^(https?:|data:)/i.test(rel) ? rel : undefined;
}

export interface OptimizedImage {
  src: string;
  // Caja pedida al pipeline de imágenes (la usan los <img> del listado).
  width: number;
  height: number;
  // Tamaño real del fichero generado. Astro devuelve en `attributes` la caja
  // pedida, no lo que mide el fichero, y como el pipeline nunca reescala hacia
  // arriba una imagen menor que la caja se queda a su tamaño. Estas son las que
  // hay que declarar en og:image:width/height para no mentir.
  outputWidth: number;
  outputHeight: number;
}

// Tamaño real del fichero que produce el pipeline: la caja pedida recortada por
// el tamaño de la fuente (nunca reescala hacia arriba).
function outputSize(source: { width: number; height: number }, width?: number, height?: number) {
  return {
    outputWidth: width === undefined ? source.width : Math.min(source.width, width),
    outputHeight: height === undefined ? source.height : Math.min(source.height, height),
  };
}

// Carpeta del post dentro de src/content, para resolver sus imágenes.
function postDir(post: CollectionEntry<'blog'>): string {
  return (post.filePath ?? '')
    .replace(/^src\//, '')
    .split('/')
    .slice(0, -1)
    .join('/');
}

export async function postFirstImage(
  post: CollectionEntry<'blog'>,
  width: number,
  height: number,
): Promise<OptimizedImage | undefined> {
  const rel = postFirstImageRel(post.body);
  if (!rel) return undefined;
  const load = postImages[`../${postDir(post)}/${rel}`];
  if (!load) return undefined;
  try {
    const mod = await load();
    const img = await getImage({ src: mod.default, width, height, fit: 'cover', format: 'webp' });
    return {
      src: img.src,
      width: img.attributes.width,
      height: img.attributes.height,
      ...outputSize(mod.default, width, height),
    };
  } catch (error) {
    // No rompe el build (la fila sale sin miniatura), pero deja rastro: fallar
    // aquí suele ser una ruta de imagen mal escrita.
    console.warn(`[blog] No se pudo optimizar la miniatura de ${post.id}: ${rel}`, error);
    return undefined;
  }
}

// Imagen del cuerpo (ruta relativa del markdown) resuelta con los mismos
// parámetros que usa el render del artículo, de forma que reutiliza el fichero
// ya optimizado y no añade trabajo al build. La usa el feed, que publica el
// artículo completo. Sin imagen o con error devuelve undefined.
export async function postBodyImage(
  post: CollectionEntry<'blog'>,
  rel: string,
): Promise<OptimizedImage | undefined> {
  const load = postImages[`../${postDir(post)}/${rel}`];
  if (!load) return undefined;
  try {
    const mod = await load();
    const img = await getImage({ src: mod.default, format: 'webp' });
    return {
      src: img.src,
      width: img.attributes.width ?? mod.default.width,
      height: img.attributes.height ?? mod.default.height,
      ...outputSize(mod.default),
    };
  } catch (error) {
    console.warn(`[blog] No se pudo optimizar la imagen de ${post.id}: ${rel}`, error);
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

// Minutos de lectura estimados (mínimo 1)
export function readingMinutes(body: string | undefined) {
  const words = (body ?? '').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
