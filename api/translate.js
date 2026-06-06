import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { content, mode } = req.body || {};
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "请输入需要翻译的内容" });
  }

  const isZh2En = mode === "zh2en";
  const systemPrompt = isZh2En
    ? "你是专业中英翻译和润色专家。将用户的中文内容翻译成地道的英文。要求：1. 语言自然地道，不要生硬的直译 2. 保持原文的语气和风格 3. 适当润色让表达更专业。直接输出翻译结果，不要任何解释。"
    : "你是专业英中翻译和润色专家。将用户的英文内容翻译成流畅的中文。要求：1. 中文表达自然流畅，不要生硬的直译 2. 保持原文的语气和风格 3. 专业术语翻译准确。直接输出翻译结果，不要任何解释。";

  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.3,
      max_tokens: 4000,
    });

    const result = response.choices[0]?.message?.content || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error("Translate error:", err);
    res.status(500).json({ error: "翻译失败，请稍后重试" });
  }
}
