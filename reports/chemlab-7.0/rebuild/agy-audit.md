# Dynamic Laboratory (`src/dlab/**`) — Adversarial Architecture & Scientific Audit

**Scope inspected (read-only):** `src/dlab/engine/{sim,chemistry,processes,safety}.js`, `src/dlab/data/{materials,reactions,equipment}.js`, `src/dlab/ui/{dlabApp,render2d,render3d,observations,library,labels,icons}.js`, `src/dlab/{guided,persistence}.js`, `scripts/test-dlab.mjs`, `scripts/lib/dlab-journeys.mjs` (plus `src/data/elements.js`, `src/chem/formula.js` for molar-mass verification).

---

## 1. Architecture Audit

### 1.1 Single Simulation Core & State Ownership
There is **one** simulation core (`createSim` in `src/dlab/ui/dlabApp.js:24`) and **one** canonical chemical state (`sim.state`) read by both 2D (`render` at `src/dlab/ui/dlabApp.js:200`) and 3D (`three.update` at `src/dlab/ui/dlabApp.js:148`). Neither `src/dlab/ui/render2d.js` nor `src/dlab/ui/render3d.js` mutates chemical composition or `sim.state`; 3D pointer events delegate to `dlabApp.js`'s shared `controller` (`src/dlab/ui/render3d.js:722-790`, `src/dlab/ui/dlabApp.js:1482-1489`).

However, **state ownership is breached in three places inside `dlabApp.js` and `guided.js`:**

1. **UI mutates `sim.state` directly outside `sim.dispatch()`, bypassing `assess()` (safety) and undo invariants:**
   - `dlabApp.js:473-474` (`dragTo`) mutates `o.x`, `o.y` directly; `assess()` for `move` only runs on `pointerup` (`dlabApp.js:597`). Holding a non-heat-resistant `cylinder` or `CRACKED` beaker over an active burner during a drag causes `stepContainer` (`src/dlab/engine/processes.js:585, 602`) to heat and shatter it before `assess()` can block the move.
   - `dlabApp.js:554, 1087` mutate `o.angle` directly (triggering live pouring at `processes.js:540`), and `dlabApp.js:280, 328-329, 454, 520-521, 593-595, 642-645, 1035, 1081-1083, 1096-1097, 1181, 1185` directly write `x`, `y`, `held`, `angle`, `paused`, `speed`.
2. **Guided Lab progress lives outside `sim.state` and can crash the render loop:**
   - `ui.guided = { lab, roles, done: [], finished: false }` (`dlabApp.js:1305`) is UI-local and append-only (`g.done.push(st.t)` at `dlabApp.js:1320`). Exported stateless `guidedProgress()` (`src/dlab/guided.js:205-212`) is dead code.
   - `sim.undo()` (`dlabApp.js:634, 1187`) and `resetSim()` (`dlabApp.js:132, 1188`) never roll back `ui.guided.done`; save/load drops guided mode entirely (`dlabApp.js:1434`).
   - Deleting any target vessel (`dlabApp.js:646, 846`) leaves dangling IDs in `g.roles`; unguarded dereferences like `obj(s, r.B).contents` (`src/dlab/guided.js:57-58, 86, 97-99, 129, 161-163, 165, 195-197`) throw `TypeError` inside `paintGuided()` (`dlabApp.js:1320`), permanently killing the `requestAnimationFrame` loop (`dlabApp.js:141-149`).
3. **2D vs 3D visual divergence on the same state:**
   - `render3d.js` never renders the immiscible `oil` layer (`render3d.js:591-649` vs `render2d.js:560-597`), cathode `cuDeposit` (`render3d.js:270-273` vs `render2d.js:411-412`), `state.wires`, `state.drops`, `bridge.links` spanning vessels, `gasTank.target` tubing, `state.spill`, or `CRACKED`/`WARNING` damage (`UNUSABLE` hides the vessel at `render3d.js:484`).
   - `src/dlab/ui/observations.js:69` resolves the vessel for a finished reaction via `.find(Boolean)` over all `rx-<id>-*` notes, misattributing pH/indicator conclusions if two vessels run the same reaction.

### 1.2 Guided Lab Step-Completion Bypasses (`src/dlab/guided.js`)

| Lab & Step | Line | Flaw | Non-target / Stale Bypass |
| :--- | :--- | :--- | :--- |
| `precipitate` #4 | `guided.js:99` | Relies on permanent note `s.notes['ppt-Cu(OH)2-' + r.beaker]` set in Step 1 (`processes.js:175`) + absence of `Cu(OH)2`. | After Step 3 (stirred suspension), pour beaker out onto bench or shatter it: `Cu(OH)2` hits 0, stale Step-1 note remains truthy → **completes with empty/broken beaker and zero HCl**. |
| `precipitate` #5 | `guided.js:100` | Checks `o.massG < 0.2` with no check on initial mass or water. | Drop `0.1 g` NaCl (even into an emptied beaker) → **instant pass without dissolving**. |
| `precipitate` #1 (`progress`) | `guided.js:90` | Infers NaOH added from total `ions['Na+']`. | Adding `NaCl` or `Na2SO4` falsely reports `"Đã thêm X mL NaOH"`. |
| `acid-base` #2–#3 | `guided.js:25, 55-56` | `papersIn` checks `o.touched?.includes(cid)` and `wet > 0.4` without requiring distinct papers; `processes.js:760` records `touched` on the first 1/60 s tick. | Reuse the single wet paper from Tube A and brush Tubes B & C for 1 tick (no color change in B/C) → **completes Steps 2 & 3**. |
| `acid-base` #5 | `guided.js:58` | Checks only `phenolphthalein > 0 && pH < 8.2`. | Pour Tube A, bubble CO₂, or dilute twice with water → **passes without HCl bottle**. |
| `metals` #3 | `guided.js:129` | Checks `zn` in `r.acid` AND cumulative `r.acid.gasOut?.H2 > 2e-5`. | Earlier `mg`/`fe` in `r.acid` leaves stale `gasOut.H2`; dropping `zn` after acid is exhausted still passes. |
| `electrolysis` #1–#2 | `guided.js:161-162` | Step 1 uses `e.y < surfaceY(c) - 3` while `processes.js:485` requires `surfaceY(c) >= el.y + 4` (1 mm dead zone). Step 2 checks only `r.power.current > 0`. | Wiring `r.power` to electrodes in a **different** CuCl₂ beaker (or setting 2 V instead of 6 V) completes Step 2. |
| `organic` #2–#4 | `guided.js:195-197` | Step 2 checks only `r.acid.gasOut?.CO2 > 1e-5`; Steps 3–4 don't require water in `t2`/`t3`. | Dropping `CaCO3`, `Na2CO3`, or CO₂ tank completes Step 2 without `NaHCO3`; pouring out water before adding oil/ethanol still passes Steps 3–4. |

---

## 2. Chemistry & Scientific Audit

### 2.1 Reaction-by-Reaction Verification

| Supported System | Files | Stoichiometry & Conservation | Constants vs Reputable Sources | Key Scientific Defects |
| :--- | :--- | :--- | :--- | :--- |
| **Acid–base & indicators** | `materials.js:52-59, 101-131`, `chemistry.js:24-103, 231-243` | Charge balance exact for `HCl`, `H2SO4`, `HNO3`, `CH3COOH`, `NaOH`, `KOH`, `Ca(OH)2`, `NH3`, `Na2CO3`, `NaHCO3`. **Broken in `mix()` heat/log (`chemistry.js:241`)**: uses `max(ΔH+, ΔOH-)` as `H+ + OH- -> H2O`. | `Kw=1e-14`, `HSO4- Ka2=1.0e-2`, `HOAc Ka=1.75e-5`, `NH4+ Ka=5.6e-10`, `H2CO3 Ka1=4.45e-7, Ka2=4.69e-11`, `NEUTRALIZATION_DH=-55840 J/mol` match CRC/NBS (25 °C). Indicator `pKin` (phenolphthalein 9.4, methyl orange 3.46) standard. Ideal (`γ=1`), flagged at `I>0.1 M` (`chemistry.js:78`). | `mix()` logs fake `H+ + OH- -> H2O` and adds `-55.84 kJ/mol` heat for `CuSO4+NaOH`, `MgCl2+NaOH`, `HCl+Na2SO4`, `HCl+NH3`, `HCl+NaHCO3` (`chemistry.js:241`, `processes.js:172`). |
| **Cu²⁺ + OH⁻ precipitation** | `materials.js:38, 69`, `chemistry.js:5, 38-43, 155-200` | `Cu2+ + 2OH- ⇌ Cu(OH)2(s)` conserves Cu and charge (`shift` at `chemistry.js:136-140`). | `Ksp=2.2e-20` (CRC older table) vs IUPAC Powell et al. (2007) `log *Ks0 = 8.68 → Ksp = 4.8e-20` ([doi:10.1351/pac200779050895](https://doi.org/10.1351/pac200779050895)); `hydrolysisKa=10^-7.95` vs `-7.97 ± 0.09`, `dimerBeta=10^-10.43` (matches Powell 2007). `NUCLEATION_LOG=1` is an unverified educational approximation. | Missing `Cu(OH)2` thermal dehydration (`→ CuO + H2O` on boiling) and `[Cu(NH3)4]^2+` complexation in excess `NH3`. Fake neutralization heat in `mix()`. |
| **Fe + Cu²⁺** | `reactions.js:9`, `processes.js:401-445` | `Fe + Cu2+ -> Fe2+ + Cu` (1:1:1:1). Mass & charge conserved (except possible `-1e-17` IEEE-754 underflow at `processes.js:421`). | `dH=-153870 J/mol` exact from NBS (`-89.1 - 64.77 kJ/mol`). `E°(Fe2+/Fe)=-0.44 V`, `E°(Cu2+/Cu)=+0.34 V` match CRC. `k=2e-5` unverified educational constant. | If `Ag+` is also present (`CuSO4 + AgNO3`), `anyRule=true` suppresses `UNSUPPORTED` for `Fe + Ag+` (`processes.js:446`). |
| **Zn + H⁺** | `reactions.js:7`, `processes.js:401-445` | `Zn + 2H+ -> Zn2+ + H2↑`. **No `H+` cap on `xi` (`processes.js:416-418`)**: hot acid can overshoot stoichiometry in 1 tick. | `dH=-153890 J/mol` exact (NBS). `E°=-0.76 V` (CRC). `hydrolysisKa=10^-8.96` matches IUPAC Powell et al. (2013) ([doi:10.1351/pac-rep-13-06-03](https://doi.org/10.1351/pac-rep-13-06-03)). `k=2e-5` unverified. | `driver < 1e-3` (`processes.js:408`) halts `Zn + 1 M CH3COOH` at ~1.75% acid conversion. In `FeCl3` (`pH 1.48`), fires fake `H2` instead of `Fe3+` reduction. In dilute `HNO3` (`[NO3-] ≤ 0.01 M`, `pH < 3`), evolves fake `H2` (`processes.js:410`). |
| **Na + water** | `reactions.js:12`, `processes.js:405, 416-436` | `Na + H2O -> Na+ + OH- + ½H2↑`. **Water mass is never decremented** (`processes.js:420-425`). | `dH=-184280 J/mol Na` exact (NBS). `Na` density `0.968 g/cm³` (CRC). `k=4e-4` unverified. | `na` omitted from `METAL_E0` (`reactions.js:29`); `Na + ethanol` is a silent no-op. No `nitrateUnsupported` if `HNO3` is poured into water containing reacting `Na`. |
| **NaCl dissolution / solubility** | `materials.js:84, 190`, `processes.js:341-391` | **Broken conservation on reverse crystallization (`processes.js:347, 361-365`)**: checks only `[Cl-]`, clamps `[Na+]` at 0 → synthesizes Na from HCl/CaCl₂. | `NaCl` table (`35.7–39.2 g/100 g`, 0–100 °C) and `KNO3` (`13.3–246`) match CRC. `k=2e-4` unverified; ΔH_soln = 0 (omitted). | Ignores common-ion effect of `Na+`; `crystallize` does not account for non-ideal ionic strength. |
| **Electrolysis of CuCl₂** | `reactions.js:34`, `processes.js:477-510` | `Cu2+ + 2Cl- -> Cu + Cl2↑`; Faraday `n = I·t/(2F)` exact (`F=96485` vs CODATA `96485.33212 C/mol`, 0.0003% diff). | `decomposition=1.02 V` (`1.358 - 0.340 V`) valid **only at standard state**; ignores Nernst shift down to `1e-7 mol`. `overpotential=0.4 V`, `resistance=4 Ω` unverified approximations. | No Joule heating (`I²R`). Electrolyzing `CuCl2 + KI` produces fake `Cl2` instead of `I2`. Non-CuCl₂ electrolytes log nothing in Observations. `volts = NaN` propagates `I = NaN` (`sim.js:174`). |
| **Daniell cell** | `reactions.js:35`, `processes.js:511-532` | Open-circuit voltmeter (no current/mass change). | `E°=1.10 V` (`0.340 - (-0.762)`), `0.05916 V` exact at 25 °C (`RT ln10 / F = 0.059159 V`). | Hardcodes 25 °C even when vessels are heated (`processes.js:528`); uses total `[M2+]` instead of `freeConc()` and `aqueousLitres()` (includes ethanol); never checks salt-bridge immersion/geometry (`processes.js:518`). |
| **NaHCO₃ + CH₃COOH** | `materials.js:166, 184, 192-195`, `chemistry.js:29-32, 122-126`, `processes.js:341-391, 563-576` | Charge balance exact (`Na+` + `CO3` total). CO₂ degasses when `[H2CO3*] > 0.9·HENRY_CO2`. | `HENRY_CO2=3.4e-2 mol/(L·atm)` matches Sander/NIST (25 °C). `NaHCO3` solubility table (`6.9–16.4`, 0–60 °C) matches CRC (contradicts comment `"treated as constant"` at `materials.js:194`). | Zero endothermic enthalpy (real reaction cools). `crystallize()` (`processes.js:372-390`) matches `Na+`+`CO3` in boiling `Na2CO3`, **crystallizing fake `NaHCO3(s)` + `NaOH`** at 100 °C (chemically reversed; NaHCO₃ decomposes >60 °C). |
| **Organic miscibility** | `materials.js:76-80`, `chemistry.js:12-18, 252-265`, `render2d.js:560-597`, `render3d.js:591-649` | Volume conserved (additive; ignores ~3.6% EtOH–H₂O contraction). | Ethanol density `0.789 g/mL` is 20 °C value (PubChem CID 702: [pubchem.ncbi.nlm.nih.gov/compound/702](https://pubchem.ncbi.nlm.nih.gov/compound/702); 25 °C is `0.785 g/mL`). Boiling point `78.37 °C` (same source) is **completely missing** (`processes.js:591-600`). | `ethanol.aqueous = true` (`materials.js:78`): (1) pure ethanol reports `pH = 7.00`; (2) **oil (`0.92 g/mL`) floats on top of ethanol (`0.789 g/mL`)** in `withdraw()` and 2D; (3) ethanol never boils even at 300 °C; (4) oil layer invisible in 3D. |

---

## 3. Problematic Reagent Combinations

### A. Combinations Producing Fake Products / False Observations
1. **`Fe` (or `Zn`, `Mg`) + `FeCl3` (0.2 M, pH 1.48):** `fe-acid`/`zn-acid`/`mg-acid` fires before `UNSUPPORTED_HINTS` (`processes.js:408-451`) → evolves **fake `H2` gas + `Fe(OH)3↓`** instead of `Fe3+ -> Fe2+` reduction or `UNSUPPORTED` (`reactions.js:42` is bypassed).
2. **Boiling `Na2CO3` (0.2 M) on burner:** `crystallize()` (`processes.js:372-388`) nucleates **fake `NaHCO3(s)`** at 100 °C and turns the remaining liquid into `NaOH`.
3. **`NaCl(s)` + boiled/concentrated `HCl` or `CaCl2` (`[Cl-] > 6.14 M`, `[Na+] = 0`):** `stepDissolve()` (`processes.js:347, 361-365`) drives `dn < 0` → **grows `NaCl(s)` mass out of Na-free HCl**, fabricating Na atoms and destroying `Cl-`.
4. **`Mg` ribbon (0.5 g) + hot `HCl` (5 mL, 0.5 M, 95 °C):** Single-step `xi` overshoot (`processes.js:416-423`) → **fabricates excess `H2`, jumps to pH ~13.6, and precipitates fake `Mg(OH)2` from HCl**.
5. **`CuSO4`/`FeCl3`/`FeSO4`/`MgCl2` + `NaOH`, or `HCl` + `Na2SO4`/`NH3`/`NaHCO3`:** `mix()` (`chemistry.js:241`) logs **fake `"H⁺ + OH⁻ → H₂O, tỏa nhiệt"`** and injects wrong `-55.84 kJ/mol` heat.
6. **`Oil` + `Ethanol`:** `ethanol.aqueous = true` (`materials.js:78`, `chemistry.js:256`, `render2d.js:560-597`) causes denser **oil (`0.92`) to float on lighter ethanol (`0.789`)** and pour out first.
7. **`CuCl2` + `KI` under electrolysis (`processes.js:487-504`):** Evolves **fake `Cl2`** instead of `I2` (and misses `2Cu2+ + 4I- -> 2CuI↓ + I2`).
8. **`Zn`/`Fe`/`Mg` + very dilute `HNO3` (`0.002–0.01 M`, pH < 3):** `[NO3-] ≤ 0.01 M` bypasses `nitrateUnsupported` (`processes.js:410`) → evolves **fake `H2`**.
9. **`CuSO4` + excess `NH3`:** Leaves permanent solid `Cu(OH)2↓` instead of dissolving to deep-blue `[Cu(NH3)4]^2+` (or flagging `UNSUPPORTED`).
10. **`Cu` + `HNO3` or `Cu` + `FeCl3`:** Logs **both** `"Không có phản ứng"` (`processes.js:448`) **and** `"Chưa có mô hình"` (`processes.js:451`).

### B. Combinations Producing Negative / `NaN` Amounts or Crashes
1. **Any limiting-reactant completion (`cu-ag`, `fe-cu`, `electrolysisCuCl2` depletion, boiling to dryness):** `processes.js:420-421, 500-501, 595` subtract without clamping to `0`. IEEE-754 rounding (`-1e-17`) passes `checkInvariants` (`>= -1e-12`, `sim.js:417`) but **fails `validateSave()` (`>= 0`, `persistence.js:24`)**, corrupting IndexedDB autosaves/saves.
2. **Power supply `volts = NaN` (cleared input in inspector, `dlabApp.js:786, 840`):** `sim.js:174` stores `p.volts = NaN` → `p.current = NaN` (`processes.js:494`).
3. **Removing a Guided Lab vessel (`Delete` / `"Cất khỏi bàn"`):** Throws `TypeError` in `guided.js` checks → **crashes the main animation loop** (`dlabApp.js:141-149, 1320`).

### C. Combinations Producing Silent No-Op Instead of `UNSUPPORTED`
1. **`FeCl3(aq)` + `KI(aq)`:** Explicitly listed in `UNSUPPORTED_HINTS` (`reactions.js:43`), but `UNSUPPORTED_HINTS` is only checked in `stepKinetics()` when a solid is present (`processes.js:450`) → **100% dead code, silent no-op**.
2. **`CuSO4`/`CuCl2` + `KI`** (redox `CuI↓ + I2`), **`AgNO3` + `NaOH`/`KOH`/`NH3`** (`Ag2O↓`), **`ZnSO4` + `NaOH`/`KOH`/`NH3`/`Na2CO3`** (`Zn(OH)2↓` / `ZnCO3↓`), **`BaCl2` + `Na2CO3`** (`BaCO3↓`), **`AgNO3` + `Na2CO3`** (`Ag2CO3↓`), **`CaCl2` + `Na2SO4`** (`CaSO4↓`), **`AgNO3` + `Na2SO4`** (`Ag2SO4↓`): all missing from `PRECIPITATES` (`materials.js:64-73`) and unflagged → **silent no-op**.
3. **`Na` + pure `Ethanol`** (`2Na + 2C2H5OH -> 2C2H5ONa + H2↑`), **`Zn` + `NaOH`** (`[Zn(OH)4]^2- + H2↑`), **`Mg` + boiling `H2O`** (`Mg(OH)2 + H2↑`), **heating `Cu(OH)2` to 100 °C** (`→ CuO`): all **silent no-ops**.
4. **Mixed-oxidant metals (`Mg` in `CuSO4 + HCl`, `Fe` in `CuSO4 + AgNO3`, `Zn` in `AgNO3 + HCl`):** `anyRule = true` skips `processes.js:446-463`, silently ignoring the unmodelled redox pair.
5. **Heating pure `Ethanol` to >78.37 °C:** Never boils or evaporates (`processes.js:591-600`).

---

## 4. Prioritized Findings (P0–P3)

### P0 — Critical (Broken Conservation, Crashes, or Severe Scientific Corruption)
1. **Fake `H2` & bypassed `UNSUPPORTED_HINTS` in `FeCl3` + `Fe`/`Zn`/`Mg` and dead `Fe3+ + I-` check (`reactions.js:28, 42-43`, `processes.js:401-463`)**
   - *Failure scenario:* Student drops an iron nail into `FeCl3 0.2 M` (or mixes `FeCl3 + KI`). Instead of `"Chưa có mô hình"`, `Fe + FeCl3` bubbles fake `H2` and precipitates `Fe(OH)3↓`; `FeCl3 + KI` does nothing silently.
2. **Mass/charge conservation violation in `stepDissolve` & fake `NaHCO3` from boiling `Na2CO3` (`processes.js:347, 361-390`)**
   - *Failure scenario:* Boil `Na2CO3` down on the burner → crystallizes solid `NaHCO3` and turns liquid into `NaOH`. Or drop `NaCl(s)` into concentrated boiled `HCl` (`[Na+]=0`) → crystal gains mass by creating Na atoms out of HCl.
3. **Unbounded `xi` overshoot in `driver: 'h'` acid kinetics (`processes.js:416-423`)**
   - *Failure scenario:* Drop 0.5 g `Mg` ribbon into 5 mL hot `0.5 M HCl` (95 °C) → in one 1/60 s tick, reaction consumes 172% of available HCl, jumps to pH 13.6, fabricates excess `H2`, and precipitates `Mg(OH)2`.
4. **Deleting a Guided Lab vessel crashes the `requestAnimationFrame` loop (`guided.js:57-197`, `dlabApp.js:141-149, 1320`)**
   - *Failure scenario:* In Guided Lab 1 (`acid-base`), select Tube B and press `Delete` → `paintGuided()` throws `TypeError` on `obj(s, r.B).contents`, freezing rendering and simulation permanently.

### P1 — High (Major Scientific, Architecture, or Guided-Lab Integrity Defects)
5. **`ethanol.aqueous = true` corrupts pH, oil/ethanol buoyancy, and boiling (`materials.js:78`, `chemistry.js:12-18, 256`, `processes.js:591-600`, `render2d.js:560-597`)**
   - *Failure scenario:* Pour `oil` into `ethanol`: heavier oil (`0.92`) floats on lighter ethanol (`0.789`) and pours out first; pure ethanol reads `pH 7.00` and heats to 300 °C without boiling.
6. **Fake neutralization (`H+ + OH- -> H2O`) & wrong enthalpy in `mix()` (`chemistry.js:241-242`, `processes.js:172`)**
   - *Failure scenario:* Mix `CuSO4 + NaOH` or `HCl + Na2SO4`: Observations logs `"Phản ứng trung hòa: H⁺ + OH⁻ → H₂O, tỏa nhiệt"` and adds `-55.84 kJ/mol` heat when no water neutralization occurred.
7. **Guided Lab false completions via stale notes/gas, reused paper, and undo/reset desync (`guided.js:25, 55-58, 99-100, 129, 161-162, 195`, `dlabApp.js:1305, 1320`)**
   - *Failure scenario:* In `precipitate` Step 4, pour the stirred beaker out onto the bench instead of adding HCl → stale `s.notes['ppt-Cu(OH)2-...']` completes Step 4 on an empty beaker. Or press Undo/Reset after Step 3 → state resets while progress stays 3/5.
8. **Direct UI state mutation during drag bypasses safety engine (`dlabApp.js:473-474, 597`, `processes.js:585, 602`)**
   - *Failure scenario:* Hold a `CRACKED` beaker or `cylinder` over a lit burner for 1 s before releasing → `stepContainer` shatters/heats it mid-drag before `assess()` runs on `pointerup`.
9. **IEEE-754 negative-amount tolerance mismatch bricks IndexedDB saves (`processes.js:420-421, 500-501, 595`, `sim.js:417`, `persistence.js:24`)**
   - *Failure scenario:* Run electrolysis or boiling to exhaustion leaving `-1e-17` mol → passes `checkInvariants`, autosaves, then fails `validateSave()` on reload and discards user work.
10. **Silent no-ops for common textbook precipitations/redox (`materials.js:64-73`, `reactions.js:28-44`)**
    - *Failure scenario:* Student mixes `ZnSO4 + NaOH`, `AgNO3 + NaOH`, `BaCl2 + Na2CO3`, `CuSO4 + KI`, or `Na + ethanol` → completely blank response with neither reaction nor `UNSUPPORTED`.

### P2 — Medium (Significant Feature Parity, Quantitative Accuracy, or Edge-Case Bugs)
11. **3D renderer omits key chemical visuals (`render3d.js:270-273, 484, 591-649`)**
    - *Failure scenario:* Switch to 3D during Guided Lab 4 (electrolysis/Daniell) or Lab 5 (oil/water): oil layer disappears into a single homogeneous liquid, copper coating never appears on the cathode, wires and salt-bridge link are invisible.
12. **Weak-acid kinetic cutoff halts `CH3COOH` reactions at 1.75% (`processes.js:408`)**
    - *Failure scenario:* Drop `CaCO3` or `Zn` into `1 M CH3COOH` → reaction stops almost immediately (`pH 3.0`) with >98% acid unreacted.
13. **Electrochemistry simplifications & input edge cases (`processes.js:487-532`, `sim.js:174`)**
    - *Failure scenario:* Heat Daniell cell to 80 °C → voltmeter still computes 25 °C Nernst (`0.05916`); electrolyze `CuCl2 + KI` → evolves fake `Cl2`; clear volts input → `NaN V` / `NaN A`.
14. **Contradictory `NO_REACTION` + `UNSUPPORTED` logging on `Cu + HNO3` / `Cu + FeCl3` (`processes.js:448-451`)**
    - *Failure scenario:* Drop `Cu` into `HNO3` → Observations shows both `"Không có phản ứng"` and `"Chưa có mô hình"`.

### P3 — Low (Minor Discrepancies & Polish)
15. **Water stoichiometry omitted in `na-water` / `caco3-acid` (`processes.js:420-425`)** — negligible at bench dilution (<0.2 mL), breaks strict H₂O mass balance.
16. **Minor constant / comment discrepancies:** `Cu(OH)2` `Ksp = 2.2e-20` (CRC) vs IUPAC Powell 2007 `4.8e-20` ([doi:10.1351/pac200779050895](https://doi.org/10.1351/pac200779050895)); `NaHCO3` comment `"treated as constant"` (`materials.js:194`) contradicts its 4-point table (`materials.js:195`); ethanol density `0.789` is 20 °C rather than 25 °C (`0.785`).
17. **Multi-vessel observation conclusion misattribution (`observations.js:69`)** — running `na-water` in two vessels attributes the first vessel's pH/indicator reading to the second vessel's conclusion card.
