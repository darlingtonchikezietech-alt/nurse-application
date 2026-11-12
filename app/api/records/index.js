import { requireAuth } from "../_lib/auth.js";
import { listRecords, saveRecord, newId, newRef } from "../_lib/store.js";
import { clean } from "../_lib/validate.js";

export default async function handler(req, res) {
  const who = requireAuth(req, res);
  if (!who) return;
  try {
    if (req.method === "GET") {
      let rows = await listRecords();
      const { status, ref, q } = req.query || {};
      if (status) rows = rows.filter((r) => r.status === status);
      if (ref) rows = rows.filter((r) => r.ref === ref);
      if (q) { const s = String(q).toLowerCase(); rows = rows.filter((r) => [r.ref, r.fullName, r.phone, r.registrationNo, r.rrr].join(" ").toLowerCase().includes(s)); }
      rows.sort((a, b) => String(b.updatedAt || "").localeCompare(String(a.updatedAt || "")));
      return res.status(200).json({ records: rows });
    }
    if (req.method === "POST") {
      const { data, error } = clean(req.body);
      if (error) return res.status(400).json({ error });
      const now = new Date().toISOString();
      data.ref = data.ref || newRef();
      data.createdAt = now; data.updatedAt = now; data.updatedBy = who;
      data.source = who.startsWith("agent:") ? "agent" : "dashboard";
      data.history = Array.isArray(data.history) && data.history.length ? data.history : [{ status: data.status, at: now, by: who }];
      const saved = await saveRecord(newId(), data);
      return res.status(201).json(saved);
    }
    res.status(405).json({ error: "Use GET or POST" });
  } catch (e) {
    res.status(500).json({ error: "Storage error: " + e.message });
  }
}
