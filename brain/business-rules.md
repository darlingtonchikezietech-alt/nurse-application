# Business rules

The decisions that define how we run the service. Agents follow these; the owner edits them.

## What we offer

| Service | `requestType` | Notes |
|---|---|---|
| Licence renewal | `renewal` | Most common. Licence is renewed every 3 years. |
| New licence (first licensing after registration) | `new` | |
| Change of name | `change_of_name` | Usually after marriage; needs marriage certificate or affidavit. |

## Money

- Two figures matter per nurse: **what we collect from the nurse** (`received`) and **what we pay NMCN** (`nmcnFee`). Other running costs per card (printing, delivery, data, transport) go in `otherCosts`.
- Profit per nurse = `received − nmcnFee − otherCosts`.
- Our prices live in the dashboard under **Fees & prices** (`config/prices`). Quote from there.
- **Pay-before-we-pay rule:** don't pay NMCN for a nurse until they've paid us at least the NMCN fee. Full balance due before or on delivery. _(Owner: change this if you extend credit.)_
- Refunds: if NMCN rejects and the fee is lost, decide case by case; record the outcome in `notes`.

## Official NMCN fees (verify every time)

Last seen figures, from NMCN's renewal page: renewal ₦13,125, plus ₦6,562 penalty for each year of default, paid through Remita on the renewal portal. These change; the amount on the Remita screen wins. Update `config/prices` and this file when they change.

**Years in default** = whole years between the licence expiry date and today. Expired 31 Mar 2024, renewing Nov 2026 → 2 years.

## What we never do

- Store or handle nurses' passwords, OTPs, BVN or bank details.
- Pay or submit on the portal without the operator's approval in the moment.
- Generate a Remita RRR outside the portal for a renewal.
- Share a nurse's documents outside this process.

## Service levels (targets)

- Reply to a new enquiry the same day.
- Submit within 1 working day of `docs_ready`.
- Chase NMCN status every 2–3 working days.
- Deliver within 2 working days of `printed`.
