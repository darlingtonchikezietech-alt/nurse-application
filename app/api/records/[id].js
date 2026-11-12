import { requireAuth } from "../_lib/auth.js";
import { getRecord, saveRecord, deleteRecord, ID_RE } from "../_lib/store.js";
import { clean } from "../_lib/validate.js";
import { clearSecret } from "../_lib/secrets.js";
const CLEAR_ON = ["delivered", "cancelled"];

export default async function handler(req, res) {
  const who = requireAuth(req, res);
  if (!who) return;
  const id = String((req.query || {}).id || "");
  if (!ID_RE.test(id)) return res.status(400).json({ error: "Bad record id" });
  try {
    const existing = await getRecord(id);
    if (req.method === "GET") return existing ? res.status(200).json(existing) : res.status(404).json({ error: "Not found" });
    if (req.method === "DELETE") { await clearSecret(id); await deleteRecord(id); return res.status(200).json({ ok: true }); }
    if (req.method === "PUT" || req.method === "PATCH") {
      if (!existing) return res.status(404).json({ error: "Not found" });
      const partial = req.method === "PATCH";
      const { data, error } = clean(req.body, { partial });
      if (error) return res.status(400).json({ error });
      const now = new Date().toISOString();
      const merged = partial ? { ...existing, ...data, docs: { ...(existing.docs || {}), ...(data.docs || {}) } } : { ...data };
      merged.ref = existing.ref; merged.createdAt = existing.createdAt; merged.source = existing.source;
merged.hasPortalPassword = !!existing.hasPortalPassword; merged.portalPasswordSetAt = existing.portalPasswordSetAt || null;
      const history = Array.isArray(merged.history) ? merged.history : (existing.history || []);
      if (merged.status !== existing.status && !(history.length && history[history.length - 1].status === merged.status)) {
        history.push({ status: merged.status, at: now, by: who, ...(req.body.note ? { note: String(req.body.note).slice(0, 500) } : {}) });
      }
      if (CLEAR_ON.includes(merged.status) && existing.hasPortalPassword) {
        await clearSecret(id); merged.hasPortalPassword = false; merged.portalPasswordSetAt = null;
        history.push({ status: merged.status, at: now, by: "system", note: "Temporary portal password cleared" });
      }
      merged.history = history; merged.updatedAt = now; merged.updatedBy = who;
      delete merged.note;
      return res.status(200).json(await saveRecord(id, merged));
    }
    res.status(405).json({ error: "Use GET, PUT, PATCH or DELETE" });
  } catch (e) {
    res.status(500).json({ error: "Storage error: " + e.message });
  }
}
