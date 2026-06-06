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
    return res.status(400).json({ error: "请输入会议记录" });
  }

  const systemPrompt = `你是专业会议纪要整理专家。将用户的会议记录整理成标准会议纪要格式。

格式要求：
1. 标题：【会议纪要】+ 根据内容推断会议主题
2. 基本信息：时间、参会人员（根据提供的内容提取）
3. 核心部分：【会议议题】【讨论要点】【决议事项】【待办事项】
4. 待办事项格式：责任人 + 具体任务 + 截止时间
5. 语言专业简洁，条理清晰

不要输出任何解释性文字，直接输出会议纪要。`;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.5,
      max_tokens: 2000,
    });

    const result = response.choices[0]?.message?.content || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error("Minutes error:", err);
    res.status(500).json({ error: "生成失败，请稍后重试" });
  }
}
