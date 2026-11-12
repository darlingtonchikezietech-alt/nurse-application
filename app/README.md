# NMCN Card Desk (Vercel app)

Static dashboard (`index.html`) + Vercel Functions (`api/`) + private Vercel Blob storage.
Vercel project: `nmcn-card-desk` (team darton-tech), root directory `app`.

## Environment variables (set in Vercel)
| Key | Purpose |
|---|---|
| `BLOB_READ_WRITE_TOKEN` | Added automatically by the connected Blob store `nmcn-card-desk-data` |
| `ADMIN_PASSWORD` | Dashboard sign-in password |
| `SESSION_SECRET` | Signs the login cookie (change it to sign everyone out) |
| `AGENT_API_KEY` | Bearer key for AI agents |

## API (all require sign-in cookie or `Authorization: Bearer $AGENT_API_KEY`)
| Method | Path | Does |
|---|---|---|
| GET | `/api/records?status=&ref=&q=` | List records (newest first) |
| POST | `/api/records` | Create (`fullName`, `status`, `requestType` required) |
| GET | `/api/records/:id` | One record |
| PATCH | `/api/records/:id` | Merge fields; add `"note"` to annotate a status change |
| PUT | `/api/records/:id` | Replace whole record |
| DELETE | `/api/records/:id` | Delete |
| GET/PUT | `/api/config` | Fees & prices |

Agents should send `X-Agent-Name: <name>` so changes are attributed. Fields named like passwords, OTPs, BVN, card numbers, or `profit` are rejected.
