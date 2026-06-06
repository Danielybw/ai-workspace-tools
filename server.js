import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OpenAI } from "openai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 3456;

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const STYLES = {
  professional: `你是职场汇报专家。将工作要点整理成专业周报。
格式：
1. 标题：本周工作总结
2. 分三部分：【重点项目进展】【日常工作推进】【下周计划】
3. 每条用完整句子，适度量化
4. 最后一句本周感悟

直接输出周报，不要解释。`,

  result: `你是成果导向型汇报专家。整理成成果导向周报。
格式：
1. 标题：本周关键成果
2. 每条用「完成了什么+带来什么价值」结构
3. 突出量化成果
4. 末尾附「关键洞察」

直接输出周报。`,

  concise: `你是高效汇报专家。整理成极简周报。
格式：
1. 标题：本周摘要
2. 不超过5条
3. 每条不超过30字
4. 只写完成了什么

直接输出周报。`,

  tech: `你是技术团队周报助手。整理成技术风周报。
格式：
1. 标题：【技术周报】
2. 分类：【功能开发】【技术优化】【Bug修复】【技术调研】
3. 每条带技术细节
4. 末尾加技术债务提示

直接输出周报。`,
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
};

function serveStatic(req, res) {
  let fp = req.url === "/" ? "/index.html" : req.url;
  const full = path.join(__dirname, "public", fp);
  if (!full.startsWith(path.join(__dirname, "public"))) {
    res.writeHead(403); res.end("Forbidden"); return;
  }
  try {
    const st = fs.statSync(full);
    if (st.isFile()) {
      const ext = path.extname(full).toLowerCase();
      res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
      fs.createReadStream(full).pipe(res); return;
    }
  } catch (_) {}
  const idx = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(idx)) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    fs.createReadStream(idx).pipe(res);
  } else { res.writeHead(404); res.end("Not Found"); }
}

async function handleGenerate(req, res) {
  if (req.method !== "POST") { res.writeHead(405); res.end(JSON.stringify({error:"Method not allowed"})); return; }
  let body = "";
  req.on("data", c => { body += c; });
  req.on("end", async () => {
    try {
      const { content, style } = JSON.parse(body);
      if (!content || !content.trim()) { res.writeHead(400); res.end(JSON.stringify({error:"请输入工作内容"})); return; }
      const sys = STYLES[style] || STYLES.professional;
      const r = await openai.chat.completions.create({
        model: "qwen-plus",
        messages: [{role:"system",content:sys},{role:"user",content}],
        temperature: 0.7, max_tokens: 2000,
      });
      const result = r.choices[0]?.message?.content || "";
      res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({ result }));
    } catch (err) {
      console.error(err);
      res.writeHead(500); res.end(JSON.stringify({error:"生成失败，请稍后重试"}));
    }
  });
}


async function handleMinutes(req, res) {
  if (req.method !== "POST") { res.writeHead(405); res.end(JSON.stringify({error:"Method not allowed"})); return; }
  let body = "";
  req.on("data", c => { body += c; });
  req.on("end", async () => {
    try {
      const { content } = JSON.parse(body);
      if (!content || !content.trim()) { res.writeHead(400); res.end(JSON.stringify({error:"请输入会议记录"})); return; }
      const sys = `你是专业会议纪要整理专家。将用户的会议记录整理成标准会议纪要格式。

格式要求：
1. 标题：【会议纪要】+ 根据内容推断会议主题
2. 基本信息：时间（如未提供则不写）、参会人员（如提供则列出）
3. 核心部分：【会议议题】【讨论要点】【决议事项】【待办事项】
4. 待办事项格式：责任人 + 具体任务 + 截止时间（如有）
5. 语言专业简洁，条理清晰

不要输出任何解释性文字，直接输出会议纪要。`;
      const r = await openai.chat.completions.create({
        model: "qwen-plus",
        messages: [{role:"system",content:sys},{role:"user",content}],
        temperature: 0.5, max_tokens: 2000,
      });
      const result = r.choices[0]?.message?.content || "";
      res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({ result }));
    } catch (err) {
      console.error(err);
      res.writeHead(500); res.end(JSON.stringify({error:"生成失败，请稍后重试"}));
    }
  });
}


async function handleResume(req, res) {
  if (req.method !== "POST") { res.writeHead(405); res.end('{"error":"Method not allowed"}'); return; }
  let body = "";
  req.on("data", c => { body += c; });
  req.on("end", async () => {
    try {
      const { content } = JSON.parse(body);
      if (!content || !content.trim()) { res.writeHead(400); res.end('{"error":"请输入简历内容"}'); return; }
      const sys = "你是资深HR和简历优化专家。用STAR法则重写简历，突出量化成果，强动词开头。直接输出优化后简历。";
      const r = await openai.chat.completions.create({
        model: "qwen-plus", messages: [{role:"system",content:sys},{role:"user",content}],
        temperature: 0.5, max_tokens: 3000,
      });
      res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({ result: r.choices[0]?.message?.content || "" }));
    } catch (err) { console.error(err); res.writeHead(500); res.end('{"error":"生成失败"}'); }
  });
}

async function handleTranslate(req, res) {
  if (req.method !== "POST") { res.writeHead(405); res.end('{"error":"Method not allowed"}'); return; }
  let body = "";
  req.on("data", c => { body += c; });
  req.on("end", async () => {
    try {
      const { content, mode } = JSON.parse(body);
      if (!content || !content.trim()) { res.writeHead(400); res.end('{"error":"请输入内容"}'); return; }
      const isZh2En = mode === "zh2en";
      const sys = isZh2En ? "中译英专家。翻译成地道英文，不要直译。只输出译文。" : "英译中专家。翻译成流畅中文，不要直译。只输出译文。";
      const r = await openai.chat.completions.create({
        model: "qwen-plus", messages: [{role:"system",content:sys},{role:"user",content}],
        temperature: 0.3, max_tokens: 4000,
      });
      res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({ result: r.choices[0]?.message?.content || "" }));
    } catch (err) { console.error(err); res.writeHead(500); res.end('{"error":"翻译失败"}'); }
  });
}

async function handleAnalyze(req, res) {
  if (req.method !== "POST") { res.writeHead(405); res.end('{"error":"Method not allowed"}'); return; }
  let body = "";
  req.on("data", c => { body += c; });
  req.on("end", async () => {
    try {
      const { content } = JSON.parse(body);
      if (!content || !content.trim()) { res.writeHead(400); res.end('{"error":"请输入数据"}'); return; }
      const sys = "你是资深数据分析师。分析数据输出报告：数据概览、关键发现(3-5条)、趋势分析、异常检测、行动建议。直接输出报告。";
      const r = await openai.chat.completions.create({
        model: "qwen-plus", messages: [{role:"system",content:sys},{role:"user",content}],
        temperature: 0.5, max_tokens: 2500,
      });
      res.writeHead(200, {"Content-Type":"application/json; charset=utf-8"});
      res.end(JSON.stringify({ result: r.choices[0]?.message?.content || "" }));
    } catch (err) { console.error(err); res.writeHead(500); res.end('{"error":"分析失败"}'); }
  });
}

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
  if (req.url === "/api/generate") return handleGenerate(req, res);
  if (req.url === "/api/minutes") return handleMinutes(req, res);
  if (req.url === "/api/resume") return handleResume(req, res);
  if (req.url === "/api/translate") return handleTranslate(req, res);
  if (req.url === "/api/analyze") return handleAnalyze(req, res);
  serveStatic(req, res);
});

server.listen(PORT, () => { console.log(`Server: http://localhost:${PORT}`); });
