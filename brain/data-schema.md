# Card Desk data schema

Artifact slug `54b15c09-4cf4-4886-b941-4eaab53750e5`. Collection `applications`, one document per nurse request. The dashboard page (`dashboard/index.html`) uses exactly these keys; change both together.

## Status keys

Pipeline, in order: `intake`, `awaiting_docs`, `docs_ready`, `profile_done`, `applied`, `nmcn_paid`, `approved`, `printed`, `out_for_delivery`, `delivered`.
Side states: `query`, `on_hold`, `cancelled` (cancelled records are excluded from money totals).

## Request types

`renewal`, `new`, `change_of_name`.

## Fields

| Key | Type | Meaning |
|---|---|---|
| `ref` | string | Our reference, `NC-YYMMDD-XXXX` |
| `requestType` | string | See above |
| `status` | string | See above |
| `fullName` | string | As on NMCN record |
| `phone`, `whatsapp`, `email` | string | |
| `gender` | `Female` \| `Male` | |
| `dob` | `YYYY-MM-DD` | |
| `stateOfOrigin`, `residenceState`, `workplace` | string | |
| `category` | `RN` \| `RM` \| `RN/RM` \| `RPHN` \| `RPN` \| `Other` | Cadre |
| `registrationNo` | string | NMCN registration no. |
| `licenceNo` | string | Current licence no. |
| `licenceExpiry` | `YYYY-MM-DD` | |
| `yearsDefaulted` | number | Whole years expired |
| `newName` | string | Change of name only |
| `docs` | object of booleans | Keys: `passport`, `oldLicence`, `certificate`, `idCard`, `cpd`, `marriageCert`, `signature` |
| `portalUsername` | string | Never a password |
| `nmcnAppId` | string | Portal application/tracking ID |
| `rrr` | string | Remita Retrieval Reference |
| `nmcnPaidOn` | `YYYY-MM-DD` | |
| `charged` | number ₦ | Agreed price to nurse |
| `received` | number ₦ | Collected from nurse so far |
| `nmcnFee` | number ₦ | Actually paid to NMCN (incl. penalty, Remita charge) |
| `otherCosts` | number ₦ | Printing, delivery, data, transport |
| `deliveryMethod` | string | `Hand delivery`, `Courier / dispatch`, `Client pick-up`, `NMCN state office pick-up` |
| `courier`, `deliveryAddress`, `trackingNo` | string | |
| `deliveredAt` | `YYYY-MM-DD` | |
| `notes` | string | Free text: NMCN queries, client requests |
| `history` | array | `{status, at (ISO), by, note?}`, appended on every status change |
| `createdAt`, `updatedAt` | ISO string | |
| `updatedBy` | string | `dashboard` or `agent:<name>` |
| `source` | `dashboard` \| `agent` | Who created it |

Derived on the page, never stored: profit (`received − nmcnFee − otherCosts`), balance owed (`charged − received`).

## `config/prices`

`renewalFee`, `penaltyPerYear`, `newLicenceFee`, `changeOfNameFee` (official NMCN, ₦); `priceRenewal`, `priceNew`, `priceChange` (our prices, ₦); `otherCosts` (typical per card); `updatedAt`, `updatedBy`.
