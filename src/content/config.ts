import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/projects" }),
  schema: z.object({
    title: z.string(),
    showcased: z.boolean().default(false),
    "card-subheadline": z.string().optional(),
    category: z.string(),
    keywords: z.array(z.string()),
    cover: z.string(),
    "square-image": z.string(),
    gallery: z.array(z.string()).optional(),
    "project-subheadline-1": z.string(),
    "project-subheadline-2": z.string().optional(),
    "project-text-1": z.string(),
    "project-text-2": z.string().optional(),
    quote: z.object({
      author: z.string(),
      "quote-text": z.string(),
    }),
  }),
});

export const collections = { projects };
