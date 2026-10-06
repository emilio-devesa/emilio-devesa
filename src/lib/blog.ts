export const BLOG_PAGE_SIZE = 20;

export function blogPageUrl(page: number) {
  return page === 1 ? '/blog/' : `/blog/pagina/${page}/`;
}
