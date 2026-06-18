export interface Pillar {
  stem: string       // 天干汉字
  stemIndex: number  // 0-9
  branch: string     // 地支汉字
  branchIndex: number // 0-11
  fullStemBranch: string // 完整干支
}

export interface HiddenStem {
  stem: string
  stemIndex: number
  branchName: string
  depth: '本气' | '中气' | '余气'
}

export interface BirthInput {
  year: number
  month: number
  day: number
  hour: number       // 0-23
  minute: number
  gender: 'male' | 'female'
}

export interface FiveElementCount {
  element: string
  count: number
  percentage: number
  source: string[]
}

export interface TenGodItem {
  stem: string
  tenGod: string
  relation: string   // 生我/我生/克我/我克/同我
}

export interface DayMasterAnalysis {
  stem: string
  element: string
  strength: '极强' | '偏强' | '中和' | '偏弱' | '极弱'
  deLing: boolean     // 得令
  deDi: boolean       // 得地
  deZhu: boolean      // 得助
  favorable: string[]
  unfavorable: string[]
}

export interface BaziResult {
  birthInput: BirthInput
  yearPillar: Pillar
  monthPillar: Pillar
  dayPillar: Pillar
  hourPillar: Pillar
  dayMaster: string
  dayMasterIndex: number
  hiddenStems: HiddenStem[]
  fiveElements: FiveElementCount[]
  missingElement: string | null
  tenGods: TenGodItem[]
  dayMasterAnalysis: DayMasterAnalysis
  interpretation: string
  summary: string
  timestamp: number
}

