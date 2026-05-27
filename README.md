# The Black Dahlia Site

Next.js 16 site for The Black Dahlia, using locally committed crawl/media artifacts.

## Admin Area

This repo now includes a protected `/admin` dashboard for:

- Reviewing incoming booking enquiries.
- Updating enquiry status, assignment, and notes.
- Creating and viewing artist bookings in a calendar view.

### Default login

- Username: `admin`
- Password: `blackdahlia420`

Override these in environment variables for production.

### Required environment variables

Copy `.env.example` and set:

- `DATABASE_URL` (Neon / Vercel Postgres compatible connection string)
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Content Pipeline

The crawler and downloader are available, but are not required for every build.

```bash
npm run crawl
npm run assets
npm run refresh-content
```

`npm run refresh-content` regenerates:

- `data/crawl/*`
- `src/content/media.json`
- `public/media/*`

Commit those artifacts after refresh.

## Build

```bash
npm run lint
npm run build
```

`npm run build` calls `scripts/prepare-content.mjs` before `next build`:

- If committed artifacts exist, build uses them (no network crawl).
- If artifacts are missing in local dev, it auto-generates them.
- If artifacts are missing on Vercel, build fails fast with instructions.

## Vercel Deployment Notes

This repo is safe for Vercel as configured:

- Uses `next build` with App Router server features enabled.
- Avoids external crawling during normal Vercel builds.
- Requires committed media/content artifacts in git.
- Requires `DATABASE_URL` and admin auth environment variables for `/admin`.

Optional manual refresh behavior:

- Set `FORCE_CONTENT_REFRESH=1` to force recrawl during a build.
- Not recommended on Vercel unless intentionally rebuilding source assets remotely.
