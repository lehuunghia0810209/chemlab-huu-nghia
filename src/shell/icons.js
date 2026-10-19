
const PATHS = {
  home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>',
  table: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M8 4v16M14 9v11"/>',
  tools: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3.6 17.4a1.4 1.4 0 0 0 2 2l5.7-5.7a4 4 0 0 0 5.4-5.4l-2.5 2.5-2-2Z"/><path d="m15 15 4.5 4.5"/>',
  learn: '<path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H10a2 2 0 0 1 2 2v14a1.5 1.5 0 0 0-1.5-1.5H4Z"/><path d="M20 5.5A1.5 1.5 0 0 0 18.5 4H14a2 2 0 0 0-2 2v14a1.5 1.5 0 0 1 1.5-1.5H20Z"/>',
  lab: '<path d="M9 3h6"/><path d="M10 3v6.2L4.6 18.3A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.7L14 9.2V3"/><path d="M7.4 15h9.2"/>',
  ai: '<path d="M12 3.5 13.7 8l4.5 1.7-4.5 1.7L12 16l-1.7-4.6-4.5-1.7L10.3 8Z"/><path d="M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8Z"/><path d="M5 16.5l.6 1.4 1.4.6-1.4.6L5 20.5l-.6-1.4L3 18.5l1.4-.6Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/>',
  atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9.5" ry="3.8" transform="rotate(120 12 12)"/>',
  ion: '<circle cx="9" cy="12" r="5.5"/><path d="M6.8 12h4.4M9 9.8v4.4"/><circle cx="17.5" cy="12" r="3.5"/><path d="M16 12h3"/>',
  scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="m5 7-3 6a3 3 0 0 0 6 0Z"/><path d="m19 7-3 6a3 3 0 0 0 6 0Z"/>',
  calculator: '<rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M8.5 7h7"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01M8.5 14.5h.01M12 14.5h.01M15.5 14.5h.01M8.5 18h.01M12 18h.01M15.5 18h.01"/>',
  droplets: '<path d="M12 3s-6 6.3-6 11a6 6 0 0 0 12 0c0-4.7-6-11-6-11Z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
  compound: '<path d="M12 2.8 19.8 7.3v9L12 20.8 4.2 16.3v-9Z"/><path d="M12 7.5 15.9 9.8v4.4L12 16.5 8.1 14.2V9.8Z"/>',
  reaction: '<path d="M3 8h14l-3-3"/><path d="M21 16H7l3 3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z"/>',
  settings: '<path d="M10.3 3.3a1.7 1.7 0 0 1 3.4 0l.2 1.1a1.7 1.7 0 0 0 2.4 1.1l1-.6a1.7 1.7 0 0 1 2.4 2.4l-.6 1a1.7 1.7 0 0 0 1.1 2.4l1.1.2a1.7 1.7 0 0 1 0 3.4l-1.1.2a1.7 1.7 0 0 0-1.1 2.4l.6 1a1.7 1.7 0 0 1-2.4 2.4l-1-.6a1.7 1.7 0 0 0-2.4 1.1l-.2 1.1a1.7 1.7 0 0 1-3.4 0l-.2-1.1a1.7 1.7 0 0 0-2.4-1.1l-1 .6a1.7 1.7 0 0 1-2.4-2.4l.6-1a1.7 1.7 0 0 0-1.1-2.4l-1.1-.2a1.7 1.7 0 0 1 0-3.4l1.1-.2a1.7 1.7 0 0 0 1.1-2.4l-.6-1a1.7 1.7 0 0 1 2.4-2.4l1 .6a1.7 1.7 0 0 0 2.4-1.1Z"/><circle cx="12" cy="12" r="3"/>',
  sidebar: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M9 4v16"/>',
  chevronRight: '<path d="m9 6 6 6-6 6"/>',
  arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
  bolt: '<path d="m13 2.5-8 11.5h6.5L10.5 21.5l8-11.5H12Z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  play: '<path d="M7 4.5v15l12.5-7.5Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6.3 6.3l2.4 2.4M15.3 15.3l2.4 2.4M6.3 17.7l2.4-2.4M15.3 8.7l2.4-2.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>'
}

export function icon(name, className = 'ui-icon') {
  return `<svg class="${className}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${PATHS[name] || PATHS.lab}</svg>`
}

/* Official ChemLab symbol (flask + atomic orbits), see public/brand. */
export function brandMark() {
  return '<img class="app-brand__svg" src="/brand/chemlab-mark.webp" width="32" height="32" alt="" decoding="async">'
}
