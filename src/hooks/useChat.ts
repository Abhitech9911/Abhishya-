import { useState, useRef, useEffect } from 'react';
import { Message, ChatMode, Screen } from '../types';
import { geminiService } from '../services/geminiService';

export const useChat = (userName: string) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('abhishya_messages');
    return saved ? JSON.parse(saved) : [{
      id: '1',
      role: 'assistant',
      content: `Neural Link Established. Welcome back, Commander ${userName.split(' ')[0]}. All systems operational. How shall we proceed?`,
      timestamp: Date.now()
    }];
  });
  
  const [input, setInput] = useState('');
  const [chatMode, setChatMode] = useState<ChatMode>('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{file: File, preview: string} | null>(null);
  const [pendingMessage, setPendingMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('abhishya_messages', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          file,
          preview: reader.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const clearChat = () => {
    const initialMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: `Neural Core Reset. Memory banks cleared. Standing by for new instructions, Commander.`,
      timestamp: Date.now()
    };
    setMessages([initialMessage]);
    localStorage.removeItem('abhishya_messages');
  };

  const handleSend = async (overrideInput?: string) => {
    const messageText = overrideInput || input;
    if (!messageText.trim() && !selectedFile) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
      image: selectedFile?.preview
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const currentFile = selectedFile;
    setSelectedFile(null);
    setIsLoading(true);

    try {
      const assistantMessageId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: Date.now()
      }]);

      let fullResponse = '';
      const history = messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }));

      const stream = geminiService.sendMessageStream(
        messageText,
        history,
        chatMode
      );

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId ? { ...msg, content: fullResponse } : msg
        ));
      }
    } catch (error) {
      console.error('Neural Link Error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "CRITICAL ERROR: Neural link severed. Please check your connection and try again.",
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
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
        handleSend(transcript);
      }
    };

    recognition.start();
  };

  return {
    messages,
    setMessages,
    input,
    setInput,
    chatMode,
    setChatMode,
    isLoading,
    setIsLoading,
    isListening,
    setIsListening,
    selectedFile,
    setSelectedFile,
    pendingMessage,
    setPendingMessage,
    messagesEndRef,
    chatInputRef,
    fileInputRef,
    handleFileSelect,
    removeSelectedFile,
    clearChat,
    handleSend,
    startListening
  };
};
