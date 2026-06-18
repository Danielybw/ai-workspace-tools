import lunisolar from 'lunisolar'
import type { BirthInput, BaziResult, DaYun, LiuNian, DaYunResult } from './types'
import { STEMS, BRANCHES, STEM_ELEMENT, BRANCH_ELEMENT, STEM_YINYANG, ELEMENT_INDEX, TEN_GODS_MATRIX, JIE_TERM_INDEXES, SOLAR_TERM_TO_BRANCH, NAYIN } from './data'

/** 计算大运 + 当前流年 */
export function calculateDaYun(result: BaziResult): DaYunResult {
  const input = result.birthInput
  const dayMaster = result.dayMaster
  const dayMasterIndex = result.dayMasterIndex
  const yearStemIndex = result.yearPillar.stemIndex
  const monthStemIndex = result.monthPillar.stemIndex
  const monthBranchIndex = result.monthPillar.branchIndex

  // 1. 判断阳年阴年（甲丙戊庚壬=阳，乙丁己辛癸=阴）
  const isYangYear = STEM_YINYANG[yearStemIndex] === 0 // 0=阳
  const isMale = input.gender === 'male'

  // 阳男阴女 → 顺排 (forward)，阴男阳女 → 逆排 (reverse)
  const isForward = (isYangYear && isMale) || (!isYangYear && !isMale)

  // 2. 计算起运年龄
  const { startAge, daysToTerm } = calculateStartAge(input, isForward, monthBranchIndex)

  // 3. 排大运
  const daYunList = buildDaYunList(monthStemIndex, monthBranchIndex, isForward, startAge, dayMasterIndex)

  // 4. 找到当前所在的大运
  const currentYear = new Date().getFullYear()
  const age = currentYear - input.year
  let currentDaYunIndex = 0
  for (let i = daYunList.length - 1; i >= 0; i--) {
    if (age >= daYunList[i].startAge) {
      currentDaYunIndex = i
      break
    }
  }

  // 5. 当前流年
  const liuNian = calculateLiuNian(currentYear, dayMasterIndex, result)

  // 6. 生成总结
  const currentDaYun = daYunList[currentDaYunIndex]
  const summary = `您于${startAge}岁起运，目前行「${currentDaYun.fullStemBranch}」大运（${currentDaYun.startAge}-${currentDaYun.endAge}岁），${currentDaYun.tenGod}运。当前流年为${liuNian.fullStemBranch}年，${liuNian.effect}。`

  return {
    birthInput: input,
    dayMaster,
    dayMasterElement: STEM_ELEMENT[dayMasterIndex],
    startAge,
    isForward,
    daYunList,
    currentDaYunIndex,
    currentYear,
    summary
  }
}

/** 计算起运年龄 */
function calculateStartAge(input: BirthInput, isForward: boolean, monthBranchIndex: number): { startAge: number; daysToTerm: number } {
  const dateStr = `${input.year}-${String(input.month).padStart(2, '0')}-${String(input.day).padStart(2, '0')} ${String(input.hour).padStart(2, '0')}:${String(input.minute).padStart(2, '0')}`
  const lsr = lunisolar(dateStr)
  const solarTerm = lunisolar.SolarTerm

  // 找到出生时间所属的节气区间
  const termDays = solarTerm.getYearTermDayList(input.year)

  // 判断出生月份对应的"节"
  // 月支→对应的节索引: 寅(2)→立春(2), 卯(3)→惊蛰(4), 辰(4)→清明(6), 巳(5)→立夏(8)
  // 午(6)→芒种(10), 未(7)→小暑(12), 申(8)→立秋(14), 酉(9)→白露(16)
  // 戌(10)→寒露(18), 亥(11)→立冬(20), 子(0)→大雪(22), 丑(1)→小寒(0)
  const monthToJieTerm: Record<number, number> = {
    2: 2,   // 寅→立春
    3: 4,   // 卯→惊蛰
    4: 6,   // 辰→清明
    5: 8,   // 巳→立夏
    6: 10,  // 午→芒种
    7: 12,  // 未→小暑
    8: 14,  // 申→立秋
    9: 16,  // 酉→白露
    10: 18, // 戌→寒露
    11: 20, // 亥→立冬
    0: 22,  // 子→大雪
    1: 0,   // 丑→小寒
  }

  const currentJieIdx = monthToJieTerm[monthBranchIndex]
  const birthDayOfYear = dayOfYear(input.year, input.month, input.day)
  const birthTotalMinutes = birthDayOfYear * 1440 + input.hour * 60 + input.minute

  if (isForward) {
    // 顺排：找下一个节
    // 找到当前月节之后的下一个节
    const nextJieIdx = (currentJieIdx + 2) % 24 // 每两个节气一个"节"
    const nextTermDay = termDays[nextJieIdx % 24]
    const nextYear = nextJieIdx < currentJieIdx ? input.year + 1 : input.year
    const nextTermTotalMinutes = dayOfYear(nextYear, monthFromDayOfYear(nextYear, nextTermDay), nextTermDay > 31 ? nextTermDay - daysBefore(3, nextYear) : nextTermDay) * 1440

    // 简单处理：使用太阳黄经计算
    // 简化：用下一个"节"的日序减出生日期
    let daysDiff = nextTermDay - birthDayOfYear
    if (daysDiff < 0) {
      // 跨年了，加一年天数
      daysDiff += isLeapYear(input.year) ? 366 : 365
    }
    const daysToTerm = Math.max(0, daysDiff)
    const startAge = Math.floor(daysToTerm / 3)
    return { startAge, daysToTerm }
  } else {
    // 逆排：找上一个节
    const prevJieIdx = (currentJieIdx - 2 + 24) % 24
    const prevTermDay = termDays[prevJieIdx]
    let daysDiff = birthDayOfYear - prevTermDay
    if (daysDiff < 0) {
      daysDiff += isLeapYear(input.year - 1) ? 366 : 365
    }
    const daysToTerm = Math.max(0, daysDiff)
    const startAge = Math.floor(daysToTerm / 3)
    return { startAge, daysToTerm }
  }
}

function dayOfYear(year: number, month: number, day: number): number {
  const daysInMonth = [0, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let d = 0
  for (let m = 1; m < month; m++) d += daysInMonth[m]
  return d + day
}

function daysBefore(month: number, year: number): number {
  const daysInMonth = [0, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let d = 0
  for (let m = 1; m < month; m++) d += daysInMonth[m]
  return d
}

function monthFromDayOfYear(year: number, doy: number): number {
  const daysInMonth = [0, 31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  let remaining = doy
  for (let m = 1; m <= 12; m++) {
    if (remaining <= daysInMonth[m]) return m
    remaining -= daysInMonth[m]
  }
  return 12
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)
}

/** 构建大运列表 */
function buildDaYunList(
  startStem: number, startBranch: number,
  isForward: boolean, startAge: number,
  dmIndex: number
): DaYun[] {
  const list: DaYun[] = []
  const maxYun = 8 // 最多排8步大运（80年）

  for (let i = 0; i < maxYun; i++) {
    let stemIdx: number, branchIdx: number
    if (isForward) {
      stemIdx = (startStem + 1 + i) % 10
      branchIdx = (startBranch + 1 + i) % 12
    } else {
      stemIdx = (startStem - 1 - i + 10 * 10) % 10
      branchIdx = (startBranch - 1 - i + 12 * 12) % 12
    }

    const ageStart = startAge + i * 10
    const ageEnd = startAge + (i + 1) * 10 - 1
    const tenGod = TEN_GODS_MATRIX[dmIndex][stemIdx]
    const stem = STEMS[stemIdx]
    const branch = BRANCHES[branchIdx]
    const naYin = getNaYin(stemIdx, branchIdx)
    const full = stem + branch
    const description = `${full}（${naYin}），${tenGod}运`

    list.push({
      startAge: ageStart,
      endAge: ageEnd,
      stem,
      branch,
      fullStemBranch: full,
      tenGod,
      description
    })
  }

  return list
}

/** 获取纳音五行 */
function getNaYin(stemIdx: number, branchIdx: number): string {
  // 60甲子纳音：每对干支共享一个纳音
  // 甲子(0,0)乙丑(1,1) = NAYIN[0]
  // 丙寅(2,2)丁卯(3,3) = NAYIN[1]
  // ...
  const pairIdx = Math.floor(stemIdx / 2) % 5
  const branchPair = Math.floor(branchIdx / 2)
  const idx = pairIdx * 6 + branchPair % 6
  return NAYIN[idx % 30]
}

/** 计算流年 */
export function calculateLiuNian(year: number, dmIndex: number, result: BaziResult): LiuNian {
  const lsr = lunisolar(`${year}-01-01 12:00`)
  const c8 = lsr.char8
  const stemIdx = c8.year.stem.value
  const branchIdx = c8.year.branch.value

  const tenGod = TEN_GODS_MATRIX[dmIndex][stemIdx]
  const effect = analyzeLiuNianEffect(stemIdx, branchIdx, dmIndex, result)

  return {
    year,
    stem: STEMS[stemIdx],
    branch: BRANCHES[branchIdx],
    fullStemBranch: STEMS[stemIdx] + BRANCHES[branchIdx],
    tenGod,
    effect
  }
}

/** 分析流年影响 */
function analyzeLiuNianEffect(stemIdx: number, branchIdx: number, dmIndex: number, result: BaziResult): string {
  const effects: string[] = []

  // 与日柱的关系
  const dayBranchIdx = result.dayPillar.branchIndex
  const dayStemIdx = result.dayMasterIndex

  // 地支六冲
  if (chongMap[branchIdx] === dayBranchIdx) {
    effects.push('与日支相冲')
  }

  // 地支六合
  if (heMap[branchIdx] === dayBranchIdx) {
    effects.push('与日支相合')
  }

  // 天干相冲（克）
  if ((stemIdx % 5 + 2) % 5 === (dayStemIdx % 5 + 2) % 5 && Math.abs(stemIdx - dayStemIdx) === 5) {
    effects.push('与日主天干相冲')
  }

  // 天干相合（五合）
  if (stemHeMap[stemIdx] === dayStemIdx) {
    effects.push('与日主天干相合')
  }

  if (effects.length === 0) effects.push('与命局无特殊冲合')

  return effects.join('、')
}

const chongMap: Record<number, number> = { 0: 6, 1: 7, 2: 8, 3: 9, 4: 10, 5: 11, 6: 0, 7: 1, 8: 2, 9: 3, 10: 4, 11: 5 }
const heMap: Record<number, number> = { 0: 1, 1: 0, 2: 11, 3: 10, 4: 9, 5: 8, 6: 7, 7: 6, 8: 5, 9: 4, 10: 3, 11: 2 }
const stemHeMap: Record<number, number> = { 0: 5, 1: 6, 2: 7, 3: 8, 4: 9, 5: 0, 6: 1, 7: 2, 8: 3, 9: 4 }

/** 获取多组流年 (过去+未来) */
export function getLiuNianRange(dmIndex: number, result: BaziResult, yearsBack: number = 3, yearsForward: number = 5): LiuNian[] {
  const currentYear = new Date().getFullYear()
  const list: LiuNian[] = []
  for (let y = currentYear - yearsBack; y <= currentYear + yearsForward; y++) {
    list.push(calculateLiuNian(y, dmIndex, result))
  }
  return list
}

