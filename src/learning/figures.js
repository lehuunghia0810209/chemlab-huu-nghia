// Schematic lesson illustrations drawn as inline SVG so they follow the theme.
// Each states what it simplifies in its caption.

const atom = `
<svg viewBox="0 0 360 240" role="img" aria-labelledby="fig-atom-t">
  <title id="fig-atom-t">Mô hình nguyên tử lithium: hạt nhân gồm 3 proton và 4 neutron ở tâm, 3 electron ở lớp vỏ trên hai lớp</title>
  <circle class="lx-fig-line" cx="140" cy="120" r="52"/>
  <circle class="lx-fig-line" cx="140" cy="120" r="96"/>
  <g>
    <circle class="lx-fig-n" cx="133" cy="113" r="7"/>
    <circle class="lx-fig-p" cx="147" cy="113" r="7"/>
    <circle class="lx-fig-n" cx="126" cy="125" r="7"/>
    <circle class="lx-fig-p" cx="140" cy="126" r="7"/>
    <circle class="lx-fig-n" cx="154" cy="125" r="7"/>
    <circle class="lx-fig-p" cx="133" cy="136" r="7"/>
    <circle class="lx-fig-n" cx="147" cy="136" r="7"/>
  </g>
  <circle class="lx-fig-e" cx="88" cy="120" r="5"/>
  <circle class="lx-fig-e" cx="192" cy="120" r="5"/>
  <circle class="lx-fig-e" cx="140" cy="24" r="5"/>
  <path class="lx-fig-line" d="M162 104 L250 64"/>
  <path class="lx-fig-line" d="M144 24 L250 30"/>
  <text class="lx-fig-text" x="256" y="60">Hạt nhân</text>
  <text class="lx-fig-muted" x="256" y="78">proton + neutron</text>
  <text class="lx-fig-text" x="256" y="34">Electron</text>
  <circle class="lx-fig-p" cx="262" cy="160" r="6"/><text class="lx-fig-muted" x="274" y="164">proton (+)</text>
  <circle class="lx-fig-n" cx="262" cy="184" r="6"/><text class="lx-fig-muted" x="274" y="188">neutron (0)</text>
  <circle class="lx-fig-e" cx="262" cy="208" r="5"/><text class="lx-fig-muted" x="274" y="212">electron (−)</text>
</svg>`

const equilibriumRates = `
<svg viewBox="0 0 360 220" role="img" aria-labelledby="fig-eq-t">
  <title id="fig-eq-t">Đồ thị tốc độ theo thời gian: tốc độ phản ứng thuận giảm dần, tốc độ phản ứng nghịch tăng dần từ 0, hai đường gặp nhau rồi đi ngang khi hệ đạt cân bằng</title>
  <path class="lx-fig-axis" d="M40 20 V180 H340"/>
  <text class="lx-fig-muted" x="12" y="16">Tốc độ</text>
  <text class="lx-fig-muted" x="282" y="204">Thời gian</text>
  <path class="lx-fig-forward" d="M40 36 C90 96 130 112 190 116 H330"/>
  <path class="lx-fig-reverse" d="M40 180 C90 140 130 122 190 118 H330"/>
  <path class="lx-fig-guide" d="M190 30 V180"/>
  <text class="lx-fig-text" x="100" y="76">v thuận</text>
  <text class="lx-fig-text" x="110" y="162">v nghịch</text>
  <text class="lx-fig-muted" x="198" y="40">bắt đầu cân bằng</text>
  <text class="lx-fig-text" x="210" y="104">v thuận = v nghịch</text>
</svg>`

const galvanicCell = `
<svg viewBox="0 0 400 260" role="img" aria-labelledby="fig-cell-t">
  <title id="fig-cell-t">Pin Zn–Cu: thanh kẽm nhúng trong dung dịch ZnSO4 là anode cực âm, thanh đồng nhúng trong dung dịch CuSO4 là cathode cực dương, hai dung dịch nối bằng cầu muối, electron đi từ kẽm sang đồng qua dây dẫn và vôn kế</title>
  <path class="lx-fig-wire" d="M90 92 V36 H178"/>
  <path class="lx-fig-wire" d="M222 36 H310 V92"/>
  <circle class="lx-fig-meter" cx="200" cy="36" r="22"/>
  <text class="lx-fig-text" x="200" y="41" text-anchor="middle">V</text>
  <path class="lx-fig-arrow" d="M118 22 H160 M152 16 L160 22 L152 28"/>
  <text class="lx-fig-muted" x="122" y="14">e⁻</text>
  <path class="lx-fig-glass" d="M40 120 V236 H150 V120"/>
  <path class="lx-fig-glass" d="M250 120 V236 H360 V120"/>
  <rect class="lx-fig-zn-sol" x="41" y="146" width="108" height="89"/>
  <rect class="lx-fig-cu-sol" x="251" y="146" width="108" height="89"/>
  <rect class="lx-fig-zn" x="82" y="92" width="16" height="122"/>
  <rect class="lx-fig-cu" x="302" y="92" width="16" height="122"/>
  <path class="lx-fig-bridge" d="M128 210 V108 H272 V210"/>
  <text class="lx-fig-muted" x="200" y="100" text-anchor="middle">cầu muối</text>
  <text class="lx-fig-text" x="8" y="62">Anode (−)</text>
  <text class="lx-fig-text" x="8" y="80">Zn</text>
  <text class="lx-fig-text" x="396" y="62" text-anchor="end">Cathode (+)</text>
  <text class="lx-fig-text" x="396" y="80" text-anchor="end">Cu</text>
  <text class="lx-fig-muted" x="58" y="252">ZnSO₄</text>
  <text class="lx-fig-muted" x="306" y="252">CuSO₄</text>
</svg>`

// Cross-section of the rock-salt lattice: ions alternate in every direction.
const naclCells = []
for (let row = 0; row < 4; row += 1) {
  for (let column = 0; column < 5; column += 1) {
    const x = 40 + column * 52
    const y = 36 + row * 52
    naclCells.push((row + column) % 2
      ? `<circle class="lx-fig-na" cx="${x}" cy="${y}" r="11"/>`
      : `<circle class="lx-fig-cl" cx="${x}" cy="${y}" r="21"/>`)
  }
}
const naclLattice = `
<svg viewBox="0 0 400 220" role="img" aria-labelledby="fig-nacl-t">
  <title id="fig-nacl-t">Mặt cắt tinh thể sodium chloride: các ion Na⁺ nhỏ và Cl⁻ lớn xếp xen kẽ nhau theo hàng ngang và hàng dọc</title>
  <path class="lx-fig-line" d="M40 36 H248 M40 88 H248 M40 140 H248 M40 192 H248 M40 36 V192 M92 36 V192 M144 36 V192 M196 36 V192 M248 36 V192"/>
  ${naclCells.join('')}
  <circle class="lx-fig-cl" cx="296" cy="70" r="14"/><text class="lx-fig-muted" x="318" y="75">Cl⁻ (lớn)</text>
  <circle class="lx-fig-na" cx="296" cy="112" r="8"/><text class="lx-fig-muted" x="318" y="117">Na⁺ (nhỏ)</text>
  <text class="lx-fig-text" x="282" y="160">Mỗi ion được bao</text>
  <text class="lx-fig-text" x="282" y="178">quanh bởi 6 ion</text>
  <text class="lx-fig-text" x="282" y="196">trái dấu (3 chiều)</text>
</svg>`

const lewis = `
<svg viewBox="0 0 430 140" role="img" aria-labelledby="fig-lewis-t">
  <title id="fig-lewis-t">Công thức Lewis: H₂O có O liên kết đơn với hai H và còn hai cặp electron riêng; NH₃ có N liên kết đơn với ba H và một cặp electron riêng; CO₂ có C liên kết đôi với mỗi O, mỗi O còn hai cặp electron riêng; N₂ có liên kết ba, mỗi N còn một cặp electron riêng</title>
  <g class="lx-fig-bond">
    <path d="M30 60 H44 M66 60 H80"/>
    <path d="M136 55 H149 M171 55 H184 M160 66 V81"/>
    <path d="M236 56 H259 M236 64 H259 M281 56 H304 M281 64 H304"/>
    <path d="M371 54 H389 M371 60 H389 M371 66 H389"/>
  </g>
  <g class="lx-fig-atom">
    <text x="20" y="66" text-anchor="middle">H</text><text x="55" y="66" text-anchor="middle">O</text><text x="90" y="66" text-anchor="middle">H</text>
    <text x="125" y="61" text-anchor="middle">H</text><text x="160" y="61" text-anchor="middle">N</text><text x="195" y="61" text-anchor="middle">H</text><text x="160" y="98" text-anchor="middle">H</text>
    <text x="225" y="66" text-anchor="middle">O</text><text x="270" y="66" text-anchor="middle">C</text><text x="315" y="66" text-anchor="middle">O</text>
    <text x="360" y="66" text-anchor="middle">N</text><text x="400" y="66" text-anchor="middle">N</text>
  </g>
  <g class="lx-fig-dot">
    <circle cx="51" cy="44" r="2.5"/><circle cx="59" cy="44" r="2.5"/><circle cx="51" cy="76" r="2.5"/><circle cx="59" cy="76" r="2.5"/>
    <circle cx="156" cy="39" r="2.5"/><circle cx="164" cy="39" r="2.5"/>
    <circle cx="221" cy="44" r="2.5"/><circle cx="229" cy="44" r="2.5"/><circle cx="221" cy="76" r="2.5"/><circle cx="229" cy="76" r="2.5"/>
    <circle cx="311" cy="44" r="2.5"/><circle cx="319" cy="44" r="2.5"/><circle cx="311" cy="76" r="2.5"/><circle cx="319" cy="76" r="2.5"/>
    <circle cx="346" cy="56" r="2.5"/><circle cx="346" cy="64" r="2.5"/><circle cx="414" cy="56" r="2.5"/><circle cx="414" cy="64" r="2.5"/>
  </g>
  <g class="lx-fig-muted">
    <text x="55" y="128" text-anchor="middle">H₂O</text><text x="160" y="128" text-anchor="middle">NH₃</text>
    <text x="270" y="128" text-anchor="middle">CO₂</text><text x="380" y="128" text-anchor="middle">N₂</text>
  </g>
</svg>`

export const FIGURES = {
  'lewis-structures': {
    svg: lewis,
    caption: 'Công thức Lewis: mỗi gạch nối là một cặp electron dùng chung, mỗi cặp chấm là một cặp electron hóa trị riêng (chưa liên kết). Mọi nguyên tử O, N, C đều có 8 electron xung quanh; H có 2.'
  },
  'nacl-lattice': {
    svg: naclLattice,
    caption: 'Mặt cắt một lớp của tinh thể NaCl. Trong không gian ba chiều, các ion xếp thành mạng lập phương; mỗi Na⁺ được bao quanh bởi 6 Cl⁻ và ngược lại. Kích thước tương đối giữa hai ion được vẽ gần đúng.'
  },
  'atom-structure': {
    svg: atom,
    caption: 'Mô hình minh họa nguyên tử lithium (3 proton, 4 neutron, 3 electron). Hình không theo tỉ lệ: thực tế hạt nhân nhỏ hơn nguyên tử khoảng 10 000 – 100 000 lần, và electron không chuyển động trên quỹ đạo tròn cố định.'
  },
  'equilibrium-rates': {
    svg: equilibriumRates,
    caption: 'Đồ thị định tính cho một phản ứng thuận nghịch bắt đầu chỉ với chất phản ứng. Hình dạng đường cong thực tế phụ thuộc vào từng phản ứng.'
  },
  'galvanic-cell': {
    svg: galvanicCell,
    caption: 'Sơ đồ pin Zn–Cu (pin Daniell). Ở điều kiện chuẩn, sức điện động của pin là 1,10 V.'
  }
}
