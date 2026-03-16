import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Check, Loader2, Settings, Brain, Mic, ShieldCheck, Globe, MessageSquare, Shield, Network, Gauge, Thermometer, Code2, Cpu, Terminal, Lightbulb, BookOpen, Activity, Coins, Paperclip, Cloud, ChevronRight, Fingerprint, LockOpen, Eye, ShieldAlert } from 'lucide-react';
import { SettingsScreenProps } from '../types';
import { twMerge } from 'tailwind-merge';
import { clsx, type ClassValue } from 'clsx';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SettingsScreen = ({
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
      <header className="flex items-center justify-between border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-black/60 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setCurrentScreen('home')} className="p-2 bg-primary/10 dark:bg-cyber-green/10 rounded-lg border border-primary/20 dark:border-cyber-green/20">
            <ArrowLeft className="text-primary dark:text-cyber-green" size={24} />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight uppercase italic text-slate-900 dark:text-cyber-green">System <span className="text-primary">Settings</span></h2>
            <p className="text-[10px] text-primary/60 dark:text-cyber-green/60 tracking-[0.2em] font-bold uppercase font-mono">CONFIGURATION INTERFACE V.4.0</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary dark:bg-cyber-green text-white dark:text-black rounded-lg font-bold text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(0,255,65,0.3)] hover:scale-105 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
            <span>{isSaving ? 'Syncing...' : 'Save Changes'}</span>
          </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col md:flex-row max-w-[1200px] mx-auto w-full p-6 lg:p-10 gap-8 z-10">
        <aside className="w-full md:w-64 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSettingsTab(tab.id as any)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl border transition-all uppercase text-[10px] font-bold tracking-widest font-mono",
                activeSettingsTab === tab.id 
                  ? "bg-primary dark:bg-cyber-green text-white dark:text-black border-primary dark:border-cyber-green shadow-[0_0_15px_rgba(0,255,65,0.2)]" 
                  : "bg-white dark:bg-black/20 border-slate-200 dark:border-cyber-green/10 text-slate-600 dark:text-cyber-green/40 hover:bg-slate-50 dark:hover:bg-black/40"
              )}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </aside>

        <div className="flex-1 bg-white/80 dark:bg-panel-dark/80 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-cyber-green/20 p-8 shadow-2xl">
          <AnimatePresence mode="wait">
            {activeSettingsTab === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                    <Settings className="text-primary dark:text-cyber-green" size={20} />
                    General Configuration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest font-mono">Visual Theme</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['SYSTEM', 'LIGHT', 'DARK'].map((t) => (
                          <button 
                            key={t}
                            onClick={() => setTempTheme(t as any)}
                            className={cn(
                              "py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all font-mono",
                              tempTheme === t 
                                ? "bg-primary/10 dark:bg-cyber-green/10 border-primary dark:border-cyber-green text-primary dark:text-cyber-green" 
                                : "bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-cyber-green/10 text-slate-500 dark:text-cyber-green/40 hover:bg-slate-100 dark:hover:bg-black/40"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest font-mono">Neural Language</label>
                      <select 
                        value={tempLanguage}
                        onChange={(e) => setTempLanguage(e.target.value)}
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10 text-slate-800 dark:text-cyber-green text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 font-mono uppercase"
                      >
                        <option>ENGLISH (US)</option>
                        <option>HINDI (INDIA)</option>
                        <option>HINGLISH (MIXED)</option>
                        <option>SPANISH (GLOBAL)</option>
                        <option>FRENCH (EUROPE)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSettingsTab === 'personalization' && (
              <motion.div 
                key="personalization"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-wider flex items-center gap-2 italic">
                    <Brain className="text-primary dark:text-cyber-green" size={20} />
                    Neural Personalization
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest font-mono">Custom Directives</label>
                      <textarea 
                        value={tempInstructions}
                        onChange={(e) => setTempInstructions(e.target.value)}
                        placeholder="Define how Abhishya AI should behave..."
                        className="w-full p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10 text-slate-800 dark:text-cyber-green text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 min-h-[150px] font-mono"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-cyber-green/10">
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-cyber-green uppercase tracking-tight">Neural Memory</p>
                        <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 uppercase font-mono">Allow AI to remember past interactions</p>
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
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
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="space-y-6">
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
      </main>
    </div>
  );
};
