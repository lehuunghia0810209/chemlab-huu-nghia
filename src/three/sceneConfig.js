
export const QUALITY = Object.freeze({
  low: { label: 'Thấp', pixelRatio: 1, antialias: false, detail: 0.5 },
  balanced: { label: 'Cân bằng', pixelRatio: 1.5, antialias: true, detail: 1 },
  high: { label: 'Cao', pixelRatio: 2, antialias: true, detail: 1.6 }
})

export function prefersReducedMotion() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.reduceMotion === 'true'
  )
}
