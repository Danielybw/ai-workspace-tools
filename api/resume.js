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
    return res.status(400).json({ error: "请输入简历内容" });
  }

  const systemPrompt = `你是资深大厂HR和简历优化专家。请优化用户的简历。

优化原则：
1. 使用STAR法则重写每条工作经历（情境-任务-行动-结果）
2. 突出量化成果和数据指标，没有数据的地方合理添加
3. 用强动词开头（主导、推动、设计、搭建、优化）
4. 删除弱描述（"负责""参与"等空洞词汇）
5. 保持结构清晰：个人信息→个人优势（3-4条）→工作经历→项目经验→教育背景→技能
6. 个人优势部分用要点式，每条突出一个核心能力
7. 整体语言专业、简洁、有力

不要输出任何解释性文字，直接输出优化后的完整简历。`;

  try {
    const response = await openai.chat.completions.create({
      model: "qwen-plus",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content },
      ],
      temperature: 0.5,
      max_tokens: 3000,
    });

    const result = response.choices[0]?.message?.content || "";
    res.status(200).json({ result });
  } catch (err) {
    console.error("Resume error:", err);
    res.status(500).json({ error: "生成失败，请稍后重试" });
  }
}
