import crypto from "node:crypto";

const COOKIE = "nmcn_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is not set");
  return s;
}
function sign(value) {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}
export function safeEqual(a, b) {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}
function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  for (const part of raw.split(/;\s*/)) {
    const i = part.indexOf("=");
    if (i > 0 && part.slice(0, i) === name) return decodeURIComponent(part.slice(i + 1));
  }
  return null;
}

/** Returns "dashboard" for a logged-in person, "agent:<name>" for an API key, or null. */
export function whoIs(req) {
  const auth = req.headers.authorization || "";
  const key = process.env.AGENT_API_KEY;
  if (key && auth.startsWith("Bearer ") && safeEqual(auth.slice(7), key)) {
    const name = String(req.headers["x-agent-name"] || "agent").replace(/[^\w.-]/g, "").slice(0, 40) || "agent";
    return "agent:" + name;
  }
  const c = readCookie(req, COOKIE);
  if (!c) return null;
  const [exp, sig] = c.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return null;
  if (Number(exp) < Date.now() / 1000) return null;
  return "dashboard";
}

export function requireAuth(req, res) {
  let who = null;
  try { who = whoIs(req); } catch (e) { res.status(500).json({ error: "Server is not configured: " + e.message }); return null; }
  if (!who) { res.status(401).json({ error: "Not signed in" }); return null; }
  return who;
}

export function setSession(res) {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  res.setHeader("Set-Cookie", `${COOKIE}=${exp}.${sign(exp)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${MAX_AGE}`);
}
export function clearSession(res) {
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`);
}
