// An express server which will handle API requests coming in and will respond with a JSON object. It will use body parser as well as cors
require("dotenv").config();
console.log(process.env);

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Initialize conversation with system context
function initializeConversationContext() {
  return [
    {
      role: "system",
      content:
        "You are a pharmaceutical business analyst named Fuzzy. Your goal is to help the user create a revenue forecast model. Guide the user to provide you with more context for what they want in the model, for example if they say 'colon cancer' you should ask them about stage, biomarker status, geography, etc.",
    },
  ];
}
let conversationHistory = initializeConversationContext();

app.post("/", async (req, res) => {
  const { message } = req.body;
  console.log(message);

  // Assuming conversationHistory is an array of message objects already initialized
  let updatedMessages = conversationHistory.concat([
    { role: "user", content: message },
  ]);

  const response = await openai.chat.completions.create({
    messages: updatedMessages,
    model: "gpt-3.5-turbo",
    max_tokens: 100,
    temperature: 0.5,
  });

  const botMessage = response.choices[0].message.content;

  res.json({
    message: botMessage,
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
