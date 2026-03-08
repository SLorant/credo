import { defineCollection, type ImageFunction } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// Reusable schema factories
const createProjectSchema = (image: ImageFunction) =>
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
  });

const createTeamSchema = (image: ImageFunction) =>
  z.object({
    name: z.string(),
    picture: image(),
    role: z.string(),
    order: z.number(),
  });

const createCareerSchema = () =>
  z.object({
    name: z.string(),
    footer: z.string(),
    sections: z.array(z.object({ left: z.string(), right: z.string() })),
  });

// Hungarian collections
const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: ({ image }) => createProjectSchema(image),
});

const team = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team" }),
  schema: ({ image }) => createTeamSchema(image),
});

const career = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career" }),
  schema: createCareerSchema,
});

// English collections
const projects_en = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects_en" }),
  schema: ({ image }) => createProjectSchema(image),
});

const team_en = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/team_en" }),
  schema: ({ image }) => createTeamSchema(image),
});

const career_en = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/career_en" }),
  schema: createCareerSchema,
});

export const collections = {
  projects,
  projects_en,
  team,
  team_en,
  career,
  career_en,
};
