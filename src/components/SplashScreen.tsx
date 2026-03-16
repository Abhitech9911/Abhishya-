import { motion } from 'motion/react';
import { Brain, Bolt } from 'lucide-react';

export const SplashScreen = () => {
  return (
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
};
