export type Screen = 'splash' | 'home' | 'chat' | 'history' | 'settings';
export type ChatMode = 'standard' | 'friend' | 'mixed' | 'coding' | 'business' | 'study';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  groundingUrls?: { title: string; uri: string }[];
  image?: string;
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface HistoryScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  messages: Message[];
}

export interface ChatScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  chatMode: ChatMode;
  setChatMode: React.Dispatch<React.SetStateAction<ChatMode>>;
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  input: string;
  setInput: (input: string) => void;
  handleSend: (overrideInput?: string) => void;
  startListening: (onResult?: (text: string) => void) => void;
  isListening: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  selectedFile: { file: File; preview: string } | null;
  removeSelectedFile: () => void;
  clearChat: () => void;
  chatInputRef: React.RefObject<HTMLTextAreaElement | null>;
}

export interface SettingsScreenProps {
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

export interface HomeScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  setIsProfileModalOpen: (open: boolean) => void;
  userAvatar: string;
  userName: string;
  input: string;
  setInput: (input: string) => void;
  setChatMode: (mode: ChatMode) => void;
  setPendingMessage: (msg: string | null) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  startListening: (onResult?: (text: string) => void) => void;
  isListening: boolean;
}
