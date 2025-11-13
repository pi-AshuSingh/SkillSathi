# 🤖 SkillSathi Multilingual Voice Chatbot

## ✅ Features Implemented

Your SkillSathi application now includes a **powerful multilingual chatbot** with the following features:

### 🌟 Key Features:

1. **✅ Bilingual Support** - English & Hindi (हिंदी)
2. **🎤 Voice Input** - Speech-to-text in both languages
3. **🔊 Voice Output** - Text-to-speech responses in both languages
4. **💬 Chat Interface** - Beautiful, modern chat UI
5. **🌐 Language Switching** - Toggle between English and Hindi instantly
6. **🎯 Context-Aware** - Understands queries about jobs, applications, wages, payments, etc.
7. **📱 Mobile Responsive** - Works on all devices
8. **🎨 Animated UI** - Smooth animations and transitions

---

## 🚀 How to Use the Chatbot

### 1. **Access the Chatbot**
- Look for the **floating purple chat button** at the bottom-right corner of any page
- Click on it to open the chat window

### 2. **Type Your Message**
- Type your question in the chat input
- Press Enter or click the Send button

### 3. **Use Voice Input (🎤)**
- Click the **microphone button** to start voice recognition
- Speak your question clearly
- The chatbot will automatically transcribe your speech
- Press the mic button again to stop recording

### 4. **Switch Language (🌐)**
- Click the **globe icon** in the chat header
- Toggle between English and Hindi
- All responses will be in the selected language
- Voice recognition and speech will adjust automatically

### 5. **Hear Responses (🔊)**
- Bot responses are automatically spoken aloud
- Listen to responses in English or Hindi
- Adjust your device volume as needed

---

## 💡 What You Can Ask

The chatbot can help with:

### 📋 In English:
- "How do I find jobs?"
- "How can I apply for a job?"
- "How do I update my profile?"
- "Tell me about wages"
- "How do I check my payments?"
- "How do I sign up?"
- "Help me login"
- "What is SkillSathi?"

### 📋 In Hindi (हिंदी):
- "मुझे नौकरी कैसे मिलेगी?"
- "नौकरी के लिए आवेदन कैसे करें?"
- "अपनी प्रोफाइल कैसे अपडेट करूं?"
- "मजदूरी के बारे में बताओ"
- "भुगतान कैसे चेक करूं?"
- "साइन अप कैसे करें?"
- "लॉगिन में मदद करो"
- "SkillSathi क्या है?"

---

## 🎤 Voice Commands

### English Voice Commands:
```
"Hello"
"Show me jobs"
"How do I apply?"
"Update profile"
"Check wages"
"Payment history"
"Sign up"
"Login help"
```

### Hindi Voice Commands (हिंदी):
```
"नमस्ते"
"नौकरी दिखाओ"
"आवेदन कैसे करें?"
"प्रोफाइल अपडेट करो"
"मजदूरी चेक करो"
"भुगतान इतिहास"
"साइन अप करो"
"लॉगिन में मदद"
```

---

## 🔧 Technical Details

### Backend API:
- **Endpoint:** `http://localhost:8000/api/v1/chatbot/query`
- **Method:** POST
- **Payload:**
  ```json
  {
    "message": "your question here",
    "language": "en" or "hi"
  }
  ```

### Frontend Component:
- **Location:** `frontend/src/components/Chatbot.jsx`
- **Uses:** Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Supported Browsers:** Chrome, Edge, Safari (with webkit)

### Features Used:
- **Speech Recognition:** `webkitSpeechRecognition` / `SpeechRecognition`
- **Speech Synthesis:** `SpeechSynthesisUtterance`
- **Languages:** `en-US` (English), `hi-IN` (Hindi)

---

## 🎨 UI Components

### Floating Button:
- **Position:** Bottom-right corner
- **Animation:** Bouncing effect
- **Color:** Purple gradient (Indigo → Purple)

### Chat Window:
- **Size:** 384px × 600px
- **Features:**
  - Auto-scrolling messages
  - Typing indicators
  - Timestamp on messages
  - Language toggle button
  - Close button

### Message Bubbles:
- **User Messages:** Purple gradient, right-aligned
- **Bot Messages:** White with border, left-aligned
- **Timestamps:** Small text below each message

---

## ⚙️ Customization

### Adding New Responses:

Edit `backend/controllers/chatbot.controller.js`:

```javascript
const responses = {
  en: {
    yourTopic: "Your English response here",
  },
  hi: {
    yourTopic: "आपका हिंदी उत्तर यहाँ",
  }
};

// Add keyword detection
if (lowerMessage.includes('keyword')) {
  return langResponses.yourTopic;
}
```

### Changing Languages:

To add more languages, update:
1. Language codes in `Chatbot.jsx`
2. Response objects in `chatbot.controller.js`
3. Speech synthesis lang codes

---

## 🐛 Troubleshooting

### Voice Not Working?
1. **Check Browser:** Use Chrome or Edge (best support)
2. **Allow Microphone:** Grant microphone permissions
3. **Check Volume:** Ensure device volume is up
4. **HTTPS:** Voice features work best on HTTPS (or localhost)

### Language Issues?
1. **Clear Browser Cache:** Ctrl+Shift+R / Cmd+Shift+R
2. **Check Language Settings:** Click globe icon to toggle
3. **Reload Page:** Refresh the page

### Chatbot Not Responding?
1. **Backend Running:** Check `http://localhost:8000`
2. **Console Errors:** Open DevTools (F12) and check Console
3. **Network Tab:** Check if API calls are successful

---

## 📱 Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Chat Interface | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ✅ | ✅ | ⚠️ Limited |
| Voice Output | ✅ | ✅ | ✅ | ✅ |
| Hindi Support | ✅ | ✅ | ✅ | ✅ |

**Recommended:** Google Chrome or Microsoft Edge for best experience

---

## 🚀 Quick Start

### 1. Start Backend:
```bash
cd backend
npm run dev
```

### 2. Start Frontend:
```bash
cd frontend
npm run dev
```

### 3. Open Browser:
```
http://localhost:5173
```

### 4. Click Chat Button:
- Look for purple floating button at bottom-right
- Start chatting!

---

## 🎯 Example Conversations

### Example 1 (English):
**You:** "Hello, how do I find jobs?"  
**Bot:** "You can browse jobs by going to the Jobs page. We have opportunities for various skill levels!"

### Example 2 (Hindi):
**You:** "नौकरी के लिए आवेदन कैसे करें?"  
**Bot:** "नौकरी के लिए आवेदन करने के लिए, पहले उपलब्ध नौकरियां देखें, फिर जिस नौकरी में आप रुचि रखते हैं उस पर क्लिक करें और 'अभी आवेदन करें' पर क्लिक करें।"

### Example 3 (Voice):
1. Click microphone button 🎤
2. Say: "How do I check my wages?"
3. Bot responds: "You can track your wages and earnings in the Wage Dashboard. We ensure transparent payment tracking."
4. Response is also spoken aloud! 🔊

---

## 💡 Pro Tips

1. **Use Voice for Faster Interaction:** Speaking is faster than typing!
2. **Switch Languages Mid-Chat:** No need to restart, just click globe icon
3. **Keep Questions Simple:** The bot understands keywords best
4. **Listen While Multitasking:** Enable voice output and do other tasks
5. **Mobile Friendly:** Works great on phones and tablets too!

---

## 📊 Supported Topics

✅ Jobs & Job Search  
✅ Job Applications  
✅ Profile Management  
✅ Wages & Earnings  
✅ Payments & History  
✅ Account Signup  
✅ Login Issues  
✅ General Help  
✅ Company/Recruiter Features  

---

## 🎉 Your Chatbot is Ready!

The multilingual voice chatbot is **fully functional** and ready to use!

**Test it now:**
1. Open `http://localhost:5173`
2. Click the purple chat button
3. Try voice input in English or Hindi
4. Toggle between languages
5. Ask questions and get instant responses!

Enjoy your new AI assistant! 🤖💬🎤
