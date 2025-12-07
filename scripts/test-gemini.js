const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY);
  try {
      // For some versions, it's on the genAI instance or via a model manager
      // But typically we can just try to instantiate a model or check if there is a listModels method exposed.
      // The SDK doesn't always expose listModels directly on the top-level class in older versions, 
      // but in recent ones it might be different. 
      // Actually, checking the docs, it might not be straightforward in the JS SDK to list models compared to the Python one.
      // Let's try a simple generation with a very standard name first in this script to confirm connectivity.
      
      console.log("Testing Model: gemini-1.5-flash");
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hello");
      console.log("Success with gemini-1.5-flash:", result.response.text());
  } catch (error) {
      console.error("Error with gemini-1.5-flash:", error.message);
  }

  try {
      console.log("Testing Model: gemini-pro");
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("Hello");
      console.log("Success with gemini-pro:", result.response.text());
  } catch (error) {
       console.error("Error with gemini-pro:", error.message);
  }
}

listModels();
