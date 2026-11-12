import { safeEqual, setSession } from "./_lib/auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Use POST" });
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw || !process.env.SESSION_SECRET) return res.status(500).json({ error: "Login is not configured on the server" });
  const given = (req.body && req.body.password) || "";
  if (!safeEqual(given, pw)) {
    await new Promise((r) => setTimeout(r, 800));
    return res.status(401).json({ error: "Wrong password" });
  }
  setSession(res);
  res.status(200).json({ ok: true });
}
