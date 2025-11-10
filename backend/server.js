//to do store a large numer of quiz questions in databse and fetch them randomly 

import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const regionPrompts = {
  abdomen:
    "You are teaching a student about the abdomen. Focus on digestive organs, peritoneum, and major blood vessels, prompting critical thinking.",
  pelvis:
    "You are teaching a student about the pelvis. Ask questions and promote discussion about bones, muscles, and reproductive organs.",
  perineum:
    "You are teaching a student about the perineum. Guide the student through its regions, muscles, and nerves with interactive dialogue.",
  upperlimb:
    "You are teaching a student about the upper limb. Discuss the bones, muscles, and nerves involved in movement and dexterity.",
  lowerlimb:
    "You are teaching a student about the lower limb. Emphasize walking mechanics, muscles, and vascular supply, and ask applied questions.",
  neck: "You are teaching a student about the neck. Discuss triangles, vessels, and muscles while promoting anatomical reasoning.",
  head: "You are teaching a student about the head. Explore cranial nerves, skull bones, and sensory organs through guided questions.",
};

app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.post("/chat", async (req, res) => {
  console.log("Received request:", req.body);
  const { region, inputText } = req.body;

  const systemPrompt =
    regionPrompts[region] || "You are a helpful anatomy tutor.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: inputText },
        ],
      }),
    });

    const data = await response.json();
    console.log("OpenAI response data:", data);
    const reply = data.choices?.[0]?.message?.content ?? "No reply";
    console.log("OpenAI reply:", reply);

    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error contacting OpenAI API" });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
