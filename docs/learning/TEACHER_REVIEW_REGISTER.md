# Teacher review register (Issue CL-64-003)

No content in ChemLab is “Expert Verified” today. Lessons and questions are `internal` (checked by ChemLab's automated checks and by the authoring agent). AI review does not count as teacher review. A reviewer records each sign-off below; only then may a status be raised.

Status vocabulary: NOT REVIEWED · AUTOMATED VERIFIED (tests + agent re-solving) · TEACHER REVIEW PENDING · TEACHER VERIFIED (only a named human reviewer, logged below) · NEEDS CORRECTION. Today every exam question is AUTOMATED VERIFIED and TEACHER REVIEW PENDING; nothing is TEACHER VERIFIED.

Review packet for the 8 exam papers (224 questions, keys, ChemLab solutions, flagged and blocked items): `docs/review/TEACHER_REVIEW_PACKET_6.5.md` (regenerate with `node scripts/build-review-packet.mjs`).

## Priorities

| Priority | Scope | Why | Pointer |
| --- | --- | --- | --- |
| 1 | Numeric questions (all chapters) | Arithmetic is recomputed by tests, but data choices, rounding and units need a teacher | `docs/learning/QUESTION_BANK.md` (type “numeric”) |
| 1 | Items in `CONTENT_VERIFICATION.md` | Already flagged points of doubt (conditions, scope, notation) | `docs/learning/CONTENT_VERIFICATION.md` |
| 1 | Reference solutions of the 8 published exam papers (224 questions: Ministry 4, Sở Đồng Nai 2, teacher practice 2) | Questions and keys come from the issuing authority or the paper's author; the solutions and chapter tags are written by ChemLab (no difficulty level is set) (`meta.status: internal`) and shown to learners after submission | `src/exam/papers/*.js`, checklists in `docs/exam/papers/` |
| 1 | Flagged exam items | `tot-nghiep-2025-hoa` II.4 / III.4 (typing errors of the supplied Word file corrected); `dtt-2026-de-5` I.7 (CO₂ called a toxic gas), I.15 (histidine treated as not moving at pH 7,0); `dtt-2026-de-6` I.2 (Δr used for a formation enthalpy) | the paper checklists |
| 1 | Blocked teacher-practice papers | Decide `dtt-2026-de-4` III.5 / III.6, `dtt-2026-de-2` III.5 (author keys differ from independent solving) and `dtt-2026-de-3` III.1 (factual statements) before they can be published | `docs/exam/EXAM_SOURCES.md` §2b |
| 2 | Exam blueprint and scoring rules | Confirm against the Ministry's original guidance | `src/exam/blueprints.js`, `docs/exam/EXAM_SOURCES.md` |
| 2 | Written-practice rubrics (3) | Criteria and “critical mistakes” drive AI feedback | `src/learning/rubrics.js` |
| 3 | Lesson prose, worked examples, distractor feedback | Pedagogical quality | `src/learning/lessons/*.js` |
| — | Exam fixture | Test data only, not for learners | `src/exam/papers/fixture-kiem-thu.js` |

## Sign-off log

| Date | Reviewer (name, school) | Scope reviewed | Result / changes requested | Status set to |
| --- | --- | --- | --- | --- |
| | | | | |
