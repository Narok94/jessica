
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">Minha <span className="text-indigo-600">Jornada</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5 text-[10px]">Histórico de progresso.</p>
        </div>
        <button 
          onClick={() => logout()} 
          className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-rose-500 border border-slate-200 shadow-sm hover:bg-rose-50 hover:border-rose-100 transition-all active:scale-95"
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="glass-card p-16 rounded-[3rem] text-center border-dashed border-slate-200 shadow-sm">
           <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[1.8rem] flex items-center justify-center text-slate-200 mx-auto mb-6"><History size={40} /></div>
           <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Sua história começa agora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {user?.history.map((entry) => {
            const vol = entry.exercises.reduce((acc, ex) => acc + (ex.performance ? ex.performance.reduce((sa, p) => sa + (p.weight * p.reps), 0) : 0), 0);
            return (
              <div key={entry.id} className="glass-card glass-card-hover p-6 md:p-8 rounded-[2.5rem] border-white shadow-indigo-950/5 hover:-translate-y-1 group transition-all duration-500 border-l-[6px] border-l-emerald-500">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Calendar size={14} className="text-indigo-400" />
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-start md:items-end gap-2">
                    <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">Finalizado</span>
                    <div className="flex items-center gap-3">
                      {entry.duration && (
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <Clock size={12} className="text-slate-300" />
                          <span>{formatTime(entry.duration)}</span>
                        </div>
                      )}
                      <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{vol}KG Movidos</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-50 mt-4">
                  {entry.exercises.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="space-y-1.5 bg-slate-50/50 p-3 rounded-2xl border border-slate-100/50">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest truncate">{ex.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {ex.performance && ex.performance.filter(p => p.completed).slice(0, 2).map((s, si) => (
                          <div key={si} className="text-[8px] font-black bg-white text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
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
