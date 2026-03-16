import { motion } from 'motion/react';
import { Camera } from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAvatar: string;
  userName: string;
  tempName: string;
  setTempName: (name: string) => void;
  saveName: () => void;
  profilePicInputRef: React.RefObject<HTMLInputElement | null>;
  handleProfilePicSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileModal = ({
  isOpen,
  onClose,
  userAvatar,
  userName,
  tempName,
  setTempName,
  saveName,
  profilePicInputRef,
  handleProfilePicSelect
}: ProfileModalProps) => {
  if (!isOpen) return null;

  return (
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
                onClick={onClose}
                className="py-3 rounded-xl border border-slate-200 dark:border-cyber-green/10 text-slate-500 dark:text-cyber-green/40 text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-cyber-green/5 transition-all font-mono"
              >
                Abort
              </button>
              <button 
                onClick={() => { saveName(); onClose(); }}
                className="py-3 rounded-xl bg-primary dark:bg-cyber-green text-white dark:text-black text-[10px] font-black uppercase tracking-[0.3em] hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,255,65,0.4)] font-mono"
              >
                Sync
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
