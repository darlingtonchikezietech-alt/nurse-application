import { requireAuth } from "./_lib/auth.js";
import { getConfig, saveConfig } from "./_lib/store.js";

const KEYS = ["renewalFee","penaltyPerYear","newLicenceFee","changeOfNameFee","priceRenewal","priceNew","priceChange","otherCosts"];

export default async function handler(req, res) {
  const who = requireAuth(req, res);
  if (!who) return;
  try {
    if (req.method === "GET") return res.status(200).json(await getConfig());
    if (req.method === "PUT") {
      const current = await getConfig();
      const body = {};
      for (const k of KEYS) {
        const given = (req.body || {})[k];
        const n = Number(given === undefined ? current[k] : given);
        body[k] = Number.isFinite(n) ? n : 0;
      }
      body.updatedAt = new Date().toISOString(); body.updatedBy = who;
      return res.status(200).json(await saveConfig(body));
    }
    res.status(405).json({ error: "Use GET or PUT" });
  } catch (e) {
    res.status(500).json({ error: "Storage error: " + e.message });
  }
}
