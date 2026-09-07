# Daylight

A calm, minimal todo app. Plan your day, tag tasks by category and priority, and pick up right where you left off on any device.

## Features

- **Google sign-in** — tasks are tied to your account and sync across every device
- **Category & priority tagging** — Personal / Work / Health categories, Low / Medium / High priority
- **Smart filters** — sidebar filters for all tasks, completed, and each priority level, each with a live count
- **Progress tracking** — an animated ring shows how much of today's list is done
- **Details on demand** — a "view all" list and a per-task detail view for a closer look
- **A little polish** — a branded intro animation, an editable display name, and a rotating focus quote

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- [NextAuth.js](https://next-auth.js.org) with the Google provider for authentication
- [Postgres](https://neon.tech) for storage, queried directly with `pg`
- Plain CSS — no UI framework

## Getting started

```bash
npm install
```

Create a `.env.local` in the project root:

```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=
```

- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` — from a Google Cloud OAuth client (Web application type), with `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI
- `NEXTAUTH_SECRET` — any random string (`openssl rand -base64 32`)
- `DATABASE_URL` — a Postgres connection string (a free [Neon](https://neon.tech) project works well)

Then run the dev server:

```bash
npm run dev
```

## Deployment

Deployed on [Vercel](https://vercel.com). Set the same environment variables in the project's dashboard, with `NEXTAUTH_URL` pointing at the production domain, and add `https://<your-domain>/api/auth/callback/google` as an authorized redirect URI on the Google OAuth client.
