# Intake: talking to the nurse

## Details to collect (all request types)

| Field (dashboard key) | Notes |
|---|---|
| `fullName` | Exactly as on the NMCN register/certificate. Ask for surname first to avoid mix-ups. |
| `phone`, `whatsapp` | Nigerian format, e.g. 0803 123 4567. |
| `email` | Must be one the nurse can open: the portal sends verification mail there. |
| `gender`, `dob` | Required by the portal profile. |
| `stateOfOrigin`, `residenceState` | |
| `workplace` | Hospital / employer. |
| `category` | RN, RM, RN/RM, RPHN, RPN, Other. |
| `registrationNo` | NMCN registration number (on certificate). |
| `licenceNo`, `licenceExpiry` | Renewals: from the current licence card. |
| `newName` | Change of name only. |
| `deliveryAddress` | Full address with nearest landmark. |

## Documents by request type

Tick these in the record's `docs` object.

| Document (`docs` key) | Renewal | New licence | Change of name |
|---|---|---|---|
| Recent passport photo (`passport`) | ✔ | ✔ | ✔ |
| Old licence / card (`oldLicence`) | ✔ | | ✔ |
| Registration certificate (`certificate`) | if no old licence | ✔ | ✔ |
| Valid ID, e.g. NIN slip (`idCard`) | ✔ | ✔ | ✔ |
| CPD / MCPDP evidence (`cpd`) | ✔ (diaspora: WCEA credits) | | |
| Marriage certificate or sworn affidavit + newspaper publication (`marriageCert`) | | | ✔ |
| Signature specimen (`signature`) | ✔ | ✔ | ✔ |

Requirements change; check the portal's current list during Stage 3 and update this table and `brain/portal-notes.md` if it differs.

Photo checks: recent, white/plain background, face fully visible, no filters, JPG under the portal's size limit (note the limit in `brain/portal-notes.md` once seen).

## Message templates (WhatsApp)

**First reply**
> Good day {first name}. Thank you for reaching out about your NMCN licence {renewal/application}. To get started please send: your full name as on your NMCN certificate, registration number, licence number and expiry date, email address, and delivery address. Our fee is ₦{charged}, which covers the official NMCN fee and our processing and delivery.

**Document request**
> Please send clear photos/scans of: {list for request type}. Passport photo should be recent with a white background.

**Payment received**
> Received ₦{amount}, thank you. Balance: ₦{charged − received}. Your reference is {ref}.

**Submitted**
> Your application has been submitted to NMCN and the official fee paid (RRR {rrr}). Approval usually takes some days; we'll update you.

**Query from NMCN**
> NMCN has asked for {reason}. Please send {item} so we can resubmit.

**Out for delivery**
> Your licence is on its way with {courier} ({trackingNo}). Please have the balance of ₦{due} ready, if any.
