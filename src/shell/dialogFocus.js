
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function holdDialogFocus(dialog, { initial } = {}) {
  const opener = document.activeElement
  const items = () => [...dialog.querySelectorAll(FOCUSABLE)].filter(item => item.getClientRects().length)

  const onKeydown = event => {
    if (event.key !== 'Tab') return
    const list = items()
    if (!list.length) return
    const first = list[0]
    const last = list[list.length - 1]
    if (!dialog.contains(document.activeElement)) {
      event.preventDefault()
      first.focus()
    }
    else if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    }
    else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  document.addEventListener('keydown', onKeydown)
  ;(initial && dialog.querySelector(initial) || items()[0])?.focus({ preventScroll: true })

  return () => {
    document.removeEventListener('keydown', onKeydown)
    if (opener?.isConnected && opener !== document.body) opener.focus({ preventScroll: true })
  }
}
