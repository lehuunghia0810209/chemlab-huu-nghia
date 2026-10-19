
import { STOCK_CONCENTRATION, STRONG } from './acidBase.js'

export const SALT_SOLUBILITY = {
  agno3: 216,
  nacl: 35.9,
  kcl: 34.0,
  kbr: 65.3,
  ki: 144,
  cacl2: 74.5,
  mgcl2: 54.3,
  nh4cl: 37.2,
  cuso4: 20.7,
  cucl2: 75.7,
  fecl3: 91.2,
  fecl2: 64.4,
  feso4: 25.6,
  bacl2: 35.8,
  bano3: 10.5,
  pbno3: 54.3,
  na2co3: 21.5,
  nahco3: 9.6,
  na2so4: 19.5,
  k2so4: 11.1,
  na2so3: 27,
  na2s: 18.6,
  na2s2o3: 70.1,
  kscn: 217,
  znso4: 54,
  alcl3: 45.8,
  kno3: 31.6,
  nano3: 87.6,
  na3po4: 14.4,
  nh4no3: 192
}

export function stockConcentration(id) {
  if (STRONG[id] || SALT_SOLUBILITY[id] !== undefined) return STOCK_CONCENTRATION
  return null
}
