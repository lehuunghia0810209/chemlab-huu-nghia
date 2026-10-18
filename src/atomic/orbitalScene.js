/* =========================================================
   ORBITAL SCENE
   Renders one hydrogen-like orbital two ways:
   - probability cloud: points sampled from |ψ|²
   - boundary surface: |ψ| isosurface enclosing 90 % probability
   Colour encodes the sign (phase) of ψ, not charge.
========================================================= */

import { MarchingCubes } from 'three/examples/jsm/objects/MarchingCubes.js'
import { radialExtent, sampleDensity, sampleGrid } from '../chem/orbitalMath.js'

import { PHASE_COLORS, WORLD_RADIUS } from './orbitalConstants.js'

export { PHASE_COLORS, WORLD_RADIUS }

const POINTS_BY_QUALITY = { low: 9000, balanced: 22000, high: 42000 }
const GRID_BY_QUALITY = { low: 36, balanced: 48, high: 64 }
const POLYS_BY_QUALITY = { low: 40000, balanced: 80000, high: 160000 }

function cloudMaterial(THREE, pixelRatio) {
  return new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uSize: { value: 26 * pixelRatio },
      uOpacity: { value: 0.75 }
    },
    vertexShader: /* glsl */ `
      attribute vec3 color;
      varying vec3 vColor;
      uniform float uSize;
      void main() {
        vColor = color;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize / -mv.z;
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      uniform float uOpacity;
      void main() {
        vec2 p = gl_PointCoord - 0.5;
        float d = dot(p, p);
        if (d > 0.25) discard;
        float alpha = exp(-d * 14.0) * uOpacity;
        gl_FragColor = vec4(vColor, alpha);
      }
    `
  })
}

function surfaceMaterial(THREE, color) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.32,
    metalness: 0,
    clearcoat: 0.4,
    clearcoatRoughness: 0.4,
    transparent: true,
    opacity: 0.62,
    side: THREE.DoubleSide,
    depthWrite: true
  })
}

function axisLabel(THREE, text, color) {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const context = canvas.getContext('2d')
  context.fillStyle = color
  context.font = '600 40px "Be Vietnam Pro", system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText(text, 32, 34)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false, transparent: true }))
  sprite.scale.setScalar(0.5)
  return sprite
}

function createAxes(THREE) {
  const group = new THREE.Group()
  const length = WORLD_RADIUS * 1.25
  const axes = [
    ['x', new THREE.Vector3(1, 0, 0), '#f87171'],
    ['y', new THREE.Vector3(0, 1, 0), '#4ade80'],
    ['z', new THREE.Vector3(0, 0, 1), '#60a5fa']
  ]
  for (const [name, direction, color] of axes) {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      direction.clone().multiplyScalar(-length),
      direction.clone().multiplyScalar(length)
    ])
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.45 }))
    group.add(line)
    const label = axisLabel(THREE, name, color)
    label.position.copy(direction.clone().multiplyScalar(length + 0.35))
    group.add(label)
  }
  return group
}

/**
 * @param {ReturnType<import('../three/sceneHost.js').createSceneHost>} host
 */
export function createOrbitalScene(host) {
  const { THREE, scene } = host
  const root = new THREE.Group()
  scene.add(root)

  scene.add(new THREE.AmbientLight(0xffffff, 0.55))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(5, 8, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x67e8f9, 0.6)
  rim.position.set(-6, -3, -5)
  scene.add(rim)

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(0.07, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0xffffff })
  )
  scene.add(nucleus)

  const axes = createAxes(THREE)
  scene.add(axes)

  let cloud = null
  let surfaces = []
  let current = null
  let options = { cloud: true, surface: true, axes: true }

  function clear() {
    for (const object of [cloud, ...surfaces]) {
      if (!object) continue
      root.remove(object)
      object.geometry?.dispose()
      object.material?.dispose()
    }
    cloud = null
    surfaces = []
  }

  function buildCloud(n, l, key, scale) {
    const count = POINTS_BY_QUALITY[host.quality] || POINTS_BY_QUALITY.balanced
    const { positions, phases } = sampleDensity(n, l, key, count, n * 100 + l * 10 + key.length)
    const colors = new Float32Array(count * 3)
    const positive = new THREE.Color(PHASE_COLORS.positive)
    const negative = new THREE.Color(PHASE_COLORS.negative)
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] *= scale
      positions[i * 3 + 1] *= scale
      positions[i * 3 + 2] *= scale
      const color = phases[i] > 0 ? positive : negative
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const points = new THREE.Points(geometry, cloudMaterial(THREE, host.renderer.getPixelRatio()))
    points.renderOrder = 2
    return points
  }

  function buildSurfaces(n, l, key) {
    const resolution = GRID_BY_QUALITY[host.quality] || GRID_BY_QUALITY.balanced
    const maxPolys = POLYS_BY_QUALITY[host.quality] || POLYS_BY_QUALITY.balanced
    const { values, isoValue, size } = sampleGrid(n, l, key, resolution, 0.9)

    return [1, -1].map(sign => {
      const mesh = new MarchingCubes(
        size,
        surfaceMaterial(THREE, sign > 0 ? PHASE_COLORS.positive : PHASE_COLORS.negative),
        false,
        false,
        maxPolys
      )
      const field = mesh.field
      for (let i = 0; i < values.length; i += 1) field[i] = (sign * values[i]) / isoValue
      mesh.isolation = 1
      mesh.update()
      mesh.scale.setScalar(WORLD_RADIUS)
      mesh.renderOrder = 1
      return mesh
    }).filter(mesh => mesh.geometry.drawRange.count > 0)
  }

  function applyVisibility() {
    if (cloud) cloud.visible = options.cloud
    for (const surface of surfaces) surface.visible = options.surface
    axes.visible = options.axes
    host.requestRender()
  }

  return {
    get current() {
      return current
    },

    /* Heavy work (sampling + marching cubes) — callers should show a busy state first. */
    show(n, l, key) {
      clear()
      current = { n, l, key }
      const extent = radialExtent(n, l, 0.99)
      const scale = WORLD_RADIUS / extent
      cloud = buildCloud(n, l, key, scale)
      root.add(cloud)
      surfaces = buildSurfaces(n, l, key)
      for (const surface of surfaces) root.add(surface)
      applyVisibility()
    },

    setOptions(next) {
      options = { ...options, ...next }
      applyVisibility()
    },

    rebuild() {
      if (current) this.show(current.n, current.l, current.key)
    },

    dispose() {
      clear()
    }
  }
}
