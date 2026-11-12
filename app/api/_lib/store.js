import { put, get, list, del } from "@vercel/blob";
import crypto from "node:crypto";

const ACCESS = "private";
const PREFIX = "applications/";
export const ID_RE = /^[A-Za-z0-9_-]{4,64}$/;

async function readJson(pathname) {
  const r = await get(pathname, { access: ACCESS, useCache: false });
  if (!r || r.statusCode !== 200 || !r.stream) return null;
  const text = await new Response(r.stream).text();
  try { return JSON.parse(text); } catch { return null; }
}
async function writeJson(pathname, data) {
  await put(pathname, JSON.stringify(data), {
    access: ACCESS, addRandomSuffix: false, allowOverwrite: true,
    contentType: "application/json", cacheControlMaxAge: 60
  });
}

export async function listRecords() {
  const paths = [];
  let cursor;
  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor });
    for (const b of page.blobs) if (b.pathname.endsWith(".json")) paths.push(b.pathname);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  const out = [];
  for (let i = 0; i < paths.length; i += 25) {
    const chunk = await Promise.all(paths.slice(i, i + 25).map(async (p) => {
      const d = await readJson(p);
      return d ? { ...d, id: p.slice(PREFIX.length, -5) } : null;
    }));
    out.push(...chunk.filter(Boolean));
  }
  return out;
}
export async function getRecord(id) {
  const d = await readJson(PREFIX + id + ".json");
  return d ? { ...d, id } : null;
}
export async function saveRecord(id, data) {
  const body = { ...data };
  delete body.id;
  await writeJson(PREFIX + id + ".json", body);
  return { ...body, id };
}
export async function deleteRecord(id) {
  await del(PREFIX + id + ".json");
}
export function newId() {
  return crypto.randomBytes(9).toString("base64url").replace(/[^A-Za-z0-9]/g, "x");
}
export function newRef() {
  const d = new Date();
  const ymd = String(d.getUTCFullYear()).slice(2) + String(d.getUTCMonth() + 1).padStart(2, "0") + String(d.getUTCDate()).padStart(2, "0");
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase().slice(0, 4);
  return `NC-${ymd}-${rand}`;
}

export async function getConfig() {
  return (await readJson("config/prices.json")) || {};
}
export async function saveConfig(data) {
  await writeJson("config/prices.json", data);
  return data;
}
