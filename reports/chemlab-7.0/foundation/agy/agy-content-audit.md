# Adversarial Chemistry-Education Review — ChemLab Dynamic Lab

**Scope:** Read-only audit of [guided.js](file:///D:/EduLab/ChemLab/src/dlab/guided.js), [observations.js](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js), [manifest.js](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js), [reactions.js](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js), [processes.js](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js), and [safety.js](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js), cross-checked against engine behavior in [chemistry.js](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js), [materials.js](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js), and [equipment.js](file:///D:/EduLab/ChemLab/src/dlab/data/equipment.js).

> **Note on citation provenance:** External claims are marked `[SNIPPET]` (verified via web search summaries in this session) or `[MEMORY]` (standard Vietnamese Grades 10–12 / inorganic chemistry references). Engine behavior is cited directly by local `file:line`.

---

## P0 — Critical (Safety Hazards, Core Chemistry Falsehoods, Invalid Formulas, Broken Gate Checks)

### P0-1. Dangerous sodium safety advice (water + ethanol/oil) & acid-check bypass
- **Location:** [safety.js:41-46](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L41-L46), [safety.js:77-86](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L77-L86); interacts with [reactions.js:82](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L82), [processes.js:136-137](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L136-L137), [processes.js:497](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L497)
- **Quoted text:**
  - `safety.js:42`: `Không thả natri vào ${EQUIPMENT[c.type].name}: miệng hẹp làm khí và nhiệt dồn lại. Dùng chậu hoặc cốc rộng chứa nhiều nước.`
  - `safety.js:43`: `if (c.pH != null && c.pH < 4) block.push('Natri với dung dịch axit phản ứng quá mãnh liệt — nằm ngoài phạm vi an toàn của phòng thí nghiệm ảo.')`
  - `safety.js:44`: `if ((c.contents.liquids.water || 0) < 50 && !block.length) block.push('Cần ít nhất 50 mL nước để mẩu natri nhỏ phản ứng an toàn.')`
- **Why it is wrong:**
  1. **Dangerous advice for ethanol/oil:** If a student drops Na into pure ethanol or vegetable oil (`water = 0 < 50`), line 44 blocks it and tells them *"Cần ít nhất 50 mL nước để mẩu natri nhỏ phản ứng an toàn"*. Adding water to sodium + ethanol makes the reaction violently exothermic and risks igniting flammable ethanol vapour (in real labs, Na is stored under hydrocarbon oil and small scraps are quenched slowly in anhydrous alcohol, never by adding water `[MEMORY]`). This also makes `SOLVENT_HINTS` (`Na + ethanol` with `water ≤ 0.05` in [processes.js:497](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L497)) unreachable via normal `release`.
  2. **Acid + flammable-solvent safety bypass:** When ethanol > 10% vol (e.g., `50 mL HCl 0,5 M + 10 mL ethanol`), [processes.js:136-137](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L136-L137) sets `c.pH = null`. Then `safety.js:43` (`c.pH != null && c.pH < 4`) evaluates to `false`, and `water >= 50` passes line 44 — so the engine **allows** dropping Na directly into `HCl + ethanol` with zero block!
  3. **Missing hazard blocks:** Line 42 only blocks `testTube` and `cylinder`, permitting Na to be dropped into narrow-necked `flask` (`Bình tam giác 100 mL`, neck width `0.32×w` in [equipment.js:58](file:///D:/EduLab/ChemLab/src/dlab/data/equipment.js#L58)) and stock `bottle` (`Chai hóa chất`), into **hot/boiling water** (`c.T`), onto a vessel on an active burner, or pouring acid (`pourExact`/`addReagentTo`) into a vessel with reacting Na.
- **Corrected Vietnamese text (for block/warn messages after fixing conditions to also check ethanol, hot water, narrow-necked `flask`/`bottle`, `solveH` regardless of `pHApplies`, and acid poured onto active Na):**
  - If `ethanol > 0`: `Không thả natri vào hỗn hợp chứa etanol (nhất là có nước hoặc axit): phản ứng tỏa nhiệt mạnh, sinh H₂ và có thể đốt cháy hơi etanol.`
  - If narrow-necked (`testTube`, `cylinder`, `flask`, `bottle`): `Không thả natri vào ${EQUIPMENT[c.type].name}: miệng hẹp làm khí H₂ và nhiệt dồn lại, dễ gây nổ bắn. Dùng chậu thủy tinh hoặc cốc miệng rộng chứa nhiều nước lạnh.`
  - If `water < 50` (and no ethanol/oil): `Cần ít nhất 50 mL nước ở nhiệt độ phòng trong chậu hoặc cốc miệng rộng để mẩu natri nhỏ (≤ 0,2 g) phản ứng an toàn.`
  - If `c.T > 40`: `Không thả natri vào nước nóng (${c.T.toFixed(0)} °C): phản ứng xảy ra cực kỳ mãnh liệt, dễ gây nổ bắn dung dịch kiềm nóng.`
  - If pouring acid onto active Na: `Không rót axit vào dụng cụ đang có natri phản ứng: phản ứng sẽ bùng phát mãnh liệt và gây nổ.`

---

### P0-2. Unqualified metal-displacement and metal–acid rules (classic Grade 9–12 exam trap)
- **Location:** [guided.js:113](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L113)
- **Quoted text:**
  > `Dãy hoạt động: Na > Mg > Zn > Fe > (H) > Cu > Ag. Kim loại mạnh hơn đẩy kim loại yếu hơn khỏi dung dịch muối; kim loại trước H đẩy H₂ khỏi axit loãng.`
- **Why it is wrong:**
  1. **Alkali/alkaline-earth exception omitted right after listing `Na` first:** In aqueous salt solutions, metals that react vigorously with water at room temperature (`K, Na, Ca, Ba`) do **not** displace weaker metals — they react with `H₂O` first (`2Na + 2H₂O → 2NaOH + H₂↑`), and the resulting `OH⁻` precipitates the metal hydroxide (e.g., `Cu(OH)₂↓`). In Vietnamese curriculum (SGK KHTN 9 / Hóa học 12 `[MEMORY]`), the rule is strictly **"kim loại từ Mg trở về sau"** (metals from Mg onward). Having `Na` and `CuSO₄` on the same bench makes this omission actively misleading.
  2. **Unqualified `axit loãng`:** Dilute `HNO₃` is a dilute acid — and is literally in ChemLab's library as `'Axit nitric loãng'` ([materials.js:184](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L184)) — yet metals before H do **not** evolve `H₂` with dilute `HNO₃` (they reduce `NO₃⁻` to `NO, N₂O, N₂, NH₄NO₃` `[MEMORY]`, as the engine itself notes at [processes.js:517](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L517)).
- **Corrected Vietnamese text:**
  > `Dãy hoạt động: Na > Mg > Zn > Fe > (H) > Cu > Ag. Từ Mg trở về sau, kim loại hoạt động mạnh hơn đẩy được kim loại yếu hơn ra khỏi dung dịch muối (các kim loại kiềm như Na tác dụng với nước trước, không đẩy trực tiếp kim loại ra khỏi dung dịch muối); kim loại đứng trước H đẩy được H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh như HCl, H₂SO₄ loãng (không áp dụng cho HNO₃).`

---

### P0-3. Guided Lab 1 Step 5 passes without neutralisation (`null < 8.2 === true` in JS + `NaCl` spoof) and gives impractical dropper instruction
- **Location:** [guided.js:60](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L60)
- **Quoted text:**
  - `text`: `Nhỏ từ từ HCl vào ống B (hút bằng ống nhỏ giọt) đến khi mất màu hồng.`
  - `help`: `Chọn chai HCl → Rót khoảng 9 mL vào Ống B, hoặc hút HCl bằng một ống nhỏ giọt sạch và nhỏ nhiều lần.`
  - `check`: `(s, r) => (obj(s, r.B).contents.indicators.phenolphthalein || 0) > 0 && (obj(s, r.B).contents.ions['Cl-'] || 0) > 0 && obj(s, r.B).pH < 8.2`
- **Why it is wrong:**
  1. **Bypass via JS `null < 8.2`:** Phenolphthalein is 50% ethanol ([materials.js:139](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L139)). Adding ≥ 2 mL of phenolphthalein to the 8 mL of NaOH in Tube B pushes ethanol > 10% vol, so [processes.js:136-137](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L136-L137) sets `c.pH = null`. In JavaScript, `null < 8.2` evaluates to `true`. Adding a single drop of HCl (or a drop of `NaCl` from Tube C) satisfies all three clauses while Tube B still contains ~`0,36 M NaOH` (strongly basic, completely unneutralised!).
  2. **Bypass without HCl:** Emptying/spilling Tube B and adding water + 1 drop of `NaCl` (Tube C supplies `Cl⁻`) + phenolphthalein also passes (`pH = 7 < 8.2`) with zero neutralisation (`s.notes['neutral-...']` is never checked).
  3. **Amount/tool mismatch:** Tube B has `8 mL NaOH 0,5 M` (`4 mmol`). Neutralising it with `HCl 0,5 M` requires **8,0 mL** (= **160 drops**, or 4 full 2 mL dropper refills per [equipment.js:35](file:///D:/EduLab/ChemLab/src/dlab/data/equipment.js#L35)). Telling the student in `text` to add HCl drop-by-drop with the dropper is impractical; and `help` says `khoảng 9 mL` without noting equivalence is `8 mL` (`8 mL` already reaches pH 7,0 < 8,2).
- **Corrected Vietnamese text (and check requirement: `pH != null && pH < 8.2 && s.notes['neutral-' + r.B] != null`):**
  - `text`: `Thêm từ từ HCl 0,5 M vào ống B (rót khoảng 7 mL rồi dùng ống nhỏ giọt nhỏ từng giọt tiếp) đến khi mất màu hồng (tổng khoảng 8 mL).`
  - `help`: `8 mL NaOH 0,5 M cần đúng 8 mL HCl 0,5 M để trung hòa hoàn toàn. Chọn chai HCl → Rót khoảng 7–8 mL vào Ống B (hoặc rót 7 mL rồi dùng ống nhỏ giọt sạch nhỏ tiếp đến khi vừa mất màu hồng).`

---

### P0-4. Chemically invalid ALL-CAPS element/compound formulas generated across DISCOVER & manifest cards
- **Location:** [manifest.js:56](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L56), [manifest.js:97](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L97), [manifest.js:119](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L119)
- **Quoted text:**
  - `manifest.js:56`: ``inputs: PPT_DEMO[key] ? `${PPT_DEMO[key][0].toUpperCase()} + ${PPT_DEMO[key][1].toUpperCase()}` : ...``
  - `manifest.js:97`: ``inputs: `${SOLID_NAME[r.solid]} + ${r.driver === 'h' ? 'HCl' : SOURCE[r.driver]?.toUpperCase()}` ``
  - `manifest.js:119`: ``inputs: fill ? fill.map(([x]) => x.toUpperCase()).join(' + ') : r.all.join(' + ')``
- **Why it is wrong:** Applying `.toUpperCase()` to internal reagent IDs outputs **`AGNO3 + NACL`**, **`BACL2 + NA2SO4`**, **`CACL2 + NA2CO3`**, **`CUSO4 + NAOH`**, **`FECL3 + NAOH`**, **`FESO4 + NAOH`**, **`MGCL2 + NAOH`**, **`ZNSO4 + NAOH`**, **`ZNSO4 + NA2CO3`**, etc. directly on student-facing DISCOVER cards ([manifest.js:148](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L148)). In IUPAC chemical notation, element symbols are strictly case-sensitive (`Na`, `Cl`, `Cu`, `Fe`, `Ba`, `Ca`, `Mg`, `Zn`, `Ag`; e.g., `CO` ≠ `Co` `[MEMORY]`).
- **Corrected Vietnamese text (by looking up `REAGENT_BY_ID[id].formula` + Unicode subscripts instead of `.toUpperCase()`):**
  > `AgNO₃ + NaCl`, `AgNO₃ + KI`, `BaCl₂ + Na₂SO₄`, `CaCl₂ + Na₂CO₃`, `CuSO₄ + NaOH`, `FeCl₃ + NaOH`, `FeSO₄ + NaOH`, `MgCl₂ + NaOH`, `BaCl₂ + Na₂CO₃`, `ZnSO₄ + Na₂CO₃`, `AgNO₃ + Na₂CO₃`, `ZnSO₄ + NaOH`, `Cu + ZnSO₄`, `Fe + ZnSO₄`, `Cu + FeSO₄`, etc.

---

### P0-5. Missing reaction products and unbalanced equation in `manifest.js`
- **Location:** [manifest.js:31](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L31), [manifest.js:83](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L83), [manifest.js:93](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L93)
- **Quoted text:**
  - `manifest.js:31`: ``products: [...Object.keys(r.gives || {}), ...Object.keys(r.gas || {}).map(g => `${g}↑`), ...Object.keys(r.deposit || {}).map(m => `${m} bám`)].join(', ')``
  - `manifest.js:83`: `title: 'HCO₃⁻/CO₃²⁻ + H⁺ → CO₂↑'`, `products: 'CO₂↑'`
  - `manifest.js:93`: `products: 'Cu²⁺'`
- **Why it is wrong:**
  1. `manifest.js:31` derives `products` from `r.gives`, which omits `OH⁻` and `H₂O` (handled implicitly by charge balance in the engine). Consequently:
     - `na-water` (`2Na + 2H₂O → 2NaOH + H₂↑`) lists products as **`Na+, H2↑`** — omitting **`OH⁻`** (`NaOH`)!
     - `caco3-acid` (`CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O`) lists products as **`Ca2+, CO2↑`** — omitting **`H₂O`**!
  2. `manifest.js:83`: `'HCO₃⁻/CO₃²⁻ + H⁺ → CO₂↑'` is unbalanced in both atoms and charge (`CO₃²⁻` requires `2H⁺`, and both reactions produce **`H₂O`**), and `products: 'CO₂↑'` also omits `H₂O`.
  3. `manifest.js:93`: `Cu(OH)₂ + 2H⁺ → Cu²⁺ + 2H₂O` lists only `products: 'Cu²⁺'`, omitting **`H₂O`**.
- **Corrected Vietnamese text:**
  - `na-water` products: `Na⁺, OH⁻ (NaOH), H₂↑`
  - `caco3-acid` products: `Ca²⁺, CO₂↑, H₂O`
  - `manifest.js:83` title & products: `title: 'HCO₃⁻ + H⁺ → CO₂↑ + H₂O; CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O'`, `products: 'CO₂↑, H₂O'`
  - `manifest.js:93` products: `Cu²⁺, H₂O`

---

## P1 — High (Engine-vs-Text Contradictions, Wrong Products/Phenomena, Misleading Explanations, Significant Safety/Check Gaps)

### P1-1. Backwards live-observation text for CO₂ effervescence ("bubbling CO₂ in" when gas is escaping out)
- **Location:** [observations.js:56](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L56) vs [processes.js:714](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L714)
- **Quoted text:**
  > `else if (id === 'co2') happening.push({ key: \`co2-${c.id}\`, where: label(c), text: 'Sục khí CO₂ vào dung dịch: có bọt khí.' })`
- **Why it is wrong:** In [processes.js:714](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L714), `c.activeReactions.co2 = state.t` is set whenever dissolved `H₂CO₃*` degasses (e.g., `NaHCO₃ + CH₃COOH` in Guided Lab 5 or `Na₂CO₃ + HCl`). Showing *"Sục khí CO₂ vào dung dịch"* ("Bubbling CO₂ gas into the solution") describes the exact opposite physical process when no CO₂ tank is even present! Conversely, actual CO₂ feeding (`c.co2Feed`, lines 717–723) does not set `activeReactions.co2` until the solution supersaturates.
- **Corrected Vietnamese text:**
  > (Split keys `co2-evolve` vs `co2-feed`; for degassing:) `Khí CO₂ thoát ra khỏi dung dịch: sủi bọt khí không màu.`
  > (For actual `c.co2Feed`:) `Đang sục khí CO₂ vào dung dịch: có bọt khí.`

---

### P1-2. Neutralisation note (`H⁺ + OH⁻ → H₂O`) falsely emitted for `Na₂CO₃ + HCl`, `HCl + NH₃`, and `CH₃COOH + NaOH`
- **Location:** [processes.js:192](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L192) vs [chemistry.js:447](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L447)
- **Quoted text:**
  > ``if (result.neutralised > 1e-5) noteOnce(state, `neutral-${c.id}`, `Phản ứng trung hòa trong ${label(c)}: H⁺ + OH⁻ → H₂O, tỏa nhiệt.`)``
- **Why it is wrong:**
  1. **False positive on `Na₂CO₃ + HCl` (literally the `co2-carbonate` demo in [manifest.js:83](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L83)):** `20 mL Na₂CO₃ 0,2 M` has `pH ≈ 11,8`, `[OH⁻] ≈ 6,5e-3 M` → `before.oh ≈ 1,31e-4 mol > 1e-5`. Adding `20 mL HCl 0,5 M` gives `result.neutralised = 1,31e-4 > 1e-5`, so the engine logs *"Phản ứng trung hòa ...: H⁺ + OH⁻ → H₂O"* for an **acid + carbonate salt** reaction (`CO₃²⁻ + 2H⁺ → CO₂↑ + H₂O`), which is NOT acid–base neutralisation.
  2. **Wrong Grade 11 net ionic equation for weak acids/bases:** Mixing `20 mL HCl 0,5 M + 20 mL NH₃ 2 M` (`oh ≈ 1,2e-4 > 1e-5`) or `CH₃COOH + NaOH` logs `H⁺ + OH⁻ → H₂O`. In Vietnamese Grade 11 chemistry (SGK Hóa học 11 — Phương trình ion rút gọn `[MEMORY]`), weak electrolytes must stay molecular: `H⁺ + NH₃ → NH₄⁺` (doesn't even form `H₂O`!) and `CH₃COOH + OH⁻ → CH₃COO⁻ + H₂O`.
- **Corrected Vietnamese text (when emitted only for strong acid + strong base, or generalized to acid–base reaction without misstating the ionic equation):**
  > (For strong acid + strong base:) `Phản ứng trung hòa trong ${label(c)}: H⁺ + OH⁻ → H₂O, tỏa nhiệt.`
  > (For weak acid/base when `CO3` is absent:) `Phản ứng axit – bazơ trong ${label(c)} (tỏa nhiệt), pH thay đổi.`

---

### P1-3. Kinetic, unsupported, and ion-hint messages fire falsely on negligible (`10⁻¹⁸–10⁻³⁰ mol`) ions over insoluble precipitates
- **Location:** [processes.js:509, 515, 551](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L509-L551), [processes.js:558-562](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L558-L562), [processes.js:307, 326](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L307-L326); messages from [reactions.js:9-11, 40, 88-91](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L9-L91)
- **Quoted text:**
  - `reactions.js:9`: `Fe + Cu²⁺ → Fe²⁺ + Cu` — `Lớp đồng màu đỏ bám lên đinh sắt, màu xanh của dung dịch nhạt dần.`
  - `reactions.js:11`: `Cu + 2Ag⁺ → Cu²⁺ + 2Ag` — `Dây đồng phủ lớp bạc xám, dung dịch dần có màu xanh.`
  - `reactions.js:40`: `Ag⁺ + Fe²⁺ → Ag↓ + Fe³⁺ (E° 0,80 > 0,77 V) — chưa được mô hình hóa.`
  - `reactions.js:88`: `Cu + Fe³⁺ chưa được mô hình hóa.`
- **Why it is wrong:**
  1. **Kinetic rules (`processes.js:515`):** `if (!(driver > 0)) continue` has no minimum concentration threshold (and `chemistry.js:384` leaves `> 0` dissolved ions over every precipitate). Dropping an iron nail into `Cu(OH)₂` suspended in excess `NaOH` (`[Cu²⁺] ≈ 10⁻¹⁸ M`), or copper wire into `AgCl`/`AgI` (`[Ag⁺] ≈ 10⁻⁹–10⁻¹⁵ M`), reacts `~10⁻²² mol` and immediately logs *"Lớp đồng màu đỏ bám lên đinh sắt..."* / *"Dây đồng phủ lớp bạc xám, dung dịch dần có màu xanh"* when no visible reaction occurs (`Cu` cannot visibly displace Ag from insoluble `AgCl`/`AgI` `[MEMORY]`).
  2. **`UNSUPPORTED_HINTS` fallback (`processes.js:558`):** Unlike line 489 (`> 1e-7`), line 558 filters `c.contents.ions[k] > 0`. Dropping `Cu` (or `Fe`/`Zn`/`Mg`) into `Fe(OH)₃` suspended in excess `NaOH` (`Fe³⁺ ≈ 10⁻³⁰ mol > 0`) logs `'Chưa có mô hình: Cu + Fe³⁺ chưa được mô hình hóa.'` even though `Fe(OH)₃` in base does not react with Cu.
  3. **`ION_HINTS` precipitate match (`processes.js:307`):** `has` treats any precipitate containing `cation === 'Ag+'` as dissolved `Ag⁺`. Mixing `AgCl` precipitate (`AgNO₃` + excess `NaCl`) with `FeSO₄` logs `'Ag⁺ + Fe²⁺ → Ag↓ + Fe³⁺ (E° 0,80 > 0,77 V)'` — **chemically false** because `E°(AgCl/Ag) = +0,222 V << E°(Fe³⁺/Fe²⁺) = +0,771 V` (`AgCl` cannot oxidize `Fe²⁺` `[MEMORY]`).
- **Corrected Vietnamese text (keep existing texts, fix emission guards):**
  - Require real dissolved free concentration (e.g., `driver > 1e-5` and `xi > 1e-9` before `noteOnce` in `stepKinetics`; use `> 1e-7` in `processes.js:558`; check `freeConc('Ag+')` > `1e-5` rather than `AgCl` precipitate for `Ag⁺ + Fe²⁺`, and clarify reversibility: `Ag⁺ + Fe²⁺ ⇌ Ag↓ + Fe³⁺ (E° 0,80 > 0,77 V, phản ứng thuận nghịch) — chưa được mô hình hóa.`).

---

### P1-4. Electrolysis status mislabels `NaCl(aq)`, `HCl(aq)`, `CuSO₄(aq)` as "ran out of Cu²⁺ or Cl⁻: water electrolysis"
- **Location:** [processes.js:612-614](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L612-L614)
- **Quoted text:**
  > `p.status = cu > 0 || cl > 0 ? 'Đã hết Cu²⁺ hoặc Cl⁻: giai đoạn điện phân nước chưa được mô hình hóa, dòng điện ngừng.' : 'Hệ điện phân này chưa được mô hình hóa (mô hình hỗ trợ dung dịch CuCl₂).'`
- **Why it is wrong:** If a student attempts to electrolyse pure **`NaCl(aq)`** or **`HCl(aq)`** (`cl > 0, cu === 0`) or pure **`CuSO₄(aq)`** (`cu > 0, cl === 0`), `cu > 0 || cl > 0` is `true`, so the UI falsely claims *"Đã hết Cu²⁺ hoặc Cl⁻: giai đoạn điện phân nước chưa được mô hình hóa"*:
  1. Neither ion ever "ran out" — the missing ion was never present.
  2. Chemically, electrolysing `NaCl(aq)` does **not** just electrolyse water (`2NaCl + 2H₂O → 2NaOH + H₂↑ + Cl₂↑`), and electrolysing `CuSO₄(aq)` deposits `Cu` + `O₂↑` + `H₂SO₄` (`2CuSO₄ + 2H₂O → 2Cu + O₂↑ + 2H₂SO₄`) — both are core Vietnamese Grade 12 electrolysis reactions `[MEMORY]`.
- **Corrected Vietnamese text (distinguish `state.notes['electro-' + c.id]` already ran vs never ran):**
  - If electrolysis of `CuCl₂` previously ran in `c`: `Đã hết Cu²⁺ hoặc Cl⁻ trong dung dịch: các phản ứng điện phân tiếp theo (điện phân nước hoặc ion còn lại) chưa được mô hình hóa, dòng điện ngừng.`
  - Otherwise: `Hệ điện phân này chưa được mô hình hóa (mô hình hiện chỉ hỗ trợ điện phân dung dịch CuCl₂ với điện cực than chì).`

---

### P1-5. Boiling volatile `HCl`, `HNO₃`, `CH₃COOH`, or `NH₃` to dryness claims "crystalline solid residue remains" — and `safety.js` emits zero fume warning
- **Location:** [processes.js:757, 797-805](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L797-L805); [safety.js:95-102](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L95-L102)
- **Quoted text:**
  > `processes.js:803`: `${label(c)} đã cạn: còn lại chất rắn kết tinh ở đáy.`
- **Why it is wrong:**
  1. **Chemistry/engine error:** `crystallizeDry` checks `Object.entries(c.contents.ions).filter(([, v]) => v > 0)`. Solutions of `HCl` (`Cl-`), `HNO₃` (`NO3-`), `CH₃COOH` (`OAc`), and `NH₃` (`NH3`) all have entries in `contents.ions`, so boiling them dry logs *"còn lại chất rắn kết tinh ở đáy"* even though `HCl`, `HNO₃`, `CH₃COOH`, and `NH₃` are **volatile** and evaporate as vapours without leaving a salt crystal residue `[MEMORY]`.
  2. **Missing lab safety warning (`safety.js:95-102`):** `heatChecks` warns only for ethanol and empty/cracked/non-heat-resistant vessels. Heating `HCl`, `HNO₃`, `NH₃`, `H₂SO₄`, or `Ag⁺ + NH₃` (explosive silver nitride `Ag₃N` risk noted in [manifest.js:91](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L91)) produces **zero safety warning**, even though boiling strong volatile acids/ammonia on an open bench releases toxic/corrosive fumes (`HCl`, `HNO₃`/`NO₂`, `NH₃`, `H₂SO₄` mist) and must only be done in a fume hood `[MEMORY]`.
- **Corrected Vietnamese text:**
  - `processes.js:803` (only when non-volatile metal cations are present; otherwise log full evaporation):
    - With non-volatile salts: `${label(c)} đã cạn: còn lại cặn chất rắn ở đáy.`
    - Volatile acids/ammonia only: `${label(c)} đã bay hơi hết (axit/amoniac dễ bay hơi không để lại tinh thể rắn; thực tế có hơi ăn mòn/độc thoát ra).`
  - Add to `safety.js` `heatChecks`:
    - For `HCl`/`HNO₃`/`NH₃`/`H₂SO₄`: `Đun nóng dung dịch axit/amoniac dễ bay hơi sinh hơi ăn mòn, kích ứng hoặc độc: chỉ thực hiện trong tủ hút và đeo kính bảo hộ.`
    - For `Ag⁺ + NH₃`: `Không đun nóng hoặc để cạn dung dịch bạc – amoniac: có nguy cơ tạo bạc nitrua (Ag₃N) dễ nổ.`

---

### P1-6. Water–ethanol boiling card contradicts the azeotrope; azeotrope note mislabels 96–99.9% ethanol as "≈ 95,5%"
- **Location:** [manifest.js:85](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L85) and [processes.js:752](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L752) (with [materials.js:112](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L112))
- **Quoted text:**
  - `manifest.js:85`: `observe: 'Nước sôi ở 100 °C; etanol ~78 °C; hỗn hợp sôi giữa hai giá trị, nhiệt độ sôi tăng dần.'`
  - `processes.js:752`: ``Hỗn hợp nước–etanol trong ${label(c)} (≈ 95,5 % khối lượng etanol) sôi ở ${bp.T.toFixed(1)} °C như hỗn hợp đẳng phí: hơi có cùng thành phần với chất lỏng nên nhiệt độ sôi gần như không đổi. Hơi etanol dễ bắt lửa.``
- **Why it is wrong:**
  1. `manifest.js:85` states that every water–ethanol mixture boils *between* 78 °C and 100 °C and its boiling point rises. In reality, water–ethanol forms a **minimum-boiling azeotrope** at ~95,6% mass ethanol boiling at **78,1–78,2 °C** — **lower** than pure ethanol (~78,3–78,4 °C) — at constant temperature (`[SNIPPET]`: LibreTexts / CRC Handbook / Wikipedia ethanol–water azeotrope: ~95.6 wt% ethanol, bp 78.1–78.2 °C vs pure ethanol ~78.3–78.4 °C). This also contradicts [processes.js:752](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L752).
  2. In `processes.js:752`, because [materials.js:112](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L112) sets `vapourWt === ethanolWt` across the entire `95,5%–100%` segment, `Math.abs(bp.vapourWt - ethanolWt) < 0.5` is `true` for **99% ethanol + 1% water** (`diff = 0`). The engine then falsely prints `(≈ 95,5 % khối lượng etanol)` for a 99% ethanol mixture!
- **Corrected Vietnamese text:**
  - `manifest.js:85`: `Nước sôi ở 100 °C; etanol tinh khiết ~78,3 °C. Hỗn hợp nước–etanol (dưới 95,5 % khối lượng etanol) sôi trong khoảng 78,1–100 °C và nhiệt độ sôi tăng dần khi etanol bay hơi trước; riêng hỗn hợp đẳng phí (~95,5–95,6 % khối lượng etanol) sôi ổn định ở ~78,1 °C (thấp hơn etanol tinh khiết).`
  - `processes.js:752` (guard `ethanolWt` near 95.5% or interpolate actual `ethanolWt`):
    `Hỗn hợp nước–etanol trong ${label(c)} (≈ ${vn(polarPhase(c.contents).ethanolWt, 1)} % khối lượng etanol, gần điểm đẳng phí ≈ 95,5 %) sôi ở ${vn(bp.T, 1)} °C với nhiệt độ sôi gần như không đổi. Hơi etanol dễ bắt lửa.`

---

### P1-7. `NaHCO₃` claimed to crystallise across `0–100 °C` (chemically wrong & contradicts engine)
- **Location:** [manifest.js:84](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L84) vs [processes.js:449, 462](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L449-L462) and [materials.js:232](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L232)
- **Quoted text:**
  > `title: 'Hòa tan và kết tinh NaCl, KNO₃, NaHCO₃'`, `conditions: '0–100 °C'`
- **Why it is wrong:**
  1. **Chemistry error:** Aqueous `NaHCO₃` thermally decomposes starting around **50–60 °C** (`2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O`, accelerating strongly at 60–80 °C and on boiling `[SNIPPET]`: PatSnap / Ataman Chemicals thermal decomposition of aqueous NaHCO₃). It does not simply dissolve and recrystallise unchanged up to 100 °C (a core Vietnamese Grade 11–12 reaction).
  2. **Engine contradiction:** Both `stepDissolve` ([processes.js:449](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L449)) and `crystallize` ([processes.js:462](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L462)) explicitly skip `counter === 'CO3'`, so **`NaHCO₃` never crystallises in the engine**, and its solubility table ([materials.js:232](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L232)) ends at 60 °C.
- **Corrected Vietnamese text:**
  - `title`: `Hòa tan NaCl, KNO₃, NaHCO₃ và kết tinh NaCl, KNO₃`
  - `conditions`: `0–100 °C (NaCl, KNO₃); ≤ 60 °C cho NaHCO₃`
  - `limits`: `Tốc độ tan là xấp xỉ; mô hình không kết tinh lại NaHCO₃ và không mô hình hóa phản ứng nhiệt phân 2NaHCO₃ → Na₂CO₃ + CO₂↑ + H₂O khi đun nóng trên ~50–60 °C.`

---

### P1-8. False/absolute explanations in `observations.js` (`axit loãng` for Mg/Zn/Fe; `axit mạnh` for `CaCO₃`)
- **Location:** [observations.js:11-13](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L11-L13), [observations.js:17](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L17)
- **Quoted text:**
  - `observations.js:11`: `Mg đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi axit loãng.`
  - `observations.js:12`: `Zn đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi axit loãng.`
  - `observations.js:13`: `Fe đứng trước H nên tác dụng với axit loãng, tạo muối sắt(II) và khí H₂.`
  - `observations.js:17`: `Muối cacbonat tác dụng với axit mạnh, giải phóng khí CO₂.`
- **Why it is wrong:**
  1. Lines 11–13 fail for dilute **`HNO₃`** (dilute `HNO₃` oxidizes Mg/Zn/Fe without releasing `H₂`, and oxidizes Fe to `Fe³⁺` salt when in excess `[MEMORY]`).
  2. Line 17 is **both chemically false and contradicts the engine**: `caco3-acid` runs with **`CH₃COOH` (weak acid)** ([processes.js:513-514](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L513-L514)). When a student dissolves marble (`CaCO₃`) in `CH₃COOH 1 M`, line 17 tells them *"Muối cacbonat tác dụng với axit mạnh"*, teaching that acetic acid is a strong acid! Carbonates react with any acid stronger than `H₂CO₃` (`pKa1 ≈ 6,35`), including weak acids like `CH₃COOH` (`pKa ≈ 4,76`) `[MEMORY]`.
- **Corrected Vietnamese text:**
  - `11`: `Mg đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng).`
  - `12`: `Zn đứng trước H trong dãy hoạt động hóa học nên đẩy được H₂ ra khỏi dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng).`
  - `13`: `Fe đứng trước H nên tác dụng với dung dịch axit không có tính oxi hóa mạnh (như HCl, H₂SO₄ loãng), tạo muối sắt(II) và khí H₂.`
  - `17`: `Muối cacbonat tác dụng với axit mạnh hơn H₂CO₃ (như HCl, CH₃COOH...), giải phóng khí CO₂.`

---

### P1-9. Precipitation manifest: `ZnSO₄ + Na₂CO₃` real product (basic zinc carbonate), missing `Fe(OH)₂` air oxidation, and lowercase Roman numerals (`sắt(ii)`)
- **Location:** [manifest.js:48-49, 59, 62](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L48-L62)
- **Quoted text:**
  - `manifest.js:49`: `ZnCO3: ['znso4', 'na2co3']`
  - `manifest.js:59`: ``observe: `Kết tủa ${p.name.toLowerCase()} xuất hiện, lắng dần, tan lại khi điều kiện làm Q < Ksp.` ``
- **Why it is wrong:**
  1. **Lowercase Roman numerals:** `p.name.toLowerCase()` generates **`đồng(ii) hiđroxit`**, **`sắt(iii) hiđroxit`**, **`sắt(ii) hiđroxit`** — invalid Stock oxidation-state notation (Roman numerals must always be uppercase `(II)`, `(III)` `[SNIPPET]`: Thông tư 32/2018/TT-BGDĐT / IUPAC).
  2. **`ZnSO₄ + Na₂CO₃` product simplification undisclosed:** Just like `Cu²⁺ + CO₃²⁻` (which the authors explicitly warn about in [reactions.js:41](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L41)), mixing aqueous `ZnSO₄` and `Na₂CO₃` — especially at `pH ≥ 8` or with excess `Na₂CO₃` — predominantly precipitates **basic zinc carbonate (hydrozincite)** `Zn₅(OH)₆(CO₃)₂` (`2ZnCO₃·3Zn(OH)₂`), not pure `ZnCO₃` (`[SNIPPET]`: PatSnap / Ataman Chemicals). `manifest.js` marks `ppt-ZnCO3` `SUPPORTED` with no note in `limits`.
  3. **`Fe(OH)₂` air oxidation omitted:** In real labs and Vietnamese Grade 12 exams, pale greenish-white `Fe(OH)₂` rapidly turns reddish-brown in air (`4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃` `[MEMORY]`). Neither `observe` nor `limits` notes that oxygen oxidation is unmodelled.
  4. **`Zn(OH)₂` amphoterism omitted from `ppt-Zn(OH)2` limits**, and `"tan lại khi điều kiện làm Q < Ksp"` is misleading for `BaSO₄`, `AgCl`, `AgI` without clarifying that they do **not** dissolve in dilute strong acids (`HCl, HNO₃`).
- **Corrected Vietnamese text:**
  - Replace `p.name.toLowerCase()` with a helper that preserves Roman numerals `(I)`, `(II)`, `(III)` (e.g., `đồng(II) hiđroxit`, `sắt(II) hiđroxit`, `sắt(III) hiđroxit`).
  - Add per-salt `limits` notes:
    - `ZnCO3`: `Thực tế khi trộn ZnSO₄ với Na₂CO₃ (nhất là ở pH ≥ 8 hoặc dư Na₂CO₃) thường tạo kẽm cacbonat bazơ Zn₅(OH)₆(CO₃)₂; mô hình xấp xỉ thành ZnCO₃.`
    - `Fe(OH)2`: `Trong không khí, kết tủa Fe(OH)₂ trắng xanh bị oxi hóa nhanh thành Fe(OH)₃ nâu đỏ (4Fe(OH)₂ + O₂ + 2H₂O → 4Fe(OH)₃) — quá trình này chưa được mô hình hóa.`
    - `Zn(OH)2`: `Zn(OH)₂ lưỡng tính tan trong kiềm mạnh dư tạo [Zn(OH)₄]²⁻ — chưa được mô hình hóa (có cảnh báo khi pH > 12).`

---

### P1-10. Wrong `I₂ + OH⁻` final product (`IO⁻` instead of `IO₃⁻`) & `Fe³⁺ + I⁻` in base misclassified as "unsupported"
- **Location:** [reactions.js:42-43](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L42-L43), [processes.js:326](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L326), [manifest.js:117-120](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L117-L120)
- **Quoted text:**
  - `reactions.js:42`: `I₂ trong kiềm chuyển thành I⁻/IO⁻ (mất màu) — chưa được mô hình hóa.`
  - `reactions.js:43`: `Fe³⁺ + I⁻ trong môi trường kiềm: Fe(OH)₃ tạo trước, không sinh I₂ — mô hình không tính phản ứng oxi hóa – khử này.`
- **Why it is wrong:**
  1. `reactions.js:42`: Unlike `ClO⁻`, hypoiodite (`IO⁻`) is unstable even at **room temperature** and rapidly disproportionates (`3IO⁻ → 2I⁻ + IO₃⁻`), so iodine in cold or hot alkali yields **`I⁻` and `IO₃⁻`** (`3I₂ + 6OH⁻ → 5I⁻ + IO₃⁻ + 3H₂O` `[SNIPPET]`: Chemguide / Chemistry StackExchange).
  2. `reactions.js:43`: Putting `Fe³⁺ + I⁻` in base inside `ION_HINTS` causes [processes.js:326](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L326) to log **`"Chưa hỗ trợ mô phỏng phản ứng này: Fe³⁺ + I⁻ trong môi trường kiềm: Fe(OH)₃ tạo trước, không sinh I₂..."`** (`warn`) and lists it as `UNSUPPORTED` in [manifest.js:119](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L119). That contradicts itself: the engine **already produces the right outcome** (`Fe(OH)₃↓`, no `I₂`)! Also, `Fe(OH)₃` (`Ksp = 2,79·10⁻³⁹`) precipitates quantitatively by `pH ≈ 3`, not only above `minPH: 7.01`.
- **Corrected Vietnamese text:**
  - `reactions.js:42`: `I₂ trong môi trường kiềm tự oxi hóa – khử thành I⁻ và IO₃⁻ (qua chất trung gian IO⁻ kém bền: 3I₂ + 6OH⁻ → 5I⁻ + IO₃⁻ + 3H₂O, dung dịch mất màu) — chưa được mô hình hóa.`
  - `reactions.js:43` (emit as `info`, NOT prefixed `"Chưa hỗ trợ mô phỏng phản ứng này"`, and classify as `NO_REACTION` / explanatory info): `Trong môi trường kiềm (hoặc pH đủ cao), Fe³⁺ kết tủa thành Fe(OH)₃ nên không xảy ra phản ứng oxi hóa I⁻ tạo I₂.`

---

### P1-11. Contradictory litmus pH cutoffs & calling `pH 5,0–8,0` "môi trường gần trung tính"
- **Location:** [processes.js:952](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L952) vs [observations.js:27, 33](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L27-L33) and [materials.js:138](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L138)
- **Quoted text:**
  - `processes.js:952`: ``Nhúng giấy quỳ vào ${label(c)} (pH ≈ ${c.pH.toFixed(1)}): ${c.pH < 5 ? 'quỳ chuyển đỏ — môi trường axit' : c.pH > 8 ? 'quỳ chuyển xanh — môi trường bazơ' : 'quỳ không đổi màu — môi trường gần trung tính'}.``
  - `observations.js:27`: `` `${name} ${pH < 5 ? 'màu đỏ' : pH > 8.3 ? 'màu xanh' : 'màu tím'}` ``
  - `observations.js:33`: `return pH < 6.5 ? 'axit' : pH > 7.5 ? 'bazơ' : 'trung tính'`
- **Why it is wrong:**
  1. For `pH 5,0–6,4` — including bench reagents **`ZnSO₄ 0,5 M` (`pH ≈ 5,5`)** and **`FeSO₄ 0,2 M` (`pH ≈ 5,7`)** — `processes.js:952` logs *"quỳ không đổi màu — môi trường gần trung tính"*. A solution at `pH 5,0` has `[H⁺]` **100× higher** than neutral (`[H⁺]/[OH⁻] = 10⁴`) and is unequivocally **weakly acidic**, directly contradicting `observations.js:33` (`pH < 6,5` → `axit`).
  2. Between `pH 8,0` and `8,3`, `processes.js:952` says *"quỳ chuyển xanh — môi trường bazơ"*, while `observations.js:27` and `materials.js:138` (`xanh > 8,3`) say *"màu tím"*.
- **Corrected Vietnamese text (`processes.js:952`, align threshold to `8.3` and use `vn(c.pH, 1)`):**
  > ``Nhúng giấy quỳ vào ${label(c)} (pH ≈ ${vn(c.pH, 1)}): ${c.pH < 5 ? 'quỳ chuyển đỏ — môi trường axit' : c.pH > 8.3 ? 'quỳ chuyển xanh — môi trường bazơ' : 'quỳ chưa đổi màu rõ (trong khoảng chuyển màu 5,0–8,3; cần dùng máy đo pH hoặc chỉ thị vạn năng để xác định chính xác môi trường axit yếu/trung tính/bazơ yếu)'}.``

---

### P1-12. Guided Labs: logically invalid conclusion in Lab 1 & bypassable step completion checks in Labs 1, 2, 5
- **Location:** [guided.js:56-59, 64](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L56-L64), [guided.js:100-101](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L100-L101), [guided.js:196, 198-199](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L196-L199)
- **Quoted text:**
  - `guided.js:64`: `A là axit, B là bazơ, C là muối trung tính. Phản ứng trung hòa tạo nước và muối, tỏa nhiệt.`
  - `guided.js:101`: `help: '...; khuấy giúp tan nhanh.'`, `check: (s, r) => { const c = obj(s, r.beaker).contents; return s.notes[\`ppt-Cu(OH)2-${r.beaker}\`] != null && !((c.precipitates['Cu(OH)2'] || 0) > 1e-7) && (c.ions['Cl-'] || 0) > 1e-4 && (c.ions['Cu2+'] || 0) > 1e-3 }`
  - `guided.js:56-58, 196`: `check: (s, r) => papersIn(s, r.A).length > 0` (etc.)
  - `guided.js:100`: `check: (s, r) => obj(s, r.beaker).vis.stir > 0.3`
- **Why it is wrong:**
  1. **`guided.js:64` (logic & terminology):** Litmus + phenolphthalein cannot distinguish `NaCl(aq)` from distilled water (`H₂O`), so the experiment only proves `C là dung dịch trung tính` (not that C is a salt). Also in Vietnamese chemistry, *"muối trung hòa"* (normal salt, e.g., `Na₂CO₃`, which is basic in water!) is distinct from *"dung dịch muối có môi trường trung tính"* `[MEMORY]`.
  2. **`guided.js:101` (Lab 2 Step 4 check + engine contradiction):**
     - Dissolving `Cu(OH)₂` with **`NH₃ 2 M`** (forming alkaline deep-blue `[Cu(NH₃)₄]²⁺`) + 1 drop of `NaCl` satisfies every clause of `check` (because [chemistry.js:255](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L255) keeps total analytical Cu in `contents.ions['Cu2+']`, `Cl- > 1e-4`, and `Cu(OH)₂` is `0`) — passing the *"hòa tan bằng axit"* step in an **alkaline** solution! Should also require `obj(s, r.beaker).pH != null && obj(s, r.beaker).pH < 5`.
     - `help` claims *"khuấy giúp tan nhanh"*, but `Cu(OH)₂` redissolution happens **instantaneously** inside `addParcel → mix → equilibrate` ([processes.js:189](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L189)) with zero dependence on `vis.stir`.
  3. **`guided.js:56-58, 196` (`papersIn` check):** Only checks `wet > 0.4`, never that the expected pH/colour change occurred; and in Lab 1 Step 2 (`"Lấy giấy quỳ mới"`), reusing the **same** strip from Tube A into Tube B passes Step 2 while inside B (`o.inside === r.B` and `o.touched[0] === r.A` keeps Step 1 true too).
  4. **`guided.js:100` (Lab 2 Step 3):** Checks only `vis.stir > 0.3` (passes before particles lift off; decays with `τ = 1.6 s` in [processes.js:828](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L828) and breaks Step 2's settled ratio if `guidedProgress` is re-evaluated sequentially).
  5. **`guided.js:198-199` (Lab 5 Steps 3–4):** Pouring ethanol into Tube B (making oil **sink** instead of float) still passes Step 3; pouring oil into Tube C (creating **2 layers** instead of a homogeneous mixture) still passes Step 4.
- **Corrected Vietnamese text:**
  - `guided.js:64`: `A là dung dịch axit, B là dung dịch bazơ, C là dung dịch có môi trường trung tính (ở thí nghiệm này là dung dịch muối NaCl). Phản ứng trung hòa giữa axit và bazơ tạo muối và nước, tỏa nhiệt.`
  - `guided.js:101` (`help`): `Chọn chai HCl → Rót khoảng 5–10 mL vào Cốc A, hoặc nhỏ nhiều lần bằng ống nhỏ giọt đến khi kết tủa tan hết (trong thí nghiệm thật, khuấy giúp kết tủa tiếp xúc với axit và tan nhanh hơn).`

---

## P2 — Medium (Curriculum Nomenclature, Secondary Accuracy/Consistency, Edge Cases)

### P2-1. Systemic pre-2018 nomenclature across all 6 files despite citing GDPT 2018
- **Location:** All 6 reviewed files (e.g., [guided.js:32, 35, 71, 115, 144, 178](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L32-L178), [observations.js:10-17](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L10-L17), [manifest.js:30, 82-93](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L30-L93), [reactions.js:6, 12, 41, 82](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L6-L82), [processes.js:345, 517, 642](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L345-L642), [safety.js:20, 43, 100](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L20-L100)); cf. [materials.js:21](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L21)
- **Quoted text (representative examples):** `axit`, `bazơ`, `axit axetic`, `etanol`, `hiđro`, `hiđroxit`, `cacbonat`, `sunfat`, `clorua`, `clo`, `magie`, `natri`, `kali`, `canxi`, `bari`, `anot`, `catot`, `phenolphtalein`, `metyl da cam`.
- **Why it is wrong:** [materials.js:21](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L21) explicitly claims alignment with *SGK Hóa học THCS–THPT (Chương trình GDPT 2018)*, and Grades 10–12 nationwide now use GDPT 2018 (Thông tư 32/2018/TT-BGDĐT), which mandates IUPAC/English spelling for chemical terms and elements (`[SNIPPET]`: Thông tư 32/2018/TT-BGDĐT). Using pre-2018 Vietnamese transliterations conflicts with current Grade 10–12 exams and textbooks.
- **Corrected Vietnamese text (glossary mapping to apply consistently, optionally with legacy name in parentheses on first mention):**
  > `acid`, `base`, `acetic acid` (`ethanoic acid`), `ethanol`, `hydrogen`, `hydroxide`, `carbonate`, `sulfate`, `chloride`, `chlorine`, `magnesium`, `sodium`, `potassium`, `calcium`, `barium`, `copper`, `iron`, `zinc`, `silver`, `anode`, `cathode`, `phenolphthalein`, `methyl orange`.

---

### P2-2. `Cu²⁺/Fe³⁺ + I⁻` manifest omits `pH ≤ 7` condition, and its demos deplete all `I⁻` (zero `I₃⁻`, silent solid `I₂`)
- **Location:** [manifest.js:72, 78](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L72-L78), [reactions.js:52-53](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L52-L53)
- **Quoted text:**
  - `manifest.js:72`: `conditions: '25 °C, xảy ra ngay khi trộn'`
  - `reactions.js:52`: `xuất hiện kết tủa CuI màu trắng ngà, dung dịch chuyển vàng nâu do I₂ (I₃⁻).`
  - `reactions.js:53`: `dung dịch chuyển vàng nâu do I₂ (I₃⁻) sinh ra.`
- **Why it is wrong:**
  1. `ION_REDOX` enforces `maxPH: 7` ([chemistry.js:317](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L317)), so the reaction does **not** occur in alkaline medium — omitted from `manifest.js:72`.
  2. In both demos (`manifest.js:78`: `10 mL CuCl₂ 0,5 M` = `5 mmol` + `20 mL KI 0,1 M` = `2 mmol`; `10 mL FeCl₃ 0,2 M` = `2 mmol` + `20 mL KI 0,1 M` = `2 mmol`), **`I⁻` is completely consumed** (`0 mmol` left), so **no `I₃⁻` forms** and `~0,46 mmol` / `~0,96 mmol` of iodine silently precipitates as `I2s` ([chemistry.js:345](file:///D:/EduLab/ChemLab/src/dlab/engine/chemistry.js#L345)) without spawning particles or logging a precipitate note, while the observe string claims `do I₂ (I₃⁻)`.
- **Corrected Vietnamese text:**
  - `manifest.js:72`: `25 °C, môi trường axit hoặc trung tính (pH ≤ 7), xảy ra ngay khi trộn`
  - `reactions.js:52`: `xuất hiện kết tủa CuI màu trắng ngà, dung dịch chuyển vàng nâu do I₂ sinh ra (tạo I₃⁻ khi dư I⁻; nếu thiếu I⁻ có thể tách tinh thể I₂ màu tím đen).`
  - `reactions.js:53`: `dung dịch chuyển vàng nâu do I₂ sinh ra (tạo I₃⁻ khi dư I⁻).`

---

### P2-3. Unrealistic borosilicate thermal-shock threshold + mismatch with `safety.js`
- **Location:** [processes.js:181-184](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L181-L184) vs [safety.js:83](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L83)
- **Quoted text:**
  - `processes.js:182-183`: `const limit = def.heatResistant ? 60 : 30` / `Sốc nhiệt: ${def.name} đang ${c.T.toFixed(0)} °C gặp chất lỏng ${T.toFixed(0)} °C nên bị nứt.`
  - `safety.js:83`: `if (target.T - 25 > 60 && volumeOf(target) < 5 && EQUIPMENT[target.type].breakable) warn.push(...)`
- **Why it is wrong:**
  1. Standard borosilicate laboratory glassware (`heatResistant: true`, e.g., Pyrex Code 7740) has a thermal shock ΔT rating of **~150–160 °C** (`[SNIPPET]`: Corning / Sigma-Aldrich), so pouring boiling water (`100 °C`) into a `25 °C` beaker (`ΔT = 75 °C`) should **not** crack a lab beaker.
  2. `safety.js:83` only warns when `target.T > 85 °C` (`target.T - 25 > 60`), giving **zero** warning for non-heat-resistant vessels (`limit = 30 °C`) or for pouring hot liquid into a cold vessel (`|c.T - T| > limit`).
- **Corrected Vietnamese text (after raising borosilicate `limit` to ~120–150 °C and matching `safety.js:83` to `Math.abs(target.T - srcT) > limit`):**
  > `${label(target)} (${target.T.toFixed(0)} °C) gặp chất lỏng chênh lệch nhiệt độ lớn (${srcT.toFixed(0)} °C) khi gần khô: có nguy cơ sốc nhiệt làm nứt dụng cụ.`

---

### P2-4. `observations.js` conclusion attaches pH/indicator facts from the wrong vessel when a reaction ran in multiple vessels
- **Location:** [observations.js:69](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L69)
- **Quoted text:**
  > `const where = Object.keys(state.notes).filter(k => k.startsWith(\`rx-${m[1]}-\`)).map(k => byId(state, k.slice(\`rx-${m[1]}-\`.length))).find(Boolean)`
- **Why it is wrong:** If a student runs e.g. `zn-acid` in Vessel A (leaving it acidic) and later in Vessel B (reaching neutral or containing a different indicator), `.find(Boolean)` always picks the **first** vessel ever recorded in `state.notes`, displaying Vessel A's pH/indicator reading under Vessel B's completion conclusion.
- **Corrected approach (no text change needed):** Resolve the vessel from the solid object `byId(state, m[2])?.in` (or store the vessel id in the `done-` note key).

---

### P2-5. Trace sulfate (`> 10⁻⁷ mol`) in `HCl` falsely blocks `CaCO₃ + HCl` as `CaCO₃ + H₂SO₄`
- **Location:** [reactions.js:92](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L92), [processes.js:489-496](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L489-L496)
- **Quoted text:**
  > `{ all: ['SO4', 'caco3'], maxPH: 3, reason: 'CaCO₃ + H₂SO₄: lớp CaSO₄ ít tan bao phủ đá vôi làm phản ứng chậm dần rồi dừng — chưa được mô hình hóa.' }`
- **Why it is wrong:** `processes.js:489` sets `present` for any ion `> 1e-7 mol`. Adding even 1 drop of `0,2 M Na₂SO₄` (`1e-5 mol`) into `40 mL HCl` (`[SO₄²⁻] = 2,5e-4 M`, far below `CaSO₄` saturation `~0,015 M` `[MEMORY]`) halts `CaCO₃ + HCl` completely and falsely claims `CaSO₄` passivated the marble.
- **Corrected Vietnamese text (add minimum `[SO4] > 0.015 M` guard on the rule):**
  > `CaCO₃ + H₂SO₄ (hoặc axit có nồng độ SO₄²⁻ đủ cao): lớp CaSO₄ ít tan bao phủ bề mặt đá vôi làm phản ứng chậm dần rồi dừng — chưa được mô hình hóa.`

---

### P2-6. `HNO₃` reduction products narrowed to `NOx`; net ionic equations wrong for weak acid `CH₃COOH`
- **Location:** [processes.js:517](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L517), [reactions.js:6-8, 13](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L6-L13)
- **Quoted text:**
  - `processes.js:517`: `Kim loại với HNO₃ không giải phóng H₂ mà tạo NOx — phản ứng này chưa được mô hình hóa.`
  - `reactions.js:6-8, 13`: `Mg + 2H⁺ → Mg²⁺ + H₂↑`, `Zn + 2H⁺ → Zn²⁺ + H₂↑`, `Fe + 2H⁺ → Fe²⁺ + H₂↑`, `CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O`
- **Why it is wrong:**
  1. Active metals like `Mg` and `Zn` reacting with dilute `HNO₃` commonly produce `N₂O`, `N₂`, and `NH₄NO₃` in addition to `NO`/`NO₂` (`[MEMORY]`: SGK Hóa học 11) — not only `NOx` (and `NOx` lacks subscript `NOₓ`).
  2. When the acid in the vessel is weak `CH₃COOH`, displaying `Mg + 2H⁺ → Mg²⁺ + H₂↑` or `CaCO₃ + 2H⁺ → Ca²⁺ + CO₂↑ + H₂O` violates Grade 11 net ionic equation rules (`CH₃COOH` is a weak electrolyte and must not be written as `H⁺` `[MEMORY]`).
- **Corrected Vietnamese text:**
  - `processes.js:517`: `Kim loại tác dụng với HNO₃ (hoặc H⁺ + NO₃⁻) không giải phóng H₂ mà tạo sản phẩm khử của N⁺⁵ (NO, NO₂, N₂O, N₂ hoặc NH₄NO₃ tùy kim loại và nồng độ) — chưa được mô hình hóa.`
  - For weak-acid `CH₃COOH` reactions, display the molecular-acid ionic form: `Mg + 2CH₃COOH → Mg²⁺ + 2CH₃COO⁻ + H₂↑`, `CaCO₃ + 2CH₃COOH → Ca²⁺ + 2CH₃COO⁻ + CO₂↑ + H₂O`.

---

### P2-7. Incomplete/inconsistent `conditions` in `manifest.js` & unformatted internal keys
- **Location:** [manifest.js:30, 87, 114, 119](file:///D:/EduLab/ChemLab/src/dlab/data/manifest.js#L30-L119)
- **Quoted text:**
  - `manifest.js:30`: `conditions: r.driver === 'h' ? 'Axit loãng, pH < 3, 25 °C (tốc độ tăng gấp đôi mỗi 10 °C)' : '25 °C, chất rắn nhúng trong dung dịch'`
  - `manifest.js:87`: `conditions: 'U > 1,42 V; chỉ khi không có ion điện phân trước'`
  - `manifest.js:114, 119`: `title: r.all.join(' + ')` → `'NO3- + cu'`, `'SO4 + caco3'`, `'Ag+'`, `'Zn2+'`, `'I2'`, `'zn'`
- **Why it is wrong:**
  1. Line 30: Doesn't exclude `HNO₃` (or `H₂SO₄` for `CaCO₃`); misses that `CH₃COOH` runs above `pH 3` ([processes.js:514](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L514)); omits the temperature-rate doubling for non-acid kinetic reactions even though [processes.js:487](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L487) applies it to all of them; and calls `na-water` *"chất rắn nhúng trong dung dịch"* (Na floats on pure water, not submerged in a solution).
  2. Line 87: Omits `[Cl⁻] ≥ 0,1 M` even though [processes.js:619](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L619) refuses electrolysis when `[Cl⁻] < 0,1 M`.
  3. Lines 114 & 119: Raw single-species titles like `'Ag+'`, `'I2'`, `'Zn2+'`, `'zn'` omit the reaction partner (`OH⁻`) and `Ag+` shows `conditions: '—'` because it uses `kspOH` rather than `minPH`.
- **Corrected Vietnamese text:**
  - `manifest.js:30` (acid): `Axit không có tính oxi hóa mạnh (HCl; với kim loại còn hỗ trợ H₂SO₄ loãng, CH₃COOH), pH < 3 (hoặc [CH₃COOH] > 0,01 M), tốc độ tăng gấp đôi mỗi 10 °C`
  - `manifest.js:30` (`na-water`): `25 °C, mẩu Na nổi trên mặt nước (≥ 50 mL nước, chậu/cốc rộng, không axit)`
  - `manifest.js:87`: `U > 1,42 V; [Cl⁻] ≥ 0,1 M; dung môi nước và không có ion điện phân trước`

---

### P2-8. Minor textbook precision, equipment-list, and safety-text gaps in `guided.js`
- **Location:** [guided.js:35, 114, 116, 146, 178, 201-202](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L35-L202)
- **Quoted text & issues:**
  1. `guided.js:35`: `Axit làm quỳ tím hóa đỏ, bazơ làm quỳ hóa xanh; ...` — Insoluble bases (`Cu(OH)₂`, `Fe(OH)₃`) do **not** turn litmus blue (`[MEMORY]`).
     - **Fix:** `Dung dịch axit làm quỳ tím hóa đỏ, dung dịch bazơ (bazơ tan) làm quỳ hóa xanh; phenolphtalein không màu trong axit và môi trường trung tính, chuyển hồng trong dung dịch bazơ (pH > 8,2).`
  2. `guided.js:114`: `equipment: ['2 cốc 100 mL', 'Chậu thủy tinh', 'Kẹp hóa chất', 'Ống nhỏ giọt']` — `setup(sim)` ([guided.js:117-126](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L117-L126)) places **no dropper** on the bench.
     - **Fix:** Remove `'Ống nhỏ giọt'` (or add one in `setup`).
  3. `guided.js:116`: `safety: 'Natri phản ứng mãnh liệt với nước: chỉ dùng mẩu nhỏ, dùng kẹp, đứng xa.'` — Omits eye protection (`đeo kính bảo hộ`) and not touching Na with bare hands (`không cầm bằng tay`).
     - **Fix:** `Natri phản ứng mãnh liệt với nước, sinh H₂ dễ cháy và NaOH ăn mòn: chỉ dùng mẩu nhỏ (≤ 0,2 g), gắp bằng kẹp khô (không cầm bằng tay), đeo kính bảo hộ và đứng xa.`
  4. `guided.js:146`: `chemicals: [..., 'Thanh Zn, dây Cu']` — Contradicts Step 4 ([guided.js:166](file:///D:/EduLab/ChemLab/src/dlab/guided.js#L166)), which tells the student to pick `'Kẽm (viên)'` (granule).
     - **Fix:** `['CuCl₂ 0,5 M', 'ZnSO₄ 0,5 M', 'CuSO₄ 0,5 M', 'Kẽm viên (hoặc thanh Zn), dây Cu']`
  5. `guided.js:178`: `tác dụng với muối cacbonat giải phóng CO₂.` — Step 2 uses `NaHCO₃` (*muối hiđrocacbonat*), and `Na₂CO₃` with insufficient acid forms `NaHCO₃` first before evolving `CO₂`.
     - **Fix:** `tác dụng với muối cacbonat, hiđrocacbonat (khi đủ axit) giải phóng khí CO₂.`
  6. `guided.js:201-202`: Refers to `Ống 2` / `Ống 3` (steps label them `ống B` / `ống C`); states oil density as an exact universal `0,92 g/mL` (actually `~0,91–0,93 g/mL`, as [materials.js:99](file:///D:/EduLab/ChemLab/src/dlab/data/materials.js#L99) notes) and calls oil strictly `không phân cực` (triglycerides have polar ester groups and are *rất ít phân cực / kị nước*).
     - **Fix (`201`):** `Quỳ hóa đỏ. NaHCO₃ sủi bọt khí không màu. Ống B tách hai lớp: dầu vàng nổi trên nước. Ống C đồng nhất một lớp.`
     - **Fix (`202`):** `CH₃COOH + NaHCO₃ → CH₃COONa + CO₂↑ + H₂O. Dầu ăn rất ít phân cực (kị nước), không tan trong nước và có khối lượng riêng khoảng 0,92 g/mL < 1 g/mL. Etanol tạo liên kết hiđro với nước nên tan vô hạn.`

---

### P2-9. Additional edge-case engine/safety mismatches (`processes.js`, `safety.js`)
- **Locations & issues:**
  1. **Live-electrode Cl₂ warning bypass ([safety.js:50-55, 72-73](file:///D:/EduLab/ChemLab/src/dlab/engine/safety.js#L50-L73)):** Turning on power *before* dipping electrodes into `CuCl₂` bypasses the `Cl₂` warning completely, because `case 'move'` returns immediately for non-containers (`electrodes`).
  2. **Daniell cell ignores ammine complexation ([processes.js:658-659, 669](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L658-L669)):** Computes `cCu` from total analytical `Cu²⁺` instead of `freeConc('Cu2+', ...)`, so adding `NH₃ 2 M` to the `CuSO₄` half-cell still reports `E ≈ 1,10 V` instead of dropping ~0,3–0,4 V as `[Cu(NH₃)₄]²⁺` lowers free `[Cu²⁺]` (`[MEMORY]`).
  3. **`Na` in 50% water + 50% ethanol sinks, yet text says it floats ([reactions.js:12](file:///D:/EduLab/ChemLab/src/dlab/data/reactions.js#L12), [observations.js:10](file:///D:/EduLab/ChemLab/src/dlab/ui/observations.js#L10) vs [processes.js:407](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L407)):** In `50 mL water + 50 mL ethanol` (`ρ ≈ 0,91 < ρ(Na) = 0,968`), Na sinks to the bottom while the engine logs *"Mẩu natri nổi, chạy trên mặt nước"* (resolved automatically once P0-1 blocks Na in ethanol mixtures).
  4. **Formatting inconsistencies in emitted Vietnamese strings:** Raw ASCII formulas without subscripts in [processes.js:196, 454, 477, 770](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L196) (`Cu(OH)2`, `KNO3`, etc., whereas line 790 uses `subFormula(...)`), and English decimal dots (`.toFixed(1)`) in [processes.js:752, 753, 952](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L752-L952) instead of the file's own `vn(x, 1)` Vietnamese comma helper ([processes.js:9](file:///D:/EduLab/ChemLab/src/dlab/engine/processes.js#L9)).
