import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Mic, Trash2, Settings, User, Cpu, Loader2, Coins, Terminal, Cloud, Paperclip, Bolt, MessageSquare } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatScreenProps } from '../types';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ChatScreen = ({
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
  chatInputRef
}: ChatScreenProps) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
      <div className="absolute inset-0 scanline pointer-events-none opacity-5"></div>
      <header className="flex items-center justify-between border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-black/60 backdrop-blur-md px-6 py-4 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentScreen('home')} className="p-2 bg-primary/10 dark:bg-cyber-green/10 rounded-lg border border-primary/20 dark:border-cyber-green/20">
            <ArrowLeft className="text-primary dark:text-cyber-green" size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-cyber-green uppercase tracking-widest">Abhishya <span className="text-primary">AI</span></h1>
            <div className="flex items-center gap-2">
              <span className={cn(
                "size-2 rounded-full animate-pulse shadow-[0_0_10px_currentColor]", 
                chatMode === 'friend' ? "bg-indigo-500" : 
                chatMode === 'mixed' ? "bg-emerald-500" :
                chatMode === 'coding' ? "bg-primary" :
                chatMode === 'business' ? "bg-slate-400 dark:bg-slate-500" :
                chatMode === 'study' ? "bg-primary dark:bg-cyber-green" : "bg-cyber-green"
              )}></span>
              <p className="text-[10px] text-slate-600 dark:text-cyber-green/60 font-mono tracking-[0.2em] uppercase">
                {chatMode === 'friend' ? 'Friend Mode Active' : 
                 chatMode === 'mixed' ? 'Mixed Tools Active' :
                 chatMode === 'coding' ? 'DevOps Mode Active' :
                 chatMode === 'business' ? 'Strategy Mode Active' :
                 chatMode === 'study' ? 'Learning Hub Active' : 'Neural Link Active'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(chatMode === 'standard' || chatMode === 'friend') && (
            <button 
              onClick={() => setChatMode(prev => prev === 'standard' ? 'friend' : 'standard')}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all text-[10px] font-bold uppercase tracking-widest font-mono",
                chatMode === 'friend' 
                  ? "bg-accent-blue/20 border-accent-blue text-accent-blue shadow-[0_0_10px_rgba(0,210,255,0.3)]" 
                  : "bg-slate-100 dark:bg-cyber-green/5 border-slate-200 dark:border-cyber-green/20 text-slate-600 dark:text-cyber-green/80"
              )}
            >
              {chatMode === 'friend' ? <Mic size={14} /> : <MessageSquare size={14} />}
              <span>{chatMode === 'friend' ? 'Friend' : 'Standard'}</span>
            </button>
          )}
          <button onClick={clearChat} className="p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">
            <Trash2 size={20} />
          </button>
          <button onClick={() => setCurrentScreen('settings')} className="p-2 text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">
            <Settings size={20} />
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
                      {message.role === 'user' ? 'Commander' : 'Abhishya AI'}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-cyber-green/40 font-mono">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className={cn(
                    "max-w-2xl p-4 rounded-2xl backdrop-blur-md",
                    message.role === 'user' 
                      ? "bg-primary dark:bg-cyber-green text-white dark:text-black rounded-tr-none shadow-[0_0_20px_rgba(0,255,65,0.1)]" 
                      : "bg-white/90 dark:bg-zinc-900/80 border border-slate-200 dark:border-primary/20 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-xl"
                  )}>
                    {message.image && (
                      <div className="mb-3 rounded-lg overflow-hidden border border-white/10">
                        <img src={message.image} alt="attachment" className="w-full h-auto max-h-64 object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="markdown-body prose dark:prose-invert prose-sm max-w-none">
                      <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
                    </div>
                    {message.groundingUrls && message.groundingUrls.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10">
                        <p className="text-[10px] font-bold uppercase tracking-widest mb-2 text-primary dark:text-cyber-green">Neural Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.groundingUrls.map((url, idx) => (
                            <a 
                              key={idx} 
                              href={url.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] bg-slate-100 dark:bg-white/5 px-2 py-1 rounded border border-slate-200 dark:border-white/10 hover:bg-primary/10 dark:hover:bg-cyber-green/10 transition-colors truncate max-w-[150px]"
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

      <footer className="p-6 bg-white/90 dark:bg-background-dark/90 border-t border-primary/20 dark:border-cyber-green/20">
        <div className="max-w-4xl mx-auto">
          {selectedFile && (
            <div className="mb-4 p-2 bg-slate-100 dark:bg-cyber-green/5 border border-slate-200 dark:border-cyber-green/30 rounded-xl flex items-center gap-3 animate-in slide-in-from-bottom-2">
              {selectedFile.file.type.startsWith('image/') ? (
                <div className="size-12 rounded-lg overflow-hidden border border-white/10 dark:border-cyber-green/20">
                  <img src={selectedFile.preview} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ) : (
                <div className="size-12 rounded-lg bg-primary/10 dark:bg-cyber-green/10 flex items-center justify-center text-primary dark:text-cyber-green">
                  <Paperclip size={20} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 dark:text-cyber-green truncate uppercase tracking-wider font-mono">{selectedFile.file.name}</p>
                <p className="text-[10px] text-slate-500 dark:text-cyber-green/60 uppercase font-mono">{(selectedFile.file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button 
                onClick={removeSelectedFile}
                className="p-2 hover:bg-black/5 dark:hover:bg-cyber-green/10 rounded-full text-slate-600 dark:text-cyber-green/60 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )}
          <div className="flex items-center gap-4">
            <button className="size-12 rounded-full border-2 border-primary/40 dark:border-cyber-green/40 bg-primary/5 dark:bg-cyber-green/5 flex items-center justify-center text-primary dark:text-cyber-green hover:bg-primary/20 dark:hover:bg-cyber-green/20 transition-all shrink-0">
              <Coins size={24} />
            </button>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center">
                <Terminal size={20} className="text-slate-500 dark:text-cyber-green/40" />
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
                className="w-full bg-slate-100 dark:bg-black/60 border border-slate-200 dark:border-cyber-green/30 rounded-xl py-4 pl-12 pr-24 text-slate-900 dark:text-cyber-green placeholder:text-slate-600 dark:placeholder:text-cyber-green/30 focus:outline-none focus:ring-1 focus:ring-primary/50 dark:focus:ring-cyber-green/50 focus:border-primary/60 dark:focus:border-cyber-green/60 text-sm font-mono resize-none" 
                placeholder="EXECUTE COMMAND..." 
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = `${target.scrollHeight}px`;
                }}
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1">
                <button 
                  onClick={() => startListening()}
                  className={cn(
                    "p-2 transition-colors",
                    isListening ? "text-red-500 animate-pulse" : "text-slate-500 hover:text-primary"
                  )}
                  title="Voice Input"
                >
                  <Mic size={18} />
                </button>
                <button className="p-2 text-slate-500 hover:text-primary transition-colors">
                  <Cloud size={18} />
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-500 hover:text-primary dark:hover:text-cyber-green transition-colors"
                  title="Attach File"
                >
                  <Paperclip size={18} />
                </button>
              </div>
            </div>
            <button 
              onClick={() => handleSend()}
              title="Send Message"
              disabled={(!input.trim() && !selectedFile) || isLoading}
              className="bg-primary dark:bg-cyber-green hover:bg-primary/80 dark:hover:bg-cyber-green/80 disabled:opacity-50 disabled:cursor-not-allowed text-white dark:text-black flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-[0_0_20px_rgba(236,91,19,0.4)] dark:shadow-[0_0_20px_rgba(0,255,65,0.4)] group active:scale-95"
            >
              <span>Transmit</span>
              <Bolt size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
