# NMCN nurse licence automation

Skill, agent and knowledge base ("brain") for running our NMCN licence service: taking a nurse's request (renewal, new licence, change of name), processing it on the official NMCN portal, paying NMCN, printing and delivering the card, and tracking money and profit on the **NMCN Card Desk** dashboard.

## Layout

```
.claude/
  skills/nmcn-card-processing/
    SKILL.md                    the step-by-step process (start here)
    references/intake.md        details, documents, WhatsApp templates
    references/portal-playbook.md  browser steps on the NMCN portal
    references/dashboard-records.md  reading/writing Card Desk records
  agents/nmcn-processor.md      agent that runs one nurse through the pipeline
brain/
  business-rules.md             pricing, payment rules, what we never do
  data-schema.md                record fields and status keys
  portal-notes.md               living log of what we learn about the portal
  glossary.md
app/                          Vercel app: dashboard + API (production)
dashboard/
  index.html                    Claude-artifact version of the dashboard
CLAUDE.md                       instructions any agent reads on opening the repo
```

## The dashboard

Production: https://nmcn-card-desk.vercel.app (Vercel project `nmcn-card-desk`, source in `app/`, password login, private Blob storage). See `app/README.md`.

Earlier Claude-artifact version: 
Live at https://claude.ai/artifact/BTaV3G2rgRofPiDubX6HMv (private to the owner until shared). One record per nurse; shows collected, paid to NMCN, other costs and profit, plus a pipeline of stages. Agents update it through the artifact database (see `references/dashboard-records.md`).

## Pipeline

`intake → awaiting_docs → docs_ready → profile_done → applied → nmcn_paid → approved → printed → out_for_delivery → delivered` (side states: `query`, `on_hold`, `cancelled`).

## Using it with an agent

Open this repo in Claude Code (or any agent that reads `CLAUDE.md`), then ask e.g. *"Process the renewal for Ngozi Okafor"* or *"Move NC-261112-AB12 to paid to NMCN"*. The agent will load the skill, read the record, do the next stage, and stop for you at logins, payments and final submits.

## Keeping it current

- Fee changes → update **Fees & prices** on the dashboard and `brain/business-rules.md`.
- Portal changes → add a dated entry to `brain/portal-notes.md` and fix `portal-playbook.md`.
- New fields or statuses → change `dashboard/index.html` and `brain/data-schema.md` together.
