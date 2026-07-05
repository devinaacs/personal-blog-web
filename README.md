# dev — Personal Blog

The frontend for **dev**, a personal blog — _developer / writer / overthinker_. Thoughts, code, and everything in between. Built with Next.js App Router and backed by the [personal-blog-be](https://github.com/devinaacs/personal-blog-be) NestJS API.

Live: <https://devjustpost.vercel.app>

## Stack

- Next.js App Router
- React
- TypeScript strict mode
- Tailwind CSS v4
- shadcn/ui with the full official component set
- ESLint
- Prettier with Tailwind class sorting
- Vitest, React Testing Library, and jsdom
- Zod-based environment validation
- Dynamic Open Graph image generation (`next/og`)
- GitHub Actions CI

## Getting Started

```bash
git clone https://github.com/devinaacs/personal-blog-web.git
cd personal-blog-web
cp .env.example .env.local
npm install
npm run dev
```

Open <http://localhost:3000>.

The app reads from the [personal-blog-be](https://github.com/devinaacs/personal-blog-be) API, so run that locally too (or point `NEXT_PUBLIC_API_URL` at a deployed instance) before starting the frontend.

## Scripts

```bash
npm run dev            # Start local development
npm run build          # Create a production build
npm run start          # Start the production server
npm run lint           # Run ESLint
npm run typecheck      # Run TypeScript without emitting files
npm run format         # Format the project
npm run format:check   # Check formatting
npm run test           # Run unit and component tests
npm run test:watch     # Run tests in watch mode
npm run check          # Run the full local quality gate
```

## Project Structure

```txt
src/
  app/
    (site)/            Home page (hero, blog list, about)
    blog/[slug]/        Blog post page, with per-post metadata and OG image
    admin/              Admin panel: login, post editor, settings (JWT-protected)
    api/admin/           BFF routes that proxy admin auth/content calls to the API
                          and hold the JWT in an httpOnly cookie
    og/                 Dynamic Open Graph image route (next/og)
  components/
    blog/               Hero, blog list, post detail, about section
    admin/              Admin panel UI
    layout/             Reusable page shell components
    shared/             Shared providers and cross-app components
    ui/                 shadcn/ui component source
  config/               Site identity (name, tagline, description) and metadata builder
  lib/                  API client, posts/settings data fetching, environment validation
  types/                Shared TypeScript types (Post, Settings, Auth, ...)
```

## Environment

Create a local environment file from the example:

```bash
cp .env.example .env.local
```

```bash
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001/api/v1"
```

Environment values are validated in `src/lib/env.ts`. `NEXT_PUBLIC_API_URL` must point at a running [personal-blog-be](https://github.com/devinaacs/personal-blog-be) instance — blog pages fetch posts from it at both build time (`generateStaticParams`) and request time, so a missing or unreachable API will fail the build.

## Site Identity

Site name, tagline, and description live in `src/config/site.ts` and are the single source of truth for page metadata, the default Open Graph image, and the homepage hero. Update them there rather than in individual pages.

## Open Graph Images

`src/app/og/route.tsx` renders a branded OG card via `next/og`. It accepts optional `title` and `subheading` query params so each blog post gets its own card (wired up in `src/app/blog/[slug]/page.tsx`); with no params it falls back to the site tagline and description for the homepage.

## Admin Panel

`/admin` is a JWT-protected content editor for posts and site settings. The Next.js API routes under `src/app/api/admin/` act as a thin backend-for-frontend layer: they call the NestJS API's `/auth/login` endpoint, verify the returned user has the `ADMIN` role, and store the access/refresh tokens in httpOnly cookies rather than exposing them to client-side JavaScript.

## Testing

```bash
npm run test          # Vitest unit and component tests
npm run test:watch    # Watch mode
```

## Conventions

- Use Node.js 22. The repo includes `.nvmrc` for Node version managers.
- Use `@/` imports for files inside `src`.
- Keep generic reusable UI in `src/components/ui`, layout shell pieces in `src/components/layout`, and app-specific shared pieces in `src/components/shared`.
- Keep validated configuration in `src/config` and `src/lib/env.ts`.
- Run `npm run check` before merging or deploying.

## CI

GitHub Actions runs `npm ci` and `npm run check` on pushes to `main` and pull requests.

## Deployment

Deployed to Vercel, alongside [personal-blog-be](https://github.com/devinaacs/personal-blog-be):

```bash
npm run build
npx vercel@latest deploy --prod
```

Required environment variables on the Vercel project (Production + Preview):

```bash
NEXT_PUBLIC_API_URL="https://devjustpost-api.vercel.app/api/v1"
NEXT_PUBLIC_APP_URL="https://devjustpost.vercel.app"
```

`NEXT_PUBLIC_API_URL` must point at a _live, reachable_ backend before deploying — `generateStaticParams` on the blog post page fetches from it during the build, so the frontend build fails if the API is down or misconfigured.
