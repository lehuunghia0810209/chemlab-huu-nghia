# Exam release matrix — ChemLab 6.5.0

Updated 2026-10-21. Publication is decided by the owner; “READY” means every engineering state in `src/exam/catalog.js` is reached (`READY_FOR_OWNER_RELEASE`), not that the paper is public or teacher-verified. Details per paper: `docs/exam/papers/<id>.md`; sources and blocked items: `docs/exam/EXAM_SOURCES.md`.

| # | ID | Paper | Kind (label shown to learners) | Provenance | Answer key | Content review | Publication |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `minh-hoa-2025-hoa` | Đề minh họa định dạng 2025 (đề kiểm tra lớp 10) | Đề tham khảo / minh họa của Bộ GD&ĐT | Cục QLCL PDF (SHA-256 recorded) | Official, 28/28 re-solved | AUTOMATED VERIFIED · TEACHER REVIEW PENDING | READY_FOR_OWNER_RELEASE |
| 2 | `tham-khao-2025-hoa` | Đề tham khảo từ năm 2025 | Đề tham khảo / minh họa của Bộ GD&ĐT | Cục QLCL PDF | Official, 28/28 | same | READY_FOR_OWNER_RELEASE |
| 3 | `tot-nghiep-2025-hoa` | Đề thi tốt nghiệp THPT 2025, mã 0338 | Đề thi chính thức của Bộ GD&ĐT + **editorial note** | Owner-supplied retyped Word file + photo of printed page 3; Ministry publishes keys only | Ministry official key (mã 0338), 28/28 | same; **SOURCE REVIEW REQUIRED** for II.4 and III.4 corrections (no full printed original) | READY_FOR_OWNER_RELEASE |
| 4 | `tot-nghiep-2026-hoa` | Đề thi tốt nghiệp THPT 2026, mã 0330 | Đề thi chính thức của Bộ GD&ĐT + **editorial note** | Owner-supplied retyped Word file | Ministry official key (moet.gov.vn 19/06/2026, mã 0330), 28/28 | same; printed original not compared | READY_FOR_OWNER_RELEASE |
| 5 | `dong-nai-2026-l1-0301` | Khảo sát chất lượng TN THPT 2026 lần 1, ca 1, mã 0301 | Đề khảo sát của Sở GD&ĐT (không phải đề của Bộ) | Owner-supplied original PDF | Sở key table, 28/28 | same | READY_FOR_OWNER_RELEASE |
| 6 | `dong-nai-2026-l1-0325` | Same exam, ca 2, mã 0325 | Đề khảo sát của Sở GD&ĐT | Owner-supplied original PDF | Sở key table, 28/28 | same | READY_FOR_OWNER_RELEASE |
| 7 | `dtt-2026-de-5` | Đề ôn số 5 — ThS. Dương Thành Tính | Đề ôn luyện do giáo viên biên soạn (không phải đề chính thức) | Owner-supplied PDF | Author's key, 28/28 | same; 2 items flagged for science review | READY_FOR_OWNER_RELEASE |
| 8 | `dtt-2026-de-6` | Đề ôn số 6 — same author | Đề ôn luyện do giáo viên biên soạn | Owner-supplied PDF | Author's key, 28/28 | same | READY_FOR_OWNER_RELEASE |
| — | `dtt-2026-de-4` | Đề ôn số 4 | — | Owner-supplied | Author's key conflicts (III.5, III.6) | NEEDS CORRECTION | **BLOCKED** (catalog shows “Chưa sẵn sàng”, URL refused) |
| — | `dtt-2026-de-2` | Đề ôn số 2 | — | Owner-supplied | Conflict (III.5); duplicate options (I.11) | NEEDS CORRECTION | **BLOCKED** |
| — | `dtt-2026-de-3` | Đề ôn số 3 | — | Owner-supplied | III.1 not independently verifiable | TEACHER REVIEW PENDING | **BLOCKED** |

Total READY: 8 papers, 224 questions (18/4/6 each, 10/10 with the key through the UI). Authorization for all: `OWNER_ATTESTED` (licence documents not seen by the agent).

## Visibility rules (tested)

- Only papers whose catalog states include every required state are takeable; others appear under “Đề đang chuẩn bị”, labelled “Chưa sẵn sàng”, and their URL shows “chưa thể làm” (browser journey A, `scripts/test-exam.mjs` publication-gate checks).
- The internal fixture is hidden unless `localStorage['chemlab-exam-fixtures'] = '1'` or `vite dev`.
- No teacher-verified label exists in the UI; every solution is labelled “Lời giải tham khảo do ChemLab biên soạn (không phải lời giải chính thức)”.

## Owner choices before public release

1. Publish all 8, or only the Ministry papers (1–4), or the Ministry + Sở papers (1–6). Removing a paper from public view = remove `UI_TESTED` (or any required state) from its catalog entry; no data change.
2. Keep DTT 2–4 blocked until the decisions in `docs/review/TEACHER_REVIEW_PACKET_6.5.md` §2 are made.
