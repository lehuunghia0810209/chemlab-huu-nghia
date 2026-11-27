### Independent Chemistry Review

*(Read-only review; no files were modified and no terminal commands were run.)*

Below are the findings from reviewing `exp-daniell-cell`, `exp-daniell-concentration`, `exp-electrolysis-cucl2`, `exp-copper-iodide`, and `exp-iron3-iodide` in [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js), along with [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js), [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js), and [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js) (cross-checked against reagent molarities and constants in [materials.js](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js)).

**Summary verdict:** **2 P0** issues (wrong science shown as fact), **5 P1** issues (misleading science or model claims), and **6 P2** issues (minor/wording/safety completeness) were found.

---

### P0 — Wrong Science Shown as Fact

- **P0 — `exp-iron3-iodide`: Claims "no precipitate" when 96% of the generated $\text{I}_2$ precipitates as solid $\text{I}_2$, and misstates $K \approx 10^8$ for homogeneous dissolved $\text{I}_2(\text{aq})$**
  - **Files & exact text:**
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L419-L422):
      - `steps`: `'Rót 20 mL KI vào cốc FeCl₃ (2 mmol Fe³⁺, 2 mmol I⁻).'`
      - `phenomena`: `'Dung dịch chuyển vàng nâu (I₂); không có kết tủa.'`
      - `explanation`: `'E°(Fe³⁺/Fe²⁺) = +0,77 V > E°(I₂/I⁻) = +0,54 V nên Fe³⁺ oxi hóa được I⁻. Phản ứng thực chất là cân bằng (K ≈ 10⁸) nên ở các nồng độ này gần như hoàn toàn; mô phỏng coi là hoàn toàn (xấp xỉ giáo dục).'`
    - [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L55-L60):
      - Comment: `E° (CRC, 25 °C): Cu²⁺/CuI 0,86 V, Fe³⁺/Fe²⁺ 0,771 V, I₂/I⁻ 0,5355 V → log K = nΔE°/0,05916 ≈ 11 (Cu) and 7,9 (Fe). shortcut: complete conversion; at < 1 mM the Fe³⁺/I⁻ equilibrium would leave a few % unreacted`
      - `observe`: `'dung dịch chuyển vàng nâu do I₂ (I₃⁻) sinh ra.'`
    - [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L337-L348): `iodineSolubility` writes excess $\text{I}_2$ into `contents.precipitates.I2s` without recording it in `formed`, so the UI never spawns solid $\text{I}_2$ particles or logs a precipitate note.
  - **Scientific issue:**
    1. Mixing 10 mL of 0.2 M $\text{FeCl}_3$ (2 mmol $\text{Fe}^{3+}$) with 20 mL of 0.1 M $\text{KI}$ (2 mmol $\text{I}^-$) leaves **zero excess $\text{I}^-$** in 30 mL. Producing 1.0 mmol $\text{I}_2$ gives a formal concentration of 33.3 mM — **25× the aqueous solubility of $\text{I}_2$** (1.33 mM at 25 °C). In the engine itself, `iodineSolubility` leaves only 0.04 mmol dissolved and puts **0.96 mmol (96%) into `contents.precipitates.I2s`**. In real chemistry (even accounting for equilibrium and $\text{FeCl}^{2+}$ complexation), ~0.7–0.85 mmol of dark-violet solid $\text{I}_2$ precipitates in 30 mL. Claiming `'không có kết tủa'` and `'do I₂ (I₃⁻) sinh ra'` (with no excess $\text{I}^-$ to form $\text{I}_3^-$) is factually wrong.
    2. $E^\circ(\text{I}_2/\text{I}^-) = +0.5355\text{ V}$ is for **solid** $\text{I}_2(\text{s})$ (and $+0.536\text{ V}$ is for $\text{I}_3^-/\text{I}^-$), so $K \approx 9 \times 10^7 \approx 10^8$ applies to $2\text{Fe}^{3+} + 2\text{I}^- \rightleftharpoons 2\text{Fe}^{2+} + \text{I}_2(\text{s})$ or $2\text{Fe}^{3+} + 3\text{I}^- \rightleftharpoons 2\text{Fe}^{2+} + \text{I}_3^-$. For the precipitate-free aqueous reaction $2\text{Fe}^{3+} + 2\text{I}^- \rightleftharpoons 2\text{Fe}^{2+} + \text{I}_2(\text{aq})$, $E^\circ(\text{I}_2(\text{aq})/\text{I}^-) = +0.621\text{ V}$, giving $K_{\text{aq}} = K_{\text{s}} \cdot S_0 \approx \mathbf{1.2 \times 10^5}$ (nearly 3 orders of magnitude smaller). Consequently, the comment in `reactions.js` (`at < 1 mM ... a few % unreacted`) is also wrong: at 1 mM stoichiometric $\text{Fe}^{3+} + \text{I}^-$, **~21%** remains unreacted.
  - **Suggested correction:**
    - Use **excess KI** in `exp-iron3-iodide` (e.g., 5 mL $\text{FeCl}_3$ 0.2 M = 1 mmol $\text{Fe}^{3+}$ + 30 mL $\text{KI}$ 0.1 M = 3 mmol $\text{I}^-$ → 0.5 mmol $\text{I}_2$ + 2 mmol excess $\text{I}^-$). That keeps all $\text{I}_2$ genuinely dissolved as yellow-brown $\text{I}_3^-$ (no solid $\text{I}_2$ in reality or in the engine), pushes real equilibrium conversion above 99.9%, and still leaves `Fe3+` completely consumed (`gone: 'Fe3+'`).
    - Specify that $E^\circ = +0.54\text{ V}$ and $K \approx 10^8$ refer to $\text{I}_3^-/\text{I}^-$ (in excess $\text{I}^-$) or $\text{I}_2(\text{s})/\text{I}^-$, whereas for $\text{I}_2(\text{aq})/\text{I}^-$ alone $E^\circ = +0.62\text{ V}$ and $K_{\text{aq}} \approx 1.2 \times 10^5$. Fix the `< 1 mM` comment in `reactions.js`.
    - Have `iodineSolubility` report newly precipitated `I2s` via `formed` so solid iodine precipitation is visible and logged rather than silently hidden.

- **P0 — `exp-copper-iodide` (Vessel A): Claims only ivory-white $\text{CuI}$ precipitate, "$\text{I}_2$ ($\text{I}_3^-$)", and visible blue color from excess $\text{Cu}^{2+}$, when 92% of $\text{I}_2$ precipitates as solid $\text{I}_2$ and completely masks the blue color**
  - **Files & exact text:**
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L404):
      `phenomena: 'Cả hai cốc: kết tủa CuI trắng ngà, dung dịch vàng nâu do I₂ (I₃⁻). Cốc A còn màu xanh (dư Cu²⁺); cốc B hết Cu²⁺, còn dư I⁻.'`
    - [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L59):
      `observe: 'xuất hiện kết tủa CuI màu trắng ngà, dung dịch chuyển vàng nâu do I₂ (I₃⁻).'`
  - **Scientific issue:**
    1. In Vessel A (10 mL 0.5 M $\text{CuSO}_4$ + 20 mL 0.1 M $\text{KI}$ = 5 mmol $\text{Cu}^{2+}$ + 2 mmol $\text{I}^-$ in 30 mL), $\text{I}^-$ is the limiting reagent (0 mmol left in the model). The 0.5 mmol of $\text{I}_2$ formed corresponds to 16.7 mM — **12.5× above the 1.33 mM solubility of $\text{I}_2$ in water**. In the engine, **0.46 mmol (92%) of the $\text{I}_2$ precipitates as dark solid `I2s`** (and ~0.23 mmol precipitates even at real equilibrium), contaminating the ivory-white $\text{CuI}$ with dark brown/violet solid iodine.
    2. Because $\text{I}^-$ is exhausted in Vessel A, attributing the solution color in *both* beakers to `I₂ (I₃⁻)` contradicts the experiment's own `explanation` (`Cốc A: I⁻ hết trước`, with only Vessel B having excess $\text{I}^-$ to form $\text{I}_3^-$).
    3. Claiming `'Cốc A còn màu xanh (dư Cu²⁺)'` as an observable phenomenon is wrong both experimentally and in the simulator's own `bulkColor` (which blends to muddy gray-brown RGB `[160, 135, 123]`): intense brown $\text{I}_2$ (1.33 mM dissolved + 0.46 mmol solid) completely masks the pale blue of 0.133 M $\text{Cu}^{2+}$. Excess $\text{Cu}^{2+}$ is only visibly blue after decolorizing/removing $\text{I}_2$ (e.g., with $\text{S}_2\text{O}_3^{2-}$) or at much smaller $\text{I}^-$ doses.
  - **Suggested correction:**
    - Rewrite Vessel A's `phenomena` honestly: note that both beakers form $\text{CuI}$ and brown $\text{I}_2$, that in Vessel A (no excess $\text{I}^-$) most $\text{I}_2$ exceeds its low water solubility and precipitates as dark solid $\text{I}_2$ while the intense brown iodine masks the blue color of leftover $\text{Cu}^{2+}$ (which is confirmed in the vessel composition readout), whereas in Vessel B excess $\text{I}^-$ keeps all $\text{I}_2$ dissolved as yellow-brown $\text{I}_3^-$ and $\text{Cu}^{2+}$ is exhausted.
    - In `reactions.js` L59–60, avoid unconditionally claiming `(I₃⁻)` when excess $\text{I}^-$ is absent (e.g., write `'do I₂ (hoặc I₃⁻ khi dư I⁻)'`).

---

### P1 — Misleading

- **P1 — `exp-iron3-iodide` & `exp-copper-iodide` (and `redoxNotes`): Claim `pH ≤ 7` and imply $\text{Fe}^{3+}$ precipitates as $\text{Fe(OH)}_3$ only in basic medium (`trong môi trường bazơ`)**
  - **Files & exact text:**
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L417):
      `conditions: '25 °C, pH ≤ 7 (trong môi trường bazơ Fe³⁺ ở dạng Fe(OH)₃ và không oxi hóa được I⁻).'`
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L398):
      `conditions: '25 °C, môi trường axit yếu hoặc trung tính (pH ≤ 7); không có NH₃.'`
    - [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L371):
      `` `${r.equation} chỉ được mô hình hóa trong môi trường axit hoặc trung tính (pH ≤ ${r.maxPH}).` ``
  - **Scientific issue:**
    - With $K_{sp}(\text{Fe(OH)}_3) = 2.79 \times 10^{-39}$, $\text{Fe(OH)}_3$ precipitates starting around **pH 1.5–3**, not pH > 7. Between pH 3 and 7 (still acidic/neutral), $\text{Fe}^{3+}$ is already precipitated as $\text{Fe(OH)}_3$ and the $\text{Fe(OH)}_3/\text{Fe}^{2+}$ reduction potential ($E \approx 0.98 - 0.178\,\text{pH}$) falls below $E^\circ(\text{I}_2/\text{I}^-)$ above pH ~2.5. Telling students that the reaction holds up to `pH ≤ 7` and fails only `trong môi trường bazơ` creates a direct misconception for Grade 11–12 hydrolysis/precipitation chemistry.
    - Similarly, for 0.1–0.5 M $\text{Cu}^{2+}$ ($K_{sp}(\text{Cu(OH)}_2) = 2.2 \times 10^{-20}$), $\text{Cu(OH)}_2$ precipitates around **pH 4.5–5**, so free $\text{Cu}^{2+}$ is not stable at neutral pH 7.
  - **Suggested correction:**
    - For `exp-iron3-iodide`, change `conditions` to `'25 °C, môi trường axit (pH < ~2,5–3; dung dịch FeCl₃ tự có tính axit do thủy phân; ở pH cao hơn Fe³⁺ kết tủa thành Fe(OH)₃ và không còn oxi hóa được I⁻).'` (And consider setting `maxPH` for `fe-i` closer to 3 so `ionRedox` cannot iteratively reduce $\text{Fe(OH)}_3$ at pH 3–4.)
    - For `exp-copper-iodide`, change `conditions` to `'25 °C, môi trường axit yếu (pH < ~5; ở pH cao hơn Cu²⁺ kết tủa thành Cu(OH)₂); không có NH₃.'`

- **P1 — `exp-daniell-concentration`: Describes 0.5 M $\text{ZnSO}_4$ / $\text{CuSO}_4$ as "dilute solution, activity ≈ concentration", presenting the ideal 0.030 V drop (`1,100 → 1,070 V`) as if real 0.5 M solutions satisfy $a \approx c$**
  - **File & exact text:**
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L359-L370):
      - `conditions`: `'25 °C; dung dịch loãng, hoạt độ ≈ nồng độ; không có chất tạo phức (NH₃) trong pin.'`
      - `explanation`: `'E = E° − (0,0592/2)·lg([Zn²⁺]/[Cu²⁺]). Khi [Cu²⁺] giảm 10 lần, lg tăng 1 nên E giảm 0,0296 V: 1,100 → 1,070 V.'`
  - **Scientific issue:**
    - For 0.5 M of a 2:2 sulfate electrolyte, the ionic strength is $I = 2.0\text{ M}$ — **20× above the codebase's own ideal limit** (`IDEAL_I_LIMIT = 0.1` in [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L202)). Calling 0.5 M $\text{ZnSO}_4$/$\text{CuSO}_4$ `"dung dịch loãng, hoạt độ ≈ nồng độ"` is factually untrue: mean ionic activity coefficients are $\gamma_\pm(0.5\text{ M}) \approx 0.062$ vs $\gamma_\pm(0.05\text{ M}) \approx 0.21$. While $\gamma_\pm$ nearly cancels at equal 0.5 M concentrations in `exp-daniell-cell`, tenfold dilution of 0.5 M $\text{CuSO}_4$ lowers $a(\text{Cu}^{2+})$ by only **~3×** (not 10×), so a real cell drops by only **~0.014 V** (plus liquid-junction potential change), not 0.030 V.
  - **Suggested correction:**
    - Change `conditions` to `'25 °C; mô phỏng dùng xấp xỉ dung dịch lí tưởng (thay hoạt độ bằng nồng độ mol, bỏ qua thế tiếp xúc lỏng); không có chất tạo phức (NH₃).'`
    - Add a note in `explanation` that the 0.0296 V drop (`1,100 → 1,070 V`) is the textbook concentration-Nernst result; in real 0.5 M $\text{CuSO}_4/\text{ZnSO}_4$ ($I = 2\text{ M}$), activity coefficients make the measured drop smaller.

- **P1 — `processes.js` (`stepElectro`, Daniell voltmeter): Uses analytical total concentration instead of `freeConc`, outputs `0 V` instead of `null` when `[Zn²⁺]` or `[Cu²⁺]` is zero, and does not guard against active side reactions on the electrodes**
  - **File & exact text:**
    - [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L694-L700):
      ```js
      const cZn = (zn.c.contents.ions['Zn2+'] || 0) / Vz
      const cCu = (cu.c.contents.ions['Cu2+'] || 0) / Vc
      if (!(cZn > 0) || !(cCu > 0)) { m.reading = 0; m.status = 'Cần dung dịch Zn²⁺ quanh thanh Zn và Cu²⁺ quanh thanh Cu.'; continue }
      ...
      // Nernst needs the FREE ion concentration.
      ```
  - **Scientific issue:**
    1. Although `freeConc` is already imported in `processes.js` L7 and L698 notes `Nernst needs the FREE ion concentration`, `cZn` and `cCu` use analytical total dissolved moles. If the half-cell pH rises (e.g., adding base so $\text{Cu(OH)}_2$ precipitates at pH 10), `contents.ions['Cu2+']` includes hydrolyzed $\text{CuOH}^+$ (which exceeds free $\text{Cu}^{2+}$ by >100× at pH 10), causing a Nernst error of ~0.06 V or more.
    2. Setting `m.reading = 0` (unlike L682/691/697/702 which set `m.reading = null`) when `cZn === 0` or `cCu === 0` displays `0 V` on the meter — misleading a student into thinking a cell like $\text{Zn}|\text{NaCl}\parallel\text{CuSO}_4|\text{Cu}$ has zero EMF (in reality trace dissolution gives $E > 1.1\text{ V}$).
    3. If a student adds acid (pH < 3) or $\text{Cu}^{2+}$/$\text{Ag}^+$ to the Zn beaker (causing $\text{H}_2$ evolution or local displacement coating), the voltmeter still reports an equilibrium Nernst reading instead of flagging an out-of-model mixed corrosion potential.
  - **Suggested correction:**
    - Compute `cZn` and `cCu` via `freeConc(...)` using `solveH(...)`.
    - Set `m.reading = null` (not `0`) when `!(cZn > 0) || !(cCu > 0)`, keeping `0` only for the open circuit without a salt bridge.
    - Set `m.reading = null` with an out-of-model message if either electrode is undergoing an active competing reaction (e.g., Zn in acid or in a vessel containing $\text{Cu}^{2+}$/$\text{Ag}^+$).

- **P1 — `chemistry.js` (`iodineSolubility`): Overestimates $\text{I}_2$ solubility in the presence of $\text{I}^-$ by ~2×**
  - **File & exact text:**
    - [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L333-L341):
      ```js
      // I₂ dissolves in water only to 1.33 mM (0.34 g/L, 25 °C, CRC) but much more as I₃⁻ while I⁻ is present
      // (I₂ + I⁻ ⇌ I₃⁻, K ≈ 700). shortcut: capacity = 1.33 mM·V + n(I⁻); ...
      const cap = I2_SOLUBILITY * V + (contents.ions['I-'] || 0)
      ```
  - **Scientific issue:**
    - At saturation with solid $\text{I}_2(\text{s})$, $[\text{I}_2(\text{aq})] = S_0 = 1.33 \times 10^{-3}\text{ M}$ is fixed. With the code's own $K = 700\text{ M}^{-1}$ (literature ~710–768 $\text{M}^{-1}$), $[\text{I}_3^-] = K S_0 [\text{I}^-]_{\text{free}} = 0.931\,[\text{I}^-]_{\text{free}}$. Because $C_{\text{I}^-} = [\text{I}^-]_{\text{free}} + [\text{I}_3^-]$, the maximum $\text{I}_3^-$ concentration is $\frac{K S_0}{1 + K S_0} C_{\text{I}^-} \approx \mathbf{0.482}\,C_{\text{I}^-}$ (≈ 0.49 with $K = 710\text{ M}^{-1}$), matching the measured ~0.050 M solubility of $\text{I}_2$ in 0.10 M $\text{KI}$ at 25 °C. Using `1.0 * n(I⁻)` overestimates solubility in $\text{KI}$ solutions by **~2.07×**. (It does not change the qualitative outcome of `exp-copper-iodide` Vessel B, where $0.486 \times 3 = 1.46\text{ mmol} > 0.5\text{ mmol}$.)
  - **Suggested correction:**
    - Replace `contents.ions['I-'] || 0` with `I3_MAX_PER_IODIDE * (contents.ions['I-'] || 0)` where `I3_MAX_PER_IODIDE = (710 * I2_SOLUBILITY) / (1 + 710 * I2_SOLUBILITY)` (`≈ 0.486`).

- **P1 — `exp-electrolysis-cucl2`: Presents the model threshold `U > 1,42 V (thế phân hủy 1,02 V + quá thế ≈ 0,4 V)` as an experimental condition without disclosing that `0,4 V` overpotential is an illustrative model parameter**
  - **File & exact text:**
    - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L380) & [L388](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L388):
      - `conditions`: `'U > 1,42 V (thế phân hủy 1,02 V + quá thế ≈ 0,4 V); dung dịch chỉ có Cu²⁺ và Cl⁻; Cl⁻ ≥ 0,1 M.'`
      - `explanation`: `'... Cường độ dòng trong mô phỏng dùng điện trở bình minh họa nên tốc độ là minh họa; tỉ lệ Cu : Cl₂ = 1 : 1 và khối lượng theo điện lượng là đúng.'`
  - **Scientific issue:**
    - $E^\circ_{\text{decomp}} = 1.36 - 0.34 = 1.02\text{ V}$ is the standard reversible decomposition voltage (shifting slightly to ~1.03–1.11 V across 0.5 M → 0.05 M $\text{CuCl}_2$), whereas `0.4 V` overpotential is an **illustrative model constant** (explicitly noted as `'Điện trở và quá thế là minh họa'` in `manifest.js` L101). On graphite, real onset overpotential at low current is typically ~0.1–0.2 V (electrolysis starts around 1.1–1.3 V, not strictly > 1.42 V). Because `explanation` only flags the cell resistance as illustrative, students may treat `1,42 V` as a fixed textbook threshold.
    - Also, `'dung dịch chỉ có Cu²⁺ và Cl⁻'` is slightly misleading: it is an aqueous solution (water is present, and spectator ions like $\text{Na}^+/\text{SO}_4^{2-}$ do not interfere, whereas electroactive species like $\text{Ag}^+$, $\text{Fe}^{3+}$, $\text{Fe}^{2+}$, $\text{I}^-$, excess $\text{NH}_3$ do).
  - **Suggested correction:**
    - State in `conditions`: `'U > 1,42 V trong mô phỏng (thế phân hủy chuẩn 1,02 V + quá thế minh họa 0,4 V); dung dịch nước CuCl₂ không chứa ion cạnh tranh điện phân; [Cl⁻] ≥ 0,1 M.'`, and update `explanation` to say `'điện trở bình và quá thế là minh họa'`.

---

### P2 — Minor / Wording / Completeness

- **P2 — Equation notation omits `đpdd` condition and phase arrows (`↑`, `↓`) standard in Vietnamese Grade 10–12 chemistry**
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L387) (`exp-electrolysis-cucl2`): `equation: 'CuCl₂ → Cu + Cl₂'` omits `đpdd` (making it look like spontaneous decomposition) and `↑` on $\text{Cl}_2$. Suggest `'CuCl₂ —(đpdd)→ Cu + Cl₂↑'`. Consider also noting external-circuit electron flow (from anode `+` through the power source to cathode `−`) for contrast with `exp-daniell-cell`.
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L405) (`exp-copper-iodide`): `equation: '2Cu²⁺ + 4I⁻ → 2CuI + I₂'` omits `↓` after `CuI` (present in `objective` on L396 and `reactions.js` L59). Suggest `'2Cu²⁺ + 4I⁻ → 2CuI↓ + I₂'`.

- **P2 — Equipment naming mismatch (`Thanh kẽm` vs `Kẽm (viên)`) and missing `25 °C` qualifier in Daniell cell formulas**
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L338), [L342](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L342), [L358](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L358), [L362](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L362) refer to reagent `zn` as `'Thanh kẽm'`, whereas [materials.js](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L217) names it `'Kẽm (viên)'` (spherical granule). Align the wording so students can locate the reagent easily.
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L349) & [L370](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L370): Add `'ở 25 °C'` next to `E = E° ... = 1,10 V` and `0,0592/2` so students see that $E^\circ$ and $0.0592\text{ V} = \frac{RT\ln 10}{F}$ depend on temperature.

- **P2 — `processes.js`: Vietnamese chemical nomenclature `'phức amin'` should be `'phức ammin'`**
  - [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L371): `'... kim loại ở dạng hiđroxit hoặc phức amin: ...'`
  - In Vietnamese IUPAC/GDPT 2018 nomenclature, $\text{NH}_3$ complexes are `'phức ammin'` (or `'phức amoniac'`), whereas `'amin'` means organic amine ($\text{R-NH}_2$). Suggest `'phức ammin (phức với NH₃)'`.

- **P2 — Incomplete safety notes compared with `materials.js` hazard definitions**
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L350) & [L371](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L371) (`exp-daniell-cell`, `exp-daniell-concentration`): Omit eye-protection warning for $\text{ZnSO}_4$ (GHS H318 serious eye damage, listed in [materials.js](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L201) and `exp-no-displacement` L330) and aquatic-toxicity disposal warning (`không đổ xuống cống`) for $\text{CuSO}_4$/$\text{ZnSO}_4$.
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L389) (`exp-electrolysis-cucl2`): Good $\text{Cl}_2$ fume-hood and power-off guidance; add $\text{CuCl}_2$ toxicity/disposal and goggles/gloves.
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L407) (`exp-copper-iodide`) & [L423](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L423) (`exp-iron3-iodide`): Add goggles/gloves, aquatic toxicity for $\text{CuSO}_4$, and $\text{I}_2$ staining/irritation warning in `exp-iron3-iodide`.

- **P2 — `exp-electrolysis-cucl2`: Partial $\text{Cl}_2$ dissolution in water vs 1:1 gas release**
  - [experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L388): `'tỉ lệ Cu : Cl₂ = 1 : 1 và khối lượng theo điện lượng là đúng.'`
  - True for moles *produced* by Faraday's law, though in a real 50 mL beaker, $\text{Cl}_2$ has appreciable solubility in water (~0.09 M at 25 °C, 1 atm, ~4.5 mmol in 50 mL) and partly hydrolyzes, so less $\text{Cl}_2$ escapes as gas initially. Suggest writing `'tỉ lệ mol Cu : Cl₂ sinh ra ở hai điện cực là 1 : 1 (thực tế một phần Cl₂ tan trong nước)'`.

- **P2 — Grade-level alignment and driving-force note for Vietnamese Grade 10 vs Grade 12 students**
  - `exp-iron3-iodide` is tagged `grade: 'Hóa học 10'` ([experiments.js](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L413)), yet L422 uses $E^\circ$ (Grade 12 in GDPT 2018) and $K$ (Grade 11). Tagging as `'Hóa học 10–12'` (or marking the $E^\circ$/$K$ note as Grade 12 extension) avoids confusing Grade 10 students.
  - In `exp-copper-iodide` ([L406](file:///D:/EduLab/ChemLab/src/dlab/data/experiments.js#L406)), a Grade 12 student checking $E^\circ(\text{Cu}^{2+}/\text{Cu}^+) = +0.15\text{ V} < E^\circ(\text{I}_2/\text{I}^-) = +0.54\text{ V}$ may wonder why $\text{Cu}^{2+}$ oxidizes $\text{I}^-$ at all; briefly noting that the very low solubility of $\text{CuI}$ ($K_{sp} = 1.27 \times 10^{-12}$, raising $E^\circ(\text{Cu}^{2+}/\text{CuI})$ to $+0.86\text{ V}$) is *what drives* the reaction makes the explanation complete.

---

### Items Verified as Scientifically Correct

- **Electrode roles, signs, and external electron flow:** Galvanic cell (`exp-daniell-cell`: Zn = anode/negative, Cu = cathode/positive, $e^-$ from Zn → Cu externally, salt bridge conducts ions) and electrolytic cell (`exp-electrolysis-cucl2`: cathode = negative/$\text{Cu}^{2+}$ reduction, anode = positive/$\text{Cl}^-$ oxidation) are all correct.
- **Half-reactions, overall balance, and Faraday stoichiometry:** All half-reactions and overall equations are balanced in elements, charge, and electrons. In `stepElectro` ([processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L667-L673)), $n_e = I\Delta t / F$ consumes $n_e/2$ mol $\text{Cu}^{2+}$ and $n_e$ mol $\text{Cl}^-$, deposits $n_e/2$ mol $\text{Cu}$, releases $n_e/2$ mol $\text{Cl}_2$, and preserves charge and mass. All interference guards in `ELECTRO.electrolysisCuCl2.interferes` ([reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L70-L77)) have accurate $E^\circ$ orderings.
- **Daniell thermodynamics and ideal Nernst arithmetic:** $E^\circ = 0.34 - (-0.76) = 1.10\text{ V}$, $\Delta_r S^\circ = (-112.1 + 33.150) - (41.63 - 99.6) = -20.98\text{ J/(mol·K)}$, $dE^\circ/dT = \Delta_r S^\circ / (2F) = -0.109\text{ mV/K}$, and the ideal-solution 25 °C Nernst shift for tenfold dilution ($-\frac{RT\ln 10}{2F} = -0.02958\text{ V}$, $1.100 \to 1.070\text{ V}$) are mathematically exact.
- **Limiting-reagent arithmetic in `exp-copper-iodide`:** Vessel A (5 mmol $\text{Cu}^{2+}$, 2 mmol $\text{I}^-$ → 1 mmol $\text{CuI}$, 0.5 mmol $\text{I}_2$, 4 mmol $\text{Cu}^{2+}$ left, 0 mmol $\text{I}^-$ left) and Vessel B (1 mmol $\text{Cu}^{2+}$, 5 mmol $\text{I}^-$ → 1 mmol $\text{CuI}$, 0.5 mmol $\text{I}_2$, 0 mmol $\text{Cu}^{2+}$ left, 3 mmol $\text{I}^-$ left) are stoichiometrically exact, and Vessel B genuinely keeps all 0.5 mmol $\text{I}_2$ dissolved as $\text{I}_3^-$.
