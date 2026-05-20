import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import { z } from "zod";

const texts = defineCollection({
  name: "texts",
  directory: "content/texts",
  include: "*.mdx",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    categories: z.array(z.string()),
    coverImage: z.string().nullish(),
    author: z.string().nullish(),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc);
    return {
      ...doc,
      slug: doc._meta.fileName.replace(/\.mdx$/, ""),
      body,
    };
  },
});

const pages = defineCollection({
  name: "pages",
  directory: "content/pages",
  include: "*.mdx",
  schema: z.object({
    content: z.string(),
    title: z.string(),
    description: z.string().nullish(),
  }),
  transform: async (doc, ctx) => {
    const body = await compileMDX(ctx, doc);
    return {
      ...doc,
      slug: doc._meta.fileName.replace(/\.mdx$/, ""),
      body,
    };
  },
});

export default defineConfig({
  content: [texts, pages],
});
