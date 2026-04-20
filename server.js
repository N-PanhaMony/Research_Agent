import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

/* =========================
   🧠 PROMPT LAYER
========================= */
function openClaw(query) {
  return `
You are a senior AI research assistant.

User topic: ${query}

Return structured answer:

1. Key Concepts
2. Step-by-step learning roadmap
3. Best free resources
4. Beginner project idea
5. Practical tips

Make it simple, clear, and practical.
`;
}

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("PRO1 AI Backend Running");
});

/* =========================
   MAIN ENDPOINT
========================= */
app.post("/run", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.json({ result: "❌ No query provided" });
    }

    console.log("👉 Query:", query);

    const response = await axios.post(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    model: "llama-3.3-70b-versatile", // ✅ FIXED
    messages: [
      {
        role: "system",
        content: "You are a helpful AI research assistant."
      },
      {
        role: "user",
        content: openClaw(query)
      }
    ]
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json"
    }
  }
);

    const result = response.data?.choices?.[0]?.message?.content;

    if (!result) {
      console.log("⚠️ FULL RESPONSE:", response.data);
      return res.json({ result: "⚠️ No AI response" });
    }

    res.json({ result });

  } catch (err) {
    console.log("🔥 ERROR:", err.response?.data || err.message);

    res.status(500).json({
      error: "AI request failed",
      details: err.response?.data || err.message
    });
  }
});

/* =========================
   START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 PRO1 running on ${PORT}`);
});