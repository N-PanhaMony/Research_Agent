import express from "express";

const app = express();
app.use(express.json());

// 🔥 MAIN AGENT ENDPOINT
app.post("/run", async (req, res) => {
  const query = req.body.query;

  // 🧠 OPENCLAW LOGIC (replace with real OpenClaw later)
  const result = `
📌 Research Output:

Topic: ${query}

1. Key Concepts
2. Learning Roadmap
3. Resources
4. Project Idea
`;

  res.json({ result });
});

app.listen(3000, () => {
  console.log("OpenClaw running");
});