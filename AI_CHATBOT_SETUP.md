# 🤖 AI-Powered Chatbot Setup Guide

## Overview
Your SkillSathi chatbot now uses **Google Gemini AI** to answer ANY type of question - not just about SkillSathi! It can answer general knowledge questions, provide coding help, explain concepts, and much more, just like ChatGPT.

## ✨ Features
- **Universal Knowledge**: Answers ANY question (SkillSathi-related or not)
- **Voice Input**: Speak your questions using microphone
- **Voice Output**: Responses are spoken aloud
- **Bilingual**: Works in English and Hindi
- **Smart Context**: Knows about SkillSathi features when relevant
- **Fallback System**: Works even without API key (limited responses)

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Get Your Free Gemini API Key

1. **Visit Google AI Studio**:
   - Go to: https://makersuite.google.com/app/apikey
   - Or: https://aistudio.google.com/app/apikey

2. **Sign in with Google Account**
   - Use any Gmail account (free)

3. **Create API Key**:
   - Click **"Create API Key"** button
   - Select **"Create API key in new project"** (recommended)
   - Copy the generated API key (starts with `AIza...`)

4. **Important**: Keep this key private! Don't share it publicly.

### Step 2: Add API Key to Your Project

Open the file: `backend/.env`

Replace this line:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual API key:
```
GEMINI_API_KEY=AIzaSyC-your-actual-key-here-123456
```

**Save the file!**

### Step 3: Restart Backend Server

```bash
cd backend
npm run dev
```

That's it! Your AI chatbot is now ready! 🎉

---

## 🎯 How to Use

### 1. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 2. Open in Browser
- Navigate to: http://localhost:5173
- Look for purple chat button at bottom-right corner

### 3. Chat with AI

**Click the floating chat button** 💬

#### Text Chat Examples:

**SkillSathi Questions:**
- "How do I apply for a job?"
- "What is wage tracking?"
- "How do I update my profile?"

**General Knowledge:**
- "What is artificial intelligence?"
- "Explain quantum physics"
- "Write a Python function to sort an array"
- "What's the capital of France?"
- "How does photosynthesis work?"

**Bilingual (Hindi):**
- Click the 🌐 globe icon to switch to Hindi
- "कृत्रिम बुद्धिमत्ता क्या है?"
- "नौकरी के लिए कैसे आवेदन करें?"

### 4. Voice Features

#### Speak Your Question:
1. Click the **🎤 microphone icon**
2. Speak your question clearly
3. Wait for transcription
4. Message sends automatically

#### Hear the Response:
- Every response is automatically spoken aloud!
- Uses natural text-to-speech
- Adjusts language automatically (English/Hindi)

---

## 🔧 Troubleshooting

### Issue: "GEMINI_API_KEY not configured" in console

**Solution**: 
- Make sure you added the API key to `backend/.env`
- Restart the backend server
- Check for typos in the key

**Fallback**: Even without API key, chatbot works with basic responses!

### Issue: Voice not working

**Solution**:
- Use Chrome or Edge browser (best support)
- Allow microphone permissions when prompted
- Check browser console for errors
- Ensure you're on HTTPS or localhost

### Issue: Hindi voice recognition not accurate

**Solution**:
- Speak slowly and clearly
- Use simpler Hindi words
- Switch to text input for complex questions
- Google's Hindi recognition improves over time

### Issue: API Rate Limits

**Solution**:
- Free tier: 60 requests per minute
- If exceeded, wait 1 minute
- Or upgrade to paid plan (optional)
- Fallback responses work without API

---

## 💡 Advanced Tips

### 1. Context-Aware Responses
The AI knows about SkillSathi automatically:
- "How does this job portal work?" → Gets SkillSathi-specific answer
- "What features are available?" → Lists SkillSathi features

### 2. Multi-Turn Conversations
Ask follow-up questions:
```
You: "What is React?"
AI: [Explains React]
You: "How is it different from Vue?"
AI: [Compares React and Vue]
```

### 3. Code Examples
```
You: "Write a function to validate email in JavaScript"
AI: [Provides working code]
```

### 4. Language Mixing
You can type in English and get responses in Hindi (or vice versa) by toggling the language button!

---

## 🎨 Customization

### Change AI Model (Optional)

Edit `backend/controllers/chatbot.controller.js`:

```javascript
// Current: gemini-pro (fast, general purpose)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Options:
// - "gemini-pro": Fast responses, general knowledge
// - "gemini-1.5-pro": More accurate, slower (if available)
```

### Modify System Context

Edit the `systemContext` in `chatbot.controller.js` to change how the AI behaves:

```javascript
const systemContext = `You are a helpful assistant for SkillSathi...
Add your custom instructions here...`;
```

---

## 📊 API Usage & Limits

### Free Tier (Default)
- **60 requests per minute**
- **1,500 requests per day**
- Perfect for development and small-scale use

### If You Need More
1. Visit: https://console.cloud.google.com/
2. Enable billing (pay-as-you-go)
3. Gemini Pro pricing is very affordable

**Note**: For most users, free tier is more than enough!

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep API key in `.env` file only
- Add `.env` to `.gitignore`
- Use environment variables in production
- Regenerate key if exposed

### ❌ DON'T:
- Commit API keys to GitHub
- Share keys publicly
- Hardcode keys in source files
- Use same key for multiple projects

---

## 🧪 Testing Checklist

Test these scenarios to verify everything works:

- [ ] Chatbot button appears on homepage
- [ ] Can type and send messages
- [ ] Receives AI-powered responses
- [ ] Can ask SkillSathi questions
- [ ] Can ask general knowledge questions
- [ ] Microphone button works
- [ ] Speech recognition transcribes correctly
- [ ] Responses are spoken aloud
- [ ] Language toggle switches English ↔ Hindi
- [ ] Hindi voice input works
- [ ] Hindi voice output works
- [ ] Fallback works without API key

---

## 📚 Example Conversations

### Example 1: Job Seeker Help
```
User: "I'm new to SkillSathi. How do I get started?"
AI: "Welcome to SkillSathi! Here's how to get started:
     1. Create an account (Sign Up)
     2. Complete your profile with skills
     3. Browse available jobs
     4. Apply for positions that match your skills
     5. Track applications and wages in your dashboard
     
     Would you like help with any specific step?"
```

### Example 2: General Knowledge
```
User: "Explain machine learning in simple terms"
AI: "Machine learning is a type of artificial intelligence where 
     computers learn from data instead of being explicitly programmed.
     
     Simple analogy: Just like a child learns to recognize animals 
     by seeing many examples, machine learning models learn patterns 
     from data examples.
     
     Three main types:
     1. Supervised Learning (learning with labeled examples)
     2. Unsupervised Learning (finding patterns in unlabeled data)
     3. Reinforcement Learning (learning through trial and error)"
```

### Example 3: Bilingual Support
```
User: "नौकरी के लिए आवेदन कैसे करें?"
AI: "नौकरी के लिए आवेदन करने के लिए:
     1. Jobs पेज पर जाएं
     2. अपनी पसंद की नौकरी पर क्लिक करें
     3. 'Apply Now' बटन पर क्लिक करें
     4. अपना विवरण भरें
     5. सबमिट करें
     
     क्या आपको और मदद चाहिए?"
```

---

## 🆘 Need Help?

### Resources:
- **Google Gemini Docs**: https://ai.google.dev/docs
- **API Reference**: https://ai.google.dev/api/rest
- **Troubleshooting**: Check browser console (F12)

### Common Questions:

**Q: Is the API key free?**
A: Yes! Google provides generous free tier for Gemini API.

**Q: What if I don't want to use AI?**
A: The chatbot works with fallback responses even without API key!

**Q: Can I use OpenAI instead?**
A: Yes, but you'll need to modify the controller code. Gemini is free and powerful!

**Q: Does voice work on mobile?**
A: Voice input works on Android Chrome. iOS Safari has limited support.

**Q: How do I deploy to production?**
A: Use environment variables for API key. Never hardcode it!

---

## 🎉 You're All Set!

Your chatbot can now:
✅ Answer ANY question (not just SkillSathi-related)
✅ Understand voice commands
✅ Speak responses aloud
✅ Work in English and Hindi
✅ Provide intelligent, context-aware answers

**Enjoy your AI-powered assistant!** 🚀

---

## 📝 Quick Reference

| Feature | How to Use |
|---------|-----------|
| Open Chat | Click purple button (bottom-right) |
| Type Message | Enter text and press Send |
| Voice Input | Click 🎤, speak, wait |
| Voice Output | Automatic for all responses |
| Switch Language | Click 🌐 globe icon |
| Close Chat | Click X button |

**API Key Location**: `backend/.env` → `GEMINI_API_KEY=...`

**Get API Key**: https://makersuite.google.com/app/apikey
