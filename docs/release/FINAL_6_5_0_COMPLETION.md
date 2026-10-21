# ChemLab 6.5.0 — final completion report

Date 2026-10-21 · branch `evolution/next` · baseline `94b9a40` (Codex final audit: TECHNICAL PASS — PUBLIC RELEASE CONDITIONAL NO-GO).

**Verdict: TECHNICALLY COMPLETE — READY FOR OWNER ACCEPTANCE.** Public release still needs staging/live ChemAI evidence (G6/G7), teacher review (G8) and owner approval (G10). Nothing was pushed, merged or deployed; no cloud resource was created.

## 1. Delta checklist (Codex issue register → outcome)

| Issue | Class | Outcome |
| --- | --- | --- |
| AUD-007 version still 6.2.0 | ENGINEERING ACTIONABLE | **Closed locally:** 6.5.0 via `release:sync`; build reproduces it with no diff |
| AUD-005 PWA migration on staging | ENGINEERING (local) + STAGING REQUIRED | Local: real SW lifecycle 6.2 → 6.5 incl. multi-tab, offline, interrupted update, rollback — PASS. Staging/devices: NOT RUN |
| AUD-004 Gemini/Cloudflare/quota Worker | ENGINEERING (local) + STAGING REQUIRED | Local workerd runtime with real `_headers`, Functions and DO budget — 12/12. Cost gap fixed (retries now charged). Staging/live: NOT RUN (needs approval) |
| AUD-006 printed originals 2025/2026 | CONTENT/HUMAN REVIEW REQUIRED | Editorial notes shown to learners; corrections listed; still REVIEW REQUIRED |
| AUD-003 DTT 2/3/4 | OWNER/TEACHER DECISION | Still BLOCKED; decision table in the review packet |
| AUD-002 teacher sign-off | HUMAN REVIEW REQUIRED | Review packet (224 questions) prepared; 0 sign-offs |
| AUD-001 licence | OWNER DECISION | OWNER_ATTESTED unchanged |
| AUD-008/009 | ACCEPTED LIMITATION | unchanged |

## 2. Changes

- **Version 6.5.0**: `package.json`, `package-lock.json`, synced `src/appMeta.js`, `index.html`, `public/manifest.webmanifest`, `public/sw.js`; `src/ai/chemAI.js` default version from `APP_VERSION`. The ChemAI chat storage key keeps its `v62` name so saved chats survive.
- **ChemAI cost control**: `consumeBudget` (`functions/api/_limits.js`); chat charges the shared budget before every retry/fallback (`functions/api/chat.js`). Before: one counted request could cost up to 4 Gemini calls. Feedback stays off unless `CHEMAI_FEEDBACK=on` + exact DO budget.
- **Exam**: `editorialNote` for the two graduation exams (retyped sources; corrections; printed originals not compared), validated and shown on the preparation page. No question, key, state or `dataVersion` changed. 8 papers READY, DTT 2–4 BLOCKED.
- **Tests/tools**: rewritten PWA upgrade journey (10 checks), budget-per-retry test, version assertion fix, editorial-note checks; `scripts/staging-smoke.mjs`, `scripts/local-cloudflare-check.mjs`, `scripts/build-review-packet.mjs`.
- **Docs**: `RELEASE_6.5.md` (G1–G10, playbook, recovery), `CLOUDFLARE_STAGING_VERIFICATION.md`, `PWA_6_2_TO_6_5_UPGRADE.md`, `EXAM_RELEASE_MATRIX.md`, `TEACHER_REVIEW_PACKET_6.5.md`, register, checkpoint, `CODEX_FINAL_DELTA_HANDOFF.md`.

## 3. QA evidence (run 2026-10-21 on the final working tree)

| Command | Result |
| --- | --- |
| `npm run build` (prebuild: `release:sync` + `npm run check`) | PASS — project · chem 47 · learning 242 · questions 782 (537) · exam 84 · exam papers 850 · UI 76 · ChemAI mock · feedback/limits 20; Vite 262 modules; release:sync no diff |
| `npm run check:browser` | **359/359 PASS** (twice in a row). One earlier run had 1 failure (PWA journey: first service-worker wait timed out at 15 s under load); waits raised to 30 s, stage names added to errors, two consecutive full runs passed |
| `npm run check:a11y` | 100 axe scans, no WCAG A/AA violation, keyboard focus PASS |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| Secret scan of `dist/` and tracked files | no key values (only the name `GEMINI_API_KEY` in a help text); no source maps |
| `node scripts/local-cloudflare-check.mjs` | 12/12 (local runtime, invalid Gemini key, no cost) |
| Live Gemini, Cloudflare staging, real devices, screen reader | **NOT RUN** |

Learning, Practice, Chemistry engines, Virtual Lab, 3D/Atomic, router, themes and AI gating are covered by the suites above (unchanged code outside the files listed in §2).

## 4. Release gates

See `docs/release/RELEASE_6.5.md` §1: G1 PASS (local) · G2 PASS with conditions · G3 PASS · G4 PASS (local) · G5 PASS (local) · G6 NOT RUN · G7 NOT RUN (feedback off) · G8 OPEN · G9 OWNER_ATTESTED · G10 OPEN.

## 5. Release scope options for the owner

- **A. Limited release (possible after G10):** Learning, Practice, Lab, tools, ChemAI chat with `CHEMAI_BUDGET` bound and a low daily limit, written feedback **off**; Exam with the papers the owner selects, all solutions labelled “lời giải tham khảo do ChemLab biên soạn”, no “teacher-verified” claim anywhere.
- **B. Full Exam + Learning + AI feedback:** only after G6/G7 staging evidence and the teacher review required for the chosen scope (G8).

## 6. Git

Local commits on `evolution/next` (see `git log`); owner files `AGENTS.md` (staged), `.gitignore`, `.claude/` and the pre-existing empty `.wrangler/` untouched and never committed.
