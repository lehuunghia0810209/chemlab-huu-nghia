### Release Readiness Verdict: **NOT READY**

This review found **1 P0** and **12 P1** issues (plus **8 P2** and **4 P3** issues) across the 7.1 chemistry engine, reaction data, validation claims, experiment library, and unified `#lab` shell.

---

### P0 — Release Blockers (Wrong Science Shown as Fact / Broken Core Behaviour)

1. **[P0] Competitive precipitation (`kspEquilibrium`) produces thermodynamically impossible precipitates and fails to converge in 6 rounds**
   - **Location:** [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L412-L471) (`intrinsicSolubility`, `kspEquilibrium`); [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L110); [validation.js](file:///D:/EduLab/ChemLab/src/dlab/data/validation.js#L47) (`'competitive-precipitation': ['VALIDATED', ...]`).
   - **Why it is wrong (worked numbers):**
     - `kspEquilibrium` redissolves all existing solids that share an ion, sorts salts purely by pure-water `intrinsicSolubility` (`(Ksp / (p^p * q^q))^(1/(p+q))`), and runs a single-salt Gauss–Seidel loop for at most `round < 6`. Intrinsic solubility ignores actual counter-ion concentrations, and once a second solid buffers the common ion, Gauss–Seidel can only dissolve $\sim\sqrt{K_{sp}}$ per round.
     - **Case A (`AgCl` vs `AgSCN`):** Mix 5 mL `agno3` (0.1 M, 0.5 mmol $\text{Ag}^+$) + 20 mL `nacl` (0.5 M, 10 mmol $\text{Cl}^-$) + 0.5 mL `kscn` (0.1 M, 0.05 mmol $\text{SCN}^-$), $V = 25.5\text{ mL}$. Leftover $[\text{Cl}^-] = 9.5/25.5 = 0.3725\text{ M}$ and $[\text{SCN}^-] = 0.05/25.5 = 1.96\times 10^{-3}\text{ M}$. Over $\text{AgCl}$, $[\text{Ag}^+] = K_{sp}(\text{AgCl})/[\text{Cl}^-] = 1.77\times 10^{-10}/0.3725 = 4.75\times 10^{-10}\text{ M}$, so $Q(\text{AgSCN}) = (4.75\times 10^{-10})(1.96\times 10^{-3}) = 9.31\times 10^{-13} < K_{sp}(\text{AgSCN}) = 1.03\times 10^{-12}$. **Zero `AgSCN` should precipitate** ($[\text{Cl}^-]/[\text{SCN}^-] = 190 > K_{sp}(\text{AgCl})/K_{sp}(\text{AgSCN}) = 171.8$). Instead, because `intrinsicSolubility('AgSCN')` ($1.01\times 10^{-6}$) < `intrinsicSolubility('AgCl')` ($1.33\times 10^{-5}$), Round 0 precipitates all 0.05 mmol $\text{SCN}^-$ as `AgSCN↓`, then `AgCl` drops $[\text{Ag}^+]$ to $4.75\times 10^{-10}\text{ M}$. In Rounds 1–5, `AgSCN` can only dissolve $\sim\sqrt{K_{sp}(\text{AgSCN})} \approx 10^{-6}\text{ M}$ ($\approx 2.6\times 10^{-8}\text{ mol}$) per round before $\text{Ag}^+$ re-saturates it, leaving **~99.8% false `AgSCN↓`** permanently stuck and emitting `"Xuất hiện kết tủa AgSCN"`. The reverse transposition (`AgSCN` + excess `NaCl`, or `BaSO4` + excess `Na2CO3` $\to$ `BaCO3`) is similarly stuck.
     - **Case B (`Zn(OH)2` vs `ZnCO3`):** `Zn(OH)2` ($s = 1.96\times 10^{-6}$) sorts ahead of `ZnCO3` ($s = 1.21\times 10^{-5}$). Mixing 20 mL `znso4` (0.5 M, 10 mmol) + 10 mL `na2co3` (0.2 M, 2 mmol), Round 0 precipitates `Zn(OH)2` until $\text{pH} \approx 5.98$ (where $\alpha_1(\text{HCO}_3^-) = 0.298$), so each round transfers only $0.298/2 \approx 14.9\%$ of carbonate from `Zn(OH)2` to `ZnCO3`. After 6 rounds (`round < 6`), **~0.21 mmol (~10%) of bogus `Zn(OH)2↓`** remains unconverted and is falsely reported as a precipitate alongside `ZnCO3↓`.
     - Marking `'competitive-precipitation'` as **`VALIDATED`** in [validation.js](file:///D:/EduLab/ChemLab/src/dlab/data/validation.js#L47) is unjustified: the only unit test ([test-dlab.mjs](file:///D:/EduLab/ChemLab/scripts/test-dlab.mjs#L1768-L1785)) checks `AgI` vs `AgCl` where $K_{sp}$ differs by $2\times 10^6$ and $\text{I}^-$ is in excess.
   - **Suggested fix:** Order competing salts dynamically by the **required free common-ion concentration** $(K_{sp}/[\text{counter-ion}]_{\text{free}}^q)^{1/p}$ (or solve simultaneous coupled equilibria / direct solid-to-solid exchange `A(s) + Y ↔ B(s) + X` when two solids share a common ion), remove the hard 6-round cap in favour of a convergence criterion with a safe upper bound, and add regression tests for `AgCl`/`AgSCN`, `BaSO4`/`BaCO3`, and `ZnSO4 + Na2CO3`. Until solved simultaneously, downgrade `'competitive-precipitation'` or document its narrow validated scope.

---

### P1 — Major Issues (Misleading Science, Wrong Results, Over-claimed Validation, Broken Core Flows)

2. **[P1] `ionRedox` acid-limited `mno4-fe` has three bugs: silent drop near pH 2, self-contradictory notes, and autocatalytic `Fe(OH)3` continuation — and is completely untested**
   - **Location:** [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L353-L363), [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L401-L406); [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L383-L406) (`redoxNotes`); [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L74); [validation.js](file:///D:/EduLab/ChemLab/src/dlab/data/validation.js#L53) (`'redox-mno4-fe': ['VALIDATED', ...]`).
   - **Why it is wrong (worked trace):**
     1. **Silent no-op right below pH 2.0:** When initial $\text{pH} \le 2.0$ and bisection yields `xi <= 1e-12`, line 360 defines `ran['mno4-fe:acid'] = true` as **non-enumerable** and `continue`s without setting `ran['mno4-fe']`. In `equilibrate` line 403, `Object.keys(ran).length` is `0`, so `formed.redox` is never attached. In `redoxNotes` line 400, both `pH > 2` and `formed?.redox?.['mno4-fe:acid']` are falsy — neither the reaction nor `OUT_OF_MODEL_RANGE` is reported.
     2. **Contradictory observation text on partial reaction:** When `mno4-fe` runs partway and stops at $\text{pH} \approx 2.0$, `redoxNotes` logs BOTH `redox-mno4-fe` (`"màu tím hồng của MnO₄⁻ mất ngay khi nhỏ vào (Fe²⁺ còn dư)"` — false, purple $\text{MnO}_4^-$ remains in excess!) AND `redoxrange-mno4-fe` (`"ngoài phạm vi mô hình, không hiển thị sản phẩm (pH ≈ 2,0)"` — false, $\text{Mn}^{2+}$ and $\text{Fe}^{3+}$ products were just created!). Even in a fully acidic single pour of excess $\text{KMnO}_4$ (e.g., 15 mL `kmno4` into 5 mL `feso4` + 10 mL `h2so4`), `observe` still falsely claims `"(Fe²⁺ còn dư)"` and `"màu tím hồng của MnO₄⁻ mất ngay"`.
     3. **Autocatalytic $\text{H}^+$ loop via `Fe(OH)3`:** If acid-limited `mno4-fe` produces $[\text{Fe}^{3+}]_{\text{free}} > 0.028\text{ M}$ at $\text{pH} = 2.0$ (e.g. `fecl3` 10 mL + `feso4` 10 mL + `kmno4` 10 mL with **zero** added acid — initial $\text{pH} \approx 1.78$), then `kspEquilibrium` (line 405) precipitates $\text{Fe(OH)}_3\downarrow$ ($Q > 10 K_{sp} = 2.79\times 10^{-38}$), releasing $3\text{ H}^+$ per $\text{Fe}^{3+}$ ($15\text{ H}^+$ per $\text{MnO}_4^-$ vs $8\text{ H}^+$ consumed = net $+7\text{ H}^+$), dropping pH back below 2.0 so subsequent `equilibrate()` calls keep reacting `mno4-fe` indefinitely.
     4. **Untested `VALIDATED` claim:** In [test-dlab.mjs](file:///D:/EduLab/ChemLab/scripts/test-dlab.mjs#L1942-L1946), the "without acid" test (`feso4` 5 mL + `kmno4` 2 mL) starts at $\text{pH} \approx 5.2 > 2$, so line 343 (`if (pH > r.maxPH) continue`) skips before line 353 (`if (r.acid)`) is ever executed. The acid-bisection code path has zero test coverage.
   - **Suggested fix:** Attach `formed.redox` whenever `ran` has any own property (`Reflect.ownKeys(ran).length`), write separate `redoxNotes` wording for partial acid-limited stops vs. zero-extent out-of-range vs. excess-$\text{MnO}_4^-$ pours, disallow `mno4-fe` when `Fe(OH)3` is supersaturated or include `kspEquilibrium` in the pH/extent guard, and add a unit test exercising the partial-acid `r.acid` bisection branch.

3. **[P1] Missing `ION_HINTS` for classic school redox pairs introduced by 7.1 reagents (`MnO4- + Cl-` in acid, `MnO4- + SCN-`, `Cu2+ + SCN-`, `MnO4-` + metals, `Mn2+` in `ION_E0`)**
   - **Location:** [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L28-L59) (`ION_E0`, `ION_NAME`, `ION_HINTS`), [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L109-L117) (`UNSUPPORTED_HINTS`).
   - **Why it is wrong:**
     - **$\text{KMnO}_4 + \text{HCl}$:** $E^\circ(\text{MnO}_4^-/\text{Mn}^{2+}) = 1.51\text{ V} > E^\circ(\text{Cl}_2/\text{Cl}^-) = 1.36\text{ V}$ ($2\text{MnO}_4^- + 10\text{Cl}^- + 16\text{H}^+ \to 2\text{Mn}^{2+} + 5\text{Cl}_2\uparrow + 8\text{H}_2\text{O}$). In the exact Vietnamese SGK Hóa học 12 permanganate titration lesson, students are explicitly taught *never* to acidify $\text{FeSO}_4/\text{KMnO}_4$ with $\text{HCl}$ because $\text{MnO}_4^-$ oxidises $\text{Cl}^-$ to toxic $\text{Cl}_2$ (induced/catalysed by $\text{Fe}^{2+}/\text{Fe}^{3+}$). Currently, mixing `kmno4 + hcl` silently shows nothing, and `feso4 + hcl + kmno4` runs cleanly with no warning at all.
     - **$\text{MnO}_4^- + \text{SCN}^-$:** $E^\circ((\text{SCN})_2/\text{SCN}^-) \approx 0.77\text{ V} \ll 1.51\text{ V}$; permanganate vigorously oxidises thiocyanate, yet mixing `kmno4 + kscn` is silently ignored.
     - **$\text{Cu}^{2+} + \text{SCN}^-$:** In school solutions (`cuso4` 0.5 M + `kscn` 0.1 M), $\text{Cu}^{2+}$ precipitates black $\text{Cu(SCN)}_2$ decomposing to white $\text{CuSCN}\downarrow$ ($E^\circ(\text{Cu}^{2+}/\text{CuSCN}) \approx 0.86\text{ V}$); silently ignored.
     - **$\text{Mn}^{2+}$ missing from `ION_E0` / `ION_NAME`** ($E^\circ = -1.18\text{ V}$), and **`MnO4-` + metals (`Mg`, `Zn`, `Fe`, `Cu`)** missing from `UNSUPPORTED_HINTS`: dropping `Mg` into `Mn2+` or `Fe`/`Cu`/`Zn` into `kmno4` silently ignores the permanganate reduction.
     - **$\text{KMnO}_4$ + ethanol:** Oxidises ethanol to acetaldehyde/acetic acid + brown $\text{MnO}_2$; not flagged.
   - **Suggested fix:** Add `ION_HINTS` for `['MnO4-', 'Cl-']` (`maxPH: 3`, warning about $\text{Cl}_2$ evolution and why $\text{H}_2\text{SO}_4$ is required for permanganate titrations), `['MnO4-', 'SCN-']`, and `['Cu2+', 'SCN-']`; add `'Mn2+': -1.18` to `ION_E0` and `ION_NAME`; add `UNSUPPORTED_HINTS` for `['MnO4-', m]` for `m` in `['mg', 'zn', 'fe', 'cu']`.

4. **[P1] Sandbox discovery demo for `thiocyanate-complex` (`manifest.js`) immediately precipitates `Fe(OH)3↓` on setup; `exp-iodide-oxidation-starch` is on a knife-edge for the same bug**
   - **Location:** [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L111) (`thiocyanate-complex` demo: `fill: [['water', 20], ['fecl3', 0.5]], pour: ['kscn', 1]`); [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L386-L390) (`exp-iodide-oxidation-starch`).
   - **Why it is wrong (worked numbers):**
     - In the `thiocyanate-complex` demo, 0.5 mL of 0.2 M `fecl3` in 20 mL water gives $C(\text{Fe}^{3+}) = 0.1/20.5 = 4.878\text{ mM}$. Using `hydrolysisKa` $= 10^{-2.19} = 6.4565\times 10^{-3}$:
       $h = \frac{-K_a + \sqrt{K_a^2 + 4 K_a C}}{2} = 3.246\times 10^{-3}\text{ M}$ ($\text{pH} = 2.49$), $[\text{Fe}^{3+}]_{\text{free}} = 1.632\times 10^{-3}\text{ M}$, $[\text{OH}^-] = 3.081\times 10^{-12}\text{ M}$.
       $Q(\text{Fe(OH)}_3) = 1.632\times 10^{-3} \times (3.081\times 10^{-12})^3 = \mathbf{4.77\times 10^{-38}} > 10\,K_{sp} = \mathbf{2.79\times 10^{-38}}$ ($17.1\,K_{sp}$).
     - Thus clicking "Bày dụng cụ" on the `Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺` discovery card **immediately precipitates rust-brown `Fe(OH)3↓`** in the beaker before the student even pours `KSCN`! (The manifest test passes only because it checks `expect: { note: 'scn-' }` and ignores precipitates.)
     - Similarly, in `exp-iodide-oxidation-starch`, 1 mL `fecl3` into 10 mL `ki` + 0.15 mL starch gives $C = 17.94\text{ mM}$, $\text{pH} = 2.10$, $Q = 1.93\times 10^{-38}$ (barely below $2.79\times 10^{-38}$). If a student adds 0.5 mL `fecl3` (or uses a dropper instead of a single 1 mL pour), $Q = 2.97\times 10^{-38} > 10 K_{sp}$, so `kspEquilibrium` runs *before* `ionRedox` and dumps rust-brown `Fe(OH)3↓` into the KI beaker!
   - **Suggested fix:** Acidify the `thiocyanate-complex` demo setup with `['hno3', 1]` (just as `exp-thiocyanate-equilibrium` already does), and either include a small amount of dilute acid in `exp-iodide-oxidation-starch` or use a fresh-precipitate $K_{sp}$ / document the hydrolysis threshold clearly; assert `noPrecipitate: 'Fe(OH)3'` in the `thiocyanate-complex` demo test.

5. **[P1] Daniell voltmeter side-reaction guard misses ALL unmodelled electrode reactions (`HNO3`, `FeCl3`, `Ag+` on `Zn`, strong `NaOH` on `Zn`) and shows stale `sideRx` equations on coated electrodes**
   - **Location:** [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L571-L601), [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L648-L655), [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L754-L763); [validation.js](file:///D:/EduLab/ChemLab/src/dlab/data/validation.js#L19) (`daniell` = `VALIDATED`).
   - **Why it is wrong:**
     1. **Missing guard for unsupported electrode reactions:** When a Daniell half-cell contains `HNO3`, `FeCl3`, `AgNO3` (in the Zn half-cell), or `NaOH` ($\text{pH} > 12.5$ in the Zn half-cell), `stepKinetics` hits `UNSUPPORTED_HINTS`, `nitrateUnsupported`, or the `ION_E0` unsupported branch and returns **without setting `s.sideRx`**. `stepElectro` (line 756) only checks `s.sideRx` and `s.coat`, so the voltmeter happily invents and displays a normal **~1.10 V** Nernst reading while the electrode is in an unsupported side-reaction environment (e.g., $\text{Cu}$ dissolving in $\text{HNO}_3$ or $\text{FeCl}_3$). This directly falsifies the limit claim in [validation.js](file:///D:/EduLab/ChemLab/src/dlab/data/validation.js#L19).
     2. **Stale `sideRx` message:** Line 758 computes `const rule = busy.s.sideRx && KINETIC.find(...)` without checking `state.t - busy.s.sideRx.t < 1.5`. If a `Zn` granule was coated by `Cu` in another beaker (or after `Cu2+` ran out) and is later placed in clean `ZnSO4` at $t > \text{sideRx}.t + 1.5$, `coat` triggers `busy`, but `rule` is still non-null, so the voltmeter falsely reports `"đang có phản ứng phụ (Zn + Cu²⁺ → Zn²⁺ + Cu)"` instead of `"đã bị phủ kim loại khác"`.
   - **Suggested fix:** Check `const activeRx = busy.s.sideRx && state.t - busy.s.sideRx.t < 1.5` before looking up `rule`, and also set a timestamped `s.sideUnsup` (or check `x.c.unsupported`) whenever `stepKinetics` flags an unsupported reaction on an electrode so `stepElectro` refuses to display a Nernst voltage.

6. **[P1] `exp-salt-ph` promises yellow colour (`CuSO₄: vàng`) for 0.5 M `CuSO4` + universal indicator, contradicting both real chemistry and the engine's own colour output**
   - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L60-L67) (`exp-salt-ph`).
   - **Why it is wrong (worked numbers):**
     - Tube C contains 5 mL of **0.5 M `CuSO4`** (deep sky-blue: `IONS['Cu2+'].color = [70, 140, 230]`, `colorPerM = 1.6`, opacity $a = 1 - e^{-0.485 \times 1.6} = 0.540$) plus 3 drops of universal indicator ($\text{pH} \approx 4.15$, indicator colour `[243, 162, 46]`, strength $1 - e^{-3/5.15 \times 1.2} = 0.503$).
     - In `bulkColor`, mixing blue `[140, 185, 239]` with yellow-orange `[243, 162, 46]` at $t = 0.503$ yields **`[192, 173, 141]` (murky olive/tan-green)** — and in a real school lab, universal indicator in 0.5 M blue $\text{CuSO}_4$ also appears greenish/olive, not yellow. Telling students `CuSO₄: vàng` contradicts what they see in the tube. (Similarly, `Na2CO3` at $\text{pH} \approx 11.8$ renders indigo-violet `[80, 52, 158]` rather than `"xanh lam đậm"`.)
   - **Suggested fix:** Either use `znso4` (colourless acidic salt, $\text{pH} \approx 4.6$, truly yellow with universal indicator) or dilute `cuso4` (e.g., 0.05 M) and explicitly note in `phenomena` that the intrinsic blue colour of $\text{Cu}^{2+}$ blends with the indicator's yellow/orange colour.

7. **[P1] New electrolysis interferers (`MnO4-`, `SCN-`) and new `ION_HINTS` (`MnO4- + Mn2+`) are silently untested despite manifest claims**
   - **Location:** [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L126-L133), [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L147-L153); [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L54), [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L92-L93); [test-dlab.mjs](file:///D:/EduLab/ChemLab/scripts/test-dlab.mjs#L1252-L1268).
   - **Why it is wrong:**
     - `manifest.js` line 152 assigns `tests: ['electrolysis refuses every interference']` to both `electro-unsup-MnO4-` and `electro-unsup-SCN-`, so the manifest/validation report lists them as tested.
     - However, `ADD` in [test-dlab.mjs](file:///D:/EduLab/ChemLab/scripts/test-dlab.mjs#L1255) only has `I-`, `I2`, `Fe3+`, `Fe2+`, `NO3-`, `NH3`; line 1257 (`if (!ADD[x.ion]) continue`) **silently skips `'MnO4-'` and `'SCN-'`**!
     - Likewise, `'MnO4-+Mn2+'` (`ION_HINTS` line 54) is missing from `ION_HINT_DEMO` in [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L126-L133), so it has `demo: null` and no test.
   - **Suggested fix:** Add `'MnO4-': [['kmno4', 15]]` (note: 0.02 M $\times$ 15 mL = 0.3 mmol > 1% of 20 mmol $\text{Cu}^{2+}$ in 40 mL `cucl2`) and `'SCN-': [['kscn', 5]]` to `ADD` in `test-dlab.mjs`, and assert that `ADD` covers every interferer except `Ag+` (not silently `continue`ing). Add `'MnO4-+Mn2+'` to `ION_HINT_DEMO` (e.g. `[['feso4', 5], ['h2so4', 10], ['kmno4', 5], ['naoh', 12], ['kmno4', 2]]` or equivalent at $\text{pH} \in [3, 8]$).

8. **[P1] `complexNotes` falsely reports hot starch-iodine fading when no `I-` is present, and ignores `pHApplies` (ethanol-rich mixtures)**
   - **Location:** [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L112-L139) (`bulkColor`), [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L409-L418) (`complexNotes`).
   - **Why it is wrong:**
     1. Line 416 checks `else if ((c.T ?? 25) > 65 && (c.contents.ions.I2 || 0) / V >= INDICATORS.starch.minI2)` **without checking `(c.contents.ions['I-'] || 0) / V >= INDICATORS.starch.minIodide`**. If a vessel has `starch` + dissolved `I2` with zero `I-` (e.g., `CuSO4` 10 mL + `KI` 20 mL consumes all `I-` as `CuI↓`, leaving 1.33 mM `I2` and 0 `I-`), the solution was never blue-black at 25 °C — yet heating it above 65 °C falsely logs `"Ở 66 °C màu xanh tím của hồ tinh bột – iot mất... để nguội màu trở lại"`.
     2. Unlike `ammineNotes` (line 887) and `describe` ([domain.js](file:///D:/EduLab/ChemLab/src/dlab/engine/domain.js#L46)), neither `complexNotes` nor `bulkColor` checks `polarPhase(c.contents).pHApplies`. Because `LIQUIDS.ethanol.aqueous === true`, pouring `fecl3 + kscn` or `starch + iodine` into **>10% ethanol** (where `pH` is `null` and `describe().complexes` is `{}`) still renders aqueous `FeSCN²⁺`/`starch` colours and logs `"Fe³⁺ + SCN⁻ ⇌ FeSCN²⁺ ... K ≈ 10³"` using water's $K_1$.
   - **Suggested fix:** Add `&& (c.contents.ions['I-'] || 0) / V >= INDICATORS.starch.minIodide` (and require `state.notes[\`starch-${c.id}\`]` or `starchColorShare(c.contents, 25) > 0.02`) to the `starch-hot` guard; gate `complexNotes` on `polarPhase(c.contents).pHApplies`.

9. **[P1] `layOutExperiment` pollutes the undo stack with up to 23 separate commands, breaks `ui.laidOut` on undo, and gives no visible step guide when launched from a curriculum lesson**
   - **Location:** [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1402-L1431) (`layOutExperiment`), [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1866) (`layOut`), [labShell.js](file:///D:/EduLab/ChemLab/src/labShell.js#L78-L79).
   - **Why it is wrong:**
     1. `layOutExperiment` calls `sim.dispatch(...)` with the default `record: true` for every removal, vessel, reagent fill, bottle, and tool. Laying out `exp-thiocyanate-equilibrium` pushes **23 separate undo snapshots** (out of `HISTORY_LIMIT = 40` in `sim.js`), wiping half the student's undo history; pressing "Hoàn tác" only removes one bottle or one `0.2 mL` fill instead of undoing the lay-out. Compare with `clearBench` (line 1380), which properly uses a single `sim.record()` + `{ record: false }`.
     2. `ui.laidOut` is not restored by undo/reset/load, so "Bày lại" buttons stay out of sync after undoing or loading another experiment.
     3. When a student clicks `"Làm trên bàn thí nghiệm"` inside a curriculum lesson ([labShell.js](file:///D:/EduLab/ChemLab/src/labShell.js#L79)), `dlab.layOut(id)` runs `toFree(); layOutExperiment(exp)`. This lays new vessels on top of whatever was already on the bench **without opening the Experiment Library panel (`openSide('discover')`) or expanding that experiment's `<details>` guide**. After the 4.5-second toast disappears, the student has no visible steps to follow (and because `paintDiscover()` is lazy, the card button never even updates to `"Bày lại"`).
   - **Suggested fix:** Wrap `layOutExperiment` (and `layOut`) in one `sim.record()` with `{ record: false }` on inner dispatches; reset `ui.laidOut` in `loadSim`/`resetSim`/undo; and in `ChemLabDynamicLab.layOut(id)`, open the library tab (`openSide('discover')`), scroll to and expand `[data-exp-card="${id}"] details`.

10. **[P1] Incomplete `#lab` unification breaks ChemAI context, scrapes hidden guided DOM into ChemAI, and misroutes Home Dashboard "Tiếp tục thí nghiệm"**
    - **Location:** [main.js](file:///D:/EduLab/ChemLab/src/main.js#L681) (`getAppContext`), [contextBuilder.js](file:///D:/EduLab/ChemLab/src/ai/contextBuilder.js#L64-L92), [homeDashboard.js](file:///D:/EduLab/ChemLab/src/final/homeDashboard.js#L32), [homeDashboard.js](file:///D:/EduLab/ChemLab/src/final/homeDashboard.js#L103-L110).
    - **Why it is wrong:**
      1. `main.js` line 681 and `contextBuilder.js` line 87 still read `window.ChemLabLab?.context?.()` (the hidden legacy `virtualLab.js`!), never `window.ChemLabDynamicLab`. Opening ChemAI from the sidebar/topbar while on the unified `#lab` dynamic bench sends an empty legacy beaker (`mixture: {}`) as `context.lab`, and `visibleWorkspaceText('lab')` (`contextBuilder.js` line 69-71) does not strip `[hidden]` subtrees, so it feeds hidden `.ulab-guided` lesson-chooser text to ChemAI while the student is on the bench.
      2. On the Home Dashboard, when `lastActivity.type === 'experiment'` (a curriculum lesson), clicking "Tiếp tục" / "Mở lại" navigates to `#lab` (opening the free dynamic bench) instead of `"Có hướng dẫn"` / the saved curriculum lesson; and the `#lab` card still displays legacy metadata `"103 hóa chất · 96 phản ứng"`.
    - **Suggested fix:** Return dynamic bench context (when `.ulab-bench` is visible) from `getAppContext().lab` / `labContext()`, strip `[hidden]` elements in `visibleWorkspaceText()`, update `WORKSPACES` metadata in `homeDashboard.js`, and dispatch `chemlab:open-guided-lesson` when resuming a curriculum experiment from Home.

11. **[P1] Pointer-drag from the reagent/equipment library leaks global `document` event listeners and strands `.dlab-ghost` on `pointercancel`**
    - **Location:** [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L375-L403).
    - **Why it is wrong:** `pointerdown` attaches `document.addEventListener('pointermove', move)` and `document.addEventListener('pointerup', up)`, but **never listens to `pointercancel`** (unlike the canvas on line 644). On touch devices (or if an alert/scroll/browser gesture cancels the pointer), `up` never fires: both `document` listeners leak permanently and `<div class="dlab-ghost">` stays stuck on screen following subsequent pointer moves forever.
    - **Suggested fix:** Add `document.addEventListener('pointercancel', cancel)` that removes all three listeners and cleans up `ghost?.remove()`.

12. **[P1] Accessibility regressions in the new `#lab` chooser (`labShell.js`) and mode buttons (`dlabApp.js`): focus loss on view toggle, missing `<h1>`, and desynced `aria-pressed`**
    - **Location:** [labShell.js](file:///D:/EduLab/ChemLab/src/labShell.js#L28-L83); [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1266-L1299), [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1471-L1479), [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1898-L1903).
    - **Why it is wrong:**
      1. **Keyboard/screen-reader focus loss:** Clicking `"Có hướng dẫn"` (`[data-hd="guided"]`) hides `.ulab-bench` (which contains the focused button) without moving focus into `.ulab-guided`, dropping focus to `<body>`. Clicking `"← Về bàn thí nghiệm"`, any `.ulab-card`, or `.ulab-twin-btn` hides `.ulab-guided` without moving focus back into `.ulab-bench`, again dropping focus to `<body>`.
      2. **Desynced `aria-pressed` on `"Thư viện thí nghiệm"`:** When the user closes the right drawer (`[data-close="side"]` $\to$ `toggleDrawer('side', false)`), `ui.sideTab` remains `'discover'` and `setModeButtons()` ignores drawer visibility. As a result, `"Thư viện thí nghiệm"` stays highlighted with `aria-pressed="true"` while `"Tự do"` shows `aria-pressed="false"` even though the library is closed and the student is looking at the free bench.
      3. **Conflicting button semantics:** `[data-hd="guided"]` carries `aria-pressed` inside the mode group even though it navigates to a separate chooser view rather than toggling an in-place mode; and `#view-lab` has no `<h1>` (both `.dlab-brand h2` and `#ulab-guided-title` are `<h2>`).
    - **Suggested fix:** Move focus to `#ulab-guided-title` (`tabindex="-1"`) or `.ulab-back` in `showGuided()`, and restore focus to `[data-hd="guided"]` (or `.dlab-canvas` when starting a lab) in `showBench()`. In `setModeButtons()`, treat library mode as `ui.mode === 'sandbox' && ui.sideTab === 'discover' && host.classList.contains('dlab--show-side')` and call `setModeButtons()` from `toggleDrawer('side', ...)`. Promote the primary `#view-lab` heading to `<h1>`.

13. **[P1] `bulkColor` subtracts `FeSCN²⁺` moles from `[Cu(NH3)4]²⁺` moles, erasing copper-ammine colour in mixed solutions**
    - **Location:** [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L112-L134) (`bulkColor`).
    - **Why it is wrong:** Line 114 adds `scn` (moles of `FeSCN²⁺`) to `cx['Fe3+']`, but line 129-130 runs for **every** ion in `contents.ions`:
      ```js
      if (info?.ammineColor && held - scn > 0) {
        const a = 1 - Math.exp(-info.ammineColorPerM * (held - scn) / V)
      ```
      When `ion === 'Cu2+'`, `held` is `cx['Cu2+']` (`[Cu(NH3)4]²⁺` moles — `scn` was never added to it!). Subtracting `scn` from `held` reduces or completely zeroes out the deep-blue copper-ammine colour whenever `Fe3+` and `SCN-` are present in the same vessel.
    - **Suggested fix:** Keep `cx` strictly for ammine complexes (do not mutate `cx['Fe3+']` with `scn`), compute `const mol = total - held - (ion === 'Fe3+' ? scn : 0)`, and use `held` directly on lines 129–130.

---

### P2 — Minor Bugs & Quality Gaps

14. **[P2] `ionRedox` evaluates `pH` once before iterating over all `ION_REDOX` rules**
    - **Location:** [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L338-L343) (`ionRedox`).
    - **Why it is wrong:** If an earlier rule in `ION_REDOX` changes `contents.ions` in a way that alters pH (e.g., `fe-i` consumes hydrolysing $\text{Fe}^{3+}$ and raises pH from $\sim 1.8$ to $\sim 5.5$), subsequent rules check the stale pre-loop `pH` instead of the updated pH.
    - **Suggested fix:** Recompute `pH` inside the loop (or invalidate a cached `pH` after `apply()` runs).

15. **[P2] `labShell.js` `syncTwin()` depends on a brittle `setTimeout(syncTwin, 60)` tied only to clicks inside `lessons`**
    - **Location:** [labShell.js](file:///D:/EduLab/ChemLab/src/labShell.js#L65-L83).
    - **Why it is wrong:** `syncTwin()` only runs on `showGuided()`, `chemlab:open-guided-lesson` (+60 ms), or clicks inside `lessons` (+60 ms). If a curriculum lesson finishes/exits or re-renders asynchronously or via `chemlab:progress-changed` (or takes >60 ms on a slow device), `.ulab-twin` and `.ulab--lesson` (which hides the chooser cards via CSS) can stay stale.
    - **Suggested fix:** Have `guidedExperiments.js` emit a synchronous `chemlab:guided-state` event whenever `currentExperiment` changes (or observe `#guided-panel` with a `MutationObserver`) instead of a 60 ms click timeout.

16. **[P2] Clicking `"Thư viện thí nghiệm"` from a guided bench lab flashes a misleading `"Đã chuyển sang Tự do"` toast**
    - **Location:** [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1288), [dlabApp.js](file:///D:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1310-L1318).
    - **Why it is wrong:** `if (what === 'library') { toFree(); openSide('discover') }` unconditionally calls `toFree()`, which (a) displays `"Đã chuyển sang Tự do..."` even though the user clicked `"Thư viện thí nghiệm"`, and (b) when already in library mode with the side drawer closed, briefly switches `sideTab` to `'obs'` and immediately back to `'discover'`.
    - **Suggested fix:** Pass `{ silent: true, keepTab: true }` (or factor out `exitGuided()`) for the `library` branch.

17. **[P2] `exp-liquid-layers` has empty `expect` and `expectState` arrays, so the test suite verifies neither layering nor miscibility**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L292-L293).
    - **Why it is wrong:** `expect: [], expectState: []` means `runExperiment` only checks that pouring oil and 3 mL ethanol didn't throw or emit `OUT_OF_MODEL_RANGE`; it never asserts oil floats on water in vessel A or ethanol mixed in vessel B.
    - **Suggested fix:** Extend `checkState` to verify liquid phases/layer order (e.g., `oilAbove: true` in vessel 0 and `liquid: 'ethanol'` in vessel 1).

18. **[P2] `exp-thiocyanate-equilibrium` `expect` keys fire during `setup` before any student step, and `conditions` slightly contradicts its own `FeCl3` reagent**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L340-L357).
    - **Why it is wrong:** (a) All 4 vessels already contain `fecl3` + `kscn` in `setup`, so `scn` events fire before step 1 (only `expectState` actually checks the Le Chatelier shifts); (b) `conditions` states `"không dùng HCl vì Cl⁻ tạo phức với Fe³⁺"` while the setup uses `FeCl₃` (adding $1.4\text{ mM}$ $\text{Cl}^-$ initially and $8.4\text{ mM}$ in beaker B).
    - **Suggested fix:** Clarify in `conditions` that `HNO₃` is used instead of `HCl` to avoid *large* $\text{Cl}^-$ excess (while `FeCl₃` itself introduces a small amount of $\text{Cl}^-$ not modelled as $\text{FeCl}^{2+}$).

19. **[P2] `exp-starch-iodine` `conditions` mentions decoloration in base without noting it is unmodelled**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L365).
    - **Why it is wrong:** `conditions` says `"Màu mất khi đun nóng trên khoảng 65 °C và trong môi trường kiềm."` In the engine, heating above 65 °C *does* fade the blue-black colour, whereas adding `NaOH` leaves the beaker bright blue-black (only logging an `ION_HINTS` unsupported warning). A student testing base addition may think the lab contradicts its own text.
    - **Suggested fix:** Add `(phản ứng với kiềm chưa được mô phỏng, sẽ có thông báo)` to `conditions`, matching the transparent style used in `exp-iron2-hydroxide` and `exp-permanganate-iron2`.

20. **[P2] `dlab-sci-validate.mjs` silently skips formula-vs-ion validation for `AgSCN`**
    - **Location:** [dlab-sci-validate.mjs](file:///D:/EduLab/ChemLab/scripts/dlab-sci-validate.mjs#L113).
    - **Why it is wrong:** The anion map `{ OH: 'OH', 'Cl-': 'Cl', 'I-': 'I', SO4: 'SO4', CO3: 'CO3' }` does not include `'SCN-': 'SCN'`, so `if (an && !p.redox)` silently skips `AgSCN`.
    - **Suggested fix:** Add `'SCN-': 'SCN'` to the map (and fail if an unmapped non-redox anion is encountered).

21. **[P2] `kspEquilibrium` repeatedly redissolves and re-solves unchanged competing precipitates 10×/second whenever `c.dirty` is set**
    - **Location:** [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L427-L463), [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L858-L880).
    - **Why it is wrong:** Whenever a vessel with competing precipitates (e.g., `AgCl` + `AgI`) also has an active `c.dirty` trigger (heating/boiling, $\text{CO}_2$ degassing, starch temperature drift, or a dissolving solid), `stepContainer` runs `equilibrate()` every 6 ticks (10 Hz), and `kspEquilibrium` redissolves and re-solves all competing solids from scratch via `structuredClone` + `rootUp` + `solveH`.
    - **Suggested fix:** Skip re-equilibrating salts whose ion concentrations and pH already satisfy $|\log Q - \log K_{sp}| < 10^{-6}$ (and no competing salt is supersaturated).

---

### P3 — Minor Wording & Edge Cases

22. **[P3] `exp-rate-concentration` lists `'Chai nước cất'` in `equipment` though `setup.bottles` is `[]`**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L229-L231).
    - **Why it is wrong:** Beaker B is pre-diluted (`[['hcl', 15], ['water', 15]]`), so no distilled-water bottle is placed on the bench.
    - **Suggested fix:** Remove `'Chai nước cất'` from `equipment` (or note it was used to prepare beaker B).

23. **[P3] `exp-sodium-water` rounds 0.1 g Na to `4,3 mmol` instead of `4,4 mmol`**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L218).
    - **Why it is wrong:** $0.1 / 22.990 = 4.3497\text{ mmol}$, which rounds to `4,35 mmol` or `4,4 mmol` (and half of 4.35 is `2,175 ≈ 2,2 mmol`, which the same sentence already rounds up to `2,2 mmol`).
    - **Suggested fix:** Change `4,3 mmol` to `4,35 mmol` (or `4,4 mmol`).

24. **[P3] `#dlab/...` sub-path hash is not rewritten to `#lab` by `parseHashRoute()`**
    - **Location:** [main.js](file:///D:/EduLab/ChemLab/src/main.js#L624-L635).
    - **Why it is wrong:** Line 628 checks `if (VIEW_ALIASES[raw])` against the whole hash rather than `rawView`, so `#dlab` rewrites to `#lab` cleanly, while `#dlab/` or `#dlab/foo` opens `lab` but leaves `#dlab/...` in the address bar.
    - **Suggested fix:** Check `if (VIEW_ALIASES[rawView])` and rewrite to `#${VIEW_ALIASES[rawView]}`.

25. **[P3] `exp-litmus-media` `explanation` slightly overstates the litmus colour-change boundary**
    - **Location:** [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L19), [experiments71.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments71.js#L28).
    - **Why it is wrong:** `conditions` accurately states red `< 5`, violet `5,5–7,5`, blue `> 8,3`, while `explanation` says `"Dung dịch axit (pH < 7) có nhiều H⁺ làm quỳ hóa đỏ"` (weakly acidic solutions at pH 5.5–6.9 keep litmus violet).
    - **Suggested fix:** Clarify `"Dung dịch axit đủ mạnh (pH < 5) làm quỳ hóa đỏ, dung dịch bazơ (pH > 8,3) làm quỳ hóa xanh"`.
