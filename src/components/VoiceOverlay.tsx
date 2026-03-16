import { motion } from 'motion/react';
import { Mic } from 'lucide-react';

interface VoiceOverlayProps {
  isListening: boolean;
  setIsListening: (listening: boolean) => void;
}

export const VoiceOverlay = ({ isListening, setIsListening }: VoiceOverlayProps) => {
  if (!isListening) return null;

  return (
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
  );
};
