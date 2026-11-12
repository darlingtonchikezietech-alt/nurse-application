import { requireAuth } from "./_lib/auth.js";
export default function handler(req, res) {
  const who = requireAuth(req, res);
  if (!who) return;
  res.status(200).json({ who });
}
