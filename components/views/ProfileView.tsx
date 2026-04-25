
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
       <header className="flex items-center justify-between px-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Meu <span className="text-indigo-600">Espaço</span></h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 text-[10px]">Configurações e progresso.</p>
          </div>
          <button onClick={handleLogout} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 border border-slate-200 shadow-sm hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95">
            <LogOut size={20} />
          </button>
       </header>

       <div className="glass-card p-10 rounded-[3rem] border-white shadow-indigo-950/5 flex flex-col items-center text-center space-y-5">
          <div className="w-28 h-28 rounded-[2.5rem] bg-indigo-50 flex items-center justify-center border-2 border-indigo-100 shadow-2xl shadow-indigo-100 relative">
            <UserCircle2 size={64} className="text-indigo-500" />
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-lg">
               <ShieldCheck size={20} strokeWidth={3} />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{user.name}</h2>
            <div className="flex items-center gap-2 justify-center">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">MEMBRO ELITE</span>
            </div>
          </div>
       </div>

       {/* Medals Section */}
       <div className="space-y-5">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3 px-4">
            <div className="w-1 h-1 bg-indigo-600"></div> Conquistas
          </h3>
          <div className="grid grid-cols-2 gap-5 px-1">
            {user.badges && user.badges.length > 0 ? (
              user.badges.map(badge => (
                <div key={badge.id} className="glass-card p-6 rounded-[2.5rem] border-white flex flex-col items-center text-center space-y-4 shadow-indigo-950/5 group hover:-translate-y-1 transition-all duration-500">
                  <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {badgeIcons[badge.icon] || <Award size={24} className="text-indigo-600" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight italic leading-none">{badge.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-2 leading-tight tracking-widest">{badge.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 glass-card p-12 rounded-[2.5rem] border-dashed border-slate-200 text-center shadow-sm">
                <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-relaxed">Nenhuma conquista ainda.<br/>Sua dedicação será recompensada!</p>
              </div>
            )}
          </div>
       </div>

       <div className="grid grid-cols-2 gap-5 px-1 pb-10">
          <div className="glass-card p-8 rounded-[2.5rem] border-white shadow-indigo-950/5 space-y-2 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Treinos</p>
             <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{user.totalWorkouts || 0}</p>
          </div>
          <div className="glass-card p-8 rounded-[2.5rem] border-white shadow-indigo-950/5 space-y-2 text-center">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Streak</p>
             <div className="flex items-center justify-center gap-3">
                <p className="text-3xl font-black text-rose-500 italic tracking-tighter">{user.streak || 0}</p>
                <Flame size={28} className="text-rose-500 animate-pulse" />
             </div>
          </div>
       </div>
    </div>
  );
};
