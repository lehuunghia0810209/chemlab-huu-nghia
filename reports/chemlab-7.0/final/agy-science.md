# Adversarial Scientific Review — `src/dlab`

> Read-only static review of [materials.js](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js), [reactions.js](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js), [chemistry.js](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js), and [processes.js](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js).

---

## A. Verification of Numbers & Source Claims

| Constant / Table | Code Value & Claim | Published Reference | Verdict / Discrepancy |
| :--- | :--- | :--- | :--- |
| Water `bp`, `hvap`, `density`, `cp` ([materials.js:92](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L92)) | `100 °C`, `2257 J/g`, `0.997 g/mL`, `4.18 J/(g·K)` | CRC/NIST: `100.0 °C`, `2256.4–2257.1 J/g` (`40.65–40.66 kJ/mol`), `0.99705 g/cm³`, `4.181 J/(g·K)` | **Matches** (school accuracy). |
| Ethanol `bp`, `hvap`, `density`, `cp` ([materials.js:89-93](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L89-L93)) | `78.3 °C`, `838 J/g` (`38.6 kJ/mol`), `0.785 g/mL`, `2.44 J/(g·K)` (`112.4 J/(mol·K)`) | NIST WebBook: $T_b \approx 78.3\text{–}78.5\text{ °C}$; $\Delta_{\text{vap}}H(T_b) = 38.56\text{ kJ/mol} = 837.0\text{ J/g}$ (Majer & Svoboda); $C_{p,l}(298\text{ K}) = 112.3\text{–}112.4\text{ J/(mol·K)} = 2.44\text{ J/(g·K)}$; $\rho = 0.78504\text{ g/cm}^3$ | **Matches** ($\Delta_{\text{vap}}H$ within 0.1%). |
| `ETHANOL_WATER_DENSITY` ([materials.js:99](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L99)) | `0.99708` → `0.78506 g/mL` (Lange 1967, 25 °C) | ICT/CRC 25 °C ($\text{g/cm}^3$): `0.99705, 0.98040, 0.96636, 0.95064, 0.93145, 0.90982, 0.88696, 0.86337, 0.83908, 0.81360, 0.78504` | **Matches Lange 1967** (`+0.00002–0.00003` vs modern $\text{g/cm}^3$ is the pre-1964 $1\text{ mL}=1.000028\text{ cm}^3$ litre; `<0.004%`). |
| `ETHANOL_WATER_BOILING` ([materials.js:103](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L103)) | CRC "Boiling points of aqueous solutions" (`[1,98,19]`, `[5,94,44]`, `[10,90,61]`, …, `[95.5,78.1,95.5]`) | Matches older CRC (e.g. 44th ed., p. 2391) verbatim. Modern 1 atm VLE: $x=0.02\text{ mol frac}$ (`5.0 wt%`) boils at `96.4–96.8 °C`, $y=34.4\text{ wt\%}$; $x=0.05$ (`11.9 wt%`) boils at `90.8 °C`, $y=54.4\text{ wt\%}$; $x=0.10$ (`22.1 wt%`) boils at `86.6 °C`, $y=66.9\text{ wt\%}$; azeotrope `~95.5 wt%`, `78.1–78.2 °C`. | **Source accurate, data dated**: dilute region (`1–20 wt%`) is `2–2.5 °C` too low and vapour wt% `5–10` percentage points too high vs modern 1 atm VLE. |
| `ION_REDOX` $E^\circ$, $\log K$ ([reactions.js:40-42](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L40-L42)) | $E^\circ(\text{Cu}^{2+}/\text{CuI})=0.86\text{ V}$, $\text{Fe}^{3+}/\text{Fe}^{2+}=0.771\text{ V}$, $\text{I}_2/\text{I}^-=0.5355\text{ V}$; $\log K \approx 11\text{ (Cu)}, 7.9\text{ (Fe)}$ | CRC: $\text{Cu}^{2+}+\text{I}^-+\text{e}^-\to\text{CuI}(s)$ `+0.86 V`; $\text{Fe}^{3+}/\text{Fe}^{2+}$ `+0.771 V`; $\text{I}_2(s)/\text{I}^-$ `+0.5355 V`; $\text{I}_3^-/\text{I}^-$ `+0.535–0.536 V`; **$\text{I}_2(aq)/\text{I}^-$ `+0.621 V`** | **Half-reaction mismatch**: `0.5355 V` is $\text{I}_2(s)$ or $\text{I}_3^-$, not $\text{I}_2(aq)$. For stoichiometric $2\text{Fe}^{3+}+2\text{I}^-\rightleftharpoons 2\text{Fe}^{2+}+\text{I}_2(aq)$, $\log K = 2(0.771-0.621)/0.05916 = \mathbf{5.07}$ (not `7.9`, ~700× smaller!). For $\text{Cu}^{2+}+\text{I}^-\to\text{CuI}+\frac12\text{I}_2(aq)$, $\log K = \mathbf{8.08}$ (not `11`). At `1 mM` equimolar $\text{Fe}^{3+}/\text{I}^-$, ~**25%** remains unreacted (not "a few %"). |
| `CuI` $K_{\text{sp}}$, $\rho$ ([materials.js:83](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L83)) | `Ksp: 1.27e-12`, `density: 5.62` | CRC: $K_{\text{sp}} = 1.27\times 10^{-12}$ (also cited $1.1\times 10^{-12}$), $\rho = 5.67\text{ g/cm}^3$ (`5.62` is SDS/commercial value) | **Minor**: density `-0.9%` vs CRC. |
| `electrolysisCuCl2` $E^\circ$ ([reactions.js:52-60](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L52-L60)) | `decomposition: 1.02`, $\text{Cl}_2/\text{Cl}^- 1.36$, $\text{Ag}^+ 0.80$, $\text{Fe}^{3+}/\text{Fe}^{2+} 0.77$, $\text{I}_2/\text{I}^- 0.54$, $\text{Cu}^{2+} 0.34$ | CRC: $\text{Cl}_2/\text{Cl}^- 1.3583\text{ V}$, $\text{Cu}^{2+}/\text{Cu} 0.3419\text{ V}$ ($\Delta E^\circ = 1.016\text{ V}$), $\text{Ag}^+/\text{Ag} 0.7996\text{ V}$, $\text{Fe}^{3+}/\text{Fe}^{2+} 0.771\text{ V}$, $\text{I}_2(s)/\text{I}^- 0.5355\text{ V}$ | **Matches** (rounded to 2 d.p.). |
| `daniell` $E^\circ$, $\Delta S^\circ$ ([reactions.js:62-65](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L62-L65)) | `E0: 1.10`, `dS: -20.98` (NBS $S^\circ$: $\text{Zn}^{2+} -112.1$, $\text{Cu} 33.150$, $\text{Zn} 41.63$, $\text{Cu}^{2+} -99.6$); measured `-0.3 to -0.4 mV/K` | NBS (Wagman 1982): exact match on all four $S^\circ$, giving $\Delta S^\circ = -20.98\text{ J/(mol·K)}$, $dE^\circ/dT = -0.109\text{ mV/K}$. CRC $E^\circ = 0.3419 - (-0.7618) = \mathbf{1.1037\text{ V}}$. Experimental Daniell $dE/dT \approx -0.29\text{ to }-0.5\text{ mV/K}$. | **Rounding bias**: `E0: 1.10` is `3.7 mV` low while UI prints `E.toFixed(3)`—the rounding error equals a `34 K` shift. Also the extra experimental slope includes activity-coefficient/ion-pairing $d\ln\gamma/dT$, not only liquid-junction potential. |

---

## B. Scientifically Wrong or Misleading Scenarios

1. **[P0] `ionRedox` runs unconditionally before `Ksp`, ignoring pH & competing precipitates** — [chemistry.js:215-221](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L215-L221)
   - **Input 1**: Add `10 mL 0.5 M NaOH` + `10 mL 0.1 M KI`, then add `10 mL 0.2 M FeCl3` (or `CuSO4`).
   - **Expected**: In strong base ($\text{pH}>13$), $E(\text{Fe(OH)}_3/\text{Fe(OH)}_2) = -0.56\text{ V} \ll +0.54\text{ V}$ and $E(\text{Cu(OH)}_2/\text{CuI}) \approx -0.26\text{ V}$; rust-brown $\text{Fe(OH)}_3$ (or blue $\text{Cu(OH)}_2$) precipitates with **no** $\text{I}_2$ (and any $\text{I}_2$ would disproportionate in $\text{OH}^-$ to colourless $\text{I}^-/\text{IO}^-$).
   - **Actual**: `ionRedox()` runs *before* the `Ksp` loop, converting $\text{Fe}^{3+}/\text{I}^-$ to green $\text{Fe(OH)}_2$ + dark brown $\text{I}_2$ (or $\text{CuI}$ + $\text{I}_2$). Mixing `(FeCl3 + NaOH) + KI` gives $\text{Fe(OH)}_3$, whereas `(NaOH + KI) + FeCl3` gives $\text{Fe(OH)}_2 + \text{I}_2$ — order-dependent thermodynamics.
   - **Input 2**: Mix `10 mL 0.1 M AgNO3` + `10 mL 0.5 M CuSO4`, then add `10 mL 0.1 M KI`.
   - **Expected**: Yellow $\text{AgI}$ ($K_{\text{sp}} = 8.52\times 10^{-17}$, $\log K = 32.1$ per $2\,\text{I}^-$) precipitates instantaneously ahead of $\text{CuI}/\text{I}_2$ ($\log K \le 8.1$).
   - **Actual**: `ionRedox()` consumes 100% of $\text{I}^-$ as $\text{CuI} + \text{I}_2$; **zero** $\text{AgI}$ forms.

2. **[P1] Aqueous `I2` solubility & `I3-` mislabelling when `I-` is limiting** — [materials.js:46](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L46), [reactions.js:44-45](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L44-L45)
   - **Input**: Equal volumes (`10 mL + 10 mL`) of bench `0.5 M CuSO4` + `0.1 M KI` (or `0.2 M FeCl3` + `0.1 M KI`).
   - **Expected**: $\text{I}^-$ is fully consumed (`[I-] = 0`), so **no** $\text{I}_3^-$ exists; $[\text{I}_2]$ reaches `12.5 mM` (or `25 mM`), which is **10–19×** the `25 °C` aqueous solubility of $\text{I}_2$ (`1.3 mM`, `0.33 g/L`), precipitating dark grey-violet $\text{I}_2(s)$.
   - **Actual**: All $\text{I}_2$ stays dissolved in `contents.ions.I2`, labelled `I₂ (I₃⁻)` with log `"dung dịch chuyển vàng nâu do I₂ (I₃⁻)"`. Furthermore, adding excess `NaOH` or active metals (`Zn`, `Fe`, `Mg`) to the $\text{I}_2$ solution leaves it permanently brown with neither reaction nor unsupported warning ([processes.js:440-519](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L440-L519)).

3. **[P1] Micro-scale alcoholic indicator drops extinguish pH and indicator colour** — [materials.js:106](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L106), [chemistry.js:44,361](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L44), [processes.js:94,119](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L94)
   - **Input**: `1 mL 0.5 M NaOH` in a test tube + `3 drops` (`0.15 mL`) phenolphthalein (or universal indicator).
   - **Expected**: Bright pink alkaline solution, $\text{pH} \approx 13.6$.
   - **Actual**: Indicator solvent is tracked as pure ethanol (`0.15 / 1.15 = 13.0% > 10%`), so `pHApplies` flips `false`, `c.pH` becomes `null`, and `bulkColor` skips all indicators — **pink NaOH turns completely colourless** on the 3rd drop!

4. **[P1] `Na` floats on cooking oil and reacts at full water speed with trace water** — [processes.js:349-366,448-478](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L349-L366)
   - **Input 1**: `10 mL water` + `30 mL oil` + `0.1 g Na`.
   - **Expected**: $\text{Na}$ (`0.968 g/cm³`) sinks through oil (`0.92 g/mL`) to the oil–water interface.
   - **Actual**: `liquidDensity()` returns water's `0.997` (`p.mL > 0.05`), so `floats = true` puts `Na` at `level - rad*0.6` — **floating on top of the oil** while reacting at full water rate.
   - **Input 2**: `50 mL ethanol` + `0.1 mL water` (`5.5 mmol`) + `0.2 g Na` (`8.7 mmol`).
   - **Expected**: Trace water is consumed; slower ethanol reaction dominates.
   - **Actual**: Because `water > 0.05` skips `SOLVENT_HINTS` and `na-water` neither checks nor decrements `liquids.water`, all `8.7 mmol Na` reacts at pure-water speed (`-184 kJ/mol`, creating `4.35 mmol H2` from `5.5 mmol` unconsumed water), while `Na` sinks (`0.968 > 0.785`) yet logs `"Mẩu natri nổi, chạy trên mặt nước"`.

5. **[P1] Probes & electrodes ignore immiscible oil layer; Daniell cell ignores ethanol & interferents** — [processes.js:540-541,588-598,827-842](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L540-L541)
   - **Input 1**: `10 mL 0.5 M HCl` (or `CuCl2`) + `50 mL oil`; dip pH meter, litmus paper, or graphite electrodes only into the top oil layer.
   - **Expected**: Insulating non-polar oil gives no aqueous pH, no litmus colour, and zero electrolysis current.
   - **Actual**: All three check only `o.y < surfaceY(c)` (top of oil), so pH meter reads `0.3`, litmus turns red, and `CuCl2` electrolyses at full current inside cooking oil.
   - **Input 2**: Daniell cell with `Zn` in `1 mL ZnSO4 + 50 mL ethanol` and `Cu` in `1 mL CuSO4 + 50 mL ethanol` (or with `HCl`/`NH3`/`Fe3+` present).
   - **Expected**: Non-aqueous / mixed-potential refusal (like electrolysis).
   - **Actual**: `aqueousLitres()` counts ethanol and `polarPhase.pHApplies` is never checked; voltmeter reports `E = 1.100 V` to 3 decimal places.

6. **[P1] Electrolysis accepts trace `CuCl2` at full current & misses `HNO3`/`NH3`, yet blocks 250 mL `CuCl2` on 1 drop of `KI`** — [reactions.js:52-60](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L52-L60), [processes.js:543-566](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L543-L566)
   - **Input 1**: `50 mL 0.5 M CuSO4` + `1 drop (0.05 mL) 0.5 M NaCl` (`0.5 mM Cl-`) at `6 V`.
   - **Expected**: $\text{O}_2$ evolution dominates at `0.5 mM Cl-` ($E(\text{Cl}_2/\text{Cl}^-) \approx 1.55\text{ V} > 1.23\text{ V}$).
   - **Actual**: Runs at full `1.15 A` producing pure $\text{Cl}_2$. Same for `CuCl2 + HNO3` ($\text{NO}_3^-$ reduction & Cu dissolution unflagged).
   - **Input 2**: Pure `KI` or `AgNO3` (no `CuCl2`) with power on.
   - **Actual**: Because `interferes` runs *before* `!(cu > 1e-7 && cl > 1e-7)`, UI falsely says `"I⁻ bị oxi hóa ở anot trước Cl⁻"` / `"Ag⁺ bị khử ở catot trước Cu²⁺"` when neither $\text{Cl}^-$ nor $\text{Cu}^{2+}$ is present (**P2**). Also `1 drop 0.1 M KI` (`1.25 µmol I2`) in `250 mL CuCl2` triggers `> 1e-6` mol and permanently refuses electrolysis.

7. **[P2] Boiling at/above azeotrope & salt+oil boil-down** — [materials.js:103](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L103), [processes.js:666-687](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L666-L687)
   - **Input 1**: Boil `95.5–99 wt%` ethanol–water.
   - **Actual**: Composition freezes (`vapourWt = liquidWt`), yet [processes.js:683](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L683) logs `"hơi giàu etanol hơn chất lỏng nên nhiệt độ sôi tăng dần"`. Boiling ethanol also emits `GASES.steam` (`H₂O(h)`) bubbles ([processes.js:680](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L680)), and when ethanol finishes mid-step, `Math.max(0, ...)` at [processes.js:677](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L677) evaporates extra water without paying its higher `hvap`.
   - **Input 2**: Boil `10 mL NaCl(aq) + 20 mL oil` until all water boils away.
   - **Actual**: `volumeOf(c) = 20 >= 0.02` skips `crystallizeDry()` ([processes.js:687](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L687)), while `stepDissolve` stops at `waterG < 0.05` ([processes.js:384](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L384)), leaving $\text{Na}^+/\text{Cl}^-$ invisibly dissolved in dry oil.

8. **[P3] `bulkColor` depends on ion insertion order; `Fe3+ + I-` generates fake neutralization heat** — [processes.js:86-92](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L86-L92), [chemistry.js:303-305](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L303-L305)
   - Adding `CuSO4` *after* `I2` already exists blends blue over brown instead of brown over blue. Consuming hydrolysed `Fe3+` lowers `after.h`, causing `mix()` to credit `-NEUTRALIZATION_DH * ΔH+` (~`+0.05 °C`) while omitting actual redox $\Delta H$.

---

## C. Atom, Charge, and Double-Counting Audit

- **Atoms (`Cu`, `I`, `Fe`)**: Conserved in both `ION_REDOX` rules (`cu-i`: $2\text{Cu}, 4\text{I}\to 2\text{CuI}+1\text{I}_2$; `fe-i`: $2\text{Fe}, 2\text{I}\to 2\text{Fe}^{2+}+1\text{I}_2$) and in `elementInventory()` ([chemistry.js:389-396](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L389-L396)), which maps `I2 -> 'I2'` (2 I), `CuI -> Cu+ + I-` (1 Cu, 1 I).
- **Charge & Ionic Strength**: Both rules conserve charge (`2(+2)+4(-1)=0`; `2(+3)+2(-1)=2(+2)`). Storing `I2` with `z: 0` in `IONS` contributes `0` to `chargeAt` and `ionicStrength`—chemically valid even when $\text{I}_3^-$ forms ($\text{I}_2+\text{I}^-\rightleftharpoons\text{I}_3^-$ preserves both $\sum cz$ and $\frac12\sum cz^2$).
- **No Double-Counting**: `CuI` has `redox: true`, so `candidatePrecipitates()` ([chemistry.js:186](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L186)) skips it (preventing creation of untracked `Cu+` ions or double precipitation). `formed.redox` is non-enumerable ([chemistry.js:220](file:///d:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L220)), so callers iterating `Object.entries(formed)` count `CuI` once. `PRECIPITATES.CuI.cation` is `'Cu+'`, avoiding false `'Cu2+'` hits in `ionHints()`.
- **Minor Leak**: `I2` + excess `I-` overcounts *free* `I-` (since $\text{I}_3^-$ binds $\text{I}^-$, $K \approx 700\text{ L/mol}$); and `na-water` violates H/O conservation by never decrementing `liquids.water`.

---

## D. Other Lab Reactions Still Modelled Wrongly

1. **Weak acid (`CH3COOH`) + `CaCO3` / `Mg` / `Zn` / `Fe` dead-stops at 1.7% conversion** ([processes.js:462](file:///d:/EduLab/ChemLab/src/dlab/engine/processes.js#L462)) — `if (rule.driver === 'h' && driver < 1e-3) continue` halts reaction once `pH > 3`. For `1 M CH3COOH` ($K_a = 1.75\times 10^{-5}$), `pH = 3` occurs at $[\text{OAc}^-]/[\text{HOAc}] = 0.0175$ (**1.72% reacted**), leaving >98% of the vinegar inert toward marble or zinc.
2. **`Ag+` + base/ammonia (`Ag2O` & `[Ag(NH3)2]+`)** ([reactions.js:35](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L35)) — `ION_HINTS` sets `minPH: 12`, but CRC $K_{\text{sp}}(\text{AgOH}/\tfrac12\text{Ag}_2\text{O}) = 2.0\times 10^{-8}$ precipitates brown $\text{Ag}_2\text{O}$ at **pH ≥ 7.6** in `0.05 M Ag+`. Thus `AgNO3 + NH3` (pH ~11.4) or dilute `NaOH` gives a clear solution with zero warning, and `AgCl`/`Ag2CO3` dissolving in `NH3` (and `Zn(OH)2` in `NH3`) is neither modelled nor hinted.
3. **Unmodelled, unflagged solution redox with `HNO3` & `Ag+`** ([materials.js:174,183,186,193](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L174)) — `HNO3 + KI` ($E^\circ(\text{NO}_3^-/\text{NO})=0.96\text{ V} > 0.54\text{ V}$), `HNO3 + FeSO4` ($0.96 > 0.77\text{ V}$), and `AgNO3 + FeSO4` ($0.800 > 0.771\text{ V}$, precipitating grey $\text{Ag}(s)$) produce zero reaction and zero warning.
4. **`Na` + strong acid (`HCl`/`H2SO4`)** ([reactions.js:12](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L12)) — Uses `na-water` (`-184.3 kJ/mol`), omitting the `-55.8 kJ/mol` neutralization enthalpy (23% thermal error) and logging `"dung dịch thành bazơ"` while `pH < 1`.
5. **`CaCO3` + `H2SO4` passivation & `CuSO4` + `Na2CO3`** ([materials.js:77](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L77), [reactions.js:13](file:///d:/EduLab/ChemLab/src/dlab/data/reactions.js#L13)) — Omitting $\text{CaSO}_4$ lets marble dissolve completely in $\text{H}_2\text{SO}_4$ instead of passivating; $\text{CuSO}_4 + \text{Na}_2\text{CO}_3$ yields blue $\text{Cu(OH)}_2$ rather than green basic carbonate $\text{Cu}_2\text{(OH)}_2\text{CO}_3$.
6. **Thermal behaviour of `Mg`, `NaHCO3`, and gases** ([materials.js:63](file:///d:/EduLab/ChemLab/src/dlab/data/materials.js#L63)) — Hot/boiling water does not react with `Mg` (no warning); `HENRY_CO2` is fixed at `25 °C`, so boiling carbonated water or `NaHCO3(aq)` never drives off extra $\text{CO}_2$, and volatile `NH3`/`HCl` never evaporate on boiling.
