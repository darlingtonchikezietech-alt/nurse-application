export const STATUSES = ["intake","awaiting_docs","docs_ready","profile_done","applied","nmcn_paid","approved","printed","out_for_delivery","delivered","query","on_hold","cancelled"];
export const TYPES = ["renewal","new","change_of_name"];
const NUMS = ["yearsDefaulted","charged","received","nmcnFee","otherCosts"];
const FORBIDDEN = ["password","pass","pwd","otp","bvn","pin","cardNumber","cvv","profit"];

/** Cleans a record body. Returns {data} or {error}. */
export function clean(input, { partial = false } = {}) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { error: "Body must be a JSON object" };
  const data = {};
  for (const [k, v] of Object.entries(input)) {
    if (k === "id") continue;
    if (FORBIDDEN.some((f) => k.toLowerCase().includes(f.toLowerCase()))) return { error: `Field "${k}" is not allowed (no passwords, OTPs, bank details or stored profit)` };
    if (!/^[A-Za-z][A-Za-z0-9_]{0,40}$/.test(k)) return { error: `Bad field name "${k}"` };
    data[k] = v;
  }
  for (const k of NUMS) {
    if (k in data && data[k] !== null && data[k] !== "") {
      const n = Number(data[k]);
      if (!Number.isFinite(n)) return { error: `"${k}" must be a number` };
      data[k] = n;
    }
  }
  if (!partial || "status" in data) if (!STATUSES.includes(data.status)) return { error: `status must be one of: ${STATUSES.join(", ")}` };
  if (!partial || "requestType" in data) if (!TYPES.includes(data.requestType)) return { error: `requestType must be one of: ${TYPES.join(", ")}` };
  if (!partial && !String(data.fullName || "").trim()) return { error: "fullName is required" };
  if ("history" in data && !Array.isArray(data.history)) return { error: "history must be an array" };
  if (JSON.stringify(data).length > 200000) return { error: "Record too large" };
  return { data };
}
