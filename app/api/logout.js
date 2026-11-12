import { clearSession } from "./_lib/auth.js";
export default function handler(req, res) {
  clearSession(res);
  res.status(200).json({ ok: true });
}
