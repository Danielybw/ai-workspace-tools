// 天干
export const STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
// 地支
export const BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// 天干五行
export const STEM_ELEMENT: Record<number, string> = {
  0: '木', 1: '木', 2: '火', 3: '火', 4: '土', 5: '土', 6: '金', 7: '金', 8: '水', 9: '水'
}

// 地支五行
export const BRANCH_ELEMENT: Record<number, string> = {
  0: '水', 1: '土', 2: '木', 3: '木', 4: '土', 5: '火', 6: '火', 7: '土', 8: '金', 9: '金', 10: '土', 11: '水'
}

// 天干阴阳（0=阳, 1=阴）
export const STEM_YINYANG: Record<number, number> = {
  0: 0, 1: 1, 2: 0, 3: 1, 4: 0, 5: 1, 6: 0, 7: 1, 8: 0, 9: 1
}

// 地支藏遁 [本气, 中气?, 余气?]
export const HIDDEN_STEMS: Record<number, number[]> = {
  0: [9],           // 子→癸
  1: [5, 9, 7],     // 丑→己癸辛
  2: [0, 2, 4],     // 寅→甲丙戊
  3: [1],           // 卯→乙
  4: [4, 1, 9],     // 辰→戊乙癸
  5: [2, 6, 4],     // 巳→丙庚戊
  6: [3, 5],        // 午→丁己
  7: [5, 3, 1],     // 未→己丁乙
  8: [6, 8, 4],     // 申→庚壬戊
  9: [7],           // 酉→辛
  10: [4, 7, 3],    // 戌→戊辛丁
  11: [8, 0]        // 亥→壬甲
}

// 藏遁深度标记
export const HIDDEN_DEPTHS: Record<number, string[]> = {
  0: ['本气'],
  1: ['本气', '中气', '余气'],
  2: ['本气', '中气', '余气'],
  3: ['本气'],
  4: ['本气', '中气', '余气'],
  5: ['本气', '中气', '余气'],
  6: ['本气', '中气'],
  7: ['本气', '中气', '余气'],
  8: ['本气', '中气', '余气'],
  9: ['本气'],
  10: ['本气', '中气', '余气'],
  11: ['本气', '中气']
}

// 五行循环
export const ELEMENT_CYCLE = ['木', '火', '土', '金', '水']
export const ELEMENT_INDEX: Record<string, number> = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 }

// 十神矩阵 [日主天干索引][其他天干索引]
export const TEN_GODS_MATRIX: string[][] = buildTenGodsMatrix()

function buildTenGodsMatrix(): string[][] {
  const matrix: string[][] = []
  for (let dm = 0; dm < 10; dm++) {
    const row: string[] = []
    const dmElem = STEM_ELEMENT[dm]
    const dmYin = STEM_YINYANG[dm]
    const dmIdx = ELEMENT_INDEX[dmElem]

    for (let other = 0; other < 10; other++) {
      const otherElem = STEM_ELEMENT[other]
      const otherYin = STEM_YINYANG[other]
      const otherIdx = ELEMENT_INDEX[otherElem]

      // 五行生克关系判断
      let relation: string
      if (dmElem === otherElem) {
        relation = '同我'
      } else if ((dmIdx + 1) % 5 === otherIdx) {
        relation = '我生'
      } else if ((dmIdx + 2) % 5 === otherIdx) {
        relation = '我克'
      } else if ((dmIdx + 3) % 5 === otherIdx) {
        relation = '克我'
      } else {
        relation = '生我'
      }

      // 阴阳决定具体十神
      const sameYang = dmYin === otherYin
      switch (relation) {
        case '同我': row.push(sameYang ? '比肩' : '劫财'); break
        case '我生': row.push(sameYang ? '食神' : '伤官'); break
        case '我克': row.push(sameYang ? '偏财' : '正财'); break
        case '克我': row.push(sameYang ? '七杀' : '正官'); break
        case '生我': row.push(sameYang ? '偏印' : '正印'); break
        default: row.push('')
      }
    }
    matrix.push(row)
  }
  return matrix
}

// 五行颜色
export const ELEMENT_COLORS: Record<string, string> = {
  '木': '#4CAF50',
  '火': '#FF5722',
  '土': '#FFC107',
  '金': '#9E9E9E',
  '水': '#2196F3'
}

export const ELEMENT_ICONS: Record<string, string> = {
  '木': '🌳', '火': '🔥', '土': '⛰️', '金': '⚔️', '水': '💧'
}

// 月令旺衰
export function getSeasonStrength(dmElement: string, monthBranch: number): number {
  const monthElem = BRANCH_ELEMENT[monthBranch]
  const dmIdx = ELEMENT_INDEX[dmElement]
  const mIdx = ELEMENT_INDEX[monthElem]
  if (dmElement === monthElem) return 2
  if ((dmIdx + 1) % 5 === mIdx) return 1
  if ((dmIdx + 4) % 5 === mIdx) return 0.5
  if ((dmIdx + 2) % 5 === mIdx) return -0.5
  return -1
}

// 调候用神
export function getTiaoHou(dmIndex: number, monthBranch: number): { favorable: string[], unfavorable: string[] } {
  if ([10, 0, 1].includes(monthBranch)) {
    return { favorable: ['火'], unfavorable: ['水', '金'] }
  }
  if ([5, 6, 7].includes(monthBranch)) {
    return { favorable: ['水'], unfavorable: ['火', '木'] }
  }
  if ([2, 3, 4].includes(monthBranch)) {
    if ([6, 7].includes(dmIndex)) {
      return { favorable: ['火', '土'], unfavorable: ['金', '水'] }
    }
    return { favorable: ['火', '土'], unfavorable: ['水', '金'] }
  }
  if ([8, 9, 10].includes(monthBranch)) {
    if ([0, 1].includes(dmIndex)) {
      return { favorable: ['水'], unfavorable: ['金', '土'] }
    }
    if ([2, 3].includes(dmIndex)) {
      return { favorable: ['木'], unfavorable: ['水', '金'] }
    }
    return { favorable: ['水', '木'], unfavorable: ['土', '火'] }
  }
  return { favorable: ['火', '土'], unfavorable: ['水', '金'] }
}

