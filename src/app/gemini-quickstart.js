import { GoogleGenerativeAI } from "@google/generative-ai";

// Make sure to include these imports:
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt =
  "Write a single prompt for an art generator to create album art based on these lyrics: 'I know that you are vexed, I know that you are hurting'.";

const result = await model.generateContent(prompt);
console.log(result.response.text());
