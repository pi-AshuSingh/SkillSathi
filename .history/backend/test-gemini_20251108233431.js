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
        
        // Try different model names
        const modelNames = ["models/gemini-pro", "gemini-pro", "models/gemini-1.5-flash", "gemini-1.5-flash"];
        
        for (const modelName of modelNames) {
            try {
                console.log(`\n🔍 Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
        for (const modelName of modelNames) {
            try {
                console.log(`\n� Trying model: ${modelName}`);
                const model = genAI.getGenerativeModel({ model: modelName });
        
                console.log("�📤 Sending test question...");
                const result = await model.generateContent("What is quantum computing? Explain in 2 sentences.");
                const response = await result.response;
                const text = response.text();
        
                console.log(`\n✅ Success with model: ${modelName}`);
                console.log("Response:", text);
                console.log("\n🎉 Gemini AI is working correctly!");
                return; // Exit on success
            } catch (err) {
                console.log(`❌ Failed with ${modelName}: ${err.message}`);
            }
        }
        
        console.error("\n❌ All model names failed!");
        
    } catch (error) {
        console.error("\n❌ Error:", error.message);
        if (error.message.includes("API_KEY_INVALID")) {
            console.error("The API key is invalid. Please check your key at https://makersuite.google.com/app/apikey");
        }
    }
};

testGeminiAPI();
