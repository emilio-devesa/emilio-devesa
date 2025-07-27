import { glob } from 'astro/loaders'
import { defineCollection, z } from "astro:content"

const blog = defineCollection({
  loader: glob({ base: './src/content/', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    slug: z.string().optional()
  }),
});

export const collections = {
  blog,
};
