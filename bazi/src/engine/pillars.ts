import lunisolar from 'lunisolar'
import type { BirthInput, Pillar, HiddenStem, BaziResult, FiveElementCount, TenGodItem, DayMasterAnalysis } from './types'
import {
  STEMS, BRANCHES, HIDDEN_STEMS, HIDDEN_DEPTHS,
  STEM_ELEMENT, BRANCH_ELEMENT, ELEMENT_INDEX,
  ELEMENT_CYCLE, TEN_GODS_MATRIX,
  getSeasonStrength, getTiaoHou
} from './data'

function padHour(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function toPillar(sb: any): Pillar {
  return {
    stem: sb.stem.toString(),
    stemIndex: sb.stem.value,
    branch: sb.branch.toString(),
    branchIndex: sb.branch.value,
    fullStemBranch: sb.toString()
  }
}

export function calculateBazi(input: BirthInput): BaziResult {
  const dateStr = `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')} ${padHour(input.hour, input.minute)}`
  const lsr = lunisolar(dateStr)
  const c8 = lsr.char8

  const yearPillar = toPillar(c8.year)
  const monthPillar = toPillar(c8.month)
  const dayPillar = toPillar(c8.day)
  const hourPillar = toPillar(c8.hour)
  const dayMaster = c8.me.toString()
  const dayMasterIndex = c8.day.stem.value

  // Hidden stems (藏遁)
  const hiddenStems: HiddenStem[] = []
  const allBranches = [
    { branch: yearPillar.branch, branchIndex: yearPillar.branchIndex },
    { branch: monthPillar.branch, branchIndex: monthPillar.branchIndex },
    { branch: dayPillar.branch, branchIndex: dayPillar.branchIndex },
    { branch: hourPillar.branch, branchIndex: hourPillar.branchIndex }
  ]
  for (const b of allBranches) {
    const stems = HIDDEN_STEMS[b.branchIndex] || []
    const depths = HIDDEN_DEPTHS[b.branchIndex] || []
    stems.forEach((si, idx) => {
      hiddenStems.push({
        stem: STEMS[si],
        stemIndex: si,
        branchName: b.branch,
        depth: depths[idx] as '本气' | '中气' | '余气'
      })
    })
  }

  // Five elements count
  const elementCount: Record<string, { count: number; sources: string[] }> = {
    '木': { count: 0, sources: [] },
    '火': { count: 0, sources: [] },
    '土': { count: 0, sources: [] },
    '金': { count: 0, sources: [] },
    '水': { count: 0, sources: [] }
  }
  function addElement(elem: string, source: string) {
    if (elementCount[elem]) {
      elementCount[elem].count++
      elementCount[elem].sources.push(source)
    }
  }

  addElement(STEM_ELEMENT[yearPillar.stemIndex], `年干${yearPillar.stem}`)
  addElement(STEM_ELEMENT[monthPillar.stemIndex], `月干${monthPillar.stem}`)
  addElement(STEM_ELEMENT[dayPillar.stemIndex], `日干${dayPillar.stem}`)
  addElement(STEM_ELEMENT[hourPillar.stemIndex], `时干${hourPillar.stem}`)
  addElement(BRANCH_ELEMENT[yearPillar.branchIndex], `年支${yearPillar.branch}(本气)`)
  addElement(BRANCH_ELEMENT[monthPillar.branchIndex], `月支${monthPillar.branch}(本气)`)
  addElement(BRANCH_ELEMENT[dayPillar.branchIndex], `日支${dayPillar.branch}(本气)`)
  addElement(BRANCH_ELEMENT[hourPillar.branchIndex], `时支${hourPillar.branch}(本气)`)
  for (const hs of hiddenStems) {
    addElement(STEM_ELEMENT[hs.stemIndex], `藏干${hs.stem}(${hs.depth}, ${hs.branchName})`)
  }

  const total = Object.values(elementCount).reduce((s, v) => s + v.count, 0)
  const fiveElements: FiveElementCount[] = []
  let missingElement: string | null = null
  const missingList: string[] = []

  for (const elem of ELEMENT_CYCLE) {
    const data = elementCount[elem]
    const pct = total > 0 ? Math.round((data.count / total) * 100) : 0
    fiveElements.push({ element: elem, count: data.count, percentage: pct, source: data.sources })
    if (data.count === 0) missingList.push(elem)
  }
  if (missingList.length === 1) missingElement = missingList[0]
  else if (missingList.length > 1) missingElement = `缺${missingList.join('、')}`

  // Ten gods
  const tenGods: TenGodItem[] = []
  const allStems = [
    { stem: yearPillar.stem, stemIndex: yearPillar.stemIndex, pos: '年干' },
    { stem: monthPillar.stem, stemIndex: monthPillar.stemIndex, pos: '月干' },
    { stem: dayPillar.stem, stemIndex: dayPillar.stemIndex, pos: '日干' },
    { stem: hourPillar.stem, stemIndex: hourPillar.stemIndex, pos: '时干' }
  ]
  for (const s of allStems) {
    tenGods.push({ stem: `${s.stem}(${s.pos})`, tenGod: TEN_GODS_MATRIX[dayMasterIndex][s.stemIndex], relation: getRelation(dayMasterIndex, s.stemIndex) })
  }
  for (const hs of hiddenStems) {
    tenGods.push({ stem: `${hs.stem}(藏干${hs.branchName})`, tenGod: TEN_GODS_MATRIX[dayMasterIndex][hs.stemIndex], relation: getRelation(dayMasterIndex, hs.stemIndex) })
  }

  // Day master analysis
  const dmElem = STEM_ELEMENT[dayMasterIndex]
  const seasonStr = getSeasonStrength(dmElem, monthPillar.branchIndex)
  const strengthMap: Record<string, '极强' | '偏强' | '中和' | '偏弱' | '极弱'> = {
    '2': '偏强', '1': '中和', '0.5': '偏弱', '-0.5': '偏弱', '-1': '极弱'
  }
  const strength = strengthMap[String(seasonStr)] || '中和'
  const tiaoHou = getTiaoHou(dayMasterIndex, monthPillar.branchIndex)

  const dayMasterAnalysis: DayMasterAnalysis = {
    stem: dayMaster,
    element: dmElem,
    strength,
    deLing: seasonStr >= 1,
    deDi: [dayPillar.branchIndex, hourPillar.branchIndex].some(bi => BRANCH_ELEMENT[bi] === dmElem || (bi === monthPillar.branchIndex && seasonStr >= 0.5)),
    deZhu: tenGods.some(tg => ['正印', '偏印', '比肩', '劫财'].includes(tg.tenGod)),
    favorable: tiaoHou.favorable,
    unfavorable: tiaoHou.unfavorable
  }

  const interpretation = buildInterpretation(dayMaster, dmElem, strength, fiveElements, missingElement)
  const summary = buildSummary(dayMaster, dmElem, strength, missingElement)

  return {
    birthInput: input, yearPillar, monthPillar, dayPillar, hourPillar,
    dayMaster, dayMasterIndex, hiddenStems, fiveElements,
    missingElement, tenGods, dayMasterAnalysis,
    interpretation, summary, timestamp: Date.now()
  }
}

function getRelation(dmIdx: number, otherIdx: number): string {
  const dmElem = STEM_ELEMENT[dmIdx]
  const otherElem = STEM_ELEMENT[otherIdx]
  const dmIdxE = ELEMENT_INDEX[dmElem]
  const otherIdxE = ELEMENT_INDEX[otherElem]
  if (dmElem === otherElem) return '同我'
  if ((dmIdxE + 1) % 5 === otherIdxE) return '我生'
  if ((dmIdxE + 2) % 5 === otherIdxE) return '我克'
  if ((dmIdxE + 3) % 5 === otherIdxE) return '克我'
  return '生我'
}

function buildInterpretation(dm: string, elem: string, strength: string, fes: FiveElementCount[], missing: string | null): string {
  const elemDesc: Record<string, string> = {
    '木': '仁慈、有活力、注重成长',
    '火': '热情、外向、善于表达',
    '土': '稳重、包容、脚踏实地',
    '金': '果断、刚毅、注重原则',
    '水': '智慧、变通、善于沟通'
  }
  const strengthDesc: Record<string, string> = {
    '极强': '五行力量非常充足，个性鲜明突出',
    '偏强': '自身力量充沛，做事有主见',
    '中和': '五行平衡，为人平和稳重',
    '偏弱': '自身力量稍有不足，喜得生扶',
    '极弱': '五行力量较弱，喜得生扶助力'
  }
  let text = `你的日主是「${dm}」(${elem})。${elemDesc[elem] || ''}。`
  text += `日主${strength}，${strengthDesc[strength] || ''}。`
  if (missing) text += `八字中${missing}，传统命理学认为这可能意味着在相应领域的特质相对不突出。`
  const top = [...fes].sort((a, b) => b.count - a.count)
  if (top[0] && top[0].count > 0) text += `五行以「${top[0].element}」最旺，${top[1] ? `其次是「${top[1].element}」。` : ''}`
  text += '以上分析基于传统命理学框架，仅供参考学习，不构成人生决策建议。'
  return text
}

function buildSummary(dm: string, elem: string, strength: string, missing: string | null): string {
  return `日主${dm}(${elem})，${strength}。${missing ? `缺${missing}。` : '五行齐全。'}`
}
