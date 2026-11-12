# Instructions for agents

This repo runs our NMCN nurse licence service. For any task about a nurse, an NMCN licence/card, the NMCN portal, Remita payments for NMCN, or the Card Desk dashboard:

1. Load the `nmcn-card-processing` skill (`.claude/skills/nmcn-card-processing/SKILL.md`). Paths like `brain/...` in it are relative to this repo's root.
2. Follow `brain/business-rules.md`. Hard stops: no passwords, no payment or final submit without the operator's explicit approval in the conversation.
3. Keep the Card Desk record updated after every stage through the Vercel app API (`app/README.md`, `references/dashboard-records.md`).
4. Record new portal facts in `brain/portal-notes.md`.

When changing the dashboard's fields or status keys, update `app/index.html`, `app/api/_lib/validate.js`, `brain/data-schema.md` and the skill together.
