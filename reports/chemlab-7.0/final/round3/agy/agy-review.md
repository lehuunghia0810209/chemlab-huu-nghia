# ChemLab 7.0 Dynamic Lab — Independent Adversarial Review (Round 3)

## A. Science: Stability Constants & Free-NH₃ Gating

### Published Data Check (25 °C)
- `Ka(NH₄⁺) = 5.6e-10` (`src/dlab/data/materials.js:58`): matches CRC/IUPAC (`pKa = 9.25`, `Ka = 5.62e-10`).
- `lg β₂([Ag(NH₃)₂]⁺) = 7.23` (`src/dlab/data/reactions.js:40`): matches NIST/Martell–Smith (`7.22–7.24`, I = 0).
- `lg β₄([Zn(NH₃)₄]²⁺) = 9.46` and `lg β₄([Cu(NH₃)₄]²⁺) = 13.1` (`reactions.js:41,49,74`): **P3** — these are Lange's Handbook / Bjerrum high-ionic-strength (`2 M NH₄NO₃`) values, inconsistent with the I = 0 constants used elsewhere (`materials.js:2,28,55`). NIST/Martell–Smith I = 0 values are `lg β₄(Zn) ≈ 8.89–9.06` and `lg β₄(Cu) ≈ 12.6` (~1.3–1.4× higher `β^(-1/4)`). Furthermore, `β₄^(-1/4)` ignores stepwise complexes (`log K₁(Cu) ≈ 4.1`, so `[Cu(NH₃)]²⁺` already matches `[Cu²⁺]` at ~8× lower `[NH₃]`).

### Concrete Misleading / Wrong Student Outcomes
1. **P1 — `AgI` + `NH₃` falsely claims `[Ag(NH₃)₂]⁺` dissolves it** (`src/dlab/engine/processes.js:278,289-292`; `reactions.js:40`).
   - *Input*: `10 mL AgNO₃ 0.1 M + 10 mL KI 0.1 M` (forms `1 mmol AgI↓`, `Ksp = 8.52e-17`) `+ 10 mL NH₃ 0.5 M`.
   - *Expected*: No dissolution and no ammine warning (`Ksp(AgI)·β₂ ≈ 1.4e-9`; textbook distinction from `AgCl`).
   - *Actual*: `has('Ag+')` counts any precipitate with `cation === 'Ag+'` (including `AgI`), and `[NH₃]free ≈ 0.16 M > 2.43e-4 M`, firing *"Ag⁺/AgCl với NH₃ tạo phức [Ag(NH₃)₂]⁺ tan — chưa được mô hình hóa"*. Same false positive occurs for `AgCl` in `0.25 M Cl⁻` with `0.2 mL NH₃ 0.5 M` (`[[Ag(NH₃)₂]⁺] ≈ 3e-7 M`, <0.001% dissolved).
2. **P1 — `Cu(OH)₂` / `Zn(OH)₂` remain precipitated where excess `NH₃` should dissolve them, while trace `NH₃` in strong base falsely triggers ammine refusal/hints** (`src/dlab/engine/chemistry.js:256-298`; `processes.js:278,289-292,576-583`).
   - *Input 1 (dissolution missing)*: `5 mL CuSO₄ 0.5 M + 50 mL NH₃ 0.5 M` (`N:Cu = 10:1`). Expected: clear deep royal-blue `[Cu(NH₃)₄]²⁺`. Actual: engine precipitates ~100% of Cu as light-blue `Cu(OH)₂↓`, draws cloudy flakes + settled layer, and labels the beaker `Cu(OH)₂↓`, only logging a warning in the side panel. Same for `manifest.js:105` (`10 mL CuSO₄ + 30 mL NH₃`).
   - *Input 2 (false ammine trigger over `OH⁻`)*: `10 mL CuCl₂ 0.5 M + 15 mL NaOH 0.5 M` (all Cu is `Cu(OH)₂↓`, `[OH⁻] ≈ 0.04 M`, pH ~12.6) `+ 0.2 mL NH₃ 0.5 M` (`[NH₃]free ≈ 4 mM > 0.53 mM`). Actual `[[Cu(NH₃)₄]²⁺] = Ksp·β₄·[NH₃]⁴/[OH⁻]² ≈ 4.5e-14 M` (negligible), yet both `ION_HINTS` and `stepElectro` report `[Cu(NH₃)₄]²⁺` complexation. Same for `Zn(OH)₂` in `NaOH` + trace `NH₃`.
3. **P2 — `AgNO₃` + excess `NH₃` fires contradictory `Ag₂O` and `[Ag(NH₃)₂]⁺` hints together** (`reactions.js:37,40`; `manifest.js:102`).
   - *Input*: `10 mL AgNO₃ 0.1 M + 10 mL NH₃ 0.5 M`.
   - *Expected*: Only `[Ag(NH₃)₂]⁺` (no persistent `Ag₂O` at 5:1 NH₃:Ag).
   - *Actual*: Because complexation does not reduce `freeConc('Ag+')`, `[Ag⁺][OH⁻] ≈ 1e-4 ≫ 10·Ksp(Ag₂O)`, firing both `Ag₂O nâu đen` and `[Ag(NH₃)₂]⁺ tan`.
4. **P2 — `stepElectro` checks `ammine` before checking `Cl⁻` and ignores `pHApplies` (ethanol > 10%)** (`processes.js:291,578-584`).
   - *Input*: `10 mL CuSO₄ 0.5 M + 30 mL NH₃ 0.5 M` (zero `Cl⁻`), or `1 mL CuCl₂ + 30 mL ethanol + 1 mL NH₃` (`c.pH === null`).
   - *Expected*: Not-CuCl₂ message / non-aqueous message.
   - *Actual*: Runs aqueous `solveH`/`freeConc('NH3')` and emits the `CuCl₂` ammine-interference status.

---

## B. Architecture & Correctness

*(No state mutations were found inside `render2d.js` or `render3d.js`.)*

1. **P1 — 2D field cache permanently dirty on `.5` floats AND permanently stale after tilt or quality toggle** (`src/dlab/ui/render2d.js:542-568,618-631`).
   - *Bug 1 (perpetual dirty)*: `px` is a `Uint8ClampedArray` (WebIDL round-to-even: `120.5 → 120`), while line 618 compares against `Math.round(col[0])` (`120.5 → 121`). Any steady cell with a `.5` channel fails the equality check every frame forever, defeating the cache.
   - *Bug 2 (permanent staleness)*: Frame 1 updates `px` and sets `img.dirty = true` without getting `fieldTurn` (`img.canvas` stays old). User tilts the vessel (`render2d.js:685`) or switches to `low` (`591`) for >2 frames → `pickFieldTurn` (`553`) deletes `img` from `dirtyFields` (`renderCount - f.seen > 2`) while leaving `img.dirty = true`. Returning upright with unchanged `col` skips line 619 (`px` already matches `col`), so `img` is never re-added to `dirtyFields` and displays stale colors indefinitely.
   - *Bug 3 (double-render & strong-ref retention)*: `dlabApp.js:220 → 211` calls `render()` a second time per frame for `drawLoupe`, incrementing `renderCount` twice and allowing 2 `putImageData` uploads/frame. Also, `dirtyFields` (`Set`) holds strong refs to `<canvas>`/`ImageData` when switching to 3D (since `pickFieldTurn` stops running); on `undo()`/`restore()`, `JSON.parse` creates new vessel objects so `WeakMap` misses (`fresh: true`), safely redrawing but leaving old dirty entries in `dirtyFields` for 3 frames (or indefinitely in 3D).
2. **P1 — Retort stand & holder spawn inside vessels and ignore `litmusPaper`/`phMeter`; clamps miss target geometry** (`src/dlab/ui/render3d.js:82,396-422,662-672`).
   - *Root cause*: `parked = !held && !o.inside && !(Math.abs(o.angle || 0) > 0.02)`, yet **only `stepLitmus` (`processes.js:885`) ever sets `o.inside`**! `rod`, `thermometer`, `dropper`, `pipette`, `electrodes` never set `o.inside`.
   - *Input 1*: Dip `thermometer` (`dlabApp.js:1086`, `y > 1`) or `electrodes` into `dish` (radius 60 mm) or `beaker250` (radius 36 mm). *Actual*: Retort stand (`STAND_Z = 48 mm`, base extends to `z = -33 mm`) stays visible and clips through the vessel wall.
   - *Input 2*: Stir `beaker100` with `rod` at `y = 0` (`y <= 1`). *Actual*: `u.holder` (a 24×10×18 mm plastic block) spawns **inside the beaker**.
   - *Input 3*: `electrodes` / `tongs` / `bridge` at `y > 1`. *Actual*: Stand arm at `(0, 0.72·h)` ends in empty air between the two electrode rods, between the tongs' arms, and 17 mm below the salt-bridge arch (`h = 60`). Meanwhile `litmusPaper` and `phMeter` are omitted from `HELD_UPRIGHT` so `litmusPaper` still floats.
3. **P1 — `watchFrameRate` false triggers on transient stalls / `fastForward()`, weak 3D downgrade, and stale `ui.autoLow`** (`src/dlab/ui/dlabApp.js:155-170,1284,1486,1588`; `src/dlab/ui/render3d.js:1025`; `src/three/sceneHost.js:242-248`).
   - *False triggers*: (a) `toggle3d()` lazy-loads Three.js + compiles shaders + builds `RoomEnvironment` PMREM; a 1.8 s stall (`<= 2 s`) is not skipped and drags a 4 s window under 25 fps; (b) `fastForward()` runs 120 synchronous physics steps per rAF (`dlabApp.js:1486`), easily dropping <25 fps for 4 s and permanently downgrading a fast GPU; (c) occluded desktop windows throttled to 1 Hz (`dt = 1 s <= 2 s`) trigger fallback.
   - *Ineffective 3D fallback & side effect*: `three.setQuality('low')` only lowers `pixelRatio` (`sceneHost.js:246`) — it leaves `scene.environment` (PMREM, the dominant software-WebGL cost per `render3d.js:26`) and `seg = 48` intact, AND writes `'low'` to `localStorage['chemlab-3d-quality']` (`sceneHost.js:245`) without user consent.
   - *Stale flag*: Manually toggling quality back to `"Cao"` (`dlabApp.js:1284`) never clears `ui.autoLow`, so opening 3D later (`1588`) falsely toasts that it switched to `"Tiết kiệm"`.
4. **P2 — Precipitate haze double-applied in 3D + chroma-45 alpha cliff + orphaned settled mound** (`render3d.js:759-762,782-800,828`).
   - `bulkColor()` (`processes.js:110-119`) already mixes up to 55% precipitate color into liquid (never decaying as grains settle); `render3d.js:782-800` blends `haze` *again* on top, washing out `I₂` yellow-brown in `CuCl₂ + KI` into dull grey (confirmed in screenshots).
   - Line 799 multiplies alpha by `0.45` discontinuously when `max(RGB)-min(RGB) < 45` (dims pale `FeSO₄` and dilute `CuSO₄`).
   - When a vessel is emptied (`vol <= 0.02`), line 762 returns early without hiding `liq.settled`, leaving the precipitate mound inside an empty beaker.
5. **P3 — GPU/interaction checks**: Newly added shared geometries (`stand*Geo`, `holderGeo`, `holeGeo`) and `thinGlassMat` are properly marked shared and disposed (`render3d.js:89-93,852,1044-1049`), and `noPick` prevents stand raycast hits (`407,419`). Pre-existing leak: `rimRing` (`render3d.js:208-212`) allocates a `TorusGeometry` that is never added or disposed for porcelain `evaporating` bowls. Auto-pan guard (`dragging == null`, `744`) works during held drags because `dragging` is set synchronously in `onDown` before rAF, though a fast drag released before a slow rAF still pans on release.

---

## C. Test Suite Critique

1. **P1 — `electrolysis refuses every interference…` (`scripts/test-dlab.mjs:1141-1162`) never verifies the named reason and never tests `I⁻` or `Ag⁺`**.
   - Line 1152 only matches `/Chưa hỗ trợ mô phỏng điện phân/` (not `x.why`). For `I⁻`, `ionRedox` consumes all `I⁻` into `CuI + I₂`, so the `I⁻` rule is never exercised — it passes via `I₂`. `Ag⁺` is skipped (`if (!ADD[x.ion]) continue`) and asserted *not* to refuse (`1156`), making `electro-unsup-Ag+` unreachable dead code in `CuCl₂` (`[Cl⁻] ≥ 0.1 M` caps `[Ag⁺] ≤ 1.8e-9 M`), yet `manifest.js:120` marks it verified!
2. **P1 — `P01` explicit quality click hides `watchFrameRate` false triggers (`scripts/lib/dlab-journeys.mjs:483-485`)**.
   - Toggling `Đồ họa` twice sets `ui.qualityChosen = true`, disabling `watchFrameRate` during the busy 8-beaker `high` run. While `r.fps > 30` still checks average FPS, `P01` can no longer detect if a startup burst falsely downgrades a real student's unchosen `"Cao"` session.
3. **P1 — `T02` coordinate change `(470, 230) → (470, 150)` (`dlab-journeys.mjs:1162-1163`) works around a framing regression**.
   - Lowering `target.y` from `0.42` to `0.34` (`render3d.js:548`) pushed world `y = 230` under `.dlab-actionbar`. Lowering the test click to `y = 150` makes `elementFromPoint === 'CANVAS'` pass while hiding that the upper canvas above tall/lifted objects is now obstructed by the action bar.
4. **P2 — `safety: every blocked condition…` (`test-dlab.mjs:1109-1138`) has weak assertions and missing paths**.
   - Never asserts `verdict.reasons` (any unrelated block passes). `naInto('testTube', 'water', 15)` has `< 50 mL` water, so it still passes if the narrow-mouth rule breaks. Only tests `move` onto a lit burner, not turning a burner on under a cylinder/dish/cracked vessel (`safety.js:57-63`).
5. **P2 — `P03` Part 2 (`dlab-journeys.mjs:523-527`) can pass even if `ui.qualityChosen` is broken**.
   - Unlike `P01`, `P03` never pours `NaOH` (8 static beakers, zero particles). Part 2 waits only `6 s` without verifying FPS stayed `< 25` or `dt <= 2 s`; on a fast host or >2 s throttled frames it passes trivially. Never verifies 3D/2D rendering actually switched.
6. **P2 — `X06` (`dlab-journeys.mjs:1339-1373`) and manifest `tests` check (`test-dlab.mjs:1205-1206`)**.
   - `X06` only asserts internal `L.state` (`> 0` / `> 1e-7`, never visible observations, labels, or element conservation) and bypasses default action-bar target selection. `test-dlab.mjs:1205` only regex-greps source for `test('prefix')` — not that the test passed or covers the entry (e.g., `boiling` cites a test that never boils a water–ethanol mixture on a burner).

---

## D. 3D & UX Critique (from `before/` vs `after-c/` Screenshots)

Improvements confirmed: lighter bench reads much better with contact shadows; tighter selection rings are cleaner; thin glass makes rod/dropper visible; `closeup-precipitate` shows readable flakes.

### What Still Looks Wrong / Unclear to a 15-Year-Old Student
- **Floating & bizarrely mounted tools**: `Giấy quỳ tím` still floats in midair (`acid-base`, `organic`). Clamping hand tools (glass rod, spatula, tongs, dropper) high up on 2–3 separate tall retort stands (`precipitate`, `metals`, `organic`) looks unnatural; the `electrodes` clamp pokes into empty air between the rods (`electrolysis`); yellow highlight rings sit on empty bench in front of stand bases; in `closeup-metals`, a leftover tongs stand pole bisects the beaker background like a rod inside the `CuSO₄`.
- **Gravity-defying & overlapping glassware**: Three round-bottomed test tubes balance upright without a rack (`organic`). In `oil-water-ethanol-cui`, Sandbox beakers `D, E, F` clip directly through starter beakers `A, B, C` (test tube `C` stands *inside* beaker `F`).
- **Washed-out chemistry visuals**: In `oil-water-ethanol-cui`, `CuCl₂ + KI` (Cốc F) lost its yellow-brown `I₂` color from `before` and now looks muddy grey-white. `closeup-gas` shows zero bubbles (reaction already finished at `0:26`) and a thick grey washer-like meniscus ring. `closeup-precipitate` flakes look like coarse polygonal pebbles.
- **UI/label crowding**: Close-up shots have `.dlab-actionbar` clipped at the top and the right drawer's `×` button overlapping `"Khám phá"` (`Khám ph✕`, `closeup-metals`/`gas`). Label pills cover bottle caps and bridge legs (`acid-base`, `electrolysis`).

### 5 Most Valuable Next Improvements (Zero Software-WebGL Cost)
1. **Lay hand tools flat on the bench (or one shared tray) & put `organic` tubes in a rack**: Reserve retort stands only for clamped apparatus (`electrodes`, dipped probes); cuts draw calls while eliminating floating/weird-stand visuals.
2. **Fix stand anchors & vessel-inside detection**: Compute true `inVessel` via `containerAt`, attach arms to actual geometry (electrode top bar, bridge peak, tongs hinge), and align highlight rings with footprints.
3. **Remove double precipitate haze & thin the meniscus ring**: Stop tinting `bulkColor` with settled precipitate so `I₂` brown stays vivid, hide `liq.settled` when empty, and narrow meniscus `RingGeometry` (`0.96–1.0`).
4. **Prevent vessel overlap & tighten label placement**: Keep `freeX()` clear of existing vessels in Sandbox/evidence scripts and space guided bottles slightly wider so pills never cover caps/bridge legs.
5. **Fix UI chrome overlaps & `watchFrameRate` 3D fallback**: Fix the `Khám phá` / `×` CSS collision, make `setQuality('low')` actually drop `scene.environment` without writing `localStorage`, and pause `watchFrameRate` during `fastForward()` / `toggle3d()`.
