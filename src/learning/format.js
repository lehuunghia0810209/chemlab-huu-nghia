export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char])
}

// Lesson and question text is plain text with **bold** as the only markup.
export function rich(text) {
  return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
