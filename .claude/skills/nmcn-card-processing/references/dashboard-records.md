# Reading and writing Card Desk records

The dashboard is a Claude artifact with a shared database.

- **Dashboard:** https://claude.ai/artifact/BTaV3G2rgRofPiDubX6HMv
- **Artifact slug:** `54b15c09-4cf4-4886-b941-4eaab53750e5`
- **Records:** collection `applications`, one document per nurse request
- **Prices:** document `config/prices` (only the owner/editors can change it)

Field definitions are in `brain/data-schema.md`. Agents with the claude-artifacts tools use `db_list`, `db_get`, `db_query` and `db_write` with the slug above. People use the dashboard page.

## Find a record

- By ref or name: `db_query` on `applications` with `where ref == "NC-..."`, or `db_list` and match `fullName` / `phone` / `registrationNo`.
- Always note the document's `version`; every write to an existing doc needs `ifVersion`.

## Create

```json
{"op":"set","path":"applications/<new-id>","data":{
  "ref":"NC-YYMMDD-XXXX",
  "fullName":"...","phone":"...","email":"...",
  "requestType":"renewal","category":"RN/RM",
  "registrationNo":"...","licenceNo":"...","licenceExpiry":"2025-03-31","yearsDefaulted":1,
  "status":"intake",
  "charged":30000,"received":0,"nmcnFee":null,"otherCosts":0,
  "docs":{},
  "history":[{"status":"intake","at":"<ISO time>","by":"agent:<your name>"}],
  "createdAt":"<ISO time>","updatedAt":"<ISO time>","updatedBy":"agent:<your name>","source":"agent"
}}
```
`<new-id>`: letters/digits only, e.g. the ref without dashes. `ref` format: `NC-` + date + `-` + 4 random capitals/digits.

## Update a stage

Use `update` with `ifVersion`. Arrays replace wholesale, so read `history`, append, and write the whole array:

```json
{"op":"update","path":"applications/<id>","ifVersion":7,"data":{
  "status":"nmcn_paid","rrr":"1234-5678-9012","nmcnFee":19824,"nmcnPaidOn":"2026-11-12",
  "history":[ ...existing..., {"status":"nmcn_paid","at":"<ISO>","by":"agent:<name>","note":"Paid via Remita"}],
  "updatedAt":"<ISO>","updatedBy":"agent:<name>"
}}
```

If the write is refused for a version conflict, re-read and redo. One `db_write` at a time.

## Never write

- Passwords, OTPs, card/bank details, BVN.
- A `profit` field (the dashboard computes it).
- Status keys outside the list in `brain/data-schema.md`.
