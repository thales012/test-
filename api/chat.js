export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API key missing on server" });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
Você é o Professor Lucas, professor de Português.
Seja educado, explique com clareza e ofereça exercícios.
`
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();

    // Debug (ativar se necessário)
    // console.log("API Response:", data);

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "No reply from model" });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("API ERROR:", error);
    return res.status(500).json({ error: "Server error" });
  }
}
