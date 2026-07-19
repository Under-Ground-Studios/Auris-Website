/* =========================================================
   AURIS — key system logic
   Generates a temporary key (24h) either against the logged-in
   account or, for visitors browsing without an account, a guest
   slot in localStorage. All generated keys are also appended to
   a shared log so the "verify a key" box can check any of them.

   Where to wire up your real ad-locker / verification link:
   see the REAL_VERIFICATION_URL constant below.
   ========================================================= */

const REAL_VERIFICATION_URL = null; // e.g. "https://yourlinkservice.com/xyz" — set this to skip the demo timer and send people to your real ad-locker step instead.

const KEY_LOG = "auris_key_log";
const GUEST_KEY = "auris_guest_key";
const KEY_DURATION_MS = 24 * 60 * 60 * 1000;

function genKeyString() {
  const seg = () => Math.random().toString(36).slice(2, 6).toUpperCase().padEnd(4, "X");
  return `AURIS-${seg()}-${seg()}-${seg()}`;
}

function getKeyLog() {
  try { return JSON.parse(localStorage.getItem(KEY_LOG)) || []; } catch { return []; }
}
function logKey(key) {
  const log = getKeyLog();
  log.push(key);
  localStorage.setItem(KEY_LOG, JSON.stringify(log));
}

function generateKeyForCurrentContext() {
  const key = { value: genKeyString(), createdAt: Date.now(), expiresAt: Date.now() + KEY_DURATION_MS };
  logKey(key);
  const user = getCurrentUser();
  if (user) {
    updateUser(user.id, { keyValue: key.value, keyCreatedAt: key.createdAt, keyExpiresAt: key.expiresAt });
  } else {
    localStorage.setItem(GUEST_KEY, JSON.stringify(key));
  }
  return key;
}

function getActiveKeyForCurrentContext() {
  const user = getCurrentUser();
  if (user) {
    if (!user.keyValue) return null;
    return { value: user.keyValue, createdAt: user.keyCreatedAt, expiresAt: user.keyExpiresAt };
  }
  try { return JSON.parse(localStorage.getItem(GUEST_KEY)); } catch { return null; }
}

function isKeyValid(key) {
  return !!key && !!key.expiresAt && key.expiresAt > Date.now();
}

function verifyKeyString(value) {
  const clean = value.trim().toUpperCase();
  const match = getKeyLog().find((k) => k.value === clean);
  if (!match) return { valid: false, reason: "not_found" };
  if (match.expiresAt <= Date.now()) return { valid: false, reason: "expired" };
  return { valid: true, key: match };
}

function getKeyStats() {
  const log = getKeyLog();
  const now = Date.now();
  return {
    totalGenerated: log.length,
    active: log.filter((k) => k.expiresAt > now).length,
  };
}
