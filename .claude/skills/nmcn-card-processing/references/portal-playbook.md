# NMCN portal playbook (browser work)

For an agent driving a browser (Claude in Chrome, the Claude built-in browser, or computer use). The live site changes; treat this as a guide, read the screen, and record what you learn in `brain/portal-notes.md`.

## Known addresses (check they still work)

| Purpose | URL |
|---|---|
| Council main site | https://nmcn.gov.ng |
| Licence renewal / change of name portal | https://licence.nmcn.gov.ng |
| Professional Update Form (PUF) portal | https://portal.nmcn.gov.ng |
| Support / FAQ | https://licence.nmcn.gov.ng/Support |
| Our admin / agent dashboard on the NMCN platform | _Operator to fill in: URL of the admin login we use_ |

## Before you start

1. Open the nurse's record on the dashboard (or read it with `db_get`). Everything you type comes from the record. If a field is missing, stop and ask; don't guess.
2. Use a new browser tab. Don't reuse tabs for other nurses' accounts.
3. If you see a login page: **stop and ask the operator to sign in.** Never type passwords.
4. One nurse at a time. Sign out of a nurse's account before starting the next.

## Account and profile (→ `profile_done`)

1. Check whether the nurse already has a licence-portal account (ask them; or the portal's "forgot password" with their email will show).
2. If not: on the licence portal choose **Register**, fill the nurse's details from the record, use the nurse's own email. The verification email goes to the nurse; ask them to forward the code/link or click it.
3. Make sure the PUF/profile is complete and approved; renewal depends on it ("no PUF, no renewal").
4. Record `portalUsername`. Move the record to `profile_done` with a history note.

## Application (→ `applied`)

1. Signed in (operator signed in for you), choose the service: **Licence renewal**, **Change of name** or the first-licence route for new licences.
2. Fill each field from the record. Upload documents (passport photo, old licence, ID, etc.).
3. Before the final submit, take a screenshot or read back a summary to the operator: name, reg. no., licence no., service, amount shown. **Wait for "yes".**
4. Submit. Copy the application/tracking ID into `nmcnAppId`. Move to `applied`.

## Payment (→ `nmcn_paid`)

1. Payment goes through **Remita on the portal**. Generate the RRR from inside the portal; an RRR generated outside the portal can force a manual paper application (portal FAQ).
2. Read the exact amount (renewal + penalty for default years + Remita charge). Tell the operator the amount and RRR; **wait for "yes"** before paying.
3. After payment, confirm the portal shows it as paid. Record `rrr`, `nmcnFee` (total actually paid), `nmcnPaidOn`. Save the receipt.

## Status checks (→ `approved` / `query`)

- Check the application page every 2–3 working days.
- Approved: note where the licence is collected or how it is printed, set `approved`.
- Query/rejected: copy the exact reason into `notes`, set `query`, message the nurse (template in `intake.md`).

## Printing (→ `printed`)

- If the portal provides a printable licence: download, print on our card stock, add print cost to `otherCosts`.
- If collection is from an NMCN state/zonal office: note the office in `notes`, add transport to `otherCosts`.

## If something goes wrong

- Page error, portal down, or a step not described here: stop, take a screenshot, describe it to the operator, and add what you learn to `brain/portal-notes.md`.
- Two failed attempts at the same step: stop and ask. Don't loop.
- Never use another nurse's account or documents to "test" a step.
