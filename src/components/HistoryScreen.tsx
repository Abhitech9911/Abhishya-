import { ArrowLeft, History, Activity, Terminal } from 'lucide-react';
import { HistoryScreenProps } from '../types';

export const HistoryScreen = ({ setCurrentScreen, messages }: HistoryScreenProps) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background-light dark:bg-background-dark transition-colors duration-300 tech-grid">
      <div className="absolute inset-0 scanline pointer-events-none opacity-10"></div>
      <div className="layout-container flex h-full grow flex-col max-w-5xl mx-auto px-4 md:px-10 z-10">
        <header className="flex items-center justify-between py-8 border-b border-primary/20 dark:border-cyber-green/20">
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentScreen('home')} className="group flex items-center justify-center size-12 rounded-full bg-primary/10 dark:bg-cyber-green/10 border border-primary/40 dark:border-cyber-green/40 hover:bg-primary/20 dark:hover:bg-cyber-green/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,255,65,0.2)]">
              <ArrowLeft className="text-primary dark:text-cyber-green" size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-cyber-green uppercase italic">Neural Archives</h2>
              <p className="text-primary/70 dark:text-cyber-green/60 text-[10px] font-bold uppercase tracking-[0.3em]">Secure Data Vault // Abhishya AI</p>
            </div>
          </div>
        </header>
        <main className="py-10 space-y-6">
          <div className="grid gap-6">
            {messages.length <= 1 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-cyber-green/20">
                <History size={48} className="opacity-20 mb-4" />
                <p className="text-xs uppercase tracking-[0.3em] font-bold font-mono">No active logs found in this sector</p>
              </div>
            ) : (
              messages.filter(m => m.role === 'user').map((item) => (
                <div key={item.id} className="group relative flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-white/40 dark:bg-black/60 border border-slate-200 dark:border-cyber-green/20 hover:border-primary/50 dark:hover:border-cyber-green/50 hover:bg-white/60 dark:hover:bg-black/80 transition-all duration-500 overflow-hidden">
                  <div className="relative z-10 w-full md:w-48 aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-cyber-green/20 bg-slate-100 dark:bg-black/50 flex items-center justify-center">
                    {item.image ? (
                      <img src={item.image} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity" />
                    ) : (
                      <Activity size={48} className="text-primary/20 dark:text-cyber-green/20" />
                    )}
                  </div>
                  <div className="relative z-10 flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-primary/60 dark:text-cyber-green/60 tracking-[0.2em] uppercase font-mono">Log ID: #{item.id.slice(-6)}</span>
                      <span className="text-[10px] text-slate-500 dark:text-cyber-green/40 font-mono uppercase">{new Date(item.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-cyber-green group-hover:text-primary dark:group-hover:text-cyber-green transition-colors truncate max-w-md uppercase tracking-tight">{item.content}</h3>
                    <p className="text-slate-600 dark:text-cyber-green/60 text-xs leading-relaxed max-w-xl line-clamp-2 font-mono">
                      {messages[messages.findIndex(m => m.id === item.id) + 1]?.content || 'Awaiting response...'}
                    </p>
                  </div>
                  <button onClick={() => setCurrentScreen('chat')} className="relative z-10 flex items-center justify-center size-12 rounded-xl bg-primary dark:bg-cyber-green text-white dark:text-black hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,255,65,0.4)]">
                    <Terminal size={24} />
                  </button>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
        </div>
  );
};
