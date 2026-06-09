# User Auth

A full-stack authentication app built with Next.js, MongoDB, and JWT. Users can register, log in, and access a protected dashboard. Admins get a separate login and management portal to view registered users.

**Live demo:** [user-auth-haseeb.vercel.app](https://user-auth-haseeb.vercel.app/login)

---

## What I Built

- User registration and login with bcrypt password hashing
- JWT stored in httpOnly cookies for secure sessions
- Protected routes via `proxy.ts` (redirects unauthenticated users)
- Admin dashboard with user stats, table view, and role badges
- Admin seed script to bootstrap the first admin account
- Dark UI built with Tailwind CSS

---

## Tech Stack

- **Next.js** — Full-stack app with pages, API routes, and route protection in one project
- **React** — Build login, register, dashboard, and admin UI
- **TypeScript** — Catch errors early and keep code easier to maintain
- **MongoDB + Mongoose** — Store users and roles in a flexible database
- **JWT** — Secure sessions without storing login state on the server
- **bcryptjs** — Hash passwords so they're never stored in plain text
- **Tailwind CSS** — Style the UI quickly with utility classes
- **tsx** — Run the admin seed script from the command line
- **pnpm** — Fast, reliable package management

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/Haseeb-takween/user-auth.git
cd user-auth
pnpm install
```

### 2. Environment variables

Create a `.env.local` file in the project root:

```env
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your-admin-password
ADMIN_NAME=Admin
```

### 3. Seed admin user

```bash
pnpm seed:admin
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Run production build |
| `pnpm lint` | Run ESLint |
| `pnpm seed:admin` | Create or reset the admin user |

---

## How to Test

### Live (Vercel)

- [Login](https://user-auth-haseeb.vercel.app/login) — register a user, sign in, reach `/dashboard`
- [Admin login](https://user-auth-haseeb.vercel.app/admin/login) — sign in with admin credentials, reach `/admin`
- [Health check](https://user-auth-haseeb.vercel.app/api/health) — should return `{ "status": "ok" }` if MongoDB is connected

### User flow

1. Open `/register` and create an account (password min 6 characters)
2. Log in at `/login` — you should land on `/dashboard`
3. Log out — should return to login
4. Visit `/dashboard` while logged out — should redirect to `/login`

### Admin flow

1. Open `/admin/login` and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`
2. You should reach `/admin` with user stats and a registered users table
3. Log in as a regular user and visit `/admin` — should redirect to `/dashboard`

### Route protection

| URL | Logged out | Regular user | Admin |
|-----|-----------|--------------|-------|
| `/login` | ✅ | ✅ | ✅ |
| `/dashboard` | → login | ✅ | ✅ |
| `/admin/login` | ✅ | ✅ | → `/admin` |
| `/admin` | → admin login | → `/dashboard` | ✅ |

---

## Project Structure

```
app/
├── (auth)/          # Login & register pages
├── (protected)/     # Dashboard & admin portal
├── admin/login/     # Admin login page
└── api/             # Auth & health API routes
lib/db/              # MongoDB connection
models/              # User schema
scripts/             # Admin seed script
proxy.ts             # Route protection middleware
```

---

## Known Limitations

- **No email verification** — anyone can register with any email; accounts are active immediately
- **No password reset** — users cannot recover a forgotten password
- **No rate limiting** — login and register endpoints have no brute-force protection
- **Route guard uses `jwt.decode`, not `jwt.verify`** — `proxy.ts` checks the token payload without validating the signature; pages verify properly, but middleware alone is not fully secure
- **API routes are not protected by middleware** — `/api/*` is excluded from `proxy.ts`; auth is only enforced on page routes
- **Admin panel is read-only** — admins can view users but cannot edit, delete, or change roles
- **Admin dashboard shows partial password hashes** — for demo/debug only; not suitable for production
- **No automated tests** — all testing is manual through the browser
- **Single session model** — JWT expires after 24 hours; no refresh tokens or "remember me"
- **Register does not auto-login** — users must sign in separately after creating an account
- **Two roles only** — `user` and `admin`; no finer-grained permissions

---

## License

Private project.
