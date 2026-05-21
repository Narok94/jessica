import React from 'react';
import { useStore } from '../../store';
import { UserCircle2, ShieldCheck, Trophy, Award, Rocket, Flame, LogOut, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { user, logout, theme, toggleTheme } = useStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const badgeIcons: Record<string, any> = {
    Rocket: <Rocket size={18} className="text-[#FF5F00]" />,
    Trophy: <Trophy size={18} className="text-[#FF5F00]" />,
    Flame: <Flame size={18} className="text-[#FF5F00]" />,
    Award: <Award size={18} className="text-[#FF5F00]" />
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between pb-1.5 bg-transparent select-none font-sans">
       {/* Compact Header */}
       <header className="flex items-center justify-between py-1.5 px-1 border-b border-white/5 shrink-0">
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Meu <span className="text-[#FF5F00]">Perfil</span></h1>
            <p className="text-white/40 uppercase tracking-widest mt-1 text-[8px] font-mono leading-none">Configurações e conquistas.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                handleVibrate(5);
                toggleTheme();
              }} 
              className="w-7 h-7 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-center text-[#FF5F00] active:scale-95 transition-all"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              onClick={() => {
                handleVibrate(15);
                handleLogout();
              }} 
              className="text-[7.5px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors py-1 px-2 border border-rose-500/10 rounded bg-rose-500/[0.02]"
            >
              SAIR
            </button>
          </div>
       </header>

       {/* Biometrics Profile Card - Compact Horizontal */}
       <div className="bg-[#0c0c0c]/80 border border-white/5 p-2.5 rounded-xl flex items-center gap-3 shrink-0 mt-2 text-left">
          <div className="w-12 h-12 rounded-xl bg-[#FF5F00]/10 flex items-center justify-center border border-[#FF5F00]/20 shrink-0">
            <UserCircle2 size={32} className="text-[#FF5F00]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none truncate">{user.name}</h2>
            <div className="flex items-center gap-1.5 mt-1 leading-none text-white/40">
               <ShieldCheck size={10} className="text-emerald-500" />
               <span className="text-[8px] font-black uppercase tracking-widest font-mono">Membro Pro</span>
            </div>
          </div>
       </div>

       {/* Stats Grid Compact Horizontal */}
       <div className="grid grid-cols-2 gap-2 mt-2 shrink-0">
          <div className="bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl space-y-0.5 leading-none">
             <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest font-mono">Total de Treinos</p>
             <p className="text-lg font-black text-white font-mono leading-none">{user.totalWorkouts || 0}</p>
          </div>
          <div className="bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl flex justify-between items-center leading-none">
             <div>
                <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest font-mono">Sequência</p>
                <p className="text-lg font-black text-white font-mono leading-none mt-0.5">{user.streak || 0}</p>
             </div>
             <Flame size={16} className="text-[#FF5F00]" />
          </div>
       </div>

       {/* Horizontal medals slider avoids grids page overflows entirely */}
       <div className="flex-1 min-h-0 flex flex-col justify-end pb-1 mt-2.5">
          <h3 className="text-[8.5px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 px-1 shrink-0 mb-1.5">
            <Award size={11} className="text-emerald-500" /> Minhas Medalhas
          </h3>
          
          <div className="flex-1 min-h-0 py-0.5">
            {user.badges && user.badges.length > 0 ? (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
                {user.badges.map((badge, idx) => (
                  <motion.div 
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex-shrink-0 w-28 bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl flex flex-col items-center text-center space-y-1.5 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-white/[0.02] rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                      {badgeIcons[badge.icon] || <Award size={18} className="text-[#FF5F00]" />}
                    </div>
                    <div>
                      <p className="text-[8.5px] font-black text-white uppercase tracking-tight leading-tight truncate w-[100px]">{badge.name}</p>
                      <p className="text-[7px] font-black text-white/40 uppercase mt-0.5 leading-none truncate w-[100px]">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#0c0c0c]/50 p-4 rounded-xl border border-dashed border-white/5 text-center flex items-center justify-center">
                <p className="text-white/40 text-[7.5px] font-black uppercase tracking-widest leading-normal">
                  Nenhuma medalha conquistada ainda. Continue treinando!
                </p>
              </div>
            )}
          </div>
       </div>
    </div>
  );
};
