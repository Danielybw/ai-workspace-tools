import { chromium } from 'playwright';

const ITEMS = [
  {desc:'【AI帮你写周报】\nAI一键生成专业周报！输入要点30秒出稿。4种风格可选。\n流程：拍下→发要点→5分钟出稿。¥6.6/次。', price:'6.6', img:'1'},
  {desc:'【AI会议纪要】\n会议记录一键转标准纪要，自动提取议题/讨论/决议/待办。\n流程：拍下→发记录→10分钟出稿。¥6.6/次。', price:'6.6', img:'2'},
  {desc:'【AI简历优化】\n大厂PM视角+STAR法则重写每条经历，突出量化成果。\n流程：拍下→发简历→30分钟出优化版。¥9.9/次。', price:'9.9', img:'3'},
  {desc:'【AI翻译润色】\n中英互译+专业润色，工作邮件/文档/简历。\n流程：拍下→发内容→10分钟出稿。¥8.8/千字。', price:'8.8', img:'4'},
  {desc:'【AI数据分析】\n上传数据自动分析趋势，输出洞察报告可放PPT。\n流程：拍下→发数据→20分钟出报告。¥12.8/次。', price:'12.8', img:'5'},
];

const ctx = await chromium.launchPersistentContext('/tmp/xianyu-persist', {
  headless: false, viewport: { width: 1440, height: 900 }, args: ['--no-sandbox']
});
const page = await ctx.newPage();

// Login
await page.goto('https://www.goofish.com', { timeout: 15000, waitUntil: 'load' });
await page.waitForTimeout(3000);
await page.click('text=登录');
await page.waitForTimeout(6000);

const loggedIn = (await page.evaluate(() => document.body.innerText)).includes('TB_');
console.log('Login:', loggedIn);
if (!loggedIn) process.exit(1);

for (let i = 0; i < ITEMS.length; i++) {
  const item = ITEMS[i];
  await page.goto('https://www.goofish.com/publish', { timeout: 10000, waitUntil: 'load' });
  await page.waitForTimeout(3000);

  await page.$('input[type="file"]').then(f => f.setInputFiles(`/Users/yubangwang/Desktop/Crazy AI/public/xianyu-images/item-${item.img}.jpg`));
  await page.waitForTimeout(2000);

  try {
    const body = await page.evaluate(() => document.body.innerText);
    const m = body.match(/分类\s*\n\s*(.+?)\n/);
    if (m && m[1] !== '其他闲置') {
      await page.click(`text=${m[1]}`);
      await page.waitForTimeout(1000);
      await page.click('text=其他闲置');
      await page.waitForTimeout(1000);
    }
  } catch(e) {}

  const descField = await page.$('[contenteditable="true"]');
  if (descField) { await descField.click(); await page.keyboard.type(item.desc, { delay: 5 }); }

  const inputs = await page.$$('input[type="text"]');
  for (const inp of inputs) {
    if (await inp.getAttribute('placeholder') === '0.00') { await inp.fill(item.price); break; }
  }

  try { await page.click('text=无需邮寄'); await page.waitForTimeout(300); } catch(e) {}

  await page.click('button:has-text("发布")');
  await page.waitForTimeout(5000);
  
  const url = page.url();
  console.log(`Item ${i+1}: ${url !== 'https://www.goofish.com/publish' ? 'PUBLISHED' : 'failed'}`);
}

console.log('ALL DONE');
process.exit(0);
