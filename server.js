import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

/* =========================
   🧠 OPENCLAW LOGIC LAYER
========================= */
function openClaw(query) {
  return `
You are a senior AI research assistant.

User topic: ${query}

Follow this structure:

1. Key Concepts (simple explanation)
2. Step-by-step learning roadmap
3. Best free resources (links if possible)
4. Beginner project idea
5. Bonus tips to master faster

Make it clear, structured, and practical.
`;
}

/* =========================
   🔥 MAIN AI ENDPOINT
========================= */
app.post("/run", async (req, res) => {
  try {
    const query = req.body.query;

    if (!query) {
      return res.json({ result: "No query provided" });
    }

    // 🧠 1. OpenClaw prompt builder
    const prompt = openClaw(query);

    // 🧠 2. Call Gemini AI
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      }
    );

    // 🧠 3. Extract result safely
    const result =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    // 🧠 4. Return to PRO2
    res.json({ result });

  } catch (err) {
    console.error("ERROR:", err.message);

    res.json({
      result: "Error generating response"
    });
  }
});

/* =========================
   🟢 HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("OpenClaw AI Server Running 🚀");
});

/* =========================
   🚀 START SERVER
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});