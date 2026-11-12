# nurse-application — NMCN Card Desk

Dashboard for processing nurses' NMCN licence requests (renewal, new licence, change of name): one record per nurse, a 10-stage pipeline from intake to delivery, and money tracking (collected from the nurse, paid to NMCN, other costs, profit).

- **Live:** https://nmcn-card-desk.vercel.app (password login)
- **Code:** `app/` (static `index.html` + Vercel Functions in `app/api/`, data in a private Vercel Blob store). API and env vars: `app/README.md`.
- **Deploys:** push to `main` → production; other branches → preview (Vercel Git integration).
- **Automation:** skills, agents, SOUL and brain are in the private repo `nurse-automation`; its `tools/cardesk.mjs` talks to this app's API.
