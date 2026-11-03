import { escapeHTML } from '../html.js'

export { escapeHTML }

// Lesson and question text is plain text with **bold** as the only markup.
export function rich(text) {
  return escapeHTML(text).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
}
