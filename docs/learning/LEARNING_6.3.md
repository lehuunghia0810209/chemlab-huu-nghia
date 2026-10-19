# ChemLab 6.3 — Learning Foundation & Experience

Status of 2026-10-19, branch `evolution/next`. Package version is still 6.2.0 (bumping it renames the service-worker cache and belongs to the release step).

## 1. Audit (before 6.3)

**Architecture.** Vite + vanilla JS. `#learning` lazy-loaded `src/quiz.js` (5 100 lines): XP/level quiz practice plus a "progress dashboard" that sent learners to guided activities in the Lab. There was no lesson reader.

**Data inventory.**
- `src/lab/experiments/curriculum.js` — 21 chapters / 77 lessons (Hóa 10–12, KNTT order). IDs `g<grade>-l<n>` are referenced by stored progress.
- `src/lab/experiments/grade10|11|12.js` — 96 guided activities, one or more per lesson: short info cards, multiple-choice questions, Lab actions. This was the only lesson content, and it was reachable only from the Lab.
- `src/quiz.js` — 6 topic quiz bank, stored under `chemlab-learning-4.7`.
- Progress: `chemlab-v1-progress` (schema v1). `learning.gradeNN.lessons[id]` and `markLessonCompleted()` existed but nothing in 6.2 wrote them; lesson completion was derived from guided-activity completion.

**Problems found.**
- No way to *learn* a lesson inside Learning; content only reachable through the Lab.
- Learning page was a dashboard (level, XP, stats, mode cards, grade cards) — many competing widgets.
- Catalogue missing *Bài 23. Ôn tập chương 7* (Hóa 10); several titles shortened versus the textbook.
- `loadProgress()` silently overwrote unreadable progress with defaults (data loss).
- From code reading (not reproduced): the old dashboard dispatched `chemlab:open-guided-lesson` right after starting the Lab route load, so on a first visit the Lab listener may not exist yet. The new reader waits for the Lab before dispatching.

**Baseline tests (before changes):** `npm run check` PASS, `npm run build` PASS, `npm run check:browser` 201/201 PASS.

## 2. Curriculum sources

| Source | Reference | How it was verified |
| --- | --- | --- |
| Chương trình GDPT 2018 môn Hóa học | Thông tư 32/2018/TT-BGDĐT, 26/12/2018; amended by TT 13/2022/TT-BGDĐT (03/8/2022), no Hóa học changes found | Requirement wording for the three sample lessons read from published copies of the programme (hoatieu.vn); full official text not opened |
| SGK Kết nối tri thức với cuộc sống, NXB GDVN | Quyết định 3588/QĐ-BGDĐT, 26/12/2025 — one textbook set nationwide from 2026–2027 | baochinhphu.vn, xaydungchinhsach.chinhphu.vn |
| Lesson lists of Hóa 10/11/12 KNTT | — | Cross-checked against two public listings per grade (VietJack, Lời giải hay, a school teaching plan). Not checked against the printed book. |

Coverage: 3 grades, 21 chapters, 78 lessons — see `CURRICULUM_COVERAGE.md`.

## 3. Architecture

```
src/learning/
  catalog.js        Grade → Chapter → Lesson, built on the Lab CURRICULUM (IDs unchanged)
                    + Bài 23 (Hóa 10) + official titles + content status
  lessons/*.js      full lessons, lazy-loaded (g10-l1, g11-l1, g12-l15)
  legacyAdapter.js  guided activities → reader steps for every other lesson
  lessonProgress.js read/save reader progress inside chemlab-v1-progress
  routes.js         #learning · #learning/grade-N · #learning/lesson/<id> · #learning/practice
  figures.js        inline SVG illustrations (theme aware)
  learningApp.js    Learning Home, Curriculum Browser, Step Reader, Practice host
```

- **Statuses:** `published` (full lesson) · `legacy` (short content from guided activities) · `draft` · `catalogued` (no content yet, e.g. g10-l23). `verified` is deliberately not used: lessons carry `verification.level = 'internal'` — automated checks and source cross-checks, *not* expert review.
- **Lesson schema:** `id, contentVersion, status, requirements, prerequisites, sources, verification, steps[]`; a step is `{ id, kind, title, blocks[] }` with kinds `objectives | concept | example | practice | check | summary` and blocks `p | heading | list | equation | table | callout | figure | worked | quiz | activity`. New question types (6.4) are new block types; the engine does not change.
- **Activities** reuse existing modules: Atomic Explorer overlay (returns focus to the step), guided Lab activities (waits for the Lab to load, then opens the right experiment), Tool Hub, periodic table. Learning keeps its route in memory, so the Learning tab returns to the same step.
- **Practice:** `quiz.js` now mounts into a host and is loaded only on `#learning/practice`; its global is `window.ChemLabPractice`. Its old curriculum dashboard is hidden (superseded by the Learning Home).

## 4. Progress & migration

Stored in the existing record `chemlab-v1-progress → learning.gradeNN.lessons[lessonId]`; the key and schema version are unchanged. New fields: `currentStep`, `openedSteps`, `viewedSteps`, `answers`, `contentVersion`.

- Opened ≠ learned ≠ completed: opening sets `started`; a step is learned when the learner presses *Tiếp tục* on it; a lesson is completed only from the last step once every earlier step is learned.
- Older records (`completed: true`, no reader fields) stay completed; invalid step IDs fall back to step 1; malformed fields are ignored, never rewritten to empty values; step IDs from other content versions are preserved on save.
- Legacy lessons also count as learned when all their guided activities are complete (6.2 progress keeps counting).
- Unreadable progress is now copied to `chemlab-v1-progress-corrupt-backup` before defaults are written.

## 5. Verification

| Command | Result |
| --- | --- |
| `npm run check` (project, chem 47, learning 149, UI 76, AI mock) | PASS |
| `npm run build` | PASS |
| `npm run check:browser` | PASS 251/251 (49 new Learning checks: journeys A–H, all 78 lessons open, legacy data, corrupt storage, reader layout at 320–1920 px in both themes) |
| `npm run check:a11y` | PASS — 60 axe scans incl. curriculum browser, reader, answered quick check, practice; keyboard focus checks |
| Manual | Screenshots reviewed at 390/1024/1440 px dark & light; Tab order walk-through in the reader |

## 6. Known limitations

- Only 3 of 78 lessons are full lessons; 74 are short legacy content, 1 is catalogued only. Legacy content has not been re-reviewed for accuracy.
- Requirement text is paraphrased from secondary copies of the programme; lesson lists are not checked against the printed textbooks.
- Sample lessons are AI-authored and machine-checked; no teacher or subject expert has reviewed them.
- Molecule buttons on some legacy info cards (e.g. g10-l12) are only available inside the Lab version of the activity.
- The Lab has no galvanic-cell simulation, so g12-l15 links a short review activity instead.
- Learning time is not tracked for the reader.
