import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      showcased: z.boolean().default(false),
      "card-subheadline": z.string().optional(),
      category: z.array(z.string()),
      keywords: z.array(z.string()).optional(),
      cover: image(),
      "square-image": image(),
      gallery: z.array(image()).optional(),
      "project-subheadline-1": z.string(),
      "project-subheadline-2": z.string().optional(),
      "project-text-1": z.string(),
      "project-text-2": z.string().optional(),
      quote: z
        .object({
          author: z.string().optional(),
          "quote-text": z.string().optional(),
        })
        .optional(),
    }),
});

export const collections = { projects };
