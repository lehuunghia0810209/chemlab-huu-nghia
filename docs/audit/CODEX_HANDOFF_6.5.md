# Independent audit handoff — ChemLab 6.5

Prepared by the implementing agent (Claude Code). **This is not an audit result.** No independent audit of 6.5 has been performed yet.

## Baseline and scope

- Branch `evolution/next`; 6.4 audited at `decd09b` (`D:\ChemLab-6_4-audit`). 6.5 commits: see `docs/learning/CHECKPOINT_6.5.md`.
- User files never committed by the agent: staged `AGENTS.md`, modified `.gitignore`, untracked `.claude/`.

## What changed in 6.5

| Area | Files | Claims to verify |
| --- | --- | --- |
| Exam blueprint + scoring | `src/exam/blueprints.js`, `src/exam/scoring.js` | 18/4/6 structure, 50 min, 0,25 / table 0,1–0,25–0,5–1 / 0,25; integer hundredths; no tolerance on short answers except “.”→“,” and whitespace |
| Paper data + gate | `src/exam/validate.js`, `src/exam/catalog.js`, `src/exam/papers/fixture-kiem-thu.js` | No official paper is takeable; fixture only behind `localStorage['chemlab-exam-fixtures']='1'` or `vite dev` |
| Sessions | `src/exam/session.js` | Persisted deadline; reload/close/background cannot extend time; clock rollback guard; read-modify-write; idempotent submit; corrupt data backed up to `chemlab-v1-exam-corrupt` |
| Exam UI | `src/exam/examApp.js`, `src/exam/exam.css`, routes in `src/learning/routes.js` | No hints/solutions/AI during exam; timeout auto-submit; results labelled (solutions “không phải lời giải chính thức” for non-official) |
| ChemAI | `functions/api/feedback.js`, `functions/api/_limits.js`, `functions/api/chat.js`, `src/learning/rubrics.js`, `src/learning/writtenPractice.js` | Feedback off unless flag + shared limit; server-side rubric; one upstream attempt; output normalised to rubric criteria; chat uses shared limits when configured |
| Issue 77/78 | `scripts/validate-project.mjs`, `src/final/homeDashboard.js` | Guided-lab 77 vs Learning 78 reported separately; Home totals 78 (lớp 10 = 23), regression check in `test-learning.mjs` |
| Release prep | `scripts/validate-final-ui.mjs`, `scripts/test-chemai-api.mjs`, `scripts/browser-smoke.mjs` | Version assertions follow `package.json`/`sw.js`; version still 6.2.0 |

## Commands (all run by the agent on 2026-10-20, results below)

| Command | Result |
| --- | --- |
| `npm run check` (project, chem, learning, question, exam, ui, ai + feedback) | PASS (47 · 242 · 782/537 q · 77 · 76 · mock · 15) |
| `npm run build` (prebuild = release:sync + check) | PASS, no diff from release:sync |
| `npm run check:browser` | 307/307 (261 previous + 35 exam + 11 written practice) |
| `npm run check:a11y` | 92 axe scans (23 areas × 2 widths × 2 themes), no A/AA violation, keyboard checks pass |
| Throttled load profile (4× CPU, 1.6 Mbps, 390 px) | No 3D chunk on any main view; LCP 1.8–2.9 s; CLS ≤ 0.023 (lab emulation, not a real device) |
| Responsive sweep 320/390/768/1024/1440 × light/dark, 10 routes | No horizontal overflow |

## Suggested audit focus

1. Scoring correctness against an independent hand calculation (use `scripts/test-exam.mjs` fixtures; 81 true/false combinations).
2. Timer manipulation: device clock forward/back, sleep, multiple tabs, storage quota errors.
3. Publication gate: try to reach a gated paper by URL, by localStorage edits other than the documented fixture flag.
4. ChemAI: prompt injection through the answer, oversized bodies, behaviour with `CHEMAI_LIMITER` failing, cost exposure with only KV budget.
5. Accessibility with a real screen reader (not done: no screen reader available to the agent).
6. Educational review remains open (`docs/learning/TEACHER_REVIEW_REGISTER.md`).

## Not verifiable by the agent

Live Gemini responses (only mocks), Cloudflare Rate Limiting binding availability for Pages, production deployment, real low-end devices, screen readers, the Ministry's primary scoring text, copyright permission for any paper.
