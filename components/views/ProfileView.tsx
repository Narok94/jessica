
import React from 'react';
import { useStore } from '../../store';
import { UserCircle2, ShieldCheck, TrendingUp, Trophy, Award, Rocket, Flame, LogOut } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { user, logout } = useStore();

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const badgeIcons: Record<string, any> = {
    Rocket: <Rocket size={24} className="text-blue-500" />,
    Trophy: <Trophy size={24} className="text-yellow-500" />,
    Flame: <Flame size={24} className="text-orange-500" />,
    Award: <Award size={24} className="text-emerald-500" />
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10">
       <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Meu <span className="text-blue-500">Perfil</span></h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Configurações e conquistas.</p>
          </div>
          <button onClick={handleLogout} className="w-10 h-10 bg-zinc-900 rounded-2xl flex items-center justify-center text-rose-500 border border-white/5 hover:bg-rose-500/10 transition-all">
            <LogOut size={20} />
          </button>
       </header>

       <div className="glass-card p-8 rounded-[2.5rem] border border-white/10 flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-[2.5rem] bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/50 shadow-2xl shadow-blue-500/20">
            <UserCircle2 size={56} className="text-blue-500" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{user.name}</h2>
            <div className="flex items-center gap-2 justify-center mt-1">
               <ShieldCheck size={14} className="text-emerald-500" />
               <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Membro Pro</span>
            </div>
          </div>
       </div>

       {/* Medals Section */}
       <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
            <Award size={14} className="text-emerald-500" /> Minhas Medalhas
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map(badge => (
                <div key={badge.id} className="glass-card p-6 rounded-[2rem] border border-white/5 flex flex-col items-center text-center space-y-3 bg-white/5">
                  <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center shadow-lg">
                    {badgeIcons[badge.icon] || <Award size={24} className="text-emerald-500" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-tight">{badge.name}</p>
                    <p className="text-[8px] font-bold text-zinc-500 uppercase mt-1 leading-tight">{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 glass-card p-8 rounded-[2rem] border border-dashed border-white/10 text-center">
                <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Nenhuma medalha conquistada ainda. Continue treinando!</p>
              </div>
            )}
          </div>
       </div>

       <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-[2rem] border border-white/5 space-y-1">
             <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Total de Treinos</p>
             <p className="text-2xl font-black text-white">{user.totalWorkouts || 0}</p>
          </div>
          <div className="glass-card p-6 rounded-[2rem] border border-white/5 space-y-1">
             <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Sequência Atual</p>
             <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-white">{user.streak || 0}</p>
                <Flame size={20} className="text-orange-500" />
             </div>
          </div>
       </div>
    </div>
  );
};
