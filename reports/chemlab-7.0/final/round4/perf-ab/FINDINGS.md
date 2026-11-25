# Round 4 — P01 frame-rate drop: verification (25/11/2026, 21:40–22:05)

## Equal-condition A/B (P01 = 8 beakers CuSO₄ + NaOH, 2D bench, 480 particles)

HEAD `faaa52f` (Round 3 baseline, built from `git archive` in the scratchpad) vs the Round 4 working tree, interleaved,
3 rounds, one run at a time, 300 s limit per run. Logs: `perf-ab/<browser>-<head|now>-r<n>.log`, summary `../perf-ab-summary.txt`.

| Browser | HEAD high / low (fps) | Round 4 high / low (fps) |
|---|---|---|
| Firefox r1 | 20,8 / 23,3 | 23,9 / 23,4 |
| Firefox r2 | 23,3 / 23,5 | 23,6 / 23,4 |
| Firefox r3 | 24,0 / 24,0 | 23,6 / 23,9 |
| WebKit r1 | 14,1 / 15,8 | 14,0 / 15,5 |
| WebKit r2 | 14,2 / 16,2 | 14,0 / 15,8 |
| WebKit r3 | 14,4 / 16,1 | 14,0 / 15,5 |

The Round 3 baseline build itself, which measured 41/39 fps (Firefox) and 33/37 fps (WebKit) on 25/11 earlier, now
measures 21–24 and 14–16 fps. Round 4 is within ±3 % of HEAD in the same conditions. **The drop is in the machine
state, not in the Round 4 code.**

## Machine state during the A/B

- Nothing of this session running except the measured test (checked with Win32_Process).
- Active CPU consumers outside this session (8 s sample): `chrome` PID 11428 ≈ 38 % of a core, `Code` PID 7244 ≈ 34 %,
  `chrome` 34360 ≈ 15 %, `Code` 33264 ≈ 13 %. On AC power, "Balanced" plan, 12 logical CPUs. Not touched.

## Where the time goes (Chromium CDP CPU profile, same scene, unminified dev builds, 4 s / 240 frames)

| Component | HEAD (2 runs) | Round 4 (2 runs) |
|---|---|---|
| 2D drawing JS (`render2d.js`) | 405 / 305 ms | 339 / 292 ms |
| Canvas native calls in the top list (fill, stroke, fillText, drawImage) | 204 / 185 ms | 184 / 140 ms |
| Chemistry engine per step (`processes.js`) | 159 / 126 ms | 168 / 172 ms |
| Ksp/pH solver (`chemistry.js`) | not in the top list (< 30 ms) | not in the top list (< 30 ms) |
| Render loop + UI (`dlabApp.js`) / labels | 97 + 61 / 126 + 51 ms | 95 + 43 / 99 + 34 ms |
| Browser native work `(program)` (raster/compositing) | 2227 / 2070 ms | 2143 / 1980 ms |

Node, same scene: one engine step 0,34–0,42 ms (HEAD) vs 0,35–0,40 ms (Round 4); adding NaOH to 8 beakers 15–20 ms (HEAD)
vs 14–15 ms (Round 4). The engine runs at 60 steps/s, so it is ≈ 2–3 ms of every second — not the bottleneck either way.
Profiles: `perf-ab/profile-{head,now}-{1,2}.json`.

## Not concluded

- P01/P01b FAIL on Firefox and WebKit in today's conditions for **both** builds; the threshold (30 fps) is unchanged.
- A PASS needs a re-run when the machine is in the Round 3 state (Chrome/VS Code idle). That decision is the owner's.
