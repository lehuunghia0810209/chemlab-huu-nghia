# Teacher review register (Issue CL-64-003)

No content in ChemLab is “Expert Verified” today. Lessons and questions are `internal` (checked by ChemLab's automated checks and by the authoring agent). AI review does not count as teacher review. A reviewer records each sign-off below; only then may a status be raised.

## Priorities

| Priority | Scope | Why | Pointer |
| --- | --- | --- | --- |
| 1 | Numeric questions (all chapters) | Arithmetic is recomputed by tests, but data choices, rounding and units need a teacher | `docs/learning/QUESTION_BANK.md` (type “numeric”) |
| 1 | Items in `CONTENT_VERIFICATION.md` | Already flagged points of doubt (conditions, scope, notation) | `docs/learning/CONTENT_VERIFICATION.md` |
| 1 | Reference solutions of the 2 official papers (56 questions) | Questions and keys are official; the solutions and chapter tags are written by ChemLab (no difficulty level is set: the papers publish none) (`meta.status: internal`) and shown to learners after submission | `src/exam/papers/tham-khao-2025-hoa.js`, `src/exam/papers/minh-hoa-2025-hoa.js`, checklists in `docs/exam/papers/` |
| 2 | Exam blueprint and scoring rules | Confirm against the Ministry's original guidance | `src/exam/blueprints.js`, `docs/exam/EXAM_SOURCES.md` |
| 2 | Written-practice rubrics (3) | Criteria and “critical mistakes” drive AI feedback | `src/learning/rubrics.js` |
| 3 | Lesson prose, worked examples, distractor feedback | Pedagogical quality | `src/learning/lessons/*.js` |
| — | Exam fixture | Test data only, not for learners | `src/exam/papers/fixture-kiem-thu.js` |

## Sign-off log

| Date | Reviewer (name, school) | Scope reviewed | Result / changes requested | Status set to |
| --- | --- | --- | --- | --- |
| | | | | |
