import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const test = async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const models = ["gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash"];
    
    for (const m of models) {
        try {
            console.log(`\nTrying: ${m}`);
            const model = genAI.getGenerativeModel({ model: m });
            const result = await model.generateContent("What is quantum computing?");
            const text = (await result.response).text();
            console.log(`✅ SUCCESS with ${m}`);
            console.log(text.substring(0, 200));
            break;
        } catch (e) {
            console.log(`❌ ${m}: ${e.message.substring(0, 80)}`);
        }
    }
};

test();
