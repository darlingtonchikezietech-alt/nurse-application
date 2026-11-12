---
name: nmcn-card-processing
description: End-to-end process for handling a Nigerian nurse's or midwife's NMCN licence request (renewal, new licence, change of name) from first contact to delivered card, including portal work on the NMCN site, money tracking and updating the NMCN Card Desk dashboard. Use whenever a task mentions an NMCN licence, nursing ID card, licence renewal, a nurse client, Remita RRR for NMCN, or the Card Desk dashboard.
---

# NMCN card processing

This skill is the operating manual for our nursing-licence service. A nurse (the **client**) pays us to get their NMCN licence/ID card renewed or issued; we do the work on the official NMCN portal, pay NMCN's official fee, print the card and deliver it. Every client is one record on the **NMCN Card Desk** dashboard, and every step below ends by updating that record.

Read these before acting:

| File | When |
|---|---|
| `brain/business-rules.md` | Always. Money rules, what we never do. |
| `brain/data-schema.md` | Before reading or writing a dashboard record. |
| `references/intake.md` | Stage 1–2: talking to the nurse, collecting documents. |
| `references/portal-playbook.md` | Stage 3–7: working in a browser on the NMCN portal. |
| `references/dashboard-records.md` | Any time you create or update a record. |
| `brain/portal-notes.md` | Before portal work: what we have learned about the live site. Add to it after. |

## Ground rules (non-negotiable)

1. **A human logs in.** Never type, store, or ask for passwords in chat, in files, or in the dashboard. If the portal shows a login screen, stop and ask the operator to sign in in the browser, then continue.
2. **A human approves money.** Never complete a Remita/card payment, or click a final "Submit application" button, without the operator's explicit "yes" in the current conversation, after you have shown them the exact amount and the nurse's details as entered.
3. **The nurse's data is personal data** (Nigeria Data Protection Act 2023). Only use it for this application. Do not paste it into other tools, public pages or web searches.
4. **The dashboard is the source of truth.** If something happened and it isn't on the record, it didn't happen. Update the record at the end of every stage, with a history entry.
5. **Fees change.** Never assume an NMCN fee; read it from the portal/Remita screen and record what was actually paid.

## The pipeline

Status keys are fixed (the dashboard depends on them). Side states can be entered from any stage: `query` (NMCN raised an issue), `on_hold` (waiting on the nurse), `cancelled`.

| # | Status key | Label | Done when |
|---|---|---|---|
| 1 | `intake` | New request | Nurse's basic details and request type are logged |
| 2 | `awaiting_docs` | Awaiting documents | We've asked for documents and payment, not all received |
| 3 | `docs_ready` | Documents complete | All required documents received and checked; price agreed |
| 4 | `profile_done` | Portal profile ready | Nurse has a working account / updated profile (PUF) on the NMCN portal |
| 5 | `applied` | Application submitted | Renewal / new licence / change-of-name application submitted on portal |
| 6 | `nmcn_paid` | Paid to NMCN | Official fee paid via Remita; RRR recorded; `nmcnFee` set |
| 7 | `approved` | Approved by NMCN | Portal shows approved / licence available |
| 8 | `printed` | Card printed | Licence/card printed (or collected from NMCN office) |
| 9 | `out_for_delivery` | Out for delivery | Handed to rider/courier or ready for pick-up |
| 10 | `delivered` | Delivered | Nurse has the card; balance settled |

## Step by step

### Stage 1 — Intake (`intake`)
1. Get from the nurse: full name exactly as on their NMCN record, phone/WhatsApp, email, request type (renewal / new / change of name), cadre (RN, RM, RN/RM, etc.), NMCN registration number, current licence number and expiry date if renewing, state of residence, delivery address.
2. Work out years in default for renewals (full years since expiry, see `brain/business-rules.md`).
3. Quote the price from the dashboard's Fees & prices settings (`config/prices`). Explain it covers the NMCN fee + our service.
4. **Create the record** (`references/dashboard-records.md` → "Create"). Set `charged` to the agreed price.

### Stage 2 — Documents and client payment (`awaiting_docs` → `docs_ready`)
1. Send the document checklist for their request type (`references/intake.md`).
2. Tick each document in `docs` as it arrives; check quality (passport photo: plain background, recent, clear face; scans legible).
3. Record every payment from the nurse by increasing `received`. Default policy: do not pay NMCN until the nurse has paid at least the NMCN fee (see business rules).
4. Move to `docs_ready` when every required doc is ticked and payment rule is met.

### Stage 3 — Portal profile (`profile_done`)
Follow `references/portal-playbook.md` → "Account and profile". Create the account on the licence portal if the nurse doesn't have one, or use their existing one; make sure the Professional Update Form (PUF) is complete. Record `portalUsername` (never the password). Note anything new about the site in `brain/portal-notes.md`.

### Stage 4 — Application (`applied`)
Follow the playbook → "Application". Fill the form from the dashboard record only, upload documents, review, and ask the operator to approve before the final submit. Record `nmcnAppId` and any reference shown.

### Stage 5 — Pay NMCN (`nmcn_paid`)
Follow the playbook → "Payment". Read the amount from the screen, show it to the operator, get approval, pay. Record `rrr`, `nmcnFee` (the exact amount paid, including penalty and any Remita charge) and `nmcnPaidOn`. Keep the receipt with the nurse's documents.

### Stage 6 — Track approval (`approved`, or `query`)
Check the application status on the portal (playbook → "Status checks") every 2–3 working days. If NMCN raises a query, set `query`, write the reason in `notes`, tell the nurse what's needed, fix and resubmit, then return to `applied`.

### Stage 7 — Print (`printed`)
When approved, download/print the licence or collect it from the NMCN office named on the portal. Add printing/collection costs to `otherCosts`.

### Stage 8 — Deliver (`out_for_delivery` → `delivered`)
1. Collect any balance (`charged − received`) before or on delivery.
2. Record `deliveryMethod`, `courier`, `trackingNo`, and delivery cost into `otherCosts`.
3. When the nurse confirms receipt, set `delivered` and `deliveredAt`.

## Money

- **Collected** = `received` (what the nurse has actually paid us).
- **Cost** = `nmcnFee` (official, paid to NMCN) + `otherCosts` (printing, delivery, data, transport).
- **Profit** = `received − nmcnFee − otherCosts`. The dashboard calculates this; never store a profit field.
- **Still owed** = `charged − received`.

## When you finish any piece of work

Report back in this shape, then update the record:
```
Nurse: <name> (<ref>)
Stage: <old status> → <new status>
Done: <one line>
Money: collected ₦x · NMCN ₦y · other ₦z
Next: <what happens next and who does it>
```
