// This is the backend for our anatomize app. 
// It sets up an Express server with a single POST endpoint at "/chat".
// The "/chat" endpoint receives user input and region context ("thorax", "abdomen") and replies to users prompt. 
// The "/quiz" endpoint generates a multiple-choice question for the specified region.

import express from "express";    
import fetch from "node-fetch";   //Adds fetch() function to Node.js so the backend can make HTTP requests
import cors from "cors";   // middleware that enables Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Allows loading environment variables from a .env, specefically the OpenAI API key
import { regionPrompts, quizSystemPrompt } from "./gptPrompts.js";  //system prompt for different anatomical regions 


dotenv.config();  //read .env file that contains OPENAI_API_KEY
const app = express();   //create Express app
app.use(express.json()); // middleware that automatically parses incoming JSON request bodies
app.use(cors()); //enables Cross-Origin Resource Sharing

// Basic request logger for visibility into responses
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
  });
  next();
});

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; //get OpenAI API key from environment variables

// Simple healthcheck to confirm connectivity from clients/emulators
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Function to call OpenAI API
async function callOpenAI(messages) {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // default model
        messages, // user/system messages
      }),
    });
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`OpenAI HTTP ${response.status}: ${text}`);
    }
    return await response.json();
  } catch (err) {
    console.error("OpenAI request error:", err);
    throw err;
  }
}

//chat Route
app.post("/chat", async (req, res) => {
  const { region, inputText } = req.body;   //get the region and user input from request body 
  const systemPrompt =
    regionPrompts[region] || "You are a helpful anatomy tutor.";  //get system prompt for the region, or default prompt
  
  try {
    console.log("POST /chat", { region });
    const data = await callOpenAI([
      //call OpenAI API
      { role: "system", content: systemPrompt },
      { role: "user", content: inputText },
    ]);
    const reply = data.choices?.[0]?.message?.content || "Error getting GPT reply."; //extract reply from API response
    res.json({ reply }); //send reply back to client
  } catch (err) {
    console.error("Error handling /chat:", err);
    res.status(500).json({ error: "Error contacting OpenAI API" }); //send error response
  }
});

//quiz Route — generates MCQ JSON
app.post("/quiz", async (req, res) => {
  const { region } = req.body; //get region from request body
  const userPrompt = `Generate a question for the region: ${region}`;  //creat the user prompt 

  try {
    console.log("POST /quiz", { region });
    const data = await callOpenAI([
      //call openAI to generate quiz question for region, use system prompt so format is correct
      { role: "system", content: quizSystemPrompt },
      { role: "user", content: userPrompt },
    ]);
    const raw = data.choices?.[0]?.message?.content; //extract raw text response
    if (!raw) {
      return res.status(500).json({ error: "No response from model" });
    }
    let quizJson; // Attempt to parse JSON
    try {
      quizJson = JSON.parse(raw);
    } catch (err) {
      console.error("JSON parse error:", raw);
      return res.status(500).json({ error: "Invalid JSON from model" });    //send error if JSON parsing fails
    }
    res.json(quizJson);   //send quiz question JSON back to client
  } catch (err) {   
    console.error("Error handling /quiz:", err);
    res.status(500).json({ error: "Error contacting OpenAI API" });  //send error response if OpenAI API call fails
  }
});


// Start server locally 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
