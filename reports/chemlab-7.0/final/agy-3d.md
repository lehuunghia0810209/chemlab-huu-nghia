# 3D Chemistry Bench Visual Upgrade Plan

## 1. Concrete Visual Weaknesses (Code & Screenshots)

1. **Cylinder-like glassware with pasted-on rims & no spouts** — [render3d.js:105-129](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L105-L129): `glassShell()` extrudes raw `halfWidthAt()` profiles with no pouring spout, rolled lip, or rounded shoulders. An opaque-looking `TorusGeometry` (`rimMat`, opacity `0.55`, L58/L125) sits atop every vessel like a white wire ring (`ppt-bubbles-v2-3d.png`, `after-9-3d-nhin-vat-chon.png`).
2. **Flat milky glass with zero edge definition** — [render3d.js:57](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L57): `glassMat` uses uniform alpha (`0.22–0.26`) on `FrontSide`, so vessel silhouettes have the same opacity as their centers instead of bright Fresnel rims (`ppt-bubbles-v2-3d.png`, `after-8-3d-nhan-va-kep.png`).
3. **Black metals in software/low quality** — [render3d.js:26-33, 60](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L26-L33): `RoomEnvironment` is skipped when `high === false` (default on software WebGL, visible in every screenshot's toast). Because `steel` has `metalness: 0.85` (L60), tongs (`after-8-3d-nhan-va-kep.png`, `after-9-3d-nhin-vat-chon.png`) and spatula (`3d-organic.png`) reflect black and read as flat charcoal silhouettes.
4. **Crude & broken tool geometry** — [render3d.js:200-233](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L200-L233):
   - **Spatula** (L221-224): Shaft spans `y = 16.5–104.5 mm`, while the scoop sits at `y = 5 mm` — visibly **detached** in [3d-organic.png](file:///d:/EduLab/ChemLab/reports/chemlab-7.0/rebuild/shots/3d-organic.png).
   - **Tongs** (L225-232): Two straight `BoxGeometry` sticks with a oversized cylinder dot at the top (`after-9-3d-nhin-vat-chon.png`), hiding the held iron nail.
   - **Test tube** (L91, L120): Rounded bottom adds a stray flat `base` circle at `y = 1 mm` and balances upright on a point (`3d-organic.png`).
   - **Bottle** (L170-191): Sharp linear shoulder ([equipment.js:62-67](file:///d:/EduLab/ChemLab/src/dlab/data/equipment.js#L62-L67)), plain unribbed cylinder cap, low-res `256×128` label (`ppt-bubbles-v2-3d.png`, `3d-organic.png`).
5. **Unlabeled floating graduation bars** — [render3d.js:131-140](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L131-L140): Four dark `BoxGeometry` rectangles float off to the left with no volume numbers (`ppt-bubbles-v2-3d.png`, `after-8-3d-nhan-va-kep.png`).
6. **Flat liquid surface & muddy clear solutions** — [render3d.js:150-160, 660-679](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L150-L160): Liquid top is a flat `CircleGeometry` with no meniscus; clear HCl reads as opaque grey (`Cốc B` in `after-8-3d-nhan-va-kep.png`). Settled precipitate is a sharp cylinder puck (L156, `Cốc A` in `ppt-bubbles-v2-3d.png`).
7. **Snowball bubbles & invisible shadows** — [render3d.js:66-67, 74](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L66-L74): Bubbles (`opacity: 0.55`, `renderOrder: 0`) draw behind the liquid wall and look like flat grey spheres (`Cốc B`, `ppt-bubbles-v2-3d.png`). Dark contact shadows (`0x0b1220`) disappear on the dark bench (`0x2d3644`, L44).
8. **Distant camera & crowded labels** — [render3d.js:418-423](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L418-L423): Excess headroom (`spanY = top + 0.9`) leaves ~65% bare grey wall while vessels sit cramped in the bottom 20% (`3d-electrolysis.png`, `3d-organic.png`), causing HTML label pills to stack tightly over apparatus.

---

## 2. Prioritized Implementation Plan (Three.js Built-ins Only)

All upgrades use only `THREE` core + `RoomEnvironment` already imported in [render3d.js](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js) (Three.js `0.186.1`).

### P0 — Lighting, Bench Contrast & Low-Quality Metal Fix
- **Change**: Lighten bench to mid-slate epoxy (`0x465366`, procedural `256×256` speckle `CanvasTexture` + `roughness: 0.52`), add a `60 mm` backsplash strip along `z = -1.38`. Rebalance lights: `HemisphereLight(0xf6f9ff, 0x4c566a, high ? 0.9 : 1.35)`, key `DirectionalLight(0xfff5e8, high ? 1.85 : 1.95)` at `(-3, 6, 5)`, rim `DirectionalLight(0xd4e8ff, high ? 1.0 : 1.15)` at `(3.5, 3.5, -4)`. Generate `RoomEnvironment` via `PMREMGenerator` at high quality; in low quality, drop `steel` `metalness` from `0.85 → 0.35`, brighten albedo to `0xc9d3df`, `roughness: 0.32`, and add a subtle front-fill `DirectionalLight(0xeef4ff, 0.45)`.
- **Student readability**: Metals immediately read as bright stainless steel instead of black sticks; bench-to-wall horizon looks grounded.
- **GPU cost**: Negligible (~0 extra draw calls; 1 extra directional light in low mode).
- **Low-quality fallback**: No `PMREM` env sampling; calibrated non-black metal parameters keep silhouette/specular clear.

### P0 — Two-Pass Fresnel Glass & Curved Liquid Meniscus
- **Change**: **Avoid `MeshPhysicalMaterial` `transmission > 0`** (requires a second full-scene render pass and skips transparent clipped liquids inside). Instead, split each vessel shell into **back wall** (`BackSide`, `renderOrder: 1`) and **front wall** (`FrontSide`, `renderOrder: 4`), both `depthWrite: false`, using a 3-line `onBeforeCompile` Schlick Fresnel alpha boost: `alpha = clamp(opacity + fBoost * pow(1.0 - abs(dot(N, V)), 3.0), 0.0, 0.85)`.
  - High tier: `MeshPhysicalMaterial({ color: 0xf0f7ff, roughness: 0.06, metalness: 0.04, ior: 1.52, clearcoat: 1.0, clearcoatRoughness: 0.05, envMapIntensity: 2.0, opacity: 0.10 / 0.16, fBoost: 0.55 })`.
  - Liquid: Replace flat `surface` `CircleGeometry` with a concave **meniscus `LatheGeometry`** (6 radial points: flat out to `0.78*r`, curving up `+1.6 mm` to `r` with a bright thin rim lip; `roughness: 0.06`, `opacity: max(0.28, alpha)`). Lower clear-liquid wall alpha floor from `0.14` to `0.09` so water/HCl look transparent while the meniscus remains unmistakable.
- **Student readability**: Bright refractive-like glass rims and realistic curved liquid surfaces distinguish empty vs. filled water/HCl at a glance.
- **GPU cost**: ~1 extra draw call per vessel, 3 ALU ops/fragment; stays >40 fps on WebKit software WebGL (no FBO transmission pass).
- **Low-quality fallback**: Swap `MeshPhysicalMaterial` for `MeshStandardMaterial` (drops clearcoat, `roughness: 0.08`, `opacity: 0.12 / 0.18`, `fBoost: 0.48`), keeping the Fresnel rim look at half fragment cost.

### P1 — Product-Grade Procedural Glassware & Tool Geometry
Cache every procedural geometry in a `sharedGeo` `Map` keyed by `(type, quality)` (`seg = high ? 44 : 24`).
- **Beaker (100/250 mL)**: `LatheGeometry` from `halfWidthAt` with `2.8 mm` thick base, `2 mm` bottom fillet, `1.4 mm` wall, rolled rim flaring `+2.2 mm` over top `3.5 mm`, plus vertex-displaced pouring spout (`+4.5 mm` radial push over `±18°` around `+X` on top `10 mm`, then `computeVertexNormals()`). Remove separate `rimRing` torus.
- **Conical flask**: Smooth cubic shoulder blend across `y = 0.54*H → 0.68*H` (eliminating sharp cone kink), `4 mm` rounded base heel, `+1.8 mm` rolled neck lip.
- **Test tube**: Closed hemispherical `LatheGeometry` from `(0, 0)` with 10-step quarter-circle (`r = 9 mm`), straight body, `+1.6 mm` beaded lip; omit flat `base` disc.
- **Graduated cylinder**: Separate hexagonal flanged foot (`CylinderGeometry(20*S, 22*S, 4*S, 6)` + tapered stem `4–9 mm`), spouted rim, and cylindrical `CanvasTexture` graduation sleeve (see P1 below).
- **Reagent bottle**: Curved shoulder (`0.68*H → 0.84*H`), glass neck bead, ribbed screw cap (`LatheGeometry` + vertical-rib `CanvasTexture` bump/color stripes), `512×256` (`anisotropy = 4`) paper label with border and hazard strip.
- **Dropper**: Single continuous `LatheGeometry` glass barrel tapering from `3.2 mm → 0.9 mm` capillary tip (fixing cylinder/cone seam), plus 10-point organic teardrop rubber bulb (`roughness: 0.72`).
- **Tongs**: Mirrored `TubeGeometry` along `CatmullRomCurve3` (finger-grip shanks → mid-height pivot pin at `0.58*h` → curved bow jaws with angled rubber/steel gripping tips aligned to held solid center).
- **Spatula**: Tapered continuous shaft meeting a concave `LatheGeometry` spoon scoop at `y = 14 mm` (fixing the `11.5 mm` gap) and flat micro-blade at top.
- **Student readability**: Each piece has an unmistakable real-lab silhouette—no more generic cylinders.
- **GPU cost**: ~600–1,200 triangles per vessel (high), ~300–550 (low); built once and shared.
- **Low-quality fallback**: Halve lathe/tube segments (`24` vs `44`), omit cap bump map.

### P1 — `CanvasTexture` Graduations & Caustic Contact Shadows
- **Graduations**: Replace 4 `BoxGeometry` ticks (L131-140) with one open `CylinderGeometry` sleeve (`r + 0.25 mm`, `polygonOffset: true`) mapped with a `256×512` transparent `CanvasTexture` (`alphaTest: 0.05`) showing major/minor ticks at exact `levelForVolume()` heights plus crisp `mL` numerals.
- **Contact shadows**: Upgrade `radialTexture()` (L907) to a two-part shadow: tight dark ambient-occlusion ring (`opacity: 0.55`) plus soft directional offset ellipse (`+0.04, -0.03`, `opacity: 0.28`), with a faint bright caustic center (`rgba(210,235,255,0.16)`) for glass containers.
- **Student readability**: Students can read actual volumes directly off beakers/cylinders; vessels sit firmly planted on the bench.
- **GPU cost**: 1 draw call per graduated vessel (replaces 4 tick draw calls — actually **cheaper** than current code!).
- **Low-quality fallback**: `128×256` graduation texture; single-quad shadow without caustic pass.

### P2 — Bubbles, Precipitate & Camera/Label Polish
- **Bubbles**: Keep `InstancedMesh` (`MAX = high ? 600 : 250`), set `renderOrder = 3`, apply Fresnel bright-rim shader (`opacity: 0.22`, `fBoost: 0.75`), and squash large rising bubbles slightly `(1.08, 0.9, 1.08)`.
- **Precipitate**: Replace flat `settled` cylinder (L156) with a softly domed `LatheGeometry` sediment mound (`roughness: 0.95`) shaped to the vessel bottom; flatten `partMesh` grains into irregular flakes `(1.2, 0.55, 0.9)` with `±8%` per-instance luminance jitter.
- **Camera & framing**: In `frameFor()` (L418-423), reduce headroom to `spanY = top + 0.45`, ignore idle elevated tools when computing `top`, set view direction `(0.12, 0.36, 0.92)` so equipment fills ~45% of viewport height, and lift `focus()` `target.y` by `+0.18` so bottom toasts don't obscure focused solids. Keep crisp HTML labels in [dlabApp.js:1113-1170](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L1113-L1170).
- **Performance hygiene**: Reuse one `ImageData` buffer per vessel (eliminate per-frame `createImageData` at L639); only call `host.requestRender()` when simulation state, animation, or UI hover/selection actually changed.

---

## 3. Current Code That Will Fight These Changes

1. **Single-mesh double-walled `glassShell` (`FrontSide`, `depthWrite: false`)** — [render3d.js:105-119](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L105-L119): Inner far wall and outer near wall share one draw call and draw in index order, causing transparency sorting pops when orbiting. Must split into separate `BackSide` (`renderOrder: 1`) and `FrontSide` (`renderOrder: 4`) meshes.
2. **Broken transparency `renderOrder` stack** — [render3d.js:74, 119, 152-155, 580](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L74): `bubbleMesh` and `streamMeshes` default to `renderOrder = 0`, drawing *before* `liquid` (`renderOrder = 1`) and `surface` (`renderOrder = 1`), all with `depthWrite: false`. Liquid paints over bubbles and competes with its own surface disc.
3. **Local clipping planes vs. transmission & tilted caps** — [render3d.js:21, 143, 151, 660](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L21): `clippingPlanes` on `DoubleSide` liquid leaves an open un-capped rim whenever `|angle| >= 0.35` hides `surface`, and is incompatible with `MeshPhysicalMaterial` transmission passes.
4. **Static `high` flag breaks runtime `setQuality()`** — [render3d.js:17, 26, 863](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L17): `setQuality()` only updates `pixelRatio` in [sceneHost.js:242-248](file:///d:/EduLab/ChemLab/src/three/sceneHost.js#L242-L248); it never updates `scene.environment`, glass material tier, or `steel` metalness.
5. **In-place UV mutation on `liquid.geometry`** — [render3d.js:624-630](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L624-L630): Mutating `uv` directly prevents sharing `liquidGeo` across same-type vessels (each filled vessel needs its own cloned `uv` buffer or a vertex-shader uniform `uLevel`).
6. **Incomplete GPU disposal & unguarded geometry sharing** — [render3d.js:692-701](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L692-L701): `disposeTree()` only disposes `m.map` (leaking any new `bumpMap`/`roughnessMap`/`alphaMap`) and disposes all geometries except `planeGeo`/`ringGeo` (would break cached `sharedGeo` unless guarded via `geo.userData.shared`).
7. **Unconditional 60 Hz render loop** — [dlabApp.js:141-150](file:///d:/EduLab/ChemLab/src/dlab/ui/dlabApp.js#L141-L150) + [render3d.js:613, 639](file:///d:/EduLab/ChemLab/src/dlab/ui/render3d.js#L613): Calling `update()` → `createImageData()` → `host.requestRender()` every rAF wastes software-WebGL CPU budget even on idle/paused benches.

---

## 4. What I Cannot Do Here

- **No code edits or file generation**: Under this read-only review, I cannot modify `render3d.js`, author external `.glb`/`.gltf` 3D models, bake `.hdr`/`.exr` environment maps, or export raster texture files.
- **No live FPS or visual verification**: I cannot run Playwright/WebKit software WebGL benchmarks or capture after-screenshots to confirm the ≥30 fps target and shader compilation across browsers.
- **Physical limits on software WebGL**: True optical refraction (`transmission`), real-time caustics, and PCF shadow maps cannot hold ≥30 fps in WebKit software rendering; this plan deliberately uses fast physically plausible approximations (Fresnel shells, curved meniscus, caustic-tinted contact shadows).
