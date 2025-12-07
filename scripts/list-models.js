const https = require('https');
require('dotenv').config();

const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.models) {
        console.log("Available Models:");
        json.models.forEach(m => {
            if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                console.log(`- ${m.name}`);
            }
        });
      } else {
        console.log("No models found or error:", JSON.stringify(json, null, 2));
      }
    } catch (e) {
      console.error("Error parsing JSON:", e);
      console.log("Raw data:", data);
    }
  });
}).on('error', (e) => {
  console.error("Got error: " + e.message);
});
