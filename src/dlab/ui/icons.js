// Small line icons for the library and action bar (24×24, currentColor). Decorative: aria-hidden.
const P = {
  beaker: '<path d="M6 4h12M7 4v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4"/><path d="M7 13h10" opacity=".55"/>',
  testTube: '<path d="M9 3h6M10 3v15a2 2 0 0 0 4 0V3"/><path d="M10 13h4" opacity=".55"/>',
  flask: '<path d="M9 3h6M10 3v6l-5 9a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 18l-5-9V3"/><path d="M7.5 15h9" opacity=".55"/>',
  cylinder: '<path d="M8 3h8M9 3v16M15 3v16M7 20h10M9 8h2M9 12h2M9 16h2"/>',
  dish: '<path d="M3 11h18l-2 6a2 2 0 0 1-2 1H7a2 2 0 0 1-2-1z"/>',
  bowl: '<path d="M3 11h18a9 7 0 0 1-18 0z"/><path d="M9 20h6"/>',
  rack: '<path d="M3 9h18M4 9v11M20 9v11M3 15h18"/><path d="M7 4v8M11 4v8M15 4v8" opacity=".6"/>',
  dropper: '<path d="M10 3h4v5h-4zM11 8v11l1 2 1-2V8"/>',
  pipette: '<path d="M12 2v6M10 8h4v4h-4zM12 12v10"/>',
  rod: '<path d="M7 21L17 3"/>',
  spatula: '<path d="M12 3v12"/><ellipse cx="12" cy="18" rx="3" ry="3.5"/>',
  tongs: '<path d="M8 3l3 15M16 3l-3 15M8 3h8"/>',
  litmusPaper: '<rect x="9" y="3" width="6" height="18" rx="1"/><path d="M9 15h6" opacity=".55"/>',
  thermometer: '<path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0z"/><path d="M12 9v8"/>',
  phMeter: '<rect x="7" y="3" width="10" height="8" rx="1.5"/><path d="M12 11v10M10 6h4"/>',
  burner: '<rect x="3" y="14" width="18" height="6" rx="1.5"/><path d="M8 11c0-2 2-2 2-4M13 11c0-2 2-2 2-4"/>',
  power: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M8 12h3M9.5 10.5v3M14 12h3"/>',
  electrodes: '<path d="M8 3v14M16 3v14"/><path d="M6 3h4M14 3h4"/>',
  bridge: '<path d="M5 20V9a7 6 0 0 1 14 0v11"/>',
  voltmeter: '<circle cx="12" cy="12" r="8"/><path d="M12 12l4-4M9 16h6"/>',
  gasTank: '<rect x="8" y="6" width="8" height="15" rx="3"/><path d="M12 6V3h4"/>',
  bottle: '<path d="M10 3h4v3l2 2v12a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V8l2-2z"/><path d="M8 12h8v5H8" opacity=".55"/>',
  liquid: '<path d="M12 3c3 5 6 8 6 11a6 6 0 0 1-12 0c0-3 3-6 6-11z"/>',
  indicator: '<path d="M12 3c3 5 6 8 6 11a6 6 0 0 1-12 0c0-3 3-6 6-11z"/><path d="M9 14a3 3 0 0 0 3 3" opacity=".6"/>',
  metal: '<path d="M6 15l3-7 7-2 3 6-4 6-7 1z"/>',
  powder: '<path d="M4 18c2-5 5-8 8-8s6 3 8 8z"/><path d="M9 6h.01M13 4h.01M15 7h.01"/>',
  gas: '<path d="M6 16a4 4 0 0 1 1-7.9A5 5 0 0 1 17 8a4 4 0 0 1 1 8z"/>',
  search: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 4.8 1c0 1.7-2.3 2-2.3 3.5M12 17h.01"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  pause: '<path d="M8 5v14M16 5v14"/>',
  undo: '<path d="M9 14L4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  reset: '<path d="M4 4v6h6"/><path d="M5 15a8 8 0 1 0 2-8.5L4 10"/>',
  fit: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
  home: '<path d="M4 11l8-7 8 7M6 10v10h12V10"/>',
  tag: '<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/>',
  forward: '<path d="M4 6l8 6-8 6zM12 6l8 6-8 6z"/>',
  panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>',
  library: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>'
}

const SOLID_ICON = { sphere: 'metal', cylinder: 'metal', ribbon: 'metal', powder: 'powder' }

export function icon(name, cls = 'dlab-ico') {
  return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${P[name] || P.beaker}</svg>`
}

export function iconFor(item) {
  if (item.type) return icon(item.type === 'beaker100' || item.type === 'beaker250' ? 'beaker' : item.type === 'evaporating' ? 'bowl' : item.type)
  const r = item.reagentDef
  if (!r) return icon('bottle')
  if (r.kind === 'solid') return icon(SOLID_ICON[r.shape] || 'metal')
  if (r.kind === 'indicator') return icon('indicator')
  if (r.kind === 'liquid') return icon('liquid')
  if (r.kind === 'gas') return icon('gas')
  return icon('bottle')
}
