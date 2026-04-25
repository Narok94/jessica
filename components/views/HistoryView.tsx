
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
      <header className="flex items-center justify-between px-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-ink tracking-tighter italic uppercase leading-none">Meus <span className="text-accent">Treinos</span></h1>
          <p className="text-secondary font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Histórico de progresso.</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-rose-500 hover:bg-rose-500/10 transition-all backdrop-blur-md"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="glass-card p-12 rounded-[2.5rem] text-center border-dashed">
           <div className="w-16 h-16 bg-ink/[0.03] rounded-2xl flex items-center justify-center text-secondary mx-auto mb-4"><History size={32} /></div>
           <p className="text-secondary text-[9px] font-black uppercase tracking-[0.2em]">Sua história começa agora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {user?.history.map((entry) => {
            const vol = entry.exercises.reduce((acc, ex) => acc + (ex.performance ? ex.performance.reduce((sa, p) => sa + (p.weight * p.reps), 0) : 0), 0);
            return (
              <div key={entry.id} className="glass-card glass-card-hover p-5 md:p-6 rounded-[2rem] space-y-4 border-l-4 border-l-accent">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-ink uppercase tracking-tight italic leading-none">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-1.5 mt-1.5 text-secondary">
                        <Calendar size={10} />
                        <p className="text-[8px] font-black uppercase tracking-widest leading-none">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-accent/20">Finalizado</span>
                    <div className="flex items-center gap-2">
                      {entry.duration && (
                        <div className="flex items-center gap-1 text-[9px] font-bold text-secondary uppercase">
                          <Clock size={10} />
                          <span>{formatTime(entry.duration)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-line">
                  {entry.exercises.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="text-[8px] font-black text-secondary uppercase tracking-widest truncate">{ex.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {ex.performance && ex.performance.slice(0, 2).map((s, si) => (
                          <div key={si} className="text-[7px] font-bold bg-ink/[0.03] text-ink px-1.5 py-0.5 rounded-md border border-line">
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
