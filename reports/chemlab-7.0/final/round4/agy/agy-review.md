### Scope & Evidence Note
Read-only static and visual review of [round4.diff](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/agy/round4.diff), [agy-ammine.md](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/agy/agy-ammine.md), and the touched source/test files. Nothing was executed. For screenshots, I inspected [r4-ammine-1-cuso4.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-1-cuso4.png) and [r4-ammine-4-deep-blue.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-4-deep-blue.png); the remaining `r4-*.png` filenames in `wip/` could not be enumerated in read-only mode without a directory-listing tool, so screenshot critiques below are strictly limited to those two images plus code-level inspection of [render3d.js](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js).

---

### 1. Ammine Speciation & Engine Interactions

**What checks out:**
- Mass and charge balance in `freeAmmonia()`, `freeMetal()`, `chargeAt()`, and `ionicStrength()` ([chemistry.js](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L79-L180)) are algebraically exact for the modelled species set (`[M(NH₃)ᵢ]ᶻ⁺` retains charge `z`, bound `NH₃` is excluded from `NH₄⁺`, dimer quadratic uses the cancellation-safe Citardauq form). Charge balance `chargeAt(h, conc, freeAmmonia(conc, h))` is provably monotonic in `h`.
- `NH₃` with no complexing metal ([chemistry.js](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L104-L105)) returns `N * Ka / (Ka + h)` in closed form, keeping `L * h / Ka` identical to `weakCharge('ammonia', N, h)`.
- `AgCl` dissolves, `AgI` stays (`Ksp·β₂ = 9.6e-10`), `Ag₂CO₃` dissolves cleanly in `2 M NH₃` (`Q ≈ 7e-19 << Ksp`), and `AgNO₃ + excess NH₃` suppresses the `Ag₂O` hint via `freeConc('Ag+', ...)` ([processes.js](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L316)). Elemental totals stay conserved because complexes are computed read-only from analytical totals.

**Concrete defects:**

- **[P1] False `Zn(OH)₂` amphoteric warning triggered by `ZnSO₄ + NH₃ 2 M`**
  - **Where:** [reactions.js:44](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L44), [processes.js:304-327](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L304-L327)
  - **Scenario:** `5 mL ZnSO₄ 0.5 M + 50 mL NH₃ 2 M` (`pH ≈ 11.61`), or `2 mL ZnSO₄ 0.5 M + 30 mL NH₃ 2 M` (`pH ≈ 11.71`).
  - **Why it is wrong:** `nh3-2m` itself has `pH ≈ 11.78`, exceeding `ION_HINTS`'s `minPH: 11.5` for `Zn2+`. Because `has('Zn2+')` matches dissolved `[Zn(NH₃)₄]²⁺`, `ionHints()` fires `"Chưa hỗ trợ… Zn(OH)₂ lưỡng tính tan trong kiềm dư tạo [Zn(OH)₄]²⁻"` during the newly modelled `ZnSO₄ + NH₃ 2 M` experiment, where dissolution is via `[Zn(NH₃)₄]²⁺` and `[Zn(OH)₄]²⁻` is negligible (`< 10⁻⁵ M` at `pH 11.6`).
  - **Suggested fix:** Raise `minPH` on the `Zn2+` amphoteric hint to `12.0` (above `2 M NH₃`'s max `pH 11.78`, still triggered by excess `NaOH 0.5 M` at `pH ≈ 13.0–13.3`) and/or require `ammineShare(c.contents, 'Zn2+') < 0.5`.

- **[P1] Electrolysis guard bypassed just past 2:1 `NH₃:Cu`, electrolysing `[Cu(NH₃)ᵢ]²⁺` as plain `CuCl₂`**
  - **Where:** [processes.js:298-301](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L298-L301), [processes.js:597-612](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L597-L612)
  - **Scenario:** `10 mL CuCl₂ 0.5 M` (`5 mmol Cu`) + `5.5 mL NH₃ 2 M` (`11 mmol NH₃`).
  - **Why it is wrong:** `~96–98%` of Cu is precipitated as `Cu(OH)₂↓`, while the remaining `2–4%` (`~0.1–0.2 mmol`) dissolved in `c.contents.ions['Cu2+']` is `>99.9%` ammine complex (`[Cu²⁺]_free < 10⁻⁶ M`). Because `ammineShare()` divides complexed Cu by **total** Cu (dissolved + precipitated), it returns `0.02–0.04 < 0.05`, bypassing line 603. Line 609 then sees `cu = 0.1–0.2 mmol > 1e-7` and electrolyses the ammoniacal solution as `CuCl₂`, while `equilibrate()` keeps redissolving `Cu(OH)₂` into `[Cu(NH₃)ᵢ]²⁺` every 6 steps to sustain the fake electrolysis.
  - **Suggested fix:** In `stepElectro()`, check the complexed fraction of **dissolved** copper (`(ammineComplexes(c.contents)['Cu2+'] || 0) / Math.max(1e-12, cu) > 0.05`) in addition to `ammineShare > 0.05` (and/or require `cu > 1e-7`).

- **[P2] Triple-nested bisection performance hazard during pouring / multi-precipitate equilibrium**
  - **Where:** [chemistry.js:119-123](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L119-L123), [chemistry.js:150-154](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L150-L154), [chemistry.js:327-363](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L327-L363)
  - **Scenario:** Tilt-pouring `NH₃ 2 M` into `CuSO₄` (or a mixture with two precipitates such as `Cu(OH)₂` + `AgCl`) calls `addParcel()` → `equilibrate()` at 60 Hz.
  - **Why it is wrong:** `kspEquilibrium` (`≤6 rounds × 48 steps`) calls `solveH` (`56 steps`), which calls `freeAmmonia` (`50 steps`) — up to **134,400 `excess()` evaluations per precipitate per round**, plus repeated redundant `solveH()` calls in `mix()`, `ammineNotes()`, `ammineShare()`, `refreshDerived()`, `bulkColor()`, and `contentsName()`.
  - **Suggested fix:** Solve `freeAmmonia()` with 5–8 safeguarded Newton steps (or 32-step bisection with tight bounds), cache `(h, L)` per `equilibrate`/`refreshDerived` pass, and pass `(h, L)` into `ammineComplexes` / `ammineShare` / `bulkColor`.

- **[P2] Inverted bisection bounds in `freeAmmonia()` for trace `NH₃` at low pH**
  - **Where:** [chemistry.js:116-124](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L116-L124)
  - **Scenario:** Trace `NH₃` (`N < 1e-19 M`, possible via `scaleContents` or tiny drops) evaluated at `solveH`'s upper bracket `h = 10^1.5`.
  - **Why it is wrong:** `hi = Math.log10(N * Ka / (Ka + h))` drops below the hardcoded `lo = -30`, inverting `[lo, hi]`. When `excess(hi) > 0`, bisection moves `hi` *up* toward `-30`, returning `L ≈ 10⁻³⁰ > N·Ka/(Ka+h)` (violating N mass balance).
  - **Suggested fix:** Set `let lo = Math.min(-30, hi - 20)`.

- **[P2] `ionRedox` (`Cu²⁺ + I⁻`) and Daniell cell ignore ammine complexation**
  - **Where:** [chemistry.js:270-285](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L270-L285), [processes.js:655-662](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L655-L662)
  - **Scenario:** (a) `CuSO₄ + NH₃ + acid` buffered at `pH 6.8–7.0` with `L ≈ 0.01 M` + `KI`: `E(Cu²⁺/CuI)` drops below `E(I₂/I⁻)`, yet `ionRedox` checks only `pH <= 7` and consumes analytical `ions['Cu2+']` to 100% completion. (b) Adding `NH₃ 2 M` to the `CuSO₄` half-cell of a Daniell cell leaves voltmeter `E` at `~1.10 V` because `cCu` uses analytical total instead of `freeConc('Cu2+', ...)`.
  - **Suggested fix:** Use `freeConc` in Daniell cell Nernst calculation (or refuse when `ammineShare > 0.05`), and gate `cu-i` redox on `freeConc('Cu2+', ...)` or `ammineShare < 0.5`.

- **[P2] `ammineComplexes()` and `ammineNotes()` ignore `polarPhase(contents).pHApplies` in ethanol-rich mixtures**
  - **Where:** [chemistry.js:13-19](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L13-L19), [chemistry.js:214-228](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L214-L228), [processes.js:777-786](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L777-L786)
  - **Scenario:** `5 mL CuSO₄ + 10 mL NH₃ 2 M + 30 mL ethanol` (`67%` ethanol; `pHOf` returns `null`).
  - **Why it is wrong:** `aqueousLitres()` includes ethanol (`LIQUIDS.ethanol.aqueous === true`), so `ammineComplexes()` solves aqueous `solveH` + `βᵢ` over the water+ethanol volume and `ammineNotes()` emits definitive aqueous complex notes even while `pH` is disabled; `solventNotes()` ([processes.js:346](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L346)) mentions only `pH, Ksp và tốc độ phản ứng`, not complex stability constants.
  - **Suggested fix:** Return `{}` from `ammineComplexes()` when `water <= 0.001`, skip `ammineNotes()` (or append a qualitative caveat) when `!polarPhase(c.contents).pHApplies`, and mention complex constants in `solventNotes()`.

---

### 2. Data Choice & Manifest Honesty

**Assessment:**
- **Adding `nh3-2m` (2 M NH₃):** Scientifically necessary and well-justified. As shown in [agy-ammine.md](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/agy/agy-ammine.md#L21-L34), unbuffered `0.5 M NH₃` cannot finish dissolving `Cu(OH)₂` or `Zn(OH)₂` at `0.05 M` metal under any physically valid `Ksp`.
- **Keeping CRC `Ksp = 2.2e-20` for `Cu(OH)₂`:** Defensible *given* the engine's `NUCLEATION_LOG = 1` (`10·Ksp` nucleation threshold). Raising `Ksp` to `1.6e-19` makes nucleation require `1.6e-18`, double-counting supersaturation and shifting the guided `CuSO₄ + NaOH` threshold from `3 mL` to `12.6 mL` due to `Cu₂(OH)₂²⁺` buffering.
- **Pairing Lange/Bjerrum finite-`I` `βᵢ` (`lg β₄ = 13.32` for Cu) with `I = 0` CRC `Ksp`:** Pragmatically defensible because finite-`I` `β₄` (+1.57 log units above NIST `I = 0`) and aged `Ksp` (-0.86 log units below fresh amorphous `Ksp`) partially cancel in `Ksp·β₄` (`4.6e-7` vs `7.5e-7` for fresh `Ksp` + NIST `I = 2 M` `β₄`). **However, the documentation/manifest has two honesty/clarity issues and one UI naming bug:**

- **[P1] Double `"2 M 2 M"` label on `nh3-2m` bottles**
  - **Where:** [materials.js:190](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L190), [sim.js:71](file:///d:/EduLab/ChemLab/src/dlab/engine/sim.js#L71), [library.js:30](file:///d:/EduLab/ChemLab/src/dlab/ui/library.js#L30)
  - **Scenario:** Placing a stock bottle of `nh3-2m` on the bench.
  - **Why it is wrong:** `materials.js:190` bakes `'2 M'` into `r.name` (`'Dung dịch amoniac 2 M'`), while `sim.js:71` unconditionally appends `r.M` (`${r.name} ${r.M} M`), producing `"Dung dịch amoniac 2 M 2 M"`. In the library panel it also duplicates `'2 M'` in both name and subtitle (`'NH₃ · 2 M'`).
  - **Suggested fix:** Name `nh3-2m` `'Dung dịch amoniac đặc hơn'` or `'Dung dịch amoniac'` (if `library.js` distinguishes via `sub`) or strip trailing `M` / avoid duplicating `r.M` in `sim.js:71` when `r.name` already contains it.

- **[P2] Slightly misleading `source`/`limits` and single-shot demo mismatch in `manifest.js`**
  - **Where:** [manifest.js:90-92](file:///d:/EduLab/ChemLab/src/dlab/data/manifest.js#L90-L92)
  - **Why it is wrong:**
    1. `source` says `"Đối chiếu NIST SRD 46 (I = 0)"` and `limits` quotes the range `11,75–13,3`, without disclosing that the engine uses the top finite-`I` value (`13,32`, 37× higher than NIST `I = 0` `11,75`) — at NIST `I = 0`, `30 mL NH₃ 2 M` would not dissolve `5 mL CuSO₄`.
    2. `limits` claims `"Với NH₃ 0,5 M chỉ tan ≈ 80 %"` without specifying the volume/concentration (`5 mL CuSO₄ 0,5 M + 50 mL NH₃ 0,5 M`). Even with `NH₃ 2 M`, diluting `5 mL CuSO₄` with `20 mL` water first (as in [r4-ammine-1-cuso4.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-1-cuso4.png) → [r4-ammine-4-deep-blue.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-4-deep-blue.png)) lowers `L` enough (`Q = 5.2e-20 > 2.2e-20`) that `~2.6% Cu(OH)₂↓` remains undissolved after `30 mL NH₃ 2 M`.
    3. `ammine-cu` `observe` describes sequential precipitation then redissolution, whereas its own `demo` pours `30 mL` in one shot so `Cu(OH)₂` never forms.
    4. `ammine-ag` omits the school safety note about explosive `Ag₃N` if ammoniacal `Ag⁺` solutions are stored or allowed to dry (flagged in [agy-ammine.md:74](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/agy/agy-ammine.md#L74)).
  - **Suggested fix:** State explicitly in `ammine-cu.limits` that `lg β₄ = 13,32` (finite-`I` Bjerrum) is paired with CRC `Ksp`, give the `5 mL + 50 mL` reference amounts for the `≈ 80%` figure, and add the `Ag₃N` storage warning to `ammine-ag`.

---

### 3. Notes & Labels

- **[P1] `contentsName()` mislabels strongly acidic `HCl + trace NH₃` as `NH₄Cl + NH₃` and appends false `+ NH₃` to acidic `CuSO₄ + little NH₃`**
  - **Where:** [labels.js:56-58](file:///d:/EduLab/ChemLab/src/dlab/ui/labels.js#L56-L58)
  - **Scenario:**
    1. `20 mL HCl 0.5 M + 1 mL NH₃ 0.5 M` (`pH ≈ 0.35`, `9.5 mmol HCl` + `0.5 mmol NH₄Cl`, zero free `NH₃`). Line 57 sees `(ions.NH3 || 0) >= 1e-6` and maps `Cl-` to `NH₄Cl`, **dropping `HCl` completely**; line 58 then pushes `'NH3'`, labeling `pH 0.35` hydrochloric acid as **`NH₄Cl + NH₃`**!
    2. `10 mL CuSO₄ 0.5 M + 2 mL NH₃ 0.5 M` (`pH ≈ 4.5`, 99.99% of N is `NH₄⁺`, `[NH₃]_free ≈ 10⁻⁶ M`). Line 58 checks analytical total `ions.NH3 > 1e-6` and labels the beaker **`CuSO₄ + (NH₄)₂SO₄ + NH₃ + Cu(OH)₂↓`**, falsely showing free `NH₃`.
  - **Suggested fix:** Track leftover anion charge `excessQ` vs `nh4Mol` (from `freeConc('NH3', ...)` and `h/Ka`): only replace an acid with `NH₄⁺` salt up to `nh4Mol` (keep the acid formula when `excessQ > nh4Mol * 1.05`), and push `'NH3'` on line 58 only when **free** `NH₃` (`freeConc('NH3', c.contents, h, V) * V`) exceeds `1e-6` (and e.g. `> 0.05 * ions.NH3`).

- **[P1] False `"tan trong NH₃ dư"` dissolution note when acid or water dissolves a precipitate**
  - **Where:** [processes.js:777-786](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L777-L786)
  - **Scenario:** Pour `5 mL CuSO₄ 0.5 M + 50 mL NH₃ 0.5 M` in one pour (leaves ~20% `Cu(OH)₂↓` alongside ~80% `[Cu(NH₃)₄]²⁺`; `ammine-dis-Cu(OH)2` has not fired yet). Next, pour `5 mL HCl 0.5 M`: acid dissolves `Cu(OH)₂↓` while `ammineShare` remains `> 0.05`.
  - **Why it is wrong:** Line 782 checks only `before[k] - after[k] > 1e-7` and `ammineShare > 0.05`, so it logs `"Kết tủa Cu(OH)2 tan trong NH₃ dư, tạo phức [Cu(NH₃)₄]²⁺ màu xanh thẫm."` even though **HCl** dissolved the solid!
  - **Suggested fix:** Pass `cxBefore` (or whether `parcel` added `NH3`) into `ammineNotes()` and emit `ammine-dis-` only when complexed metal actually increased (`(cx[metal] || 0) - (cxBefore[metal] || 0) > 1e-7`) or `parcel.ions.NH3 > 0`.

- **[P2] Malformed `([Ag(NH₃)₂])₂SO₄` / `([Ag(NH₃)₂])₂CO₃` formula and unsubscripted `Cu(OH)2` in notes**
  - **Where:** [labels.js:20](file:///d:/EduLab/ChemLab/src/dlab/ui/labels.js#L20), [labels.js:53](file:///d:/EduLab/ChemLab/src/dlab/ui/labels.js#L53), [processes.js:783](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L783)
  - **Why it is wrong:**
    1. For `Ag₂CO₃ + NH₃` or `AgNO₃ + Na₂SO₄ + NH₃`, `salt('[Ag(NH3)2]', 1, ANION.SO4)` wraps square brackets in redundant parentheses: `([Ag(NH₃)₂])₂SO₄` instead of `[Ag(NH₃)₂]₂SO₄`.
    2. At `labels.js:53`, if `pair` is absent (or excess cation budget) for a complexed metal, `BASE[m]` is `undefined` and it falls back to `IONS[k].label` (`Cu²⁺`) instead of `IONS[k].ammineLabel`.
    3. `processes.js:783` mixes ASCII `PRECIPITATES[k].formula` (`Cu(OH)2`) with Unicode `[Cu(NH₃)₄]²⁺` in the same sentence.
  - **Suggested fix:** In `salt()`, avoid adding `(...)` when `metal.startsWith('[')`; use `m` / `ammineLabel` in line 53 fallback; apply `sub()` to `PRECIPITATES[k].formula` in `ammineNotes`.

---

### 4. 3D Rendering (`render3d.js`) & Visual Critique of Screenshots

**Disposal & Shader Verification:**
- Verified against `node_modules/three/src/renderers/shaders/ShaderLib/meshphysical.glsl.js` (Three.js `0.186.1`): `#include <opaque_fragment>`, `normal`, `vViewPosition`, and `diffuseColor.a` exist, so both `glassMat` and `bubbleMat` Fresnel `onBeforeCompile` hooks compile and execute.
- Disposal ([render3d.js:1063-1090](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L1063-L1090), [sceneHost.js:43-55](file:///d:/EduLab/ChemLab/src/three/sceneHost.js#L43-L55)) cleans up `partGeo`, `partMesh.material`, `flocTex`, `bubbleMat`, and `bubbleMesh.geometry` via `host.dispose()` (`flocTex.dispose()` is called twice, harmlessly idempotent).

**Code-level 3D Defects:**

- **[P1] Transparent sorting tie between `partMesh` and glass `shell`, plus broken multi-vessel & meniscus depth ordering**
  - **Where:** [render3d.js:115-116](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L115-L116), [render3d.js:215-226](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L215-L226), [render3d.js:280-288](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L280-L288)
  - **Why it is wrong:** `liquid` & `surface` have `renderOrder = 1`, while `shell` AND global `partMesh` (origin `(0,0,0)`) BOTH have `renderOrder = 2`, and global `bubbleMesh` has `renderOrder = 3` (all `depthWrite: false`). Consequently: (a) `partMesh` pops in front of/behind glass depending on vessel `x` vs camera distance to `(0,0,0)`; (b) `partMesh` and `bubbleMesh` draw *after* `liquid`, so flocs/bubbles never get tinted or veiled by front liquid and render **in front of** any nearer vessel's liquid (and for bubbles, glass) when orbiting; (c) `meniscus` and `rimRing` stay at default `renderOrder = 0`, drawing *under* the liquid.
  - **Suggested fix:** Split `liquid` into `BackSide` (`renderOrder = 1`) and `FrontSide` (`renderOrder = 3`), place `partMesh` & `bubbleMesh` at `renderOrder = 2`, `shell` at `renderOrder = 4`, and `graduations` / `rimRing` / `meniscus` at `renderOrder = 5` (or attach `Points` per vessel so Three.js sorts per-vessel by distance).

- **[P1] Precipitate flocs are unlit 8 mm polka dots that poke past walls/meniscus and hit `gl_PointSize` caps**
  - **Where:** [render3d.js:108-113](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L108-L113), [render3d.js:754-761](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L754-L761)
  - **Why it is wrong:** `PointsMaterial` is unlit (`size: 8 * S`, circular Gaussian `flocTex`, `opacity: 0.8`), making flocs appear as bright self-luminous snowballs inside dark solutions ([r4-ammine-4-deep-blue.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-4-deep-blue.png)). Adding `spread` (`±2.2 mm`) on top of `r = hw - 2` and `y = v*level + 2` plus `4 mm` billboard radius lets puffs clip outside the glass wall and above the surface. Also, WebGL `ALIASED_POINT_SIZE_RANGE` clamps large `gl_PointSize` on zoom-in on some ANGLE/D3D11 GPUs.
  - **Suggested fix:** Clamp puff centers inside `(hw - 3, [2.5, level + 1])`; replace the circular gradient with an organic multi-lobe floc texture; vary puff size (`3–6 mm`, `FLOC = 5–6`) with lower alpha (`0.25–0.40`); darken/tint vertex colors by ambient light and surrounding liquid color so particles don't glow.

- **[P2] Per-frame GPU re-upload when idle, per-frame allocations, and lazy `bubbleMesh.instanceColor` shader recompile**
  - **Where:** [render3d.js:105](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L105), [render3d.js:780-783](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L780-L783), [render3d.js:849](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L849)
  - **Why it is wrong:** `needsUpdate = true` is set every frame on `bubbleMesh` and `partGeo` even when `b === 0` and `p === 0`; `updateLiquid` allocates `new THREE.Vector3` per vessel per frame; `bubbleMesh.instanceColor` is allocated on the first bubble frame, forcing a `bubbleMat` shader recompile hitch.
  - **Suggested fix:** Guard `needsUpdate` on `b > 0` / `p > 0`, reuse module-level `v3`, and pre-allocate `bubbleMesh.instanceColor` at init.

**Visual Critique of Screenshots ([r4-ammine-1-cuso4.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-1-cuso4.png), [r4-ammine-4-deep-blue.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/final/round4/wip/r4-ammine-4-deep-blue.png)), in priority order:**
1. **Glass reads as frosted grey plastic, washing out solution colors:** `glassMat.opacity = 0.14` ([render3d.js:60](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L60)) veils the entire beaker front face in 14% milky haze. In `r4-ammine-4-deep-blue.png`, `[Cu(NH₃)₄]²⁺` looks muted dusty lavender-slate rather than deep royal blue; in `r4-ammine-1-cuso4.png`, `0.1 M CuSO₄` looks nearly colorless milky grey.
   - *Three.js fix:* Lower face-on `glassMat.opacity` to `0.04–0.05`, sharpen Fresnel edge rim (`0.72 * pow(1 - abs(dot(N, V)), 3.5)`), add a darker grazing rim tint and thicker glass base ring, and deepen `[Cu(NH₃)₄]²⁺` color/opacity (`[10, 24, 145]`, `alpha` up to `0.94`).
2. **Precipitate flocs read as glowing polka-dot confetti:** In `r4-ammine-4-deep-blue.png`, ~48 bright uniform cyan dots float on top of the dark liquid (both visually unconvincing and chemically distracting because `25 mL 0.1 M CuSO₄ + 30 mL 2 M NH₃` left 2.6% undissolved `Cu(OH)₂`).
   - *Three.js fix:* Organic floc texture + smaller/varied lit/veiled puffs + liquid BackSide/FrontSide sandwiching (above).
3. **Matte liquid body (`roughness: 0.9`) clashes with glossy top disc (`roughness: 0.22`):** Visible hard shading seam at the liquid rim in `r4-ammine-4-deep-blue.png`, and chalky matte appearance on the side wall.
   - *Three.js fix:* Keep liquid `FrontSide` moderately glossy (`roughness: 0.25–0.35`) while suppressing specular only on `BackSide` (the original source of the pink patch), and replace the flat `meniscus` ring with a subtle concave curved lathe fillet.
4. **Bench moiré dots, stark bench-wall horizon, and competing blue selection ring:** `speckleTexture` ([render3d.js:1117](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L1117)) creates visible diagonal moiré grids on the grey bench; the unlit white tiled wall meets the dark bench as a sharp horizon bisecting the beaker; the bright blue selection ring (`0x2f7cf6`) competes visually with blue copper solutions.
   - *Three.js fix:* Enable anisotropy on `benchTex` with larger low-contrast 256×256 noise, add a soft backsplash/AO strip at the wall-bench seam, and lower idle selection ring opacity (`~0.45`) or use a neutral/amber tint.
5. **Oversized enamel graduations:** White ticks/numbers (`34px` bold) look slightly chunky compared to real borosilicate markings ([render3d.js:187](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L187)).
   - *Three.js fix:* Thinner strokes, `600 26px` font, `opacity: 0.65`.

---

### 5. Tests (`scripts/test-dlab.mjs`)

- **[P1] `'ammine complexes: model'` does NOT independently test N mass balance or charge balance (partially echoes engine)**
  - **Where:** [test-dlab.mjs:1168-1231](file:///d:/EduLab/ChemLab/scripts/test-dlab.mjs#L1168-L1231)
  - **Why it is wrong:**
    1. Lines 1175–1176 describe an independent closed-form expectation (`L = C_N − 4·C_Cu − [NH₄⁺]`), but the test never computes or asserts `pH`, `[OH⁻]`, `[NH₃]_free`, or `[Cu²⁺]_free` for any metal + `NH₃` mixture — it reads `ammineComplexes(c.contents)` back from the engine and checks a very wide bracket `share > 0.6 && share < 0.95` (line 1198). Even if `freeAmmonia()` ignored bound `NH₃` completely (`bound = 0`), every assertion in this test would still pass!
    2. `Zn²⁺` ammine complexation is completely untested in `'ammine complexes: model'` despite [manifest.js:92](file:///d:/EduLab/ChemLab/src/dlab/data/manifest.js#L92) pointing `tests: ['ammine complexes: model']` to it (which is why the false `Zn(OH)₂` amphoteric hint at `pH > 11.5` went uncaught).
    3. Line 1229 checks `!(precipitates.CuI > 0)` in `CuSO₄ + NH₃` and `CuCl₂ + NaOH + NH₃` (neither contains iodide — looks like a copy-paste mistake meant to assert `!(el.cuDeposit > 0) && !(l.s().gas.Cl2 > 0)`).
    4. Line 1201 comment says `Ksp·β₂ ≈ 3·10⁻³` (stale from Round 3's `lg β₂ = 7.23`; with `7.05` it is `1.99·10⁻³`).
    5. Missing tests for `labels.js` complex/`(NH₄)₂SO₄` naming (and `HCl + trace NH₃`), `Ag₂CO₃ + NH₃`, acid redissolution of `Cu(OH)₂` with `NH₃` present, and `benchInventory` N conservation.
  - **Suggested fix:** Add independent closed-form assertions for `pH` and `freeConc('NH3', ...)` in `5 mL CuSO₄ + 30 mL NH₃ 2 M` (`L = C_N − 4·C_Cu − √(Kb·L) ≈ 1.423 M`, `pH ≈ 11.70`) and in `10 mL AgNO₃ + 3 mL NH₃ 0.5 M` (where bound `NH₃` strongly depresses `L` and `pH`), add `ZnSO₄ + 30/50 mL NH₃ 2 M` checks (including no `ionhint-Zn2+`), fix line 1229 to check `el.cuDeposit`/`gas.Cl2`, and add unit tests for the `labels.js` and `ammineNotes` edge cases above.

---

### Ranked Summary
| Priority | Item | Location |
| :--- | :--- | :--- |
| **P1** | False `Zn(OH)₂` amphoteric hint (`minPH: 11.5`) in `ZnSO₄ + NH₃ 2 M` | [reactions.js:44](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L44), [processes.js:318-325](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L318-L325) |
| **P1** | Electrolysis guard bypassed just past 2:1 `NH₃:Cu` (`ammineShare < 0.05` while dissolved Cu is `>99.9%` complexed) | [processes.js:603-612](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L603-L612) |
| **P1** | `contentsName()` labels `HCl + trace NH₃` (`pH 0.35`) as `NH₄Cl + NH₃` and adds `+ NH₃` to acidic `CuSO₄ + NH₃` | [labels.js:57-58](file:///d:/EduLab/ChemLab/src/dlab/ui/labels.js#L57-L58) |
| **P1** | `ammineNotes()` falsely logs `"tan trong NH₃ dư"` when acid/water dissolves a precipitate | [processes.js:782-783](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L782-L783) |
| **P1** | Double `"2 M 2 M"` bottle label for `nh3-2m` | [materials.js:190](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L190), [sim.js:71](file:///d:/EduLab/ChemLab/src/dlab/engine/sim.js#L71) |
| **P1** | 3D `partMesh`/`shell` `renderOrder = 2` tie, multi-vessel sorting break, unlit 8 mm polka-dot flocs clipping walls | [render3d.js:108-116](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L108-L116), [render3d.js:744-763](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L744-L763) |
| **P1** | `'ammine complexes: model'` never tests closed-form `pH`/`[NH₃]_free`, omits `Zn²⁺`, copy-paste `CuI` assertion | [test-dlab.mjs:1168-1231](file:///d:/EduLab/ChemLab/scripts/test-dlab.mjs#L1168-L1231) |
| **P2** | Triple-nested bisection (`48×56×50`) cost per `addParcel`; `freeAmmonia()` inverted bounds when `hi < -30` | [chemistry.js:116-124](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L116-L124), [chemistry.js:327-363](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L327-L363) |
| **P2** | `ionRedox`, Daniell cell, and ethanol `pHApplies` interactions with ammine speciation | [chemistry.js:214-228](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L214-L228), [chemistry.js:270-285](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L270-L285), [processes.js:655-662](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L655-L662) |
| **P2** | Manifest `lg β₄` disclosure / `80%` context / `Ag₃N` warning; `([Ag(NH₃)₂])₂SO₄` double brackets; 3D idle GPU uploads & frosted-glass visual polish | [manifest.js:90-92](file:///d:/EduLab/ChemLab/src/dlab/data/manifest.js#L90-L92), [labels.js:20](file:///d:/EduLab/ChemLab/src/dlab/ui/labels.js#L20), [render3d.js:60](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L60), [render3d.js:780-783](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L780-L783) |
