import { useState, useRef, useEffect } from 'react';
import { 
  Send, Bot, User, Sparkles, Trash2, Loader2, 
  Settings, History, Home, Bell, ShieldCheck, 
  Bolt, Brain, QrCode, Shield, Network, 
  Gauge, Thermometer, Code2, Cpu,
  Terminal, Lightbulb, BookOpen, Activity,
  Coins, Paperclip, Cloud, ChevronRight,
  Fingerprint, LockOpen, Eye, ShieldAlert,
  MessageSquare, Mic, MicOff,
  ArrowLeft, Download, Globe, Camera, Edit2, Check, X, Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { geminiService } from './services/geminiService';
import { Message, Screen, ChatMode } from './types';
import { QUICK_REPLIES } from './constants';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HistoryScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  messages: Message[];
}

interface ChatScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  chatMode: ChatMode;
  setChatMode: React.Dispatch<React.SetStateAction<ChatMode>>;
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  input: string;
  setInput: (input: string) => void;
  handleSend: (overrideInput?: string) => void;
  startListening: (onResult?: (text: string) => void) => void;
  isListening: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  selectedFile: { file: File; preview: string } | null;
  removeSelectedFile: () => void;
  clearChat: () => void;
  chatInputRef: React.RefObject<HTMLTextAreaElement>;
  suggestions: string[];
}

interface SettingsScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  theme: 'SYSTEM' | 'DARK' | 'LIGHT';
  setTheme: (theme: 'SYSTEM' | 'DARK' | 'LIGHT') => void;
  language: string;
  setLanguage: (lang: string) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
  neuralMemory: boolean;
  setNeuralMemory: (mem: boolean) => void;
  chatHistory: boolean;
  setChatHistory: (hist: boolean) => void;
  activeSettingsTab: 'general' | 'personalization' | 'speech' | 'data';
  setActiveSettingsTab: (tab: 'general' | 'personalization' | 'speech' | 'data') => void;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('splash');
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  const [messagesByMode, setMessagesByMode] = useState<Record<ChatMode, Message[]>>(() => {
    const saved = localStorage.getItem('abhishya_messages_by_mode');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    return {
      standard: [
        {
          id: 'std-1',
          role: 'assistant',
          content: 'Hello, I am Abhishya AI. How can I assist you today?',
          timestamp: Date.now(),
        },
      ],
      friend: [
        {
          id: 'fr-1',
          role: 'assistant',
          content: 'Hey! Main Abhishya AI hoon. Kya haal hai yaar? Aaj kya explore karna chahte ho?',
          timestamp: Date.now(),
        },
      ],
      mixed: [
        {
          id: 'mx-1',
          role: 'assistant',
          content: 'Advanced Neural Uplink established. Mixed tools online. I am ready to assist with search, generation, and complex analysis. What is our objective?',
          timestamp: Date.now(),
        },
      ],
      coding: [
        {
          id: 'cd-1',
          role: 'assistant',
          content: 'DevOps Module Online. I am ready to assist with code analysis, debugging, and architectural patterns. What are we building today?',
          timestamp: Date.now(),
        },
      ],
      business: [
        {
          id: 'bs-1',
          role: 'assistant',
          content: 'Strategic Intelligence Module Active. Market synthesis and growth simulations ready. What is your business objective?',
          timestamp: Date.now(),
        },
      ],
      study: [
        {
          id: 'st-1',
          role: 'assistant',
          content: 'Learning Hub established. I am ready to help you extract knowledge and master new subjects. What shall we learn today?',
          timestamp: Date.now(),
        },
      ],
    };
  });

  const [theme, setTheme] = useState<'SYSTEM' | 'DARK' | 'LIGHT'>(() => (localStorage.getItem('abhishya_theme') as any) || 'DARK');
  const [language, setLanguage] = useState(() => localStorage.getItem('abhishya_language') || 'ENGLISH (US)');
  const [customInstructions, setCustomInstructions] = useState(() => localStorage.getItem('abhishya_instructions') || '');
  const [neuralMemory, setNeuralMemory] = useState(() => localStorage.getItem('abhishya_memory') !== 'false');
  const [chatHistory, setChatHistory] = useState(() => localStorage.getItem('abhishya_history') !== 'false');
  
  const [userName, setUserName] = useState(() => localStorage.getItem('abhishya_user_name') || 'Commander Abhishya');
  const [userAvatar, setUserAvatar] = useState(() => localStorage.getItem('abhishya_user_avatar') || 'https://picsum.photos/seed/commander/200/200');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userName);
  useEffect(() => {
    if (chatHistory) {
      localStorage.setItem('abhishya_messages_by_mode', JSON.stringify(messagesByMode));
    }
  }, [messagesByMode, chatHistory]);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState<'general' | 'personalization' | 'speech' | 'data'>('general');
  const profilePicInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('abhishya_theme', theme);
    const root = window.document.documentElement;
    
    const applyTheme = (t: 'DARK' | 'LIGHT') => {
      if (t === 'DARK') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'SYSTEM') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'DARK' : 'LIGHT';
      applyTheme(systemTheme);
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches ? 'DARK' : 'LIGHT');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('abhishya_user_name', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('abhishya_user_avatar', userAvatar);
  }, [userAvatar]);

  const handleProfilePicSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const messages = messagesByMode[chatMode];
  
  const setMessages = (updater: Message[] | ((prev: Message[]) => Message[])) => {
    setMessagesByMode(prev => {
      const currentMessages = prev[chatMode];
      const nextMessages = typeof updater === 'function' ? updater(currentMessages) : updater;
      return { ...prev, [chatMode]: nextMessages };
    });
  };
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{ file: File; preview: string } | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          file,
          preview: reader.result as string
        });
        // If we are on home screen, navigate to chat to show the attachment
        if (currentScreen === 'home') {
          setCurrentScreen('chat');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const startListening = (onResult?: (text: string) => void) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (onResult) {
        onResult(transcript);
      } else {
        if (currentScreen === 'chat') {
          handleSend(transcript);
        } else {
          setInput(transcript);
        }
      }
    };

    recognition.start();
  };

  // Splash screen effect
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('home');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (currentScreen === 'chat') {
      scrollToBottom();
    }
  }, [messagesByMode, chatMode, currentScreen]);

  // Remove the old greeting effect as greetings are now initialized per mode
  
  useEffect(() => {
    if (currentScreen === 'chat' && pendingMessage) {
      const msg = pendingMessage;
      setPendingMessage(null);
      handleSend(msg);
    }
    if (currentScreen === 'chat') {
      setTimeout(() => chatInputRef.current?.focus(), 100);
    }
  }, [currentScreen, pendingMessage]);

  const handleSend = async (overrideInput?: string) => {
    const messageContent = overrideInput || input;
    if ((!messageContent.trim() && !selectedFile) || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      role: 'user',
      content: messageContent.trim(),
      timestamp: Date.now(),
    };

    if (selectedFile) {
      userMessage.attachment = {
        name: selectedFile.file.name,
        url: selectedFile.preview,
        type: selectedFile.file.type
      };
    }

    setMessages((prev) => [...prev, userMessage]);
    if (!overrideInput) setInput('');
    setSuggestions([]); // Clear suggestions when sending
    const currentFile = selectedFile;
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setIsLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const assistantMessageId = `assistant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

      // Check for image generation request in mixed mode
      const isImageRequest = chatMode === 'mixed' && !currentFile && (
        messageContent.toLowerCase().includes('generate image') || 
        messageContent.toLowerCase().includes('create image') || 
        messageContent.toLowerCase().includes('draw') ||
        messageContent.toLowerCase().includes('imagine')
      );

      if (isImageRequest) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content: 'Initializing neural rendering engine... Generating image based on your prompt.',
            timestamp: Date.now(),
          },
        ]);
        
        try {
          const imageUrl = await geminiService.generateImage(messageContent);
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: 'Neural rendering complete. Here is the visualization you requested:', image: imageUrl } : msg
            )
          );
        } catch (err) {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: 'Neural rendering failed. Error in image generation module.' } : msg
            )
          );
        }
        setIsLoading(false);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '',
          timestamp: Date.now(),
        },
      ]);

      if (chatMode === 'mixed' || currentFile) {
        let imageAttachment;
        if (currentFile && currentFile.file.type.startsWith('image/')) {
          imageAttachment = {
            data: currentFile.preview.split(',')[1],
            mimeType: currentFile.file.type
          };
        }

        const response = await geminiService.sendMessage(userMessage.content, history, chatMode, imageAttachment);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: response.text, groundingUrls: response.groundingUrls } : msg
          )
        );
      } else {
        let fullResponse = '';
        const stream = geminiService.sendMessageStream(userMessage.content, history, chatMode);

        for await (const chunk of stream) {
          fullResponse += chunk;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
            )
          );
        }
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error?.message || 'I apologize, but I encountered an error. Please try again.';
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: errorMessage.includes('API_KEY') ? 'Error: GEMINI_API_KEY is missing or invalid.' : 'I apologize, but I encountered an error. Please try again.',
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
      
      // Generate dynamic suggestions after response
      try {
        const history = messagesByMode[chatMode].map(m => ({ role: m.role, content: m.content }));
        const newSuggestions = await geminiService.generateSuggestions(history, chatMode);
        setSuggestions(newSuggestions);
      } catch (err) {
        console.error('Failed to generate suggestions:', err);
      }
    }
  };

  const clearChat = () => {
    let greeting = 'Hello, I am Abhishya AI. How can I assist you today?';
    if (chatMode === 'friend') {
      greeting = 'Hey! Main Abhishya AI hoon. Kya haal hai yaar? Aaj kya explore karna chahte ho?';
    } else if (chatMode === 'mixed') {
      greeting = 'Advanced Neural Uplink established. Mixed tools online. I am ready to assist with search, generation, and complex analysis. What is our objective?';
    } else if (chatMode === 'coding') {
      greeting = 'DevOps Module Online. I am ready to assist with code analysis, debugging, and architectural patterns. What are we building today?';
    } else if (chatMode === 'business') {
      greeting = 'Strategic Intelligence Module Active. Market synthesis and growth simulations ready. What is your business objective?';
    } else if (chatMode === 'study') {
      greeting = 'Learning Hub established. I am ready to help you extract knowledge and master new subjects. What shall we learn today?';
    }
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: greeting,
        timestamp: Date.now(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors duration-300">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileSelect} 
        className="hidden" 
      />
      
      {/* Overlays (Outside screen transition AnimatePresence) */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <motion.div 
            key="profile-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              key="profile-modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white dark:bg-background-dark border border-primary/30 dark:border-cyber-green/30 rounded-2xl overflow-hidden shadow-2xl shadow-primary/20 dark:shadow-cyber-green/20"
            >
              <div className="p-8 flex flex-col items-center gap-8">
                <div className="relative group/avatar">
                  <div className="size-40 rounded-full border-4 border-primary dark:border-cyber-green p-1 glow-border relative z-10 overflow-hidden bg-white dark:bg-background-dark">
                    <img className="w-full h-full object-cover" src={userAvatar} referrerPolicy="no-referrer" />
                  </div>
                  <button 
                    onClick={() => profilePicInputRef.current?.click()}
                    className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 opacity-0 group-hover/avatar:opacity-100 transition-opacity rounded-full"
                  >
                    <Camera className="text-white" size={40} />
                  </button>
                  <input 
                    type="file" 
                    ref={profilePicInputRef} 
                    onChange={handleProfilePicSelect} 
                    accept="image/*"
                    className="hidden" 
                  />
                </div>

                <div className="w-full space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-primary dark:text-cyber-green uppercase tracking-[0.3em] font-mono">Neural Identity</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="text"
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="flex-1 bg-slate-100 dark:bg-black/50 border border-slate-200 dark:border-cyber-green/20 rounded-xl px-4 py-3 text-xl font-bold text-slate-900 dark:text-cyber-green focus:outline-none focus:border-primary/50 dark:focus:border-cyber-green/50 transition-all font-mono uppercase tracking-tight"
                        placeholder="Enter Callsign"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button 
                      onClick={() => { setIsProfileModalOpen(false); setTempName(userName); }}
                      className="py-3 rounded-xl border border-slate-200 dark:border-cyber-green/10 text-slate-500 dark:text-cyber-green/40 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-cyber-green/5 transition-all font-mono"
                    >
                      Abort
                    </button>
                    <button 
                      onClick={() => { saveName(); setIsProfileModalOpen(false); }}
                      className="py-3 rounded-xl bg-primary dark:bg-cyber-green text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,65,0.4)] font-mono"
                    >
                      Sync
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isListening && (
          <motion.div 
            key="voice-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 dark:bg-cyber-green/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="relative flex items-center justify-center size-32 rounded-full border-2 border-primary/30 dark:border-cyber-green/30 bg-black/80 shadow-2xl shadow-primary/20 dark:shadow-cyber-green/20">
                <Mic size={48} className="text-primary dark:text-cyber-green animate-bounce" />
              </div>
              <div className="mt-8 flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={`voice-bar-${i}`}
                    animate={{ 
                      height: [10, 30, 10],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 0.5,
                      delay: i * 0.1
                    }}
                    className="w-1 bg-primary dark:bg-cyber-green rounded-full shadow-[0_0_10px_rgba(0,255,65,0.5)]"
                  />
                ))}
              </div>
            </div>
            <p className="mt-8 text-white dark:text-cyber-green font-mono tracking-[0.3em] uppercase text-xs animate-pulse">
              Listening to Neural Command...
            </p>
            <button 
              onClick={() => setIsListening(false)}
              className="mt-12 px-6 py-2 rounded-full border border-white/20 dark:border-cyber-green/20 text-white/60 dark:text-cyber-green/40 hover:text-white dark:hover:text-cyber-green hover:border-white/40 dark:hover:border-cyber-green/40 transition-all text-[10px] uppercase tracking-widest font-mono"
            >
              Abort
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentScreen === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SplashScreen />
          </motion.div>
        )}
        {currentScreen === 'home' && (
          <motion.div key="home" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HomeScreen 
              setCurrentScreen={setCurrentScreen}
              setIsProfileModalOpen={setIsProfileModalOpen}
              userAvatar={userAvatar}
              userName={userName}
              input={input}
              setInput={setInput}
              setChatMode={setChatMode}
              setPendingMessage={setPendingMessage}
              fileInputRef={fileInputRef}
              startListening={startListening}
              isListening={isListening}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </motion.div>
        )}
        {currentScreen === 'chat' && (
          <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <ChatScreen 
              setCurrentScreen={setCurrentScreen}
              chatMode={chatMode}
              setChatMode={setChatMode}
              messages={messages}
              isLoading={isLoading}
              messagesEndRef={messagesEndRef}
              input={input}
              setInput={setInput}
              handleSend={handleSend}
              startListening={startListening}
              isListening={isListening}
              fileInputRef={fileInputRef}
              selectedFile={selectedFile}
              removeSelectedFile={removeSelectedFile}
              clearChat={clearChat}
              chatInputRef={chatInputRef}
              suggestions={suggestions}
            />
          </motion.div>
        )}
        {currentScreen === 'history' && (
          <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <HistoryScreen 
              setCurrentScreen={setCurrentScreen}
              messages={messages}
            />
          </motion.div>
        )}
        {currentScreen === 'settings' && (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <SettingsScreen 
              setCurrentScreen={setCurrentScreen}
              theme={theme}
              setTheme={setTheme}
              language={language}
              setLanguage={setLanguage}
              customInstructions={customInstructions}
              setCustomInstructions={setCustomInstructions}
              neuralMemory={neuralMemory}
              setNeuralMemory={setNeuralMemory}
              chatHistory={chatHistory}
              setChatHistory={setChatHistory}
              activeSettingsTab={activeSettingsTab}
              setActiveSettingsTab={setActiveSettingsTab}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
const SplashScreen = () => (
  <div className="relative flex min-h-screen w-full flex-col items-center justify-center holographic-grid bg-background-light dark:bg-background-dark transition-colors duration-300 overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyber-green/10 blur-[120px] rounded-full"></div>
    </div>
    <div className="z-10 flex flex-col items-center w-full max-w-[960px] px-6">
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl opacity-50 scale-125"></div>
        <div className="relative w-48 h-48 md:w-64 md:h-64 flex items-center justify-center rounded-full border border-primary/40 dark:border-cyber-green/40 bg-white/80 dark:bg-black/80 backdrop-blur-xl shadow-[0_0_60px_rgba(236,91,19,0.4)] dark:shadow-[0_0_60px_rgba(0,255,65,0.2)]">
          <div className="absolute inset-4 border border-cyber-green/30 rounded-full"></div>
          <div className="absolute inset-8 border border-accent-red/20 rounded-full border-dashed"></div>
          <div className="flex flex-col items-center justify-center text-primary">
            <Brain size={80} className="md:w-32 md:h-32" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-4">
              <Bolt size={40} className="md:w-16 md:h-16 text-cyber-green drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]" />
            </div>
          </div>
        </div>
      </div>
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-cyber-green uppercase">
          Abhishya <span className="text-primary drop-shadow-[0_0_15px_rgba(236,91,19,0.5)]">AI</span>
        </h1>
        <p className="text-slate-600 dark:text-cyber-green/60 text-lg md:text-xl font-medium tracking-widest uppercase font-mono">
          System.Initialize(Neural_Assistant)
        </p>
      </div>
      <div className="w-full max-w-md mt-12 flex flex-col gap-3 px-4">
        <div className="flex justify-between items-end">
          <p className="text-primary text-xs font-bold tracking-widest uppercase font-mono">Loading Neural Modules...</p>
          <p className="text-slate-600 dark:text-cyber-green text-xs font-mono">65%</p>
        </div>
        <div className="h-1 w-full bg-primary/10 rounded-full overflow-hidden border border-primary/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '65%' }}
            transition={{ duration: 2 }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(236,91,19,0.8)]"
          />
        </div>
      </div>
    </div>
    <div className="absolute bottom-10 left-0 w-full flex justify-center opacity-20 dark:opacity-40">
      <p className="text-[10px] font-mono text-slate-500 dark:text-cyber-green uppercase tracking-[0.5em]">Secure Terminal Connection Established</p>
    </div>
  </div>
);

interface HomeScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  userAvatar: string;
  userName: string;
  input: string;
  setInput: (input: string) => void;
  setChatMode: (mode: ChatMode) => void;
  setPendingMessage: (msg: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  startListening: (onResult?: (text: string) => void) => void;
  isListening: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const HomeScreen = ({
  setCurrentScreen,
  setIsProfileModalOpen,
  userAvatar,
  userName,
  input,
  setInput,
  setChatMode,
  setPendingMessage,
  fileInputRef,
  startListening,
  isListening,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}: HomeScreenProps) => (
  <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
    <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-background-dark/80 px-4 md:px-6 lg:px-12 py-3 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="size-8 md:size-10 rounded-lg bg-gradient-to-br from-primary to-cyber-green p-[2px] hud-glow-green">
            <div className="w-full h-full bg-white dark:bg-background-dark rounded-[7px] flex items-center justify-center">
              <Bolt className="text-primary dark:text-cyber-green" size={18} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold tracking-tighter text-slate-900 dark:text-cyber-green flex items-center gap-2 uppercase">
              Abhishya <span className="text-primary italic">AI</span>
            </h1>
            <span className="text-[8px] md:text-[10px] text-slate-500 dark:text-cyber-green/60 font-mono tracking-widest uppercase hidden xs:block">Command Center v4.0.2</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentScreen('home')} className="text-xs font-bold uppercase tracking-widest text-primary dark:text-cyber-green border-b-2 border-primary dark:border-cyber-green pb-1">Dashboard</button>
          <button onClick={() => setCurrentScreen('history')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Neural Assets</button>
          <button onClick={() => setCurrentScreen('history')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Archives</button>
          <button onClick={() => setCurrentScreen('settings')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Settings</button>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <button className="size-10 flex items-center justify-center rounded-full border border-primary/30 dark:border-cyber-green/30 text-primary dark:text-cyber-green hover:bg-primary/10 dark:hover:bg-cyber-green/10 transition-all">
            <Bell size={20} />
          </button>
          <div className="h-10 w-[1px] bg-primary/20 dark:bg-cyber-green/20 mx-2 hidden md:block"></div>
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 bg-slate-100 dark:bg-panel-dark/50 p-1 pr-4 rounded-full border border-primary/20 dark:border-cyber-green/20 cursor-pointer hover:bg-slate-200 dark:hover:bg-panel-dark/80 transition-all group"
          >
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden border border-white/20 group-hover:border-primary/50 transition-all">
              <img className="w-full h-full object-cover" src={userAvatar} referrerPolicy="no-referrer" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-slate-900 dark:text-cyber-green group-hover:text-primary dark:group-hover:text-cyber-green transition-colors">{userName.split(' ')[0]}</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-primary/10 dark:border-cyber-green/10 mt-3"
          >
            <div className="flex flex-col gap-4 py-4">
              <button 
                onClick={() => { setCurrentScreen('home'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-3 px-2 py-1 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors text-sm font-bold uppercase tracking-widest font-mono"
              >
                <Home className="w-4 h-4" /> Dashboard
              </button>
              <button 
                onClick={() => { setCurrentScreen('history'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-3 px-2 py-1 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors text-sm font-bold uppercase tracking-widest font-mono"
              >
                <History className="w-4 h-4" /> Neural Assets
              </button>
              <button 
                onClick={() => { setCurrentScreen('settings'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-3 px-2 py-1 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors text-sm font-bold uppercase tracking-widest font-mono"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    <main className="flex-grow flex flex-col p-6 lg:p-12 max-w-7xl mx-auto w-full gap-8 z-10">
      <section className="flex flex-col gap-2 border-l-4 border-primary dark:border-cyber-green pl-4 md:pl-6 py-2">
        <div className="flex items-center gap-2">
          <span className="flex size-2 rounded-full bg-primary dark:bg-cyber-green animate-pulse"></span>
          <p className="text-[9px] md:text-[10px] font-mono text-primary dark:text-cyber-green uppercase tracking-[0.3em]">Neural Link: Stable</p>
        </div>
        <h2 className="text-3xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-cyber-green uppercase italic leading-tight">
          Superhuman Intelligence <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyber-green">at your command</span>
        </h2>
      </section>

      {/* Direct Chat Input */}
      <div className="relative group max-w-3xl w-full">
        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary/50 dark:to-cyber-green/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-white/80 dark:bg-panel-dark/80 hud-border rounded-xl p-1.5 md:p-2 flex items-center gap-1 md:gap-3">
          <div className="pl-2 md:pl-3 text-primary shrink-0">
            <Terminal size={18} />
          </div>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="INITIALIZE COMMAND..." 
            className="bg-transparent border-none focus:outline-none text-slate-900 dark:text-white w-full font-mono text-xs md:text-sm py-2 md:py-3"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (input.trim()) {
                  setChatMode('standard');
                  setPendingMessage(input);
                  setCurrentScreen('chat');
                  setInput('');
                }
              }
            }}
          />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-all shrink-0"
              title="Upload File"
            >
              <Paperclip size={18} />
            </button>
            <button 
              onClick={() => startListening((text) => {
                setChatMode('standard');
                setPendingMessage(text);
                setCurrentScreen('chat');
              })}
              className={cn(
                "p-2 md:p-3 rounded-lg transition-all shrink-0",
                isListening ? "bg-red-500/20 text-red-500 animate-pulse" : "bg-primary/10 dark:bg-cyber-green/10 hover:bg-primary/20 dark:hover:bg-cyber-green/20 text-primary dark:text-cyber-green"
              )}
              title="Voice Command"
            >
              <Mic size={18} />
            </button>
            <button 
              onClick={() => {
                if (input.trim()) {
                  setChatMode('standard');
                  setPendingMessage(input);
                  setCurrentScreen('chat');
                  setInput('');
                }
              }}
              className="bg-primary/10 dark:bg-cyber-green/10 hover:bg-primary/20 dark:hover:bg-cyber-green/20 text-primary dark:text-cyber-green p-2 md:p-3 rounded-lg transition-all active:scale-95 shrink-0"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
        <div onClick={() => { setChatMode('mixed'); setCurrentScreen('chat'); }} className="group relative p-px rounded-xl bg-emerald-500/20 hover:bg-emerald-500/50 transition-all cursor-pointer">
          <div className="bg-panel-dark/90 rounded-[11px] p-6 h-full flex flex-col gap-4 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.05)] overflow-hidden relative">
            <div className="size-12 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:hud-glow-emerald transition-all">
              <Globe size={30} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-emerald-500 transition-colors">Mixed Tools Suite</h3>
              <p className="text-slate-500 dark:text-cyber-green/60 text-xs mt-1 leading-relaxed">Advanced mode with Google Search, Image Generation, and Real-time data processing.</p>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-emerald-500/60 uppercase">Mode: ADV_MIXED</span>
              <ChevronRight size={14} className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        <div onClick={() => { setChatMode('coding'); setCurrentScreen('chat'); }} className="group relative p-px rounded-xl bg-primary/20 hover:bg-primary/50 transition-all cursor-pointer">
          <div className="bg-panel-dark/90 rounded-[11px] p-6 h-full flex flex-col gap-4 border border-primary/30 shadow-[0_0_15px_rgba(236,91,19,0.05)] overflow-hidden relative">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:hud-glow-primary transition-all">
              <Terminal size={30} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-primary transition-colors">Coding Help</h3>
              <p className="text-slate-500 dark:text-cyber-green/60 text-xs mt-1 leading-relaxed">Advanced syntax analysis and architectural pattern generation.</p>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-primary/60 uppercase">Mode: DEV_OPS</span>
              <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        <div onClick={() => { setChatMode('business'); setCurrentScreen('chat'); }} className="group relative p-px rounded-xl bg-slate-400/10 dark:bg-slate-400/5 hover:bg-slate-400/30 dark:hover:bg-slate-400/20 transition-all cursor-pointer">
          <div className="bg-panel-dark/90 rounded-[11px] p-6 h-full flex flex-col gap-4 border border-slate-700 dark:border-cyber-green/10 shadow-md overflow-hidden relative">
            <div className="size-12 rounded-lg bg-slate-700/10 dark:bg-slate-700/20 flex items-center justify-center text-slate-400 group-hover:bg-slate-700/20 dark:hover:bg-slate-700/40 transition-all">
              <Lightbulb size={30} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-slate-100 transition-colors">Business Ideas</h3>
              <p className="text-slate-500 dark:text-cyber-green/60 text-xs mt-1 leading-relaxed">Market synthesis and strategic growth simulations.</p>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-slate-500 dark:text-cyber-green/40 uppercase">Type: STRAT_SYS</span>
              <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        <div onClick={() => { setChatMode('study'); setCurrentScreen('chat'); }} className="group relative p-px rounded-xl bg-primary/20 dark:bg-cyber-green/20 hover:bg-primary/50 dark:hover:bg-cyber-green/50 transition-all cursor-pointer">
          <div className="bg-panel-dark/90 rounded-[11px] p-6 h-full flex flex-col gap-4 border border-primary/30 dark:border-cyber-green/30 shadow-[0_0_15px_rgba(0,255,65,0.05)] overflow-hidden relative">
            <div className="size-12 rounded-lg bg-primary/10 dark:bg-cyber-green/10 flex items-center justify-center text-primary dark:text-cyber-green group-hover:hud-glow-green transition-all">
              <BookOpen size={30} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-primary dark:group-hover:text-cyber-green transition-colors">Study Assistant</h3>
              <p className="text-slate-500 dark:text-cyber-green/60 text-xs mt-1 leading-relaxed">Knowledge extraction and contextual learning modules.</p>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-primary/60 dark:text-cyber-green/60 uppercase">Data: LRN_HUB</span>
              <ChevronRight size={14} className="text-primary dark:text-cyber-green group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
        <div onClick={() => { setChatMode('friend'); setCurrentScreen('chat'); }} className="group relative p-px rounded-xl bg-indigo-500/20 hover:bg-indigo-500/50 transition-all cursor-pointer">
          <div className="bg-panel-dark/90 rounded-[11px] p-6 h-full flex flex-col gap-4 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.05)] overflow-hidden relative">
            <div className="size-12 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:hud-glow-indigo transition-all">
              <Mic size={30} />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg uppercase tracking-tight group-hover:text-indigo-400 transition-colors">Friend Mode</h3>
              <p className="text-slate-500 dark:text-cyber-green/60 text-xs mt-1 leading-relaxed">Casual, friendly conversation with emotional intelligence.</p>
            </div>
            <div className="mt-auto pt-4 flex justify-between items-center">
              <span className="text-[10px] font-mono text-indigo-500/60 uppercase">Vibe: SOCIAL_AI</span>
              <ChevronRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);

// Screen Components

const ChatScreen = ({
  setCurrentScreen,
  chatMode,
  setChatMode,
  messages,
  isLoading,
  messagesEndRef,
  input,
  setInput,
  handleSend,
  startListening,
  isListening,
  fileInputRef,
  selectedFile,
  removeSelectedFile,
  clearChat,
  chatInputRef,
  suggestions
}: ChatScreenProps) => (
  <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="absolute inset-0 scanline pointer-events-none opacity-5"></div>
      <header className="flex items-center justify-between border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 z-10">
        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setCurrentScreen('home')} className="p-1.5 md:p-2 bg-primary/10 dark:bg-cyber-green/10 rounded-lg border border-primary/20 dark:border-cyber-green/20">
            <ArrowLeft className="text-primary dark:text-cyber-green w-5 h-5 md:w-6 md:h-6" />
          </button>
          <div>
            <h1 className="text-sm md:text-xl font-bold tracking-tight text-slate-900 dark:text-cyber-green uppercase tracking-widest">Abhishya <span className="text-primary">AI</span></h1>
            <div className="flex items-center gap-1.5 md:gap-2">
              <span className={cn(
                "size-1.5 md:size-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", 
                chatMode === 'friend' ? "bg-indigo-500" : 
                chatMode === 'mixed' ? "bg-emerald-500" :
                chatMode === 'coding' ? "bg-primary" :
                chatMode === 'business' ? "bg-slate-400 dark:bg-slate-500" :
                chatMode === 'study' ? "bg-primary dark:bg-cyber-green" : "bg-cyber-green"
              )}></span>
              <p className="text-[8px] md:text-[10px] text-slate-600 dark:text-cyber-green/60 font-mono tracking-[0.1em] md:tracking-[0.2em] uppercase truncate max-w-[80px] md:max-w-none">
                {chatMode === 'friend' ? 'Friend' : 
                 chatMode === 'mixed' ? 'Mixed' :
                 chatMode === 'coding' ? 'Coding' :
                 chatMode === 'business' ? 'Strategy' :
                 chatMode === 'study' ? 'Learning' : 'Active'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 md:gap-3">
          <button onClick={() => setCurrentScreen('history')} className="p-1.5 md:p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">
            <History className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>
          {(chatMode === 'standard' || chatMode === 'friend') && (
            <button 
              onClick={() => setChatMode(prev => prev === 'standard' ? 'friend' : 'standard')}
              className={cn(
                "flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full border transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-widest font-mono",
                chatMode === 'friend' 
                  ? "bg-accent-blue/20 border-accent-blue text-accent-blue shadow-[0_0_10px_rgba(0,210,255,0.3)]" 
                  : "bg-slate-100 dark:bg-cyber-green/5 border-slate-200 dark:border-cyber-green/20 text-slate-600 dark:text-cyber-green/80"
              )}
            >
              {chatMode === 'friend' ? <Mic size={12} /> : <MessageSquare size={12} />}
              <span className="hidden xs:inline">{chatMode === 'friend' ? 'Friend' : 'Standard'}</span>
            </button>
          )}
          <button onClick={clearChat} className="p-1.5 md:p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">
            <Trash2 className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>
          <button onClick={() => setCurrentScreen('settings')} className="p-1.5 md:p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">
            <Settings className="w-[18px] h-[18px] md:w-5 md:h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide matrix-bg">
        <div className="max-w-4xl mx-auto space-y-8">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "flex items-start gap-4",
                  message.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div className={cn(
                  "size-10 rounded-full flex items-center justify-center shrink-0",
                  message.role === 'user' 
                    ? "bg-slate-100 dark:bg-cyber-green/10 border border-primary dark:border-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.2)]" 
                    : "bg-gradient-to-br from-indigo-600 to-primary shadow-[0_0_15px_rgba(236,91,19,0.3)]"
                )}>
                  {message.role === 'user' ? <User size={20} className="text-primary dark:text-cyber-green" /> : <Cpu size={20} className="text-white" />}
                </div>
                <div className={cn(
                  "flex flex-col gap-2",
                  message.role === 'user' ? "items-end" : "items-start"
                )}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-600 dark:text-cyber-green/60 tracking-widest uppercase font-mono">
                      {message.role === 'user' ? 'Operator' : 'Abhishya Core'}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase font-mono">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={cn(
                    "p-3 md:p-4 rounded-xl border backdrop-blur-md max-w-[85%] md:max-w-2xl",
                    message.role === 'user' 
                      ? "bg-primary/5 dark:bg-cyber-green/5 border-primary/30 dark:border-cyber-green/30 rounded-tr-none" 
                      : "bg-white/90 dark:bg-black/80 border-slate-200 dark:border-cyber-green/20 rounded-tl-none border-l-2 border-l-primary dark:border-l-cyber-green"
                  )}>
                    {message.attachment && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-slate-200 dark:border-cyber-green/20 bg-slate-50 dark:bg-black/40">
                        {message.attachment.type.startsWith('image/') ? (
                          <img src={message.attachment.url} alt="attachment" className="max-w-full h-auto" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="p-4 flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-primary/10 dark:bg-cyber-green/10 flex items-center justify-center text-primary dark:text-cyber-green">
                              <Paperclip size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-slate-800 dark:text-cyber-green truncate uppercase tracking-wider font-mono">{message.attachment.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase font-mono">ATTACHED_MODULE</p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <div className="markdown-body text-slate-900 dark:text-cyber-green/90 font-mono text-xs">
                      <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    </div>
                    {message.image && (
                      <div className="mt-4 rounded-lg overflow-hidden border border-primary/30 dark:border-cyber-green/30">
                        <img src={message.image} alt="Generated" className="w-full h-auto" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    {message.groundingUrls && message.groundingUrls.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-primary/10 dark:border-cyber-green/10 space-y-2">
                        <p className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest font-mono">Neural Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.groundingUrls.map((url, idx) => (
                            <a 
                              key={idx} 
                              href={url.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-primary/10 dark:bg-cyber-green/10 text-primary dark:text-cyber-green border border-primary/20 dark:border-cyber-green/20 px-2 py-1 rounded hover:bg-primary/20 dark:hover:bg-cyber-green/20 transition-colors font-mono"
                            >
                              {url.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && messages[messages.length - 1].content === '' && (
            <div className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-gradient-to-br from-indigo-600 to-primary flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(236,91,19,0.3)]">
                <Cpu size={20} className="text-white" />
              </div>
              <div className="bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-primary/20 rounded-xl rounded-tl-none p-4 backdrop-blur-md">
                <Loader2 size={18} className="animate-spin text-primary" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      <footer className="p-3 md:p-6 bg-white/90 dark:bg-background-dark/90 border-t border-primary/20 dark:border-cyber-green/20">
        <div className="max-w-4xl mx-auto">
          {/* Quick Replies */}
          {!isLoading && (
            <div className="mb-3 md:mb-4 flex flex-wrap gap-1.5 md:gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {(suggestions.length > 0 ? suggestions : QUICK_REPLIES[chatMode]).map((reply, idx) => (
                <motion.button
                  key={`quick-reply-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSend(reply)}
                  className="whitespace-nowrap px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-primary/5 dark:bg-cyber-green/5 border border-primary/20 dark:border-cyber-green/20 text-[8px] md:text-[10px] font-bold text-primary dark:text-cyber-green uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-cyber-green/10 hover:border-primary/40 dark:hover:border-cyber-green/40 transition-all font-mono shadow-[0_0_10px_rgba(0,255,65,0.1)]"
                >
                  {reply}
                </motion.button>
              ))}
            </div>
          )}

          {selectedFile && (
            <div className="mb-3 md:mb-4 p-2 bg-slate-100 dark:bg-cyber-green/5 border border-slate-200 dark:border-cyber-green/30 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
              {selectedFile.file.type.startsWith('image/') ? (
                <div className="size-10 md:size-12 rounded-lg overflow-hidden border border-white/10 dark:border-cyber-green/20">
                  <img src={selectedFile.preview} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="size-10 md:size-12 rounded-lg bg-primary/10 dark:bg-cyber-green/10 flex items-center justify-center text-primary dark:text-cyber-green">
                  <Paperclip size={18} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[10px] md:text-xs font-bold text-slate-800 dark:text-cyber-green truncate uppercase tracking-wider font-mono">{selectedFile.file.name}</p>
                <p className="text-[8px] md:text-[10px] text-slate-500 dark:text-cyber-green/60 uppercase font-mono">{(selectedFile.file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={removeSelectedFile}
                className="p-2 hover:bg-black/5 dark:hover:bg-cyber-green/10 rounded-full text-slate-600 dark:text-cyber-green/60 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-2 md:gap-4">
            <button className="size-10 md:size-12 rounded-full border-2 border-primary/40 dark:border-cyber-green/40 bg-primary/5 dark:bg-cyber-green/5 flex items-center justify-center text-primary dark:text-cyber-green hover:bg-primary/20 dark:hover:bg-cyber-green/20 transition-all shrink-0">
              <Coins className="w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 md:left-4 flex items-center">
                <Terminal className="text-slate-500 dark:text-cyber-green/40 w-4 h-4 md:w-5 md:h-5" />
              </div>
              <textarea 
                ref={chatInputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                className="w-full bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-cyber-green/30 rounded-xl py-3 md:py-4 pl-10 md:pl-12 pr-16 md:pr-24 text-slate-900 dark:text-cyber-green placeholder:text-slate-600 dark:placeholder:text-cyber-green/30 focus:outline-none focus:ring-1 focus:ring-primary/50 dark:focus:ring-cyber-green/50 focus:border-primary/60 dark:focus:border-cyber-green/60 text-xs md:text-sm font-mono resize-none" 
                placeholder="COMMAND..." 
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <div className="absolute inset-y-0 right-1.5 md:right-2 flex items-center gap-0.5 md:gap-1">
                <button 
                  onClick={() => startListening()}
                  className={cn(
                    "p-1.5 md:p-2 transition-colors",
                    isListening ? "text-red-500 animate-pulse" : "text-slate-500 hover:text-primary"
                  )}
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
                <button className="p-1.5 md:p-2 text-slate-500 hover:text-primary transition-colors hidden xs:block">
                  <Cloud className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 md:p-2 text-slate-500 hover:text-primary dark:hover:text-cyber-green transition-colors"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4 md:w-[18px] md:h-[18px]" />
                </button>
              </div>
            </div>
            <button 
              onClick={() => handleSend()}
              title="Send Message"
              disabled={(!input.trim() && !selectedFile) || isLoading}
              className="bg-primary dark:bg-cyber-green hover:bg-primary/80 dark:hover:bg-cyber-green/80 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black flex items-center justify-center gap-1.5 md:gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all shadow-[0_0_20px_rgba(236,91,19,0.4)] dark:shadow-[0_0_20px_rgba(0,255,65,0.4)] group active:scale-95 shrink-0"
            >
              <span className="hidden sm:inline">Transmit</span>
              <Bolt className="group-hover:translate-x-1 transition-transform w-4 h-4 md:w-[18px] md:h-[18px]" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );

const HistoryScreen = ({ setCurrentScreen, messages }: HistoryScreenProps) => (
  <div className="relative min-h-screen overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300 tech-grid">
      <div className="absolute inset-0 scanline pointer-events-none opacity-10"></div>
      <div className="layout-container flex h-full grow flex-col max-w-5xl mx-auto px-4 md:px-10 z-10">
        <header className="flex items-center justify-between py-4 md:py-8 border-b border-primary/20 dark:border-cyber-green/20">
          <div className="flex items-center gap-3 md:gap-6">
            <button onClick={() => setCurrentScreen('home')} className="group flex items-center justify-center size-10 md:size-12 rounded-full bg-primary/10 dark:bg-cyber-green/10 border border-primary/40 dark:border-cyber-green/40 hover:bg-primary/20 dark:hover:bg-cyber-green/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
              <ArrowLeft className="text-primary dark:text-cyber-green w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div className="flex flex-col">
              <h2 className="text-xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-cyber-green uppercase italic">Neural Archives</h2>
              <p className="text-primary/70 dark:text-cyber-green/60 text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em]">Secure Data Vault // Abhishya AI</p>
            </div>
          </div>
        </header>
        <main className="py-6 md:py-10 space-y-4 md:space-y-6">
          <div className="grid gap-4 md:gap-6">
            {messages.length <= 1 ? (
              <div className="flex flex-col items-center justify-center py-12 md:py-20 text-slate-500 dark:text-cyber-green/20">
                <History className="opacity-20 mb-4 w-8 h-8 md:w-12 md:h-12" />
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] font-bold font-mono text-center">No active logs found in this sector</p>
              </div>
            ) : (
              messages.filter(m => m.role === 'user').map((item) => (
                <div key={item.id} className="group relative flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl bg-white/40 dark:bg-black/60 border border-slate-200 dark:border-cyber-green/20 hover:border-primary/50 dark:hover:border-cyber-green/50 hover:bg-white/60 dark:hover:bg-black/80 transition-all duration-500 overflow-hidden">
                  <div className="relative z-10 w-full md:w-48 aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-cyber-green/20 bg-slate-100 dark:bg-black/50 flex items-center justify-center shrink-0">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                    ) : (
                      <Activity className="text-primary/20 dark:text-cyber-green/20 w-8 h-8 md:w-12 md:h-12" />
                    )}
                  </div>
                  <div className="relative z-10 flex-1 space-y-1 md:space-y-2 w-full">
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] md:text-[10px] font-bold text-primary/60 dark:text-cyber-green/60 tracking-[0.2em] uppercase font-mono">Log ID: #{item.id.slice(-6)}</span>
                      <span className="text-[8px] md:text-[10px] text-slate-500 dark:text-cyber-green/40 font-mono uppercase">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="text-sm md:text-lg font-bold text-slate-900 dark:text-cyber-green group-hover:text-primary dark:group-hover:text-cyber-green transition-colors truncate max-w-md uppercase tracking-tight">{item.content}</h3>
                    <p className="text-slate-600 dark:text-cyber-green/60 text-[10px] md:text-xs leading-relaxed max-w-xl line-clamp-2 font-mono">
                      {messages[messages.findIndex(m => m.id === item.id) + 1]?.content || 'Awaiting response...'}
                    </p>
                  </div>
                  <button onClick={() => setCurrentScreen('chat')} className="relative z-10 flex items-center justify-center size-10 md:size-12 rounded-xl bg-primary dark:bg-cyber-green text-white dark:text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,65,0.4)] shrink-0 self-end md:self-center">
                    <Terminal className="w-5 h-5 md:w-6 md:h-6" />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );

const SettingsScreen = ({
  setCurrentScreen,
  theme,
  setTheme,
  language,
  setLanguage,
  customInstructions,
  setCustomInstructions,
  neuralMemory,
  setNeuralMemory,
  chatHistory,
  setChatHistory,
  activeSettingsTab,
  setActiveSettingsTab
}: SettingsScreenProps) => {
  const tabs = [
      { id: 'general', label: 'General', icon: Settings },
      { id: 'personalization', label: 'Personalization', icon: Brain },
      { id: 'speech', label: 'Speech', icon: Mic },
      { id: 'data', label: 'Data Controls', icon: ShieldCheck },
    ];

    const [tempTheme, setTempTheme] = useState(theme);
    const [tempLanguage, setTempLanguage] = useState(language);
    const [tempInstructions, setTempInstructions] = useState(customInstructions);
    const [tempMemory, setTempMemory] = useState(neuralMemory);
    const [tempHistory, setTempHistory] = useState(chatHistory);
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveSettings = () => {
      setIsSaving(true);
      setTimeout(() => {
        setTheme(tempTheme);
        setLanguage(tempLanguage);
        setCustomInstructions(tempInstructions);
        setNeuralMemory(tempMemory);
        setChatHistory(tempHistory);
        
        localStorage.setItem('abhishya_theme', tempTheme);
        localStorage.setItem('abhishya_language', tempLanguage);
        localStorage.setItem('abhishya_instructions', tempInstructions);
        localStorage.setItem('abhishya_memory', String(tempMemory));
        localStorage.setItem('abhishya_history', String(tempHistory));
        
        setIsSaving(false);
      }, 800);
    };

    return (
      <div className="relative min-h-screen w-full flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300 circuit-bg">
        <div className="absolute inset-0 scanline pointer-events-none opacity-10"></div>
        <header className="flex items-center justify-between border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-black/60 backdrop-blur-md px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50">
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setCurrentScreen('home')} className="p-1.5 md:p-2 bg-primary/10 dark:bg-cyber-green/10 rounded-lg border border-primary/20 dark:border-cyber-green/20">
              <ArrowLeft className="text-primary dark:text-cyber-green w-5 h-5 md:w-6 md:h-6" />
            </button>
            <div>
              <h2 className="text-sm md:text-xl font-bold tracking-tight uppercase italic text-slate-900 dark:text-cyber-green">System <span className="text-primary">Settings</span></h2>
              <p className="text-[8px] md:text-[10px] text-primary/60 dark:text-cyber-green/60 tracking-[0.1em] md:tracking-[0.2em] font-bold uppercase font-mono">CONFIGURATION INTERFACE V.4.0</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-3">
            <button 
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-primary dark:bg-cyber-green text-white dark:text-black rounded-lg font-bold text-[8px] md:text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:scale-105 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin w-3 h-3 md:w-3.5 md:h-3.5" /> : <Check className="w-3 h-3 md:w-3.5 md:h-3.5" />}
              <span>{isSaving ? 'Syncing...' : 'Save'}</span>
            </button>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col md:flex-row max-w-[1200px] mx-auto w-full p-4 md:p-6 lg:p-10 gap-6 md:gap-8 z-10">
          {/* Sidebar Tabs */}
          <aside className="w-full md:w-64 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSettingsTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl border transition-all uppercase text-[8px] md:text-[10px] font-bold tracking-widest font-mono whitespace-nowrap md:whitespace-normal",
                  activeSettingsTab === tab.id 
                    ? "bg-primary/20 dark:bg-cyber-green/20 border-primary dark:border-cyber-green text-primary dark:text-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.2)]" 
                    : "bg-white/50 dark:bg-black/40 border-slate-200 dark:border-cyber-green/10 text-slate-500 dark:text-cyber-green/40 hover:bg-white/80 dark:hover:bg-black/60"
                )}
              >
                <tab.icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </aside>

          {/* Tab Content */}
          <div className="flex-1 bg-white dark:bg-black/60 backdrop-blur-sm border border-slate-200 dark:border-cyber-green/20 rounded-2xl p-4 md:p-8 min-h-[400px] md:min-h-[500px] flex flex-col">
            <div className="flex-1">
              <AnimatePresence mode="wait">
                {activeSettingsTab === 'general' && (
                  <motion.div 
                    key="general"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                        <Settings className="text-primary dark:text-cyber-green" size={20} />
                        General Configuration
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">Theme Interface</p>
                            <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Select visual matrix style</p>
                          </div>
                          <select 
                            value={tempTheme}
                            onChange={(e) => setTempTheme(e.target.value as any)}
                            className="bg-white dark:bg-black border border-slate-300 dark:border-cyber-green/20 rounded-lg px-3 py-2 text-[10px] font-bold text-primary dark:text-cyber-green focus:outline-none cursor-pointer font-mono"
                          >
                            <option value="SYSTEM">SYSTEM DEFAULT</option>
                            <option value="DARK">CYBER DARK</option>
                            <option value="LIGHT">CLEAN LIGHT</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">System Language</p>
                            <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Global dialect settings</p>
                          </div>
                          <select 
                            value={tempLanguage}
                            onChange={(e) => setTempLanguage(e.target.value)}
                            className="bg-white dark:bg-black border border-slate-300 dark:border-cyber-green/20 rounded-lg px-3 py-2 text-[10px] font-bold text-primary dark:text-cyber-green focus:outline-none font-mono"
                          >
                            <option value="ENGLISH (US)">ENGLISH (US)</option>
                            <option value="HINDI (IN)">HINDI (IN)</option>
                            <option value="SPANISH (ES)">SPANISH (ES)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-cyber-green/10">
                      <button className="w-full py-4 rounded-xl border border-red-500/30 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/10 transition-all font-mono">
                        Archive All Neural Logs
                      </button>
                    </div>
                  </motion.div>
                )}

                {activeSettingsTab === 'personalization' && (
                  <motion.div 
                    key="personalization"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                        <Brain className="text-primary dark:text-cyber-green" size={20} />
                        Neural Personalization
                      </h3>
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-[0.3em] font-mono">Custom Instructions</label>
                          <textarea 
                            value={tempInstructions}
                            onChange={(e) => setTempInstructions(e.target.value)}
                            placeholder="What would you like the AI to know about you to provide better responses?"
                            className="w-full h-32 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-cyber-green/20 rounded-xl p-4 text-xs text-slate-800 dark:text-cyber-green focus:outline-none focus:border-primary/50 dark:focus:border-cyber-green/50 transition-all font-mono"
                          />
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">Neural Memory</p>
                            <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Allow AI to remember context across sessions</p>
                          </div>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={tempMemory}
                              onChange={(e) => setTempMemory(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-cyber-green"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSettingsTab === 'speech' && (
                  <motion.div 
                    key="speech"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                        <Mic className="text-primary dark:text-cyber-green" size={20} />
                        Vocal Synthesis
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {['Zephyr', 'Puck', 'Kore', 'Fenrir'].map((voice) => (
                          <button 
                            key={voice}
                            className="p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10 hover:border-primary/40 dark:hover:border-cyber-green/40 transition-all text-left group"
                          >
                            <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase group-hover:text-primary dark:group-hover:text-cyber-green transition-colors tracking-tight">{voice}</p>
                            <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest font-mono">Neural Voice Model</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeSettingsTab === 'data' && (
                  <motion.div 
                    key="data"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                        <ShieldCheck className="text-primary dark:text-cyber-green" size={20} />
                        Data & Privacy Controls
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10">
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">Chat History & Training</p>
                            <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Save new chats to this browser</p>
                          </div>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={tempHistory}
                              onChange={(e) => setTempHistory(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-slate-300 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary dark:peer-checked:bg-cyber-green"></div>
                          </div>
                        </div>
                        <button className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10 text-left hover:bg-slate-100 dark:hover:bg-black/40 transition-all">
                          <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">Export Neural Data</p>
                          <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Download a copy of your data</p>
                        </button>
                        <button className="w-full p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-left hover:bg-red-500/10 transition-all">
                          <p className="text-sm font-bold text-red-500 dark:text-red-400 uppercase tracking-tight">Delete Neural Core</p>
                          <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Permanently erase all data</p>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 dark:border-cyber-green/10 flex justify-end gap-4">
              <button 
                onClick={() => setCurrentScreen('home')}
                className="px-6 py-2 rounded-xl border border-slate-200 dark:border-cyber-green/10 text-slate-500 dark:text-cyber-green/40 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-cyber-green/5 transition-all font-mono"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-8 py-2 rounded-xl bg-primary dark:bg-cyber-green text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,65,0.4)] font-mono flex items-center gap-2"
              >
                {isSaving && <Loader2 size={14} className="animate-spin" />}
                {isSaving ? 'Syncing...' : 'Sync Configuration'}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  };


