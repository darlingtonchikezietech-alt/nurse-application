import crypto from "node:crypto";
import { put, get, del } from "@vercel/blob";

// Temporary NMCN portal passwords for nurses, encrypted at rest (AES-256-GCM).
// Stored apart from records so they never appear in record JSON or the agent API.
function key() {
  const k = process.env.PORTAL_SECRET_KEY || "";
  const buf = Buffer.from(k, "base64");
  if (buf.length !== 32) throw new Error("PORTAL_SECRET_KEY must be 32 bytes, base64");
  return buf;
}
const path = (id) => "secrets/" + id + ".json";

export function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const data = Buffer.concat([c.update(String(text), "utf8"), c.final()]);
  return { iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") };
}
export function decrypt(box) {
  const d = crypto.createDecipheriv("aes-256-gcm", key(), Buffer.from(box.iv, "base64"));
  d.setAuthTag(Buffer.from(box.tag, "base64"));
  return Buffer.concat([d.update(Buffer.from(box.data, "base64")), d.final()]).toString("utf8");
}
export async function setSecret(id, password) {
  const body = { ...encrypt(password), setAt: new Date().toISOString() };
  await put(path(id), JSON.stringify(body), { access: "private", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json", cacheControlMaxAge: 60 });
  return body.setAt;
}
export async function getSecret(id) {
  const r = await get(path(id), { access: "private", useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const box = JSON.parse(await new Response(r.stream).text());
  return { password: decrypt(box), setAt: box.setAt };
}
export async function clearSecret(id) {
  try { await del(path(id)); } catch {}
}
