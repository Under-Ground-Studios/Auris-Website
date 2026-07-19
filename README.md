# Auris website

A complete site for the Auris Roblox Lua script editor/execution client: landing page with a particle-reveal hero, an information page, a key system, a download page, and user + admin panels.

## Structure

```
auris-website/
├── index.html          Landing page (particle hero, features, how-it-works, Discord)
├── information.html     Feature detail, requirements, FAQ
├── keysystem.html       Generate + verify keys
├── download.html        Download button, install steps, changelog
├── user.html             Login/register + key & HWID dashboard
├── admin.html            Admin login + user management table
├── css/style.css        All styling (dark glass theme, mint accent)
└── js/
    ├── app.js            Icons, nav, toasts, confirm modal
    ├── particles.js      The canvas particle-reveal effect
    ├── auth.js           Demo accounts (localStorage)
    └── keysystem.js      Key generation/verification (localStorage)
```

No build step, no dependencies to install. The only external resource is Google Fonts (Chakra Petch, Inter, JetBrains Mono) — if that's unreachable it falls back to system fonts automatically.

## Running it

Easiest: open `index.html` directly in a browser.

More reliable (recommended, since the panels share data across pages via localStorage): serve the folder with any static server, for example:

```
npx serve .
```
or
```
python3 -m http.server 8080
```

When you're ready to publish, drag the whole folder into Netlify, or push it to a repo and use GitHub Pages / Vercel — still no build step required.

## Demo accounts

- Admin: `admin` / `admin123`
- Sample user: `shadowplayer` / `demo1234` (has an active key)
- Sample user: `nightowl` / `demo1234` (has an expired key, for testing that state)

Change or remove these before a real launch — see the security note below.

## Where to customize

- **Discord link** — already wired to the invite you gave me, in every page's nav, footer, and Discord section.
- **Download link** — `download.html` has a placeholder `href="#"` on the download button. Swap it for your real hosted installer link (GitHub Releases, your own CDN, etc.).
- **Key verification step** — `js/keysystem.js` has a `REAL_VERIFICATION_URL` constant at the top. Right now it's `null`, which runs a demo countdown before generating a key. Set it to your real ad-locker/verification link to redirect there instead.
- **Colors/fonts** — all in the `:root` block at the top of `css/style.css`.
- **Version/changelog copy** — in `download.html`, plain HTML you can edit directly.

## Important: this is a front-end demo, not a real backend

Accounts, keys, and admin data all live in the visitor's own browser (`localStorage`), not on a server. That's what makes every panel clickable and testable right now without you standing up any infrastructure — but it also means anyone could open dev tools and edit that data, and nothing here is shared between two different people's browsers. Don't treat it as secure for a real public launch, and don't reuse the demo password-obfuscation approach as real security.

When you're ready to go live for real, the natural next step is a small backend (Node/Express, or serverless functions) with a real database, so accounts and keys are actually stored server-side and validated there instead of in the browser. Happy to help build that next.
