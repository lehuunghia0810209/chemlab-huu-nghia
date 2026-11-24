# Adversarial Review of Recent `src/dlab` Changes

No P0 crashes were found in the reviewed diff, but there are **5 P1** defects (dead hints, broken school-chemistry qualitative test, guided-lab lockout/rollback bugs, and actively wrong guidance), **5 P2** defects (stale dropdown carry-over, false neutralization logs, overly strict guided predicates, `stepKinetics` hint/E° gaps, and mass-creating recrystallization), and **1 P3** 3D visual issue. **No GPU resource leaks** were found in the 3D additions.

---

## P1 — High Severity

### 1. Two of five `ION_HINTS` are dead code (including the `Zn(OH)₂` amphotericity guard)
- **Location:** [src/dlab/data/reactions.js:38-39](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L38-L39), [src/dlab/engine/processes.js:269](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L269)
- **Scenario A (`Cu²⁺ + NH₃`):** `ION_HINTS[4]` checks for `'NH4+'`, but ammonia is stored under `'NH3'` ([src/dlab/data/materials.js:47](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L47), [160](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L160)). Even if renamed to `'NH3'`, `Cu(OH)2` (`Ksp = 2.2e-20`) precipitates synchronously in `mix() → equilibrate()` before `stepContainer()` calls `ionHints()`, depleting dissolved `Cu2+` to `~1e-11 mol << 1e-7` at `pH ≥ 9`.
- **Scenario B (`Zn²⁺ + excess OH⁻`):** Pour 20 mL `ZnSO4` (0.5 M) + 50 mL `NaOH` (0.5 M) (`pH ≈ 12.85`). `equilibrate()` precipitates `Zn(OH)2` (`Ksp = 3e-17`) before `ionHints()` runs, leaving total dissolved `Zn2+` (including `ZnOH+`) at `≤ ~1e-9 M` (`≤ 3e-10 mol` even in a 300 mL dish), failing `(ions['Zn2+'] || 0) > 1e-7`. The amphotericity warning never fires, silently teaching the opposite of school chemistry (`Zn(OH)2` dissolves in excess alkali).

### 2. New precipitates `Ag₂SO₄` and `CaSO₄` break school qualitative analysis under ideal concentrations
- **Location:** [src/dlab/data/materials.js:77-78](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L77-L78)
- **Scenario:** A student runs the standard textbook test distinguishing `Cl⁻` from `SO₄²⁻` with `AgNO3`: 10 mL `Na2SO4` (0.2 M) + 5 mL `AgNO3` (0.1 M) (or 10 mL `CuSO4`/`ZnSO4` 0.5 M + 3 mL `AgNO3`). Because the engine uses ideal concentrations (`γ = 1`) with CRC thermodynamic `Ksp = 1.2e-5` (halving effective solubility from `0.0266 M` to `0.0144 M`), `Q = (0.0333)² × 0.1333 = 1.48e-4 > 10·Ksp`, producing a **white `Ag2SO4↓` precipitate** in `Na2SO4` where real activity (`I ≈ 0.4 M`, `Q_act ≈ 1.6e-5`) produces none in a school test tube. Similarly, `CaSO4` (`Ksp = 4.93e-5` ideal → `s = 0.0070 M` vs real `~0.015 M`) precipitates ~93% of `Ca²⁺` from equal volumes of `CaCl2` (0.2 M) + `Na2SO4` (0.2 M).

### 3. `g.missing` locks out guided labs when unneeded role objects are removed or replaced
- **Location:** [src/dlab/ui/dlabApp.js:1322-1325](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1322-L1325)
- **Scenario A:** In `acid-base` Step 2, the student creates a second litmus paper and removes (`Cất khỏi bàn`) the spent first paper (`roles.paper`)—or removes `dropper`/`rod`/`naoh` after finishing their steps in `precipitate`, or `el`/`power` after Step 3 in `electrolysis`. `Object.values(g.roles).some(id => !byId(st, id))` becomes `true`, blocking **all** remaining steps from completing even though those objects are never referenced again.
- **Scenario B:** If a role vessel cracks and the student clicks the built-in recovery button *"Lấy dụng cụ thay thế"* (`replace`, [src/dlab/engine/sim.js:218-224](file:///d:/EduLab/ChemLab/src/dlab/engine/sim.js#L218-L224)), the replacement gets a new `id`; `g.roles` still holds the old `id`, permanently locking the lesson.

### 4. Guided undo/reset rollback (`g.done` vs `st.t`) misses same-timestamp completions
- **Location:** [src/dlab/ui/dlabApp.js:1320](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1320), [1325](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1325)
- **Scenario:** Pause the simulation at `st.t = 12.500` and complete `organic` Step 3 (pour oil into `t2`) or `precipitate` Step 1 (pour NaOH), **or** even while running, complete a solid-drop step via `addSolidWithTool`/`drop-solid`/`piece-into` (which calls `select() → draw() → paintGuided()` synchronously before `sim.advance()`). `g.done` pushes `12.500`. Clicking **Undo** restores the pre-action snapshot whose `st.t` is also `12.500`. The check `g.done[last] > st.t + 1e-9` is `false`, so the step remains permanently marked Done after Undo. Same on **Reset** if Step 1 completed at `st.t === 0`.

### 5. `misplaced()` gives backwards instructions on `electrolysis` Step 4 (worsened by `vessels()` ordering)
- **Location:** [src/dlab/ui/dlabApp.js:1351-1361](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1351-L1361), [308-313](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L308-L313), [src/dlab/guided.js:166](file:///d:/EduLab/ChemLab/src/dlab/guided.js#L166)
- **Scenario:** `electrolysis` Step 4 has `need: [zn, cu]` and `target: ['tongs', 'zn', 'cuB']`. `misplaced()` grabs only the **first** container (`r.zn`, Cốc B `ZnSO4`) and checks *both* solids against it. If the student correctly drops `Cu` into `Cốc C (CuSO4)` before dropping `Zn`, the strip warns: *"Dây đồng đang ở Cốc C, không phải Cốc B. Lấy mẩu mới và thả vào Cốc B."* Conversely, `vessels()` puts both `zn` (`x=520`) and `cuB` (`x=660`) in `want`, breaking ties by distance to `tongs` (`x=780`)—so when the student picks `Zn` (auto-selected first), the default "Thả vào" dropdown targets `Cốc C (CuSO4)` instead of `Cốc B (ZnSO4)`.

---

## P2 — Medium Severity

### 6. `patch(el, html, keepPicks)` ignores `keepPicks = false` when HTML or skeleton matches
- **Location:** [src/dlab/ui/dlabApp.js:675-695](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L675-L695), [907-909](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L907-L909)
- **Scenario:** In `acid-base`, select `paper1`, change `Nhúng vào` to `Ống C`, then select a second `litmusPaper` (`paper2`). `same` is `false` (`keepPicks = false`), but both papers produce identical action-bar HTML, so line 676 (`if (el.dataset.html === html) return`) returns immediately and `paper2` inherits `Ống C`. Switching between two droppers with different volumes hits the same bug via line 680 (`el.dataset.skel === skeleton`), skipping rebuild and keeping the previous dropper's `<select>` target.

### 7. `mix()` `'neutralised'` false-fires on `CuSO₄ + NaOH` (and `CuCl₂`/`FeCl₃ + NaOH`); `heatJ` still over-heats precipitation
- **Location:** [src/dlab/engine/chemistry.js:241-243](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L241-L243), [src/dlab/engine/processes.js:172](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L172)
- **Scenario:** 20 mL `CuSO4` (0.5 M) hydrolyzes to `pH ≈ 4.14` (`before.h = 1.44e-6 mol`). Selecting the `NaOH` bottle in Lab 2 and clicking *Rót vào cốc* with the default 50 mL (or ≥25 mL, or any NaOH into 50 mL `CuSO4` / 20 mL `CuCl2` / 20 mL `FeCl3`) drops `after.h ≈ 0`, giving `neutralised = 1.44e-6 > 1e-6` and falsely logging *"Phản ứng trung hòa: H⁺ + OH⁻ → H₂O, tỏa nhiệt."* In addition, `xi` at line 241 still uses `Math.max(...)` rather than `neutralised`, releasing full neutralization heat (`55.84 kJ/mol`, `+558 J` for 10 mmol) for `OH⁻` consumed by `Cu(OH)2` precipitation.

### 8. Overly strict guided predicates (and one wrong-object bypass)
- **Location:** [src/dlab/guided.js:25](file:///d:/EduLab/ChemLab/src/dlab/guided.js#L25), [56-60](file:///d:/EduLab/ChemLab/src/dlab/guided.js#L56-L60), [102](file:///d:/EduLab/ChemLab/src/dlab/guided.js#L102), [196](file:///d:/EduLab/ChemLab/src/dlab/guided.js#L196)
- **Scenario A (`papersIn`, too strict):** Dragging a litmus paper briefly through `A` on the way to `B` (or dipping the starting paper into `B` before `A` in Step 1) permanently sets `o.touched[0]` to the wrong tube in one `1/60 s` tick ([src/dlab/engine/processes.js:787-788](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L787-L788)). Dipping it in the right tube turns it the expected color, yet the step refuses to complete with no hint.
- **Scenario B (`precipitate` Step 5, too strict):** Adding 2 g NaCl as two 1 g scoops dissolves all 2 g (`Na+ = 0.034 mol > 0.02`), but `some(o => (o.mass0 ?? 0) >= 1.5 && o.massG < 0.2)` stays `false` until a single `≥ 1.5 g` scoop is added.
- **Scenario C (`acid-base` Step 5, wrong-object bypass):** Pouring `CuCl2` or `FeCl3` (acidic chloride salts) into `B` supplies `Cl-` and lowers `pH < 8.2` via hydroxide precipitation, completing *"Nhỏ từ từ HCl vào ống B"* without any acid.

### 9. `stepKinetics` hint & `E°` fallback bugs (`Zn + NaOH`, trace `Fe³⁺`, sticky `c.unsupported`, `Ag₂CO₃`)
- **Location:** [src/dlab/engine/processes.js:417-424](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L417-L424), [473-490](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L473-L490), [src/dlab/data/reactions.js:28-29](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L28-L29), [37](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L37), [49-54](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L49-L54)
- **Scenario A (`Zn + NaOH`):** Dropping `Zn` into `NaOH` (`Na+`, `pH 13.7`) hits line 484 (`ION_E0['Na+'] = -2.71 < -0.76`) and wrongly reports *"Không có phản ứng: Zn yếu hơn kim loại của ion Na⁺"*, contradicting `Zn + 2NaOH → Na2ZnO2 + H2↑`.
- **Scenario B (`Fe³⁺` traces & `Zn`/`Mg`):** Line 417 uses `> 0` with no floor; after `FeCl3 + excess NaOH` precipitates `Fe(OH)3`, trace `Fe3+` (`~1e-35 mol`) remains and triggers `"Cu/Fe + Fe³⁺ chưa được mô hình hóa"` on any `Cu`/`Fe` added later. Conversely, `0.2 M FeCl3` hydrolyzes to `pH ≈ 1.48 < 3`; because `Fe3+` is missing from `ION_E0` and `UNSUPPORTED_HINTS` lacks `['Fe3+', 'zn']`/`['Fe3+', 'mg']`, `Zn`/`Mg` in `FeCl3` silently evolve `H2` via `zn-acid`/`mg-acid`.
- **Scenario C (sticky `c.unsupported` & dead code):** Once set (lines 421/436/486), `c.unsupported` is never cleared, leaving a stale Inspector warning and permanently disabling line 473 `NO_REACTION`/`E°` checks even after removing the solid. Line 476 is unreachable dead code (line 419 already returned).
- **Scenario D (`AgNO₃ + excess Na₂CO₃`):** After `Ag2CO3` precipitates (`Ksp = 8.46e-12`), excess `Na2CO3` (`pH ≈ 11.5`) leaves `n(Ag+) ≈ 3.9e-7 mol > 1e-7`, wrongly firing `ION_HINTS[2]` (`Ag2O` unsupported) on a modelled precipitate.
- *(Verified clean: `HCl + NaOH`, `Fe + CuSO4`, `Zn + HCl`, `Na + water`, `NaHCO3 + CH3COOH`, and `CuCl2` electrolysis do **not** trigger false hints.)*

### 10. Unbounded negative `dn` in `stepDissolve` creates solid mass during boiling
- **Location:** [src/dlab/engine/processes.js:367-380](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L367-L380)
- **Scenario:** Boil a beaker containing 1 g solid `NaCl` (or `KNO3`) + 1 g dissolved salt down to `0.1 g` water (`T = 100 °C`, `tempBoost = 181`, `driving ≈ -25`). `dn` is clamped above (`Math.min(dn, s.massG / M)`) but not below, yielding `dn ≈ -0.68 mol` while only `0.017 mol` is dissolved. Line 379 adds `~40 g` to `s.massG` while line 380 clamps ions to `0`, creating mass out of thin air.

---

## P3 — Low Severity (Visual / Polish)

### 11. 3D wire anchors clip through glass and below the bench; 3D oil top disc averages water + oil
- **Location:** [src/dlab/ui/render3d.js:470-475](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L470-L475), [661-663](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L661-L663)
- **Scenario A (wires):** For voltmeter leads to solid electrodes (`Zn`/`Cu` in Daniell cell), `EQUIPMENT['solid']` is `undefined`, so `top()` anchors at `o.y + 12 mm` (piercing the beaker wall rather than clearing the rim as in [src/dlab/ui/render2d.js:173](file:///d:/EduLab/ChemLab/src/dlab/ui/render2d.js#L173)), and `mid.y = Math.min(p0.y, p1.y) - 0.15` puts the sag at `y = -0.03` **below the bench**.
- **Scenario B (oil surface):** `liq.surface` colors the top disc with the mean of all `GW × GH` cells (`sum / n`), so floating oil (Lab 5 Step 3) appears muddy grey-green from above instead of oil yellow.
- **3D resource-leak check:** `updateWires()` disposes replaced `TubeGeometry` and shares `wireMat`; `cathode` material is disposed via `disposeTree()`; `updateLiquid()` reuses `liq.tex`/`liq.map`; `api.dispose()` ([src/dlab/ui/render3d.js:870-879](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L870-L879)) and `sceneHost.dispose()` clean up all added objects. **No GPU resource leak found.**
