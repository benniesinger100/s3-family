# S³ — our shared family week

A warm, comic-strip style web app for four people (Bennie, Leora, Mom, Gg) to
share what their week looks like and cheer each other on.

- **Frontend:** React + Vite
- **Backend:** Supabase (Postgres + realtime) — optional; the app runs in a
  local "demo mode" until you connect it
- **Hosting:** built to deploy free on Vercel

## Running locally

This project needs **Node 20+**. If you use nvm:

```bash
nvm use 20      # or: nvm install 20
npm install
npm run dev
```

Open the printed URL (e.g. http://localhost:5173). With no Supabase keys set,
it runs in demo mode (data stored only in your browser).

## Going live with Supabase

1. Create a free project at https://supabase.com.
2. In the dashboard, open **SQL Editor → New query**, paste the contents of
   [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
3. Open **Project Settings → API** and copy the **Project URL** and the
   **anon public** key.
4. Put them in `.env.local`:
   ```
   VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR-ANON-KEY
   ```
5. Restart `npm run dev`. The "demo mode" banner disappears and all devices now
   share the same live data.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. At https://vercel.com, **Add New → Project**, import the repo (framework
   auto-detected as Vite).
3. Add the two environment variables (`VITE_SUPABASE_URL`,
   `VITE_SUPABASE_ANON_KEY`) under **Settings → Environment Variables**.
4. Deploy. Share the resulting URL with the family.

## Adding your own art

The styling leaves obvious spots for personal doodles — the title panel, each
person's panel header, and empty-state areas. Drop images into `src/assets/`
and reference them from the relevant component.

## Project layout

```
src/
  lib/
    people.js     four members + their colors (edit here to tweak)
    week.js       week/date math
    supabase.js   client (reads VITE_ env vars)
    store.js      single data layer: Supabase if configured, else localStorage
  components/      IdentityPicker, Header, WeekNav, Board, PersonPanel,
                  NotesFeed, CopyWeek
  App.jsx         wires it together, loads data + realtime
supabase/
  schema.sql      run this once in the Supabase SQL editor
```
