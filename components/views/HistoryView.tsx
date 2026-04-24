
import React from 'react';
import { useStore } from '../../store';
import { History, Calendar, Clock, LogOut } from 'lucide-react';

export const HistoryView: React.FC = () => {
  const { user, logout } = useStore();

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  return (
    <div className="space-y-6 animate-slide-up pb-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <span className="text-emerald-500">Treinos</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Histórico de progresso.</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="w-12 h-12 bg-zinc-900/40 rounded-2xl flex items-center justify-center text-rose-500 border border-white/5 hover:bg-rose-500/10 transition-all backdrop-blur-md"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="glass-card p-12 rounded-[2.5rem] text-center border border-dashed border-white/10">
           <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-800 mx-auto mb-4"><History size={32} /></div>
           <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">Sua história começa agora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {user?.history.map((entry) => {
            const vol = entry.exercises.reduce((acc, ex) => acc + (ex.performance ? ex.performance.reduce((sa, p) => sa + (p.weight * p.reps), 0) : 0), 0);
            return (
              <div key={entry.id} className="glass-card glass-card-hover p-5 md:p-6 rounded-[2rem] space-y-4 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500">
                        <Calendar size={10} />
                        <p className="text-[8px] font-black uppercase tracking-widest">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Finalizado</span>
                    <div className="flex items-center gap-2 mt-1">
                      {entry.duration && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 uppercase">
                          <Clock size={10} />
                          <span>{formatTime(entry.duration)}</span>
                        </div>
                      )}
                      <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">{vol}kg movidos</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  {entry.exercises.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest truncate">{ex.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {ex.performance && ex.performance.slice(0, 2).map((s, si) => (
                          <div key={si} className="text-[7px] font-bold bg-zinc-900/80 text-white px-1.5 py-0.5 rounded-md">
                             {s.weight}kg x {s.reps}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
