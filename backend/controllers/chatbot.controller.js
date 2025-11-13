import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Chatbot controller for handling multilingual chat queries
export const handleChatQuery = async (req, res) => {
    try {
        const { message, language = 'en' } = req.body;

        if (!message) {
            return res.status(400).json({
                message: language === 'hi' ? "कृपया एक संदेश भेजें" : "Please send a message",
                success: false
            });
        }

        // Process the message and generate response
        const response = await generateChatbotResponse(message, language);

        return res.status(200).json({
            message: "Response generated successfully",
            response: response,
            language: language,
            success: true
        });
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json({
            message: error.message || "Server error",
            success: false
        });
    }
};

// Generate chatbot response using Google Gemini AI
const generateChatbotResponse = async (message, language) => {
    try {
        // Check if Gemini API key is configured
        console.log("🔑 Checking API Key - Exists:", !!process.env.GEMINI_API_KEY);
        console.log("📝 Message:", message);
        console.log("🌐 Language:", language);
        
        if (!process.env.GEMINI_API_KEY) {
            console.warn("⚠️ GEMINI_API_KEY not configured, using fallback responses");
            return generateFallbackResponse(message, language);
        }
        
        console.log("✅ Using Gemini AI for response generation...");

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Create context-aware prompt for SkillSathi
        const systemContext = language === 'hi' 
            ? `आप SkillSathi के लिए एक मददगार AI असिस्टेंट हैं, जो एक जॉब पोर्टल है जो नौकरी चाहने वालों को कंपनियों से जोड़ता है। 
               SkillSathi की विशेषताएं: नौकरी खोज, नौकरी के लिए आवेदन, प्रोफाइल प्रबंधन, मजदूरी ट्रैकिंग, और भुगतान इतिहास।
               उपयोगकर्ता के सवालों का संक्षिप्त, मददगार उत्तर हिंदी में दें। अगर सवाल SkillSathi से संबंधित नहीं है, तो भी सामान्य ज्ञान प्रदान करें।`
            : `You are a helpful AI assistant for SkillSathi, a job portal connecting job seekers with companies.
               SkillSathi features: Job browsing, job applications, profile management, wage tracking, and payment history.
               Provide concise, helpful answers to user questions in English. If the question is not related to SkillSathi, still provide general knowledge.`;

        const prompt = `${systemContext}\n\nUser Question: ${message}\n\nAnswer:`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text;
    } catch (error) {
        console.error("Gemini AI error:", error);
        // Fallback to basic responses if AI fails
        return generateFallbackResponse(message, language);
    }
};

// Fallback response system when AI is not available
const generateFallbackResponse = (message, language) => {
    const lowerMessage = message.toLowerCase();

    // Define responses in both languages
    const responses = {
        en: {
            greeting: "Hello! Welcome to SkillSathi. How can I help you today?",
            jobs: "You can browse jobs by going to the Jobs page. We have opportunities for various skill levels!",
            apply: "To apply for a job, first browse available jobs, then click on the job you're interested in and click 'Apply Now'.",
            profile: "You can update your profile by going to the Profile page. Add your skills, experience, and upload your resume.",
            wages: "You can track your wages and earnings in the Wage Dashboard. We ensure transparent payment tracking.",
            payment: "View your payment history and details in the Payment section. All transactions are secure.",
            signup: "To create an account, click on 'Sign Up', fill in your details, select your role (Job Seeker or Local Head), and submit.",
            login: "To login, enter your email, password, and select the same role you used during signup.",
            help: "I can help you with: Jobs, Applications, Profile, Wages, Payments, Signup, and Login. What would you like to know?",
            company: "If you're a recruiter/local head, you can post jobs, manage applications, and track workers.",
            default: "I'm here to help! You can ask me about jobs, applications, profile, wages, payments, or how to use SkillSathi."
        },
        hi: {
            greeting: "नमस्ते! SkillSathi में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं?",
            jobs: "आप जॉब्स पेज पर जाकर नौकरियां देख सकते हैं। हमारे पास विभिन्न कौशल स्तरों के लिए अवसर हैं!",
            apply: "नौकरी के लिए आवेदन करने के लिए, पहले उपलब्ध नौकरियां देखें, फिर जिस नौकरी में आप रुचि रखते हैं उस पर क्लिक करें और 'अभी आवेदन करें' पर क्लिक करें।",
            profile: "आप प्रोफाइल पेज पर जाकर अपनी प्रोफाइल अपडेट कर सकते हैं। अपने कौशल, अनुभव जोड़ें और अपना रिज्यूमे अपलोड करें।",
            wages: "आप वेज डैशबोर्ड में अपनी मजदूरी और कमाई को ट्रैक कर सकते हैं। हम पारदर्शी भुगतान ट्रैकिंग सुनिश्चित करते हैं।",
            payment: "भुगतान अनुभाग में अपना भुगतान इतिहास और विवरण देखें। सभी लेनदेन सुरक्षित हैं।",
            signup: "खाता बनाने के लिए, 'साइन अप' पर क्लिक करें, अपना विवरण भरें, अपनी भूमिका चुनें (जॉब सीकर या लोकल हेड), और जमा करें।",
            login: "लॉगिन करने के लिए, अपना ईमेल, पासवर्ड दर्ज करें और साइन अप के दौरान उपयोग की गई वही भूमिका चुनें।",
            help: "मैं इनमें आपकी मदद कर सकता हूं: नौकरियां, आवेदन, प्रोफाइल, मजदूरी, भुगतान, साइन अप और लॉगिन। आप क्या जानना चाहेंगे?",
            company: "यदि आप एक रिक्रूटर/लोकल हेड हैं, तो आप नौकरियां पोस्ट कर सकते हैं, आवेदनों का प्रबंधन कर सकते हैं और श्रमिकों को ट्रैक कर सकते हैं।",
            default: "मैं मदद के लिए यहां हूं! आप मुझसे नौकरियों, आवेदनों, प्रोफाइल, मजदूरी, भुगतान, या SkillSathi का उपयोग कैसे करें के बारे में पूछ सकते हैं।"
        }
    };

    const langResponses = responses[language] || responses.en;

    // Check for keywords and return appropriate response
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते') || lowerMessage.includes('हैलो')) {
        return langResponses.greeting;
    } else if (lowerMessage.includes('job') || lowerMessage.includes('नौकरी') || lowerMessage.includes('काम')) {
        return langResponses.jobs;
    } else if (lowerMessage.includes('apply') || lowerMessage.includes('आवेदन')) {
        return langResponses.apply;
    } else if (lowerMessage.includes('profile') || lowerMessage.includes('प्रोफाइल')) {
        return langResponses.profile;
    } else if (lowerMessage.includes('wage') || lowerMessage.includes('मजदूरी') || lowerMessage.includes('salary') || lowerMessage.includes('वेतन')) {
        return langResponses.wages;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('भुगतान')) {
        return langResponses.payment;
    } else if (lowerMessage.includes('signup') || lowerMessage.includes('register') || lowerMessage.includes('साइन अप')) {
        return langResponses.signup;
    } else if (lowerMessage.includes('login') || lowerMessage.includes('लॉगिन')) {
        return langResponses.login;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('मदद')) {
        return langResponses.help;
    } else if (lowerMessage.includes('company') || lowerMessage.includes('recruiter') || lowerMessage.includes('कंपनी')) {
        return langResponses.company;
    } else {
        return langResponses.default;
    }
};

export default { handleChatQuery };
