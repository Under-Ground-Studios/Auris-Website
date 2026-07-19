/* =========================================================
   AURIS — demo account layer
   IMPORTANT: this stores accounts, keys, and sessions in the
   visitor's own browser (localStorage). It's here so every
   panel is genuinely clickable and testable end to end, but
   it is NOT a real backend: anyone with devtools can read or
   edit this data. Before you launch for real, swap this file
   for calls to an actual server that hashes passwords properly
   (bcrypt/argon2) and issues secure sessions.
   ========================================================= */

const DB_USERS = "auris_users";
const DB_SESSION = "auris_session";
const HWID_COOLDOWN_MS = 24 * 60 * 60 * 1000;

function auHash(str) {
  // Non-cryptographic obfuscation ONLY, so raw passwords aren't
  // sitting in localStorage in plain text. Do not treat this as
  // real password security.
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return h.toString(16);
}

function auGenId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function genHwid() {
  const chars = "ABCDEF0123456789";
  let out = "";
  for (let i = 0; i < 32; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
    if ((i + 1) % 8 === 0 && i < 31) out += "-";
  }
  return out;
}

function getUsers() {
  try { return JSON.parse(localStorage.getItem(DB_USERS)) || []; } catch { return []; }
}
function saveUsers(users) { localStorage.setItem(DB_USERS, JSON.stringify(users)); }

function seedDemoData() {
  if (getUsers().length) return;
  const now = Date.now();
  saveUsers([
    {
      id: auGenId(), username: "admin", passwordHash: auHash("admin123"), role: "admin",
      hwid: genHwid(), createdAt: now - 86400000 * 40, lastHwidReset: 0, banned: false,
      keyValue: null, keyCreatedAt: null, keyExpiresAt: null,
    },
    {
      id: auGenId(), username: "shadowplayer", passwordHash: auHash("demo1234"), role: "user",
      hwid: genHwid(), createdAt: now - 86400000 * 11, lastHwidReset: 0, banned: false,
      keyValue: "AURIS-7F2K-91ZQ-M0XR", keyCreatedAt: now - 3600000 * 4, keyExpiresAt: now + 3600000 * 20,
    },
    {
      id: auGenId(), username: "nightowl", passwordHash: auHash("demo1234"), role: "user",
      hwid: genHwid(), createdAt: now - 86400000 * 2, lastHwidReset: 0, banned: false,
      keyValue: "AURIS-3D8B-77TT-QQ1L", keyCreatedAt: now - 86400000 * 2, keyExpiresAt: now - 3600000 * 3,
    },
  ]);
}

function registerUser(username, password) {
  username = username.trim();
  if (username.length < 3) return { ok: false, error: "Username needs at least 3 characters." };
  if (password.length < 4) return { ok: false, error: "Password needs at least 4 characters." };
  const users = getUsers();
  if (users.some((u) => u.username.toLowerCase() === username.toLowerCase())) {
    return { ok: false, error: "That username is already taken." };
  }
  const user = {
    id: auGenId(), username, passwordHash: auHash(password), role: "user",
    hwid: genHwid(), createdAt: Date.now(), lastHwidReset: 0, banned: false,
    keyValue: null, keyCreatedAt: null, keyExpiresAt: null,
  };
  users.push(user);
  saveUsers(users);
  localStorage.setItem(DB_SESSION, user.id);
  return { ok: true, user };
}

function loginUser(username, password) {
  const users = getUsers();
  const user = users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
  if (!user) return { ok: false, error: "No account with that username." };
  if (user.banned) return { ok: false, error: "This account has been banned." };
  if (user.passwordHash !== auHash(password)) return { ok: false, error: "Incorrect password." };
  localStorage.setItem(DB_SESSION, user.id);
  return { ok: true, user };
}

function getCurrentUser() {
  const id = localStorage.getItem(DB_SESSION);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
}

function logoutUser() { localStorage.removeItem(DB_SESSION); }

function updateUser(id, changes) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return null;
  users[idx] = { ...users[idx], ...changes };
  saveUsers(users);
  return users[idx];
}

function deleteUserById(id) {
  saveUsers(getUsers().filter((u) => u.id !== id));
  if (localStorage.getItem(DB_SESSION) === id) logoutUser();
}

seedDemoData();
