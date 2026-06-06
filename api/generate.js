import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

const STYLES = {
  professional: `你是资深职场汇报专家。将用户输入的工作要点整理成专业周报。
格式要求：
1. 标题：本周工作总结（日期范围）
2. 分三部分：【重点项目进展】【日常工作推进】【下周计划】
3. 每部分用要点式呈现，每条要点用完整句子
4. 语言专业但不生硬，适度使用数据化表达
5. 最后加一句本周感悟（职业化表达）

不要输出任何解释性文字，直接输出周报。`,

  result: `你是成果导向型汇报专家。将用户输入的工作要点整理成成果导向型周报。
格式要求：
1. 标题：本周关键成果
2. 用「完成了什么+带来了什么价值」的结构
3. 突出量化成果和数据指标
4. 语言简洁有力，每个成果一行
5. 最后附一行「关键洞察」

不要输出任何解释性文字，直接输出周报。`,

  concise: `你是高效汇报专家。将用户输入的工作要点整理成极简周报。
格式要求：
1. 标题：本周摘要
2. 不超过5条要点
3. 每条不超过30字
4. 只写完成了什么，不写过程
5. 语言极度精炼

不要输出任何解释性文字，直接输出周报。`,

  tech: `你是技术团队的周报撰写助手。将用户输入的工作要点整理成技术风格的周报。
格式要求：
1. 标题：【技术周报】
2. 分类：【功能开发】【技术优化】【Bug修复】【技术调研】
3. 每条带技术细节但不过度展开
4. 可适当使用技术术语
5. 末尾加上技术债务/风险提示

不要输出任何解释性文字，直接输出周报。`,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, style } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "请输入工作内容" });
  }

  const systemPrompt = STYLES[style] || STYLES.professional;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error("Generate error:", err);
    res.status(500).json({ error: "生成失败，请稍后重试" });
  }
}

