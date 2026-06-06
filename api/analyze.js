import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { content } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "请输入数据" });
  }

  const prompt = `你是资深数据分析师。分析用户提供的数据，输出结构化分析报告。

格式：
1. 数据概览：一句话总结数据规模和维度
2. 关键发现（3-5条）：每条一个核心洞察，带数据支撑
3. 趋势分析：识别上升/下降趋势
4. 异常检测：发现异常数据点
5. 行动建议：基于数据给出具体建议

语言专业简洁，适合直接放入工作汇报PPT。直接输出报告。`;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [{role:"system",content:prompt},{role:"user",content}],
      temperature: 0.5, max_tokens: 2500,
    });
    const result = response.choices[0]?.message?.content || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "分析失败" });
  }
}
