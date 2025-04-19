// askAI.js
const fetch = require("node-fetch");
require("dotenv").config();
    
async function askAI(prompt) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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", 
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }]
    })
  });

  const json = await response.json();

  if (!json.choices || !json.choices[0]) {
    throw new Error("AI response malformed or empty.");
  }

  return json.choices[0].message.content;
}

module.exports = { askAI };
