
function reducedMotion() {
  return (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    document.documentElement.dataset.reduceMotion === 'true'
  )
}

function hexToRgb(color) {
  const value = String(color || '#ffffff').replace('#', '')
  const full = value.length === 3 ? value.split('').map(c => c + c).join('') : value.padEnd(6, 'f')
  return [0, 2, 4].map(i => parseInt(full.slice(i, i + 2), 16) || 255)
}

export function createBeakerEffects(host) {
  const canvas = document.createElement('canvas')
  canvas.className = 'beaker-effects'
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  const context = canvas.getContext('2d')

  let width = 0
  let height = 0
  let ratio = 1
  let level = 0
  let bubbles = []
  let rings = []
  let particles = []
  let sediment = null
  let frame = null
  let last = 0

  function resize() {
    ratio = Math.min(window.devicePixelRatio || 1, 2)
    width = host.clientWidth
    height = host.clientHeight
    canvas.width = Math.max(1, Math.round(width * ratio))
    canvas.height = Math.max(1, Math.round(height * ratio))
    draw()
  }

  const observer = new ResizeObserver(resize)
  observer.observe(host)

  function surfaceY() {
    return height * (1 - level)
  }

  function active() {
    return bubbles.length > 0 || rings.length > 0 || particles.some(p => !p.settled || p.fading) ||
      Boolean(sediment && (sediment.fading || Math.abs(sediment.depth - sediment.depthTarget) > 0.2))
  }

  function schedule() {
    if (frame === null && !document.hidden && active()) {
      last = performance.now()
      frame = requestAnimationFrame(step)
    }
  }

  function step(time) {
    frame = null
    const dt = Math.min(0.05, (time - last) / 1000)
    last = time
    const top = surfaceY()

    bubbles = bubbles.filter(bubble => {
      bubble.age += dt
      if (bubble.age < 0) return true
      bubble.vy = Math.min(bubble.vy + 60 * dt, bubble.vmax)
      bubble.y -= bubble.vy * dt
      bubble.x = bubble.x0 + Math.sin(bubble.age * bubble.freq + bubble.phase) * bubble.amp
      bubble.r = Math.min(bubble.rMax, bubble.r + 0.6 * dt)
      if (bubble.y - bubble.r > top + 1) return true
      rings.push({ x: bubble.x, r: bubble.r, age: 0 })
      return false
    })
    rings = rings.filter(ring => (ring.age += dt) < 0.35)

    if (sediment) {
      sediment.depth += (sediment.depthTarget - sediment.depth) * Math.min(1, dt * 4)
      if (sediment.fading) {
        sediment.fade = Math.max(0, sediment.fade - dt / 0.9)
        if (sediment.fade <= 0) {
          sediment = null
          particles = []
          delete host.dataset.precipitateAmount
        }
      }
    }
    particles = particles.filter(particle => !particle.fading || (particle.alpha -= dt * 1.4) > 0)

    for (const particle of particles) {
      if (particle.settled || particle.fading) continue
      if (particle.delay > 0) {
        particle.delay -= dt
        continue
      }
      particle.y += particle.vy * dt
      particle.x += Math.sin(particle.y * 0.05 + particle.phase) * 4 * dt
      const floor = height - (sediment ? sediment.depth : 0) - particle.r
      if (particle.y >= floor) {
        particle.y = floor
        particle.settled = true
        if (sediment) sediment.settled += 1
      }
    }

    draw()
    if (active()) schedule()
  }

  function draw() {
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, width, height)
    if (level <= 0) return
    const top = surfaceY()

    if (sediment) {
      const [r, g, b] = sediment.rgb
      const fade = sediment.fade
      const falling = particles.filter(p => !p.settled && !p.fading && p.delay <= 0).length
      const turbidity = sediment.total ? (falling / sediment.total) * 0.38 * fade : 0
      if (turbidity > 0.01) {
        context.fillStyle = `rgba(${r},${g},${b},${turbidity})`
        context.fillRect(0, top, width, height - top)
      }

      const fraction = sediment.total ? sediment.settled / sediment.total : 1
      const depth = sediment.depth * fraction * fade
      if (depth > 0.5) {
        const gradient = context.createLinearGradient(0, height - depth, 0, height)
        gradient.addColorStop(0, `rgba(${r},${g},${b},${0.75 * fade})`)
        gradient.addColorStop(1, `rgba(${r},${g},${b},${0.95 * fade})`)
        context.fillStyle = gradient
        context.beginPath()
        context.moveTo(0, height)
        context.lineTo(0, height - depth * 0.7)
        context.quadraticCurveTo(width / 2, height - depth * 1.35, width, height - depth * 0.7)
        context.lineTo(width, height)
        context.closePath()
        context.fill()
        context.strokeStyle = `rgba(${Math.round(r * 0.5)},${Math.round(g * 0.5)},${Math.round(b * 0.5)},${0.7 * fade})`
        context.lineWidth = 1
        context.stroke()

        context.save()
        context.clip()
        for (const grain of sediment.grains) {
          const shade = grain.shade
          context.fillStyle = `rgba(${Math.round(r * shade)},${Math.round(g * shade)},${Math.round(b * shade)},${0.55 * fade})`
          context.beginPath()
          context.arc(grain.x * width, height - depth * grain.y, grain.r, 0, Math.PI * 2)
          context.fill()
        }
        context.restore()
      }

      context.lineWidth = 0.8
      for (const particle of particles) {
        if (particle.delay > 0 || (particle.settled && !particle.fading)) continue
        const alpha = Math.max(0, particle.alpha) * fade
        context.strokeStyle = `rgba(${Math.round(r * 0.45)},${Math.round(g * 0.45)},${Math.round(b * 0.45)},${0.65 * alpha})`
        context.fillStyle = `rgba(${r},${g},${b},${alpha})`
        context.beginPath()
        context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2)
        context.fill()
        context.stroke()
      }
    }

    for (const ring of rings) {
      const progress = ring.age / 0.35
      context.beginPath()
      context.ellipse(ring.x, top + 1, ring.r + progress * 6, 1 + progress * 1.5, 0, 0, Math.PI * 2)
      context.lineWidth = 1
      context.strokeStyle = `rgba(255,255,255,${0.55 * (1 - progress)})`
      context.stroke()
    }

    for (const bubble of bubbles) {
      if (bubble.age < 0) continue
      context.beginPath()
      context.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2)
      context.fillStyle = 'rgba(255,255,255,0.14)'
      context.fill()
      context.lineWidth = 1
      context.strokeStyle = 'rgba(255,255,255,0.7)'
      context.stroke()
      context.beginPath()
      context.arc(bubble.x - bubble.r * 0.35, bubble.y - bubble.r * 0.35, bubble.r * 0.28, 0, Math.PI * 2)
      context.fillStyle = 'rgba(255,255,255,0.75)'
      context.fill()
    }
  }

  function onVisibility() {
    if (!document.hidden) schedule()
  }
  document.addEventListener('visibilitychange', onVisibility)

  function particleCount(amount) {
    const base = window.matchMedia('(max-width: 767px)').matches ? 90 : 160
    return Math.max(12, Math.round(base * amount))
  }

  function newParticle(top, still) {
    return {
      x: width * (0.06 + Math.random() * 0.88),
      y: top + Math.random() * (height - top) * 0.85,
      r: 1.6 + Math.random() * 2.2,
      vy: 14 + Math.random() * 26,
      phase: Math.random() * 10,
      alpha: 0.7 + Math.random() * 0.3,
      delay: Math.random() * 0.6,
      settled: still
    }
  }

  function setAmount(amount) {
    const value = Math.max(0.1, Math.min(2, Number(amount) || 1))
    if (Math.abs(value - sediment.amount) < 0.01) return
    const still = reducedMotion()
    const total = particleCount(value)
    const kept = particles.filter(particle => !particle.fading)
    if (total > kept.length) {
      const top = surfaceY()
      for (let i = kept.length; i < total; i += 1) particles.push(newParticle(top, still))
    }
    else if (still) {
      particles = kept.slice(0, total)
    }
    else {
      kept.slice(total).forEach(particle => { particle.fading = true })
    }
    sediment.amount = value
    sediment.total = total
    sediment.settled = particles.filter(particle => particle.settled && !particle.fading).length
    sediment.depthTarget = Math.max(4, Math.min(34, (8 + level * 14) * value))
    if (still || !sediment.depth) sediment.depth = sediment.depthTarget
    host.dataset.precipitateAmount = value.toFixed(2)
    draw()
    schedule()
  }

  function makeGrains() {
    return Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.1,
      shade: 0.8 + Math.random() * 0.1
    }))
  }

  return {
    setLevel(fraction) {
      level = Math.max(0, Math.min(1, Number(fraction) || 0))
      draw()
    },

    bubbles(count = 12) {
      if (level <= 0) return
      host.dataset.gasBursts = String(Number(host.dataset.gasBursts || 0) + 1)
      const limit = window.matchMedia('(max-width: 767px)').matches ? 40 : 80
      const add = Math.min(Math.max(0, Math.round(count)), limit - bubbles.length)
      const still = reducedMotion()
      for (let i = 0; i < add; i += 1) {
        const x0 = width * (0.12 + Math.random() * 0.76)
        bubbles.push({
          x0,
          x: x0,
          y: height - 4 - Math.random() * 8,
          r: 1.2 + Math.random() * 1.5,
          rMax: 2.5 + Math.random() * 3,
          vy: 10,
          vmax: still ? 0 : 55 + Math.random() * 45,
          amp: 1.5 + Math.random() * 3,
          freq: 4 + Math.random() * 4,
          phase: Math.random() * Math.PI * 2,
          age: still ? 0 : -i * 0.06
        })
      }
      if (still) {
        draw()
        setTimeout(() => {
          bubbles = []
          draw()
        }, 1200)
        return
      }
      schedule()
    },

    clearBubbles() {
      bubbles = []
      rings = []
      draw()
    },

    precipitate(color, amount = 1) {
      sediment = { rgb: hexToRgb(color), total: 0, settled: 0, depth: 0, depthTarget: 0, amount: 0, fade: 1, fading: false, grains: makeGrains() }
      particles = []
      setAmount(amount)
    },

    setPrecipitateAmount(amount) {
      if (sediment && !sediment.fading) setAmount(amount)
    },

    dissolvePrecipitate() {
      if (!sediment) return
      if (reducedMotion()) {
        particles = []
        sediment = null
        delete host.dataset.precipitateAmount
        draw()
        return
      }
      sediment.fading = true
      host.dataset.precipitateAmount = '0.00'
      schedule()
    },

    clearPrecipitate() {
      particles = []
      sediment = null
      delete host.dataset.precipitateAmount
      draw()
    },

    dispose() {
      if (frame !== null) cancelAnimationFrame(frame)
      observer.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.remove()
    }
  }
}
