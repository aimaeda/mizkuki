import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, hint: "POST userText" });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { userText = "" } = req.body || {};
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const r = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 速くて安い。精度重視なら "gpt-4o"
      messages: [
        { role: "system", content: "You are a helpful Japanese assistant." },
        { role: "user", content: userText }
      ]
    });

    const aiReply = r.choices?.[0]?.message?.content?.slice(0, 4900) || "（回答なし）";
    res.json({ aiReply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ aiReply: "エラー：OPENAI_API_KEYや課金設定を確認してください。" });
  }
}
