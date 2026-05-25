import React from 'react';
import { useStore } from '../../store';
import { History, Calendar, Clock, LogOut, Wind } from 'lucide-react';

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

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between pb-1 bg-transparent select-none font-sans">
      <header className="flex items-center justify-between py-1.5 px-1.5 border-b border-white/5 shrink-0">
        <div>
          <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <span className="text-accent">Treinos</span></h1>
          <p className="text-white/40 uppercase tracking-widest mt-1 text-[8px] font-mono">Histórico de progresso.</p>
        </div>
        <button 
          onClick={() => {
            handleVibrate(15);
            logout();
          }} 
          className="text-[7.5px] font-black text-rose-500/70 hover:text-rose-500 uppercase tracking-widest transition-colors py-1 px-2 border border-rose-500/10 rounded bg-rose-500/[0.02]"
          title="Sair"
        >
          SAIR
        </button>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-zinc-500 mb-2">
            <History size={16} />
          </div>
          <p className="text-zinc-500 text-[8.5px] font-black uppercase tracking-[0.15em]">Sua história começa agora.</p>
        </div>
      ) : (
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-2 space-y-1.5 mt-1.5">
          {user?.history.map((entry) => {
            return (
              <div key={entry.id} className="bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl space-y-1.5 border-l-2 border-l-accent shadow-sm">
                <div className="flex justify-between items-start gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-black text-white uppercase tracking-tight italic leading-none truncate">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-1 mt-1 text-white/40 leading-none">
                        <Calendar size={8} />
                        <span className="text-[7.5px] font-bold uppercase tracking-wider">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="bg-accent/10 text-accent border border-accent/20 px-1.5 py-0.5 rounded text-[6.5px] font-black uppercase tracking-wider leading-none">
                      Finalizado
                    </span>
                    {entry.duration && (
                      <div className="flex items-center gap-0.5 text-[7.5px] font-bold text-white/40 uppercase leading-none">
                        <Clock size={8} />
                        <span>{formatTime(entry.duration)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-white/5">
                  {entry.exercises.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="space-y-0.5 min-w-0">
                      <p className="text-[7.5px] font-black text-white/40 uppercase truncate leading-none">{ex.name}</p>
                      <div className="flex flex-wrap gap-0.5">
                        {ex.performance && ex.performance.slice(0, 2).map((s, si) => (
                          <div key={si} className="text-[6.5px] font-bold bg-white/[0.02] text-white/60 px-1 py-0.5 rounded border border-white/5 leading-none">
                             {s.weight}kg x {s.reps}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {entry.cardio && (
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-0.5 leading-none">
                        <Wind size={8} className="text-accent" />
                        <p className="text-[7.5px] font-black text-accent uppercase truncate">Aeróbico</p>
                      </div>
                      <div className="text-[6.5px] font-bold bg-accent/5 text-accent px-1 py-0.5 rounded border border-accent/10 inline-block leading-none truncate max-w-full">
                         {entry.cardio.exercise} - {entry.cardio.duration}min
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
