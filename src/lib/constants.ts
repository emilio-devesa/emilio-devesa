// Constantes compartidas del sitio.
//
// Los valores que aparecen en sitios que no pueden importar van en literal con
// un comentario que apunta aquí (el CSS no admite var() en media queries y los
// <script is:inline> se emiten tal cual, sin pasar por el empaquetador):
//
//   768 px  → style.css (§13), PrimaryLayout.astro (<noscript>) y
//             SiteHeader.astro (window.innerWidth > 768)
//   50      → BlogLayout.astro (tope de resultados del buscador)
//   200 ms  → BlogLayout.astro (retardo del filtro del buscador)
//   320×240 → BlogLayout.astro (<img> de cada resultado)

// Miniaturas de las tarjetas de post (relación 4:3).
export const THUMB_WIDTH = 320;
export const THUMB_HEIGHT = 240;

// Portada para Open Graph/Twitter y para el feed (relación ~1.91:1).
export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Velocidad de lectura (palabras por minuto) de los minutos estimados.
export const WORDS_PER_MINUTE = 200;

// Apartados ## mínimos para mostrar el índice del artículo.
export const TOC_MIN_HEADINGS = 4;
