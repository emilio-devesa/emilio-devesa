import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  loader: glob({ base: './src/content/', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // La descripción es obligatoria (regla del blog) y alimenta el meta
    // description, las tarjetas y el feed.
    description: z.string(),
    // Idioma del post; solo hay es/en y el resto del esquema lo asume.
    lang: z.enum(['es', 'en']).optional(),
    // Un slug desconocido cae en la categoría 'Más' por diseño.
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog,
};
