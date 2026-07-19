/* =========================================================
   AURIS — shared app utilities
   Self-contained icon set (no external icon CDN), nav behavior,
   toast notifications, and a promise-based confirm modal.
   ========================================================= */

/* ---- icon set (24x24, stroke-based) ---------------------- */
const ICONS = {
  menu: '<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>',
  close: '<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>',
  chat: '<path d="M4 4.5h16a1 1 0 0 1 1 1V15a1 1 0 0 1-1 1H9l-4.4 3.3a.6.6 0 0 1-1-.5V16H4a1 1 0 0 1-1-1V5.5a1 1 0 0 1 1-1z"/>',
  download: '<path d="M12 3v12.5"/><path d="M6.5 11L12 16.5 17.5 11"/><path d="M4.5 20h15"/>',
  key: '<circle cx="7.5" cy="15.5" r="3.6"/><path d="M10 13L19.5 3.5"/><path d="M15.5 7l2.7 2.7"/><path d="M12.7 9.8l2.2 2.2"/>',
  users: '<circle cx="8.5" cy="8" r="3"/><path d="M2.5 19.5c0-3.6 2.7-6 6-6s6 2.4 6 6"/><circle cx="16.5" cy="9" r="2.3"/><path d="M15 12.2c2.4.4 4 2.4 4 5.3"/>',
  shield: '<path d="M12 3.2l7 2.8v5.6c0 5-3 8.6-7 9.7-4-1.1-7-4.7-7-9.7V6l7-2.8z"/>',
  zap: '<path d="M13 2.5L4.5 14h5.8l-1 7.5 8.7-12.6h-6l1-6.4z"/>',
  code: '<path d="M8.5 6.5L2.7 12l5.8 5.5"/><path d="M15.5 6.5l5.8 5.5-5.8 5.5"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 2-1.8 0-.5-.2-1-.6-1.5-.4-.5-.6-1-.6-1.6 0-1.2 1-2.1 2.2-2.1H17a4 4 0 0 0 4-4c0-4.4-4-7-9-7z"/><circle cx="7.2" cy="10.8" r="1.15"/><circle cx="10.6" cy="7.2" r="1.15"/><circle cx="14.8" cy="8.2" r="1.15"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="M7.7 12.5l2.6 2.6L16.5 9"/>',
  alert: '<path d="M12 3L22.5 21h-21z"/><line x1="12" y1="9.5" x2="12" y2="14.2"/><circle cx="12" cy="17.3" r="0.15" fill="currentColor" stroke="none"/>',
  copy: '<rect x="9.5" y="9.5" width="11" height="11" rx="2"/><path d="M5.5 14.5v-9a2 2 0 0 1 2-2h9"/>',
  refresh: '<path d="M4 4.5v5.5h5.5"/><path d="M20 19.5V14H14.5"/><path d="M19 9.5A7.5 7.5 0 0 0 6.3 6.3L4 9.5"/><path d="M5 14.5a7.5 7.5 0 0 0 12.7 3.2L20 14.5"/>',
  ban: '<circle cx="12" cy="12" r="9"/><line x1="5.8" y1="5.8" x2="18.2" y2="18.2"/>',
  trash: '<path d="M4.5 7h15"/><path d="M9.5 7V4.3h5V7"/><path d="M6.5 7L7.4 20h9.2L17.5 7"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><line x1="20.5" y1="20.5" x2="15.8" y2="15.8"/>',
  logout: '<path d="M9.5 20.5H5.8a1.8 1.8 0 0 1-1.8-1.8V5.3a1.8 1.8 0 0 1 1.8-1.8H9.5"/><path d="M15.5 16.5l5-4.5-5-4.5"/><path d="M20.2 12H9.5"/>',
  user: '<circle cx="12" cy="8.3" r="3.8"/><path d="M4.2 20.5c0-4.2 3.5-6.8 7.8-6.8s7.8 2.6 7.8 6.8"/>',
  lock: '<rect x="5.3" y="11" width="13.4" height="9" rx="2"/><path d="M8 11V7.3a4 4 0 0 1 8 0V11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7.2V12l3.2 2.3"/>',
  chevrondown: '<path d="M5.5 9l6.5 6.5L18.5 9"/>',
  send: '<path d="M20.5 3.5L10 13.6"/><path d="M20.5 3.5L14 20.5l-4-6.9-6.9-4z"/>',
};

function renderIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach((el) => {
    const name = el.getAttribute("data-icon");
    const body = ICONS[name];
    if (!body) return;
    el.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      body +
      "</svg>";
  });
}

/* ---- nav: scroll state, active link, mobile drawer -------- */
function initNav() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    if (!navbar) return;
    navbar.classList.toggle("is-scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const here = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-links a, .mobile-panel nav a").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === here || (here === "" && href === "index.html")) a.classList.add("active");
  });

  const toggle = document.getElementById("navToggle");
  const panel = document.getElementById("mobilePanel");
  const scrim = document.getElementById("scrim");
  const closeBtn = document.getElementById("mobileClose");
  const open = () => { panel?.classList.add("is-open"); scrim?.classList.add("is-open"); };
  const close = () => { panel?.classList.remove("is-open"); scrim?.classList.remove("is-open"); };
  toggle?.addEventListener("click", open);
  closeBtn?.addEventListener("click", close);
  scrim?.addEventListener("click", close);
  panel?.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---- toast ------------------------------------------------ */
function ensureToastStack() {
  let stack = document.querySelector(".toast-stack");
  if (!stack) {
    stack = document.createElement("div");
    stack.className = "toast-stack";
    document.body.appendChild(stack);
  }
  return stack;
}

function showToast(message, type) {
  const stack = ensureToastStack();
  const el = document.createElement("div");
  el.className = "toast" + (type === "error" ? " error" : "");
  el.textContent = message;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.opacity = "0";
    el.style.transition = "opacity .25s ease";
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

/* ---- confirm modal (promise-based) ------------------------- */
function confirmAction(message, confirmLabel) {
  return new Promise((resolve) => {
    const scrim = document.createElement("div");
    scrim.className = "modal-scrim";
    scrim.innerHTML =
      '<div class="card modal-box">' +
      "<p>" + message + "</p>" +
      '<div class="modal-actions">' +
      '<button class="btn btn-ghost" data-act="cancel">Cancel</button>' +
      '<button class="btn btn-danger" data-act="ok">' + (confirmLabel || "Confirm") + "</button>" +
      "</div></div>";
    document.body.appendChild(scrim);
    scrim.addEventListener("click", (e) => {
      const act = e.target.closest("[data-act]")?.getAttribute("data-act");
      if (e.target === scrim || act === "cancel") { scrim.remove(); resolve(false); }
      if (act === "ok") { scrim.remove(); resolve(true); }
    });
  });
}

/* ---- misc --------------------------------------------------- */
function fillYear() {
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}

function formatCountdown(ms) {
  if (ms <= 0) return "expired";
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return [h, m, sec].map((v) => String(v).padStart(2, "0")).join(":");
}

document.addEventListener("DOMContentLoaded", () => {
  renderIcons(document);
  initNav();
  fillYear();
});
