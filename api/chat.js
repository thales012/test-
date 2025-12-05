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
      return res.status(500).json({ error: "API key missing" });
    }

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Você é o Professor Lucas, professor de Português. Explique com clareza e dê exemplos simples."
            },
            {
              role: "user",
              content: message
            }
          ],
          temperature: 0.7,
        }),
      }
    );

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({
        error: "Empty reply from OpenAI",
        raw: data
      });
    }

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
