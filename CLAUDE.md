# Instructions for agents

This repo holds the **NMCN Card Desk** app only (folder `app/`): dashboard + API + private Vercel Blob storage, deployed to https://nmcn-card-desk.vercel.app (Vercel project `nmcn-card-desk`, root directory `app`).

The skills, agents, persona (SOUL.md) and knowledge brain for processing nurses live in the private repo **nurse-automation**. For any task about a nurse, the NMCN portal or the business process, work from that repo.

When changing record fields or status keys, update `app/index.html` and `app/api/_lib/validate.js` here, and `brain/wiki/data-schema.md` plus the skills in nurse-automation.
