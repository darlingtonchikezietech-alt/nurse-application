import { whoIs } from "../_lib/auth.js";
import { getRecord, saveRecord, ID_RE } from "../_lib/store.js";
import { setSecret, getSecret, clearSecret } from "../_lib/secrets.js";

// Operator-only: agents (API key) are refused even with a valid key.
export default async function handler(req, res) {
  let who = null;
  try { who = whoIs(req); } catch (e) { return res.status(500).json({ error: "Server is not configured: " + e.message }); }
  if (!who) return res.status(401).json({ error: "Not signed in" });
  if (who !== "dashboard") return res.status(403).json({ error: "Portal passwords are only available to the signed-in operator, never to agents" });
  const id = String((req.query || {}).id || "");
  if (!ID_RE.test(id)) return res.status(400).json({ error: "Bad record id" });
  try {
    const rec = await getRecord(id);
    if (!rec) return res.status(404).json({ error: "Not found" });
    if (req.method === "GET") {
      const s = await getSecret(id);
      return res.status(200).json(s ? { password: s.password, setAt: s.setAt } : { password: null });
    }
    if (req.method === "PUT") {
      const pw = String((req.body || {}).password || "");
      if (!pw || pw.length > 200) return res.status(400).json({ error: "Password must be 1–200 characters" });
      const setAt = await setSecret(id, pw);
      await saveRecord(id, { ...rec, hasPortalPassword: true, portalPasswordSetAt: setAt });
      return res.status(200).json({ ok: true, setAt });
    }
    if (req.method === "DELETE") {
      await clearSecret(id);
      await saveRecord(id, { ...rec, hasPortalPassword: false, portalPasswordSetAt: null });
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: "Use GET, PUT or DELETE" });
  } catch (e) {
    res.status(500).json({ error: "Storage error: " + e.message });
  }
}
