import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const testGeminiAPI = async () => {
    try {
        console.log("🔑 API Key exists:", !!process.env.GEMINI_API_KEY);
        console.log("🔑 API Key starts with:", process.env.GEMINI_API_KEY?.substring(0, 15));
        
        if (!process.env.GEMINI_API_KEY) {
            console.error("❌ No API key found!");
            return;
        }
        
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        console.log("\n📋 Listing available models...");
        const models = await genAI.listModels();
        console.log("Available models:", models.map(m => m.name).join(", "));
        
        // Try with gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        console.log("\n📤 Sending test question to Gemini...");
        const result = await model.generateContent("What is quantum computing? Explain in 2 sentences.");
        const response = await result.response;
        const text = response.text();
        
        console.log("\n✅ Success! Response:");
        console.log(text);
        console.log("\n🎉 Gemini AI is working correctly!");
        
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        if (error.message.includes("API_KEY_INVALID")) {
            console.error("The API key is invalid. Please check your key at https://makersuite.google.com/app/apikey");
        }
    }
};

testGeminiAPI();
