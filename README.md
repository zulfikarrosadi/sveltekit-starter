# Sveltekit Starter

Already setup with
- Better Auth (Email and Google)
- ShadCn that compatible with Tailwindcss v4
- Drizzle ORM with Postgres

## How to use
1. Clone / download / use template this repo
1. run `pnpm install`
1. copy `.env.example` to `.env`
1. Create postgres database and update the url at `.env`
1. run `pnpm run db:push`
1. and run `pnpm run dev` to start vite local development server

> Better auth tend to use port 3000, because of that, I change vite default port `5173` to `3000`
> You can change this in `vite.config.ts` and change `BETTER_AUTH_URL` in `.env` file
