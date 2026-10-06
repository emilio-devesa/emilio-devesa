export const BLOG_PAGE_SIZE = 20;

export function blogPageUrl(page: number) {
  return page === 1 ? '/blog/' : `/blog/pagina/${page}/`;
}

// post.id conserva la forma NFD del nombre del fichero (p. ej. la ñ como
// n + tilde combinada); la ruta publicada usa NFC.
export function blogPostUrl(id: string) {
  return `/blog/${id.normalize('NFC')}/`;
}
