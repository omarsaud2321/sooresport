# SoorSports MVP (Arabic/English + Admin B)

This is a starter MVP for **SoorSports**:
- Dark-first (royal blue accents)
- Arabic + English routes (`/ar`, `/en`)
- Game pages: News / Tournaments / Teams
- COD tournament filters: CDL / Challengers (MENA/EU/NA) / Saudi League
- Admin area (protected) with:
  - Create posts (Arabic-first, creates AR + EN entries)
  - Manage tournaments (add)
  - Manage teams + roster (add/remove players + photos)

## 1) Requirements
- Node.js 18+ (or 20+)
- npm

## 2) Install
```bash
npm install
```

## 3) Env setup
Create `.env.local`:
```bash
DATABASE_URL="file:./dev.db"
# Generate a bcrypt hash for your admin password
# Example (node):
# node -e "console.log(require('bcryptjs').hashSync('YourPassword', 10))"
ADMIN_PASSWORD_HASH="PUT_BCRYPT_HASH_HERE"

# Optional (for tweet links)
PUBLIC_SITE_URL="https://sooresports.vercel.app"
```

## 4) Database
```bash
npx prisma migrate dev --name init
node prisma/seed.mjs
```

## 5) Run
```bash
npm run dev
```

- Public: http://localhost:3000/ar
- Admin: http://localhost:3000/admin

## Deploy on Vercel (free)
1) Create a new project in Vercel from GitHub (or upload)
2) Add env vars:
   - DATABASE_URL (use Vercel Postgres or Supabase in production)
   - ADMIN_PASSWORD_HASH
   - PUBLIC_SITE_URL
3) Build & deploy

## Next upgrades (Phase B)
- Real Arabic→English translation (via a translation provider)
- Publish to X directly (OAuth + X API or Typefully)
- Media upload (team logos/player photos)
- Better post editor & scheduling
