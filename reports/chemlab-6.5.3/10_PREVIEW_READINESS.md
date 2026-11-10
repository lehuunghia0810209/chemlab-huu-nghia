# ChemLab 6.5.3 — Preview readiness

## Decision

**READY FOR PREVIEW APPROVAL**

This document prepares a Cloudflare Pages Preview only. It is not deployment authorization. Nothing was committed, pushed, merged, rebased, deployed, or changed in Cloudflare.

## RC Git status and diff summary

| Item | Value |
|---|---|
| Worktree | `D:\EduLab\.worktrees\chemlab-6.5.3-codex-rc` |
| Branch | `rc/chemlab-6.5.3-codex` |
| HEAD/base/origin/main | `d6fcffc4d3302cbbf1ff97e51d52001b2cc4ae4b` |
| Ahead/behind origin/main | 0 / 0 |
| Tracked RC diff before report-only additions | 16 files; 507 insertions; 174 deletions |
| Commit state | Uncommitted by design |

Transferred changes are limited to release metadata/cache identity, exact Vite pin, CSP headers, non-AI route/font/focus improvements, and browser/PWA test reliability. There is no diff in `functions/`, `src/ai/`, Gemini Relay/provider/service, secrets, environment files, bindings, or publication gates.

The original `D:\EduLab\ChemLab` workspace and the Gemini worktree were not reset, stashed, cleaned, or otherwise modified.

## Full Firefox result

- Browser: Firefox, headless Playwright.
- Scope: 42/42 suites, no suite/group filter.
- Timeouts: 240,000 ms per suite; 1,200,000 ms runner.
- Result: **411/411 PASS** in **00:08:00.408**, exit 0.
- CSP: 5/5; PWA upgrade: 12/12; PWA shell: 5/5.
- Log: `implementation/final-validation/firefox-full.log`.
- Duration: `implementation/final-validation/firefox-duration.txt`.
- No timeout occurred, so no failure trace was expected in this run.

## Local regression summary

- Chromium, Firefox, and WebKit full suites: 411/411 each after the final runner/PWA test state; durations 00:04:11.371 / 00:08:00.408 / 00:07:29.256 respectively.
- Accessibility: complete unchanged-build rerun PASS, 104 axe scans plus keyboard focus.
- Build and static gates: PASS.
- Two-build reproducibility: 304/304 files, zero differences.
- CSP inline-style hash and built header file: PASS.
- PWA 6.5.2→6.5.3 lifecycle, offline, rollback, learner persistence, and exam autosave: PASS locally.
- Full/production dependency audits: 0 vulnerabilities.
- Final mobile Lighthouse: 2,355 / 2,346 / 2,351 ms LCP; no rerun because no later rendering change.

## Existing Cloudflare Pages configuration

- Repository: GitHub `lehuunghia0810209/chemlab-huu-nghia`.
- Pages project documented by the repository: `chemlab-edulab`.
- Integration: Cloudflare Pages Git integration; no root Pages `wrangler.toml`.
- Build command: existing Pages setting should remain `npm run build`.
- Build output: `dist/`.
- Functions remain in `functions/api/` and are unchanged by this RC.
- Production branch is documented as `main`; it must be visually reconfirmed in Pages **Settings → Builds → Branch control** before any push.
- Preview branch controls must include `rc/chemlab-6.5.3-codex`. Cloudflare normalizes this branch alias to `rc-chemlab-6-5-3-codex.<project>.pages.dev`.

Cloudflare documentation confirms that non-production Git branches create Preview deployments without updating Production, that branch aliases replace non-alphanumeric characters with hyphens, and that `_headers` is applied from the static output: [Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/), [Preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Headers](https://developers.cloudflare.com/pages/configuration/headers/).

## Preview deployment requirements

Before deployment, the owner must separately approve all of the following:

1. Commit the reviewed RC diff on `rc/chemlab-6.5.3-codex`.
2. Push only that non-production branch to the connected GitHub repository.
3. Allow the Git-integrated Pages project to build the branch as Preview.
4. Keep Production branch `main`; do not merge or deploy Production.
5. Preserve all current Preview/Production secrets and AI bindings unchanged.

Do not run direct-upload `wrangler pages deploy` for this package. The established integration is Git-based and supplies the repository Functions alongside the static build. Do not run `staging-smoke --ai`, ChemAI evaluation, or any real provider call for this non-AI RC validation.

## Preview validation checklist

After a separately approved Preview exists:

- [ ] Dashboard deployment shows project `chemlab-edulab`, environment Preview, branch `rc/chemlab-6.5.3-codex`, and the approved commit SHA.
- [ ] The production deployment and custom production domains are unchanged.
- [ ] `node scripts/staging-smoke.mjs https://<preview-url>` passes all 12 non-AI checks; do **not** add `--ai`.
- [ ] `HEAD /` returns CSP with `script-src 'self'`, `frame-ancestors 'none'`, and `style-src` hash `sha256-UhC6pIeolfu/DM5EERJQ3cg84WVpGdG3N2aysDdqifA=`.
- [ ] `HEAD /` returns `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, and Preview `X-Robots-Tag: noindex`.
- [ ] `/sw.js` contains `chemlab-6.5.3-brand-1` and uses `max-age=0` revalidation.
- [ ] `/manifest.webmanifest` is served as `application/manifest+json` and names ChemLab 6.5.3.
- [ ] A hashed `/assets/*` response is immutable.
- [ ] `/api/chat` GET reports release 6.5.3 and `Cache-Control: no-store`; no POST is sent.
- [ ] `/api/feedback` GET reports its existing gate; no POST is sent.
- [ ] Fresh-profile install, reload, offline shell, and offline Periodic route work on the Preview edge.
- [ ] For exact live 6.5.2→6.5.3 evidence, use a disposable Preview branch alias and an owner-approved two-deployment sequence; never use Production.
- [ ] Record deployment ID/SHA, branch alias, timestamp, header captures, smoke output, PWA screenshots, and browser console results in this report.

## Known risks

- Live Cloudflare response headers and edge PWA behavior are not verified until Preview is approved and deployed.
- Local repository evidence cannot prove the current dashboard branch-control or binding state; confirm it before push.
- The first final accessibility run had one non-reproducible timing false negative; direct repetition and the full unchanged-build rerun passed.
- Fifteen existing reaction “no effect” warnings remain.
- Physical-device PWA behavior and screen readers are not yet tested.
- The RC is uncommitted, so the exact Preview SHA does not yet exist.

## Owner approval required

Approval must explicitly cover commit, push of the non-production branch, and the resulting Cloudflare Preview. It does not authorize merge, Production deployment, secret/binding changes, AI calls, or ChemAI changes.
