// This is the backend for our anatomize app. 
// It sets up an Express server with a single POST endpoint at "/chat".
// The "/chat" endpoint receives user input and region context ("thorax", "abdomen")
// It construct a structured prompt
// It send the structure prompt to OpenAI Chat Completions endpoint
// It return the GPT model's reply.

import express from "express";    
import fetch from "node-fetch";   //Adds fetch() function to Node.js so the backend can make HTTP requests
import cors from "cors";   // middleware that enables Cross-Origin Resource Sharing
import dotenv from "dotenv"; // Allows loading environment variables from a .env, specefically the OpenAI API key
import regionPrompts from "./regionPrompts.js";  //system prompt for different anatomical regions 

dotenv.config();  //read .env file that contains OPENAI_API_KEY
const app = express();   //create Express app
app.use(express.json()); // middleware that automatically parses incoming JSON request bodies
app.use(cors()); //enables Cross-Origin Resource Sharing

const OPENAI_API_KEY = process.env.OPENAI_API_KEY; //get OpenAI API key from environment variables

app.post("/chat", async (req, res) => {    //chat endpoint 
  const { region, inputText } = req.body;  //extract region and user input from request body

  const systemPrompt =
    regionPrompts[region] || "You are a helpful anatomy tutor.";  //get system prompt for the specified region, or default prompt

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {    //make POST request to OpenAI Chat Completions endpoint
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

    const data = await response.json(); //parse JSON response
    const reply = data.choices?.[0]?.message?.content ?? "Error getting GPT Reply";   //get the model's reply or default message
    res.json({ reply }); //send reply back to client as json 

  } catch (err) {
    console.error(err);   //log error to console
    res.status(500).json({ error: "Error contacting OpenAI API" }); //send 500 error response
  }
});

const PORT = process.env.PORT || 3000;  //use port from environment or default to 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //start server and log port number
