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

export const FIGURES = {
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
