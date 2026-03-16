import { Bolt, Bell, Camera, Mic, MessageSquare, Sparkles, History, Settings, Brain, ChevronRight } from 'lucide-react';
import { HomeScreenProps } from '../types';

export const HomeScreen = ({
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
  isListening
}: HomeScreenProps) => {
  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300">
    <div className="absolute inset-0 scanline pointer-events-none opacity-20"></div>
    <header className="sticky top-0 z-50 backdrop-blur-md border-b border-primary/20 dark:border-cyber-green/20 bg-white/80 dark:bg-background-dark/80 px-6 lg:px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-cyber-green p-[2px] hud-glow-green">
            <div className="w-full h-full bg-white dark:bg-background-dark rounded-[7px] flex items-center justify-center">
              <Bolt className="text-primary dark:text-cyber-green" size={24} />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tighter text-slate-900 dark:text-cyber-green flex items-center gap-2 uppercase">
              Abhishya <span className="text-primary italic">AI</span>
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-cyber-green/60 font-mono tracking-widest uppercase">Command Center v4.0.2</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <button onClick={() => setCurrentScreen('home')} className="text-xs font-bold uppercase tracking-widest text-primary dark:text-cyber-green border-b-2 border-primary dark:border-cyber-green pb-1">Dashboard</button>
          <button onClick={() => setCurrentScreen('history')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Neural Assets</button>
          <button onClick={() => setCurrentScreen('history')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Archives</button>
          <button onClick={() => setCurrentScreen('settings')} className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-cyber-green/60 hover:text-primary dark:hover:text-cyber-green transition-colors">Settings</button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="size-10 flex items-center justify-center rounded-full border border-primary/30 dark:border-cyber-green/30 text-primary dark:text-cyber-green hover:bg-primary/10 dark:hover:bg-cyber-green/10 transition-all">
            <Bell size={20} />
          </button>
          <div className="h-10 w-[1px] bg-primary/20 dark:bg-cyber-green/20 mx-2"></div>
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
    </header>

    <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 z-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-10">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-cyber-green uppercase italic">Neural Uplink</h2>
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyber-green animate-pulse shadow-[0_0_10px_#00ff41]"></span>
                <span className="text-[10px] font-mono text-cyber-green/60 uppercase tracking-widest">System Online</span>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-cyber-green/50 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-white dark:bg-panel-dark border border-primary/20 dark:border-cyber-green/20 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 dark:bg-cyber-green/10 flex items-center justify-center text-primary dark:text-cyber-green border border-primary/20 dark:border-cyber-green/20">
                      <Brain size={28} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green uppercase tracking-tight">Direct Interface</h3>
                      <p className="text-xs text-slate-500 dark:text-cyber-green/40 font-mono uppercase">Initiate cognitive synchronization</p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="What is our objective today?"
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-cyber-green/20 rounded-2xl p-6 pt-6 pr-16 text-slate-900 dark:text-cyber-green placeholder:text-slate-400 dark:placeholder:text-cyber-green/20 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:focus:ring-cyber-green/30 transition-all min-h-[140px] text-lg font-medium"
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2">
                      <button 
                        onClick={() => startListening()}
                        className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-100 dark:bg-cyber-green/10 text-slate-500 dark:text-cyber-green hover:bg-primary/10 dark:hover:bg-cyber-green/20'}`}
                      >
                        <Mic size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          if (input.trim()) {
                            setChatMode('standard');
                            setCurrentScreen('chat');
                          }
                        }}
                        className="p-3 bg-primary dark:bg-cyber-green text-white dark:text-black rounded-xl shadow-lg shadow-primary/20 dark:shadow-cyber-green/20 hover:scale-105 active:scale-95 transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => { setChatMode('coding'); setPendingMessage('Help me with a coding project'); setCurrentScreen('chat'); }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-cyber-green/5 border border-slate-200 dark:border-cyber-green/10 text-slate-600 dark:text-cyber-green/60 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-cyber-green/10 hover:border-primary/30 dark:hover:border-cyber-green/30 transition-all flex items-center gap-2"
                    >
                      <Bolt size={14} />
                      DevOps Sync
                    </button>
                    <button 
                      onClick={() => { setChatMode('mixed'); setPendingMessage('Search for latest AI trends'); setCurrentScreen('chat'); }}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-cyber-green/5 border border-slate-200 dark:border-cyber-green/10 text-slate-600 dark:text-cyber-green/60 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-cyber-green/10 hover:border-primary/30 dark:hover:border-cyber-green/30 transition-all flex items-center gap-2"
                    >
                      <Sparkles size={14} />
                      Mixed Tools
                    </button>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-cyber-green/5 border border-slate-200 dark:border-cyber-green/10 text-slate-600 dark:text-cyber-green/60 text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-cyber-green/10 hover:border-primary/30 dark:hover:border-cyber-green/30 transition-all flex items-center gap-2"
                    >
                      <Camera size={14} />
                      Visual Input
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-cyber-green mb-6 uppercase italic">Neural Modules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 'mixed', title: 'Mixed Tools', desc: 'Search, Vision & Generation', icon: Sparkles, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { id: 'coding', title: 'DevOps Core', desc: 'Code Analysis & Architecture', icon: Bolt, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' },
                { id: 'business', title: 'Strategy Hub', desc: 'Market Intelligence & Growth', icon: History, color: 'text-indigo-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' },
                { id: 'study', title: 'Learning Hub', desc: 'Knowledge Mastering & Synthesis', icon: Brain, color: 'text-primary dark:text-cyber-green', bg: 'bg-primary/10 dark:bg-cyber-green/10', border: 'border-primary/20 dark:border-cyber-green/20' }
              ].map((module) => (
                <button 
                  key={module.id}
                  onClick={() => { setChatMode(module.id as any); setCurrentScreen('chat'); }}
                  className={`flex items-start gap-4 p-6 rounded-2xl bg-white dark:bg-panel-dark border ${module.border} hover:scale-[1.02] active:scale-[0.98] transition-all text-left group shadow-sm hover:shadow-xl`}
                >
                  <div className={`size-12 rounded-xl ${module.bg} flex items-center justify-center ${module.color} group-hover:scale-110 transition-transform`}>
                    <module.icon size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-cyber-green uppercase tracking-tight">{module.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-cyber-green/40 font-mono uppercase">{module.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-primary/10 to-cyber-green/10 dark:from-primary/5 dark:to-cyber-green/5 border border-primary/20 dark:border-cyber-green/20 rounded-3xl p-8 backdrop-blur-md">
            <h3 className="text-lg font-black text-slate-900 dark:text-cyber-green mb-4 uppercase italic">Neural Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest">Core Sync</span>
                <span className="text-[10px] font-mono text-cyber-green font-bold">STABLE</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest">Memory Load</span>
                <span className="text-[10px] font-mono text-primary font-bold">12.4 TB</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/5">
                <span className="text-[10px] font-bold text-slate-500 dark:text-cyber-green/40 uppercase tracking-widest">Neural Latency</span>
                <span className="text-[10px] font-mono text-cyber-green font-bold">14ms</span>
              </div>
            </div>
            <button 
              onClick={() => setCurrentScreen('settings')}
              className="w-full mt-6 py-3 rounded-xl bg-white dark:bg-black/40 border border-primary/20 dark:border-cyber-green/20 text-[10px] font-bold text-primary dark:text-cyber-green uppercase tracking-widest hover:bg-primary/10 dark:hover:bg-cyber-green/10 transition-all"
            >
              System Diagnostics
            </button>
          </div>

          <div className="bg-white dark:bg-panel-dark border border-slate-200 dark:border-cyber-green/20 rounded-3xl p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-900 dark:text-cyber-green uppercase italic">Recent Logs</h3>
              <button onClick={() => setCurrentScreen('history')} className="text-[10px] font-bold text-primary dark:text-cyber-green uppercase tracking-widest hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {[
                { title: 'Market Analysis 2024', time: '2h ago', icon: History },
                { title: 'Neural Core Update', time: '5h ago', icon: Bolt },
                { title: 'Cognitive Synthesis', time: '1d ago', icon: Brain }
              ].map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-cyber-green/5 transition-all cursor-pointer group">
                  <div className="size-10 rounded-lg bg-slate-100 dark:bg-cyber-green/10 flex items-center justify-center text-slate-400 dark:text-cyber-green/40 group-hover:text-primary dark:group-hover:text-cyber-green transition-colors">
                    <log.icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-cyber-green truncate uppercase tracking-tight">{log.title}</p>
                    <p className="text-[10px] text-slate-500 dark:text-cyber-green/40 font-mono">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
    </div>
  );
};
