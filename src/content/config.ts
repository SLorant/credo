import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      "website-link": z.string().optional(),
      showcased: z.boolean().default(false),
      order: z.number().optional(),
      icon: image().optional(),
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
          "quote-text-landing": z.string().optional(),
          "quote-showcased": z.boolean().default(false),
          order: z.number().optional(),
        })
        .optional(),
    }),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      picture: image(),
      role: z.string(),
      order: z.number(),
    }),
});

export const collections = { projects, team };
