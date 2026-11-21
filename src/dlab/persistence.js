// Local persistence (IndexedDB). Nothing leaves the device; no login needed.
import { SCHEMA } from './engine/sim.js'
import { EQUIPMENT } from './data/equipment.js'
import { REAGENT_BY_ID } from './data/materials.js'

const DB = 'chemlab-dynamic-lab'
const STORE = 'experiments'
export const AUTOSAVE_ID = 'autosave'

// Returns an error message, or null when the save can be loaded safely.
export function validateSave(save) {
  if (!save || typeof save !== 'object') return 'Dữ liệu lưu không hợp lệ.'
  if (save.schema !== SCHEMA) return `Phiên bản dữ liệu ${save.schema} không được hỗ trợ.`
  const st = save.state
  if (!st || !Array.isArray(st.objects) || !Number.isFinite(st.t) || st.t < 0) return 'Thiếu trạng thái mô phỏng.'
  if (st.objects.length > 200) return 'Quá nhiều vật thể.'
  for (const o of st.objects) {
    if (typeof o.id !== 'string' || !(o.type === 'solid' || EQUIPMENT[o.type])) return `Vật thể không hợp lệ: ${o.type}`
    if (!Number.isFinite(o.x) || !Number.isFinite(o.y)) return 'Tọa độ không hợp lệ.'
    if (o.type === 'solid' && (!REAGENT_BY_ID[o.reagent] || !(o.massG >= 0))) return 'Chất rắn không hợp lệ.'
    if (o.reagent && !REAGENT_BY_ID[o.reagent]) return 'Hóa chất không hợp lệ.'
    if (o.contents) {
      for (const group of ['liquids', 'ions', 'indicators', 'precipitates']) {
        for (const v of Object.values(o.contents[group] || {})) if (!(Number.isFinite(v) && v >= 0)) return 'Lượng chất âm hoặc không hợp lệ.'
      }
    }
    if (typeof o.label === 'string' && o.label.length > 120) return 'Nhãn quá dài.'
  }
  return null
}

// Schema migrations run here; v1 is current, so this only normalises.
export function migrate(save) {
  return { ...save, schema: SCHEMA }
}

function open() {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') { reject(new Error('Trình duyệt không hỗ trợ lưu cục bộ.')); return }
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' })
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function tx(mode, fn) {
  const db = await open()
  try {
    return await new Promise((resolve, reject) => {
      const t = db.transaction(STORE, mode)
      const result = fn(t.objectStore(STORE))
      t.oncomplete = () => resolve(result?.result ?? result)
      t.onerror = () => reject(t.error)
    })
  }
  finally { db.close() }
}

export function saveExperiment({ id, name, state }) {
  const record = { id: id || `exp-${Date.now()}`, name: String(name || 'Thí nghiệm').slice(0, 80), schema: SCHEMA, savedAt: Date.now(), state: JSON.parse(JSON.stringify(state)) }
  return tx('readwrite', store => store.put(record)).then(() => record)
}

export function listExperiments() {
  return tx('readonly', store => store.getAll()).then(rows => (rows || []).map(r => ({ id: r.id, name: r.name, savedAt: r.savedAt, objects: r.state?.objects?.length || 0, t: r.state?.t || 0 })).sort((a, b) => b.savedAt - a.savedAt))
}

export async function loadExperiment(id) {
  const record = await tx('readonly', store => store.get(id))
  if (!record) throw new Error('Không tìm thấy thí nghiệm.')
  const save = migrate(record)
  const problem = validateSave(save)
  if (problem) throw new Error(problem)
  return save
}

export function deleteExperiment(id) {
  return tx('readwrite', store => store.delete(id))
}
