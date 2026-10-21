# PWA upgrade ChemLab 6.2.0 → 6.5.0

Updated 2026-10-21. Covers EXR-005 / AUD-007 and AUD-005 (local part).

## 1. What changes for an installed learner

| Item | 6.2.0 | 6.5.0 |
| --- | --- | --- |
| `package.json` version (single source of truth) | 6.2.0 | **6.5.0** |
| Files rewritten by `npm run release:sync` | — | `src/appMeta.js`, `index.html` (title/meta/splash), `public/manifest.webmanifest` (name), `public/sw.js` (`VERSION`) |
| Service-worker cache namespace | `chemlab-6.2.0-brand-1-static/-runtime` | `chemlab-6.5.0-brand-1-static/-runtime` |
| Storage keys (localStorage) | progress `chemlab-v1-progress`, preferences `chemlab-v5-user-preferences`, ChemAI chat `chemlab-v62-ai-session`, … | unchanged; new key `chemlab-v1-exam` (exam sessions/results) and `chemlab-v1-exam-corrupt` (backup) |

The ChemAI chat key keeps its historical `v62` name on purpose: renaming it would discard saved chats.

## 2. Lifecycle (read from `public/sw.js` and `src/production.js`)

- The app registers `/sw.js` on `load` in production builds only. `_headers` serves `/sw.js` with `max-age=0, must-revalidate`, so the browser sees a new version on the next navigation.
- **No `skipWaiting()` / `clients.claim()`.** A new worker installs in the background and waits until every tab of the old version is closed. An open lesson or exam is never switched mid-session and never loses its JavaScript chunks.
- `install` precaches `/`, `/index.html`, the manifest and two brand files; if it fails the new worker is discarded and the old one keeps serving.
- `activate` deletes every cache whose name is not the current `STATIC`/`RUNTIME` cache.
- `fetch`: navigations network-first (fallback to cached page, then `/index.html`); `/assets/*` cache-first (immutable hashed files); `/api/*` never cached.
- The worker never touches `localStorage`.

## 3. Automated evidence (`npm run check:browser`, journey “pwa upgrade”)

The built `dist/sw.js` is rewritten during the test (and always restored) so the browser runs the real lifecycle; Playwright request interception is not used because Chromium bypasses service workers when it is on.

| Scenario | Check | Result (2026-10-21) |
| --- | --- | --- |
| A — 6.2 client | a 6.2.0 worker controls the page, caches under `chemlab-6.2.0-brand-1-*` | PASS |
| E — update with tabs open | 6.5.0 installs and **waits**; old caches stay; a second tab opened meanwhile still works | PASS |
| B — activation | after the old tabs close, 6.5.0 activates and deletes the 6.2.0 caches | PASS |
| C/D — learner data | progress, ChemAI chat and an unfinished exam (answer and deadline) unchanged | PASS |
| F — reopen | the running exam offers “Tiếp tục làm bài” | PASS |
| G — offline | the updated app shell reloads offline | PASS |
| Interrupted update | an install that fails is discarded; 6.5.0 keeps serving with its caches | PASS |
| H — rollback | redeploying the 6.2.0 worker keeps learner and exam data; caches switch namespace | PASS |
| Clean install, v1 progress, offline reload | existing journey “PWA” | PASS |

Two real 6.2.0 builds were not run side by side: the “old” worker is today's worker with the 6.2.0 cache name, which is exactly what the 6.2.0 `sw.js` differs in (the file's logic is unchanged since 6.2.0 — `git log -- public/sw.js`).

## 4. Rollback compatibility

- Rolling back the deployment to 6.2.0 re-installs a worker named `chemlab-6.2.0-brand-1`; its `activate` removes the 6.5 caches. Tested (H).
- 6.2.0 code ignores `chemlab-v1-exam` (it does not know the key), so exam data simply waits for the next 6.5 deployment.
- Learning progress keeps schema `version: 1`; 6.5 adds optional reader fields that 6.2 ignores (journey “learning F” checks the opposite direction: 6.2 data read by 6.5).

## 5. Still to verify on staging / real devices (NOT RUN)

1. Deploy 6.5.0 to a preview URL; open it first with the current production build in the same browser profile if possible, or with a profile that has the 6.2 worker installed.
2. Close all tabs, reopen: DevTools → Application → Cache Storage shows only `chemlab-6.5.0-brand-1-*`; Learning progress and exam results present.
3. Repeat on Android Chrome (installed PWA) and iOS Safari (home-screen app).
4. Offline reload on a phone.
