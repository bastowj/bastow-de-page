# bastow.de

Personal website and blog for Julian Bastow

Built with Next.js (App Router), MDX, and Tailwind CSS v4.

## Commands

```bash
pnpm dev         # Start dev server with Turbopack
pnpm build       # Production build
pnpm lint        # ESLint + Prettier check
pnpm format      # Auto-format with Prettier
pnpm test        # Run Jest tests
```

## Docker

```bash
docker build -t bastow-de .
docker run -p 3000:3000 bastow-de
```

## Stack

- **Next.js** (App Router)
- **content-collections** for build-time MDX compilation with Zod-validated frontmatter
- **Tailwind CSS v4** via PostCSS
- **next-themes** for dark/light mode
- **Jest** for testing

## Content

Blog posts and static pages live as MDX files in `/content/`. Blog posts are served at `/texts/[slug]`.

## Environment Variables

| Variable         | Required | Description                                             |
| ---------------- | -------- | ------------------------------------------------------- |
| `PIXELFED_TOKEN` | Yes      | Personal access token for the Pixelfed API (read scope) |

Create a `.env.local` file for local development. Get a token at pixelfed.de/settings/applications.
