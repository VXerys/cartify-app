const Groq = require("groq-sdk");
require('dotenv').config();

const groq = new Groq({ apiKey: process.env.EXPO_PUBLIC_GROQ_API_KEY });

async function main() {
  try {
    const models = await groq.models.list();
    console.log("Available Groq Models:");
    models.data.forEach((model) => {
        if (model.id.toLowerCase().includes('llama')) {
            console.log(`- ${model.id}`);
        }
    });
  } catch (e) {
      console.error("Error listing models:", e);
  }
}

main();
