# Creative Agency CRM + Project Management

A premium Next.js App Router SaaS scaffold for creative agencies. The product combines CRM, project delivery, Kanban, collaboration, profile management, analytics, and an admin control center, styled around the provided logo and the `#4ab5b8` brand system.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn-style component architecture
- Supabase Auth / Database / Storage / Realtime
- Zustand
- React Query
- dnd-kit
- Framer Motion
- Recharts

## Project Structure

```text
.
|-- app
|   |-- (app)
|   |   |-- admin/page.tsx
|   |   |-- clients/page.tsx
|   |   |-- dashboard/page.tsx
|   |   |-- layout.tsx
|   |   |-- profile/page.tsx
|   |   |-- projects/page.tsx
|   |   `-- tasks/page.tsx
|   |-- (auth)
|   |   |-- layout.tsx
|   |   |-- login/page.tsx
|   |   `-- signup/page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   |-- loading.tsx
|   |-- page.tsx
|   `-- providers.tsx
|-- components
|   |-- admin
|   |-- app-shell
|   |-- auth
|   |-- brand
|   |-- clients
|   |-- dashboard
|   |-- notifications
|   |-- profile
|   |-- projects
|   |-- shared
|   |-- tasks
|   `-- ui
|-- hooks
|   `-- use-realtime-notifications.ts
|-- lib
|   |-- data.ts
|   |-- env.ts
|   |-- supabase
|   |-- types.ts
|   `-- utils.ts
|-- store
|   `-- ui-store.ts
|-- supabase
|   `-- schema.sql
`-- tailwind.config.ts
```

## UI Screen Breakdown

### Dashboard

- Hero overview with KPI cards, team availability, revenue snapshot, and active sprint context
- Charts for throughput and workload distribution
- Personal task queue, upcoming deadlines, and live activity feed

### CRM

- Searchable client list with status filters
- Rich client profile cards with spend, contact info, notes, linked projects, and account history
- Built-in empty states and premium card layouts for lead nurturing

### Projects

- Project cards with health scoring, deadline visibility, progress bars, and assigned team
- Dedicated performance summaries for project owners and leadership
- Admin actions for creation, editing, assignment, and risk review

### Kanban

- Drag-and-drop task board with `To Do`, `In Progress`, `Review`, and `Done`
- Cards include due dates, assignees, priorities, comment counts, and attachments
- Touch-friendly layout with motion polish and responsive stacking

### Admin Panel

- User management with search, role filters, and recent activity visibility
- Project control for assignment and delivery health
- Global analytics to monitor system usage, active projects, and task completion

### Auth + Profile

- Branded login and signup flows with role selection
- Avatar upload or seeded avatar generation
- Editable user profile with activity history and role badge

## Supabase Schema

The complete schema lives in [`supabase/schema.sql`](./supabase/schema.sql) and includes:

- `users`
- `clients`
- `projects`
- `project_members`
- `tasks`
- `comments`
- `activity_logs`
- `notifications`

It also includes:

- enum types for roles, statuses, priorities, and notification kinds
- foreign keys and indexes
- `updated_at` triggers
- RLS policies
- a profile auto-create trigger from `auth.users`

Before using the real-data version of the app, run the latest contents of `supabase/schema.sql` in your Supabase SQL editor so the updated policies are applied.

## Setup Guide

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an `.env.local` file:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Create the required Supabase storage buckets:

   - `avatars` for profile photos
   - `attachments` for task files

4. Apply the SQL schema in Supabase SQL editor or with the CLI:

   ```bash
   supabase db push
   ```

5. Start the app:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Disable Email Confirmation

To allow users to sign up and immediately access the app without confirming their email first:

1. Open Supabase Dashboard
2. Go to `Authentication` -> `Settings`
3. Disable `Email Confirmations`

Supabase documents that when Email Confirmations are disabled, `signUp()` returns both a user and a session immediately.

## Free Netlify Deployment

This app can be deployed on Netlify's free tier with continuous deployment from GitHub.

### 1. Push this project to GitHub

If this code is only local right now, create a GitHub repo and push it there first.

### 2. Import the repo into Netlify

- Log in to Netlify
- Go to `Add new project` -> `Import an existing project`
- Choose GitHub
- Select this repository

Netlify should auto-detect Next.js.

### 3. Build settings

Use these values if Netlify asks:

- Build command: `npm run build`
- Publish directory: leave empty for Next.js auto-detection

### 4. Add environment variables in Netlify

Under `Project configuration` -> `Environment variables`, add:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://thnohzoiegdmdsrhvsli.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ocgiFVe-1tm6NA0tI2u43A_UIvXp6yB
```

### 5. Redeploy

Trigger the first deploy. Netlify will build the Next.js app and assign a free `*.netlify.app` domain.

### 6. Supabase allowed URLs

In Supabase, add your Netlify site URL to the allowed redirect URLs for auth, for example:

- `https://your-site-name.netlify.app/login`
- `https://your-site-name.netlify.app/signup`
- `https://your-site-name.netlify.app`

If you use email auth callbacks or OAuth later, also add the matching callback URLs in Supabase Auth settings.

## Production Notes

- The app now reads live data from Supabase instead of local mock records.
- Supabase clients are already abstracted in `lib/supabase`.
- Signup uploads avatars into Supabase Storage and writes profile data into `public.users`.
