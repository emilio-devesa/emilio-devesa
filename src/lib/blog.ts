export const BLOG_PAGE_SIZE = 20;

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
