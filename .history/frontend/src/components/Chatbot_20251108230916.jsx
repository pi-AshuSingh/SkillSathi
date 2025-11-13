import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Mic, MicOff, Send, X, Volume2, Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import axios from 'axios';
import { CHATBOT_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isListening, setIsListening] = useState(false);
    const [language, setLanguage] = useState('en'); // 'en' or 'hi'
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputMessage(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                toast.error(language === 'hi' ? 'वॉयस पहचान त्रुटि' : 'Voice recognition error');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }

        // Initial greeting
        if (messages.length === 0) {
            const greeting = language === 'hi' 
                ? 'नमस्ते! SkillSathi में आपका स्वागत है। मैं आपकी कैसे मदद कर सकता हूं?' 
                : 'Hello! Welcome to SkillSathi. How can I help you today?';
            setMessages([{ text: greeting, sender: 'bot', timestamp: new Date() }]);
        }
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Update language for speech recognition
    useEffect(() => {
        if (recognitionRef.current) {
            recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        }
    }, [language]);

    const toggleListening = () => {
        if (!recognitionRef.current) {
            toast.error(language === 'hi' ? 'वॉयस पहचान समर्थित नहीं है' : 'Voice recognition not supported');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const speakResponse = (text) => {
        if ('speechSynthesis' in window) {
            // Cancel any ongoing speech
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
            utterance.rate = 0.9;
            utterance.pitch = 1;
            
            window.speechSynthesis.speak(utterance);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        
        if (!inputMessage.trim()) return;

        const userMessage = {
            text: inputMessage,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await axios.post(`${CHATBOT_API_END_POINT}/query`, {
                message: inputMessage,
                language: language
            });

            if (response.data.success) {
                const botMessage = {
                    text: response.data.response,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
                
                // Speak the response
                speakResponse(response.data.response);
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMsg = language === 'hi' 
                ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।' 
                : 'Sorry, something went wrong. Please try again.';
            setMessages(prev => [...prev, { text: errorMsg, sender: 'bot', timestamp: new Date() }]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleLanguage = () => {
        const newLang = language === 'en' ? 'hi' : 'en';
        setLanguage(newLang);
        const langMessage = newLang === 'hi' 
            ? 'भाषा हिंदी में बदल दी गई है' 
            : 'Language switched to English';
        toast.success(langMessage);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className='fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center z-50 animate-bounce'
                >
                    <MessageCircle className='w-8 h-8' />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className='fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border-2 border-indigo-200'>
                    {/* Header */}
                    <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                            <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center'>
                                <MessageCircle className='w-6 h-6 text-indigo-600' />
                            </div>
                            <div>
                                <h3 className='font-bold text-lg'>SkillSathi Bot</h3>
                                <p className='text-xs opacity-90'>
                                    {language === 'hi' ? 'ऑनलाइन' : 'Online'}
                                </p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <button
                                onClick={toggleLanguage}
                                className='p-2 hover:bg-white/20 rounded-full transition-colors'
                                title={language === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
                            >
                                <Globe className='w-5 h-5' />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className='p-2 hover:bg-white/20 rounded-full transition-colors'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${
                                        msg.sender === 'user'
                                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                                    }`}
                                >
                                    <p className='text-sm whitespace-pre-wrap'>{msg.text}</p>
                                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                                        {formatTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className='flex justify-start'>
                                <div className='bg-white border border-gray-200 p-3 rounded-2xl rounded-bl-none shadow-sm'>
                                    <div className='flex gap-1'>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
                                        <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className='p-4 border-t border-gray-200 bg-white rounded-b-2xl'>
                        <div className='flex items-center gap-2'>
                            <button
                                type="button"
                                onClick={toggleListening}
                                className={`p-3 rounded-full transition-all ${
                                    isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {isListening ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
                            </button>
                            <Input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                placeholder={language === 'hi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                                className='flex-1 border-2 border-gray-200 focus:border-indigo-500 rounded-full px-4'
                                disabled={isListening || isLoading}
                            />
                            <Button
                                type="submit"
                                disabled={!inputMessage.trim() || isLoading}
                                className='p-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-full'
                            >
                                <Send className='w-5 h-5' />
                            </Button>
                        </div>
                        <p className='text-xs text-gray-500 mt-2 text-center'>
                            {language === 'hi' 
                                ? '🎤 बोलने के लिए माइक बटन दबाएं' 
                                : '🎤 Press mic button to speak'}
                        </p>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
