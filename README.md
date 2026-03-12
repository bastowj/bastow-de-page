# bastow.de

Personal website and blog for Julian Bastow

built with Next.js (App Router), MDX, and Tailwind CSS v4.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run lint     # ESLint + Prettier check
npm run format   # Auto-format with Prettier
```

## Stack

- **Next.js** (App Router)
- **MDX** via `next-mdx-remote` + `gray-matter` for blog posts and static pages
- **Tailwind CSS v4** via PostCSS
- **next-themes** for dark/light mode

## Content

Blog posts and static pages live as MDX files in `/content/`. Blog posts are served at `/texts/[slug]`.
