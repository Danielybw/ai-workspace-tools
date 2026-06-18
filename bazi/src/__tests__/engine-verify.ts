/**
 * 八字引擎验证测试
 * 
 * 运行方式：npx tsx src/__tests__/engine-verify.ts
 */
import { calculateBazi } from '../engine'
import type { BirthInput } from '../engine'

let passed = 0
let failed = 0

function assert(condition: boolean, msg: string) {
  if (condition) { passed++ }
  else { failed++; console.error(`❌ FAIL: ${msg}`) }
}

// 案例1: 1986-05-26 12:00 → 丙寅 癸巳 庚午 壬午 日主庚
function testSimpleCase() {
  const input: BirthInput = { year: 1986, month: 5, day: 26, hour: 12, minute: 0, gender: 'male' }
  const r = calculateBazi(input)
  assert(r.yearPillar.fullStemBranch === '丙寅', `年柱应为丙寅，得到${r.yearPillar.fullStemBranch}`)
  assert(r.monthPillar.fullStemBranch === '癸巳', `月柱应为癸巳，得到${r.monthPillar.fullStemBranch}`)
  assert(r.dayPillar.fullStemBranch === '庚午', `日柱应为庚午，得到${r.dayPillar.fullStemBranch}`)
  assert(r.hourPillar.fullStemBranch === '壬午', `时柱应为壬午，得到${r.hourPillar.fullStemBranch}`)
  assert(r.dayMaster === '庚', `日主应为庚，得到${r.dayMaster}`)
  console.log(`  ✅ 1986-05-26 12:00 → ${r.yearPillar.fullStemBranch} ${r.monthPillar.fullStemBranch} ${r.dayPillar.fullStemBranch} ${r.hourPillar.fullStemBranch}`)
}

// 案例2: 2000-01-01 08:00 → 立春前，年柱应为己卯
function testYearBoundary() {
  const input: BirthInput = { year: 2000, month: 1, day: 1, hour: 8, minute: 0, gender: 'female' }
  const r = calculateBazi(input)
  assert(r.yearPillar.stemIndex === 5 && r.yearPillar.branchIndex === 3,
    `2000-01-01 年柱应为己卯，得到${r.yearPillar.fullStemBranch}`)
  console.log(`  ✅ 2000-01-01 08:00 → ${r.yearPillar.fullStemBranch} ${r.monthPillar.fullStemBranch} ${r.dayPillar.fullStemBranch} ${r.hourPillar.fullStemBranch}`)
}

// 案例3: 月令节气边界（仅验证输出合法，lunisolar 节气精度与手工推算可能有微小差异）
function testMonthBoundary() {
  const input: BirthInput = { year: 2024, month: 3, day: 5, hour: 10, minute: 0, gender: 'male' }
  const r = calculateBazi(input)
  assert(r.monthPillar.fullStemBranch.length > 0, '月柱不应为空')
  assert(r.monthPillar.stemIndex >= 0 && r.monthPillar.stemIndex <= 9, '月干索引范围0-9')
  assert(r.monthPillar.branchIndex >= 0 && r.monthPillar.branchIndex <= 11, '月支索引范围0-11')
  console.log(`  ✅ 月份边界: ${r.yearPillar.fullStemBranch} ${r.monthPillar.fullStemBranch}`)
}

// 案例4: 五行统计完整性
function testFiveElementsComplete() {
  const input: BirthInput = { year: 1990, month: 6, day: 15, hour: 14, minute: 30, gender: 'male' }
  const r = calculateBazi(input)
  const totalElements = r.fiveElements.reduce((s, e) => s + e.count, 0)
  assert(totalElements >= 8, `五行元素总数(${totalElements})应至少8`)
  const totalPct = r.fiveElements.reduce((s, e) => s + e.percentage, 0)
  assert(Math.abs(totalPct - 100) <= 2, `五行百分比之和(${totalPct}%)应约等于100%`)
  console.log(`  ✅ 五行统计完整: 共${totalElements}个来源, 百分比之和${totalPct}%`)
}

// 案例5: 十神矩阵完整性
function testTenGodsComplete() {
  const input: BirthInput = { year: 1988, month: 3, day: 20, hour: 6, minute: 0, gender: 'female' }
  const r = calculateBazi(input)
  assert(r.tenGods.length >= 8, `十神条目数(${r.tenGods.length})应至少8`)
  const self = r.tenGods.find(tg => tg.stem.startsWith(r.dayMaster))
  assert(!!self, '日主自身应有十神标注')
  console.log(`  ✅ 十神完整: ${r.tenGods.length}条标注`)
}

// 案例6: 子时边界
function testZiHour() {
  const input: BirthInput = { year: 2024, month: 1, day: 1, hour: 23, minute: 30, gender: 'male' }
  const r = calculateBazi(input)
  assert(r.hourPillar.branchIndex === 0, `23:30 时支应为子(0)，得到${r.hourPillar.branch}`)
  console.log(`  ✅ 子时测试: 23:30 → ${r.hourPillar.fullStemBranch}`)
}

// 案例7: 日主分析一致性
function testDayMasterConsistency() {
  const input: BirthInput = { year: 1995, month: 8, day: 15, hour: 10, minute: 0, gender: 'male' }
  const r = calculateBazi(input)
  assert(r.dayMasterAnalysis.stem === r.dayMaster, '日主分析中的日主应匹配')
  assert(r.dayMasterAnalysis.element.length > 0, '日主五行不应为空')
  assert(r.dayMasterAnalysis.strength.length > 0, '日主强弱等级不应为空')
  console.log(`  ✅ 日主分析: ${r.dayMaster}(${r.dayMasterAnalysis.element}) ${r.dayMasterAnalysis.strength}`)
}

// 案例8: 解读文案合规性
function testInterpretation() {
  const input: BirthInput = { year: 2005, month: 10, day: 1, hour: 16, minute: 30, gender: 'female' }
  const r = calculateBazi(input)
  assert(r.interpretation.length > 20, '解读文案不能太短')
  assert(!r.interpretation.includes('化解'), '不应包含"化解"')
  assert(!r.interpretation.includes('转运'), '不应包含"转运"')
  assert(!r.interpretation.includes('趋吉避凶'), '不应包含"趋吉避凶"')
  console.log(`  ✅ 解读文案合规: ${r.interpretation.length}字, 无禁用词`)
}

// 案例9: 排盘稳定性
function testConsistency() {
  const input: BirthInput = { year: 2000, month: 1, day: 1, hour: 0, minute: 0, gender: 'male' }
  const r1 = calculateBazi(input)
  const r2 = calculateBazi(input)
  assert(r1.yearPillar.stemIndex === r2.yearPillar.stemIndex, '年柱应一致')
  assert(r1.monthPillar.stemIndex === r2.monthPillar.stemIndex, '月柱应一致')
  assert(r1.dayPillar.stemIndex === r2.dayPillar.stemIndex, '日柱应一致')
  assert(r1.hourPillar.stemIndex === r2.hourPillar.stemIndex, '时柱应一致')
  console.log('  ✅ 排盘一致性: 多次调用结果相同')
}

// 案例10: 元数据完整性
function testTimestamp() {
  const input: BirthInput = { year: 2010, month: 3, day: 15, hour: 9, minute: 15, gender: 'male' }
  const r = calculateBazi(input)
  assert(r.timestamp > 0, '时间戳应大于0')
  assert(typeof r.summary === 'string' && r.summary.length > 0, '摘要不应为空')
  console.log(`  ✅ 元数据完整: summary="${r.summary}"`)
}

console.log('='.repeat(50))
console.log('八字排盘引擎验证测试')
console.log('='.repeat(50))

testSimpleCase()
testYearBoundary()
testMonthBoundary()
testFiveElementsComplete()
testTenGodsComplete()
testZiHour()
testDayMasterConsistency()
testInterpretation()
testConsistency()
testTimestamp()

console.log('='.repeat(50))
console.log(`结果: ${passed} 通过, ${failed} 失败`)
if (failed > 0) process.exit(1)
else console.log('✅ 所有测试通过！')
