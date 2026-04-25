
import React, { useCallback, useRef, useState } from 'react';
import { useStore } from '../../store';
import { 
  Calendar, 
  Flame, 
  User as UserIcon, 
  ClipboardList, 
  TrendingUp, 
  Check, 
  ArrowRight, 
  Dumbbell,
  Target,
  Zap,
  Award,
  LogOut
} from 'lucide-react';
import { AppTab } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const { user, allWorkouts, setActiveTab, setSelectedWorkout, handleManualCheckIn, logout } = useStore();
  
  if (!user) return null;

  const today = new Date().toISOString().split('T')[0];
  const isCheckedInToday = user.checkIns?.includes(today);
  
  const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
  const currentDay = new Date().getDay();
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - currentDay);
  
  const weekActivity = weekDays.map((label, idx) => {
      const d = new Date(weekStart);
      d.setDate(d.getDate() + idx);
      const iso = d.toISOString().split('T')[0];
      return { 
        label, 
        active: user.checkIns?.includes(iso), 
        today: iso === today,
        iso 
      };
  });

  const initialWorkouts = allWorkouts[user.username.toLowerCase() as keyof typeof allWorkouts] || [];

  const getLastCompletedDate = (workoutId: string) => {
    const entry = user.history.find(h => h.workoutId === workoutId);
    if (!entry) return null;
    return new Date(entry.date).toLocaleDateString('pt-BR');
  };

  const getHistoryCount = (workoutId: string) => {
    return user.history.filter(h => h.workoutId === workoutId).length;
  };

  // Chart Data: Last 7 workouts volume
  const chartData = user.history.slice(0, 7).reverse().map(h => {
    const vol = h.exercises.reduce((acc, ex) => acc + (ex.performance ? ex.performance.reduce((sa, p) => sa + (p.weight * p.reps), 0) : 0), 0);
    return {
      name: h.workoutTitle.split(' ')[0],
      volume: vol,
      date: new Date(h.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
    };
  });

  const handleVibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const onCheckIn = () => {
    handleVibrate();
    handleManualCheckIn();
  };

  return (
    <div className="space-y-8 animate-slide-up pb-10 max-w-2xl mx-auto">
      {/* Minimalist Header */}
      <header className="flex items-center justify-between py-6 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border border-line flex items-center justify-center bg-ink/[0.03] overflow-hidden">
             {user.avatar ? (
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover opacity-80" />
             ) : (
               <UserIcon size={20} className="text-secondary" />
             )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-black italic tracking-tighter leading-none text-ink">{user.name.toUpperCase()}</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="text-[9px] font-black text-secondary uppercase tracking-widest leading-none">
                 {initialWorkouts.length === 3 ? 'ABC' : 
                  initialWorkouts.length === 4 ? 'ABCD' : 
                  initialWorkouts.length === 5 ? 'ABCDE' : 'Personalizado'} Elite
               </span>
               {!isCheckedInToday && (
                  <span className="text-[9px] font-black text-secondary uppercase tracking-widest leading-none border-l border-line pl-2">Pendente</span>
               )}
            </div>
          </div>
        </div>
        <button onClick={() => logout()} className="text-[10px] font-black text-secondary hover:text-ink uppercase tracking-widest transition-colors py-2 px-4 glass-card">
           SAIR
        </button>
      </header>

      {/* Main Focus Action: Check-in */}
      {!isCheckedInToday && (
        <div className="px-4 animate-fade">
          <button 
            onClick={onCheckIn}
            className="w-full py-6 rounded-2xl bg-highlight text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            MARCAR PRESENÇA <Check size={20} strokeWidth={4} />
          </button>
        </div>
      )}

      {/* Simplified Weekly Consistency */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Calendário Semanal</h3>
           {isCheckedInToday && (
             <span className="text-[9px] font-black text-highlight uppercase tracking-widest flex items-center gap-1.5">
               <Check size={10} strokeWidth={4}/> Confirmada
             </span>
           )}
        </div>
        
        <div className="flex justify-between gap-2">
           {weekActivity.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                 <span className={`text-[10px] font-black ${day.today ? 'text-accent' : 'text-secondary'}`}>
                   {day.label}
                 </span>
                 <div className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 ${
                   day.active 
                   ? 'bg-accent border-accent text-white' 
                   : day.today 
                     ? 'bg-accent/10 border-accent text-accent' 
                     : 'bg-transparent border-line text-secondary'
                 }`}>
                   {day.active && <Check size={16} strokeWidth={4} />}
                   {!day.active && day.today && <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>}
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Stats Grid - Symmetric and Compact */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
               <ClipboardList size={20} className="text-accent" />
             </div>
             <h3 className="text-[9px] font-black text-secondary uppercase tracking-widest">Plano Atual</h3>
          </div>
          <p className="text-base font-black text-ink uppercase tracking-tight">
            {initialWorkouts.length === 3 ? 'ABC' : 
             initialWorkouts.length === 4 ? 'ABCD' : 
             initialWorkouts.length === 5 ? 'ABCDE' : 'Personalizado'} Elite
          </p>
          <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-secondary">
            <span>Progresso</span>
            <span className="text-accent">65%</span>
          </div>
          <div className="mt-1.5 h-1 bg-ink/[0.05] rounded-full overflow-hidden">
            <div className="h-full bg-accent rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="glass-card p-5">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-highlight/10 flex items-center justify-center border border-highlight/20">
               <TrendingUp size={20} className="text-highlight" />
             </div>
             <h3 className="text-[9px] font-black text-secondary uppercase tracking-widest">Total Treinos</h3>
          </div>
          <p className="text-base font-black text-ink uppercase tracking-tight">{user.totalWorkouts || 0} Sessões</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border border-bg bg-line flex items-center justify-center">
                  <UserIcon size={10} className="text-secondary" />
                </div>
              ))}
            </div>
            <span className="text-[8px] font-black text-secondary uppercase tracking-widest">Ranking #3</span>
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <div className="glass-card p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp size={14} className="text-accent" /> Evolução de Volume
            </h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-accent rounded-full"></div>
               <span className="text-[9px] font-bold text-secondary uppercase tracking-widest">KG Levantados</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--highlight-color)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--highlight-color)" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: 'var(--bg-color)', 
                    border: '1px solid var(--border-color)',
                    borderRadius: '1.5rem',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    padding: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? 'url(#activeBarGradient)' : 'url(#barGradient)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">Meus Treinos</h3>
          <button className="text-[9px] font-black text-accent uppercase tracking-widest hover:brightness-110 transition-all">Ver Todos</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {initialWorkouts.map((workout, index) => {
            const lastDate = getLastCompletedDate(workout.id);
            const historyCount = getHistoryCount(workout.id);
            
            return (
              <div 
                key={workout.id} 
                className="glass-card glass-card-hover overflow-hidden transition-all duration-500 group cursor-pointer" 
                onClick={() => { 
                  handleVibrate();
                  setSelectedWorkout(workout); 
                  setActiveTab(AppTab.WORKOUT); 
                }}
              >
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center border border-accent/20 group-hover:scale-110 transition-all duration-500">
                      <Dumbbell size={32} className="text-accent" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-ink uppercase tracking-tight italic">Treino {String.fromCharCode(65 + index)}</h3>
                        {historyCount > 0 && (
                          <span className="bg-ink/[0.03] text-secondary text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-line">
                            {historyCount}x
                          </span>
                        )}
                      </div>
                      <p className="text-secondary text-xs font-bold uppercase tracking-widest mt-0.5">{workout.title}</p>
                      {lastDate && (
                        <p className="text-secondary text-[9px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                          <Calendar size={10} /> {lastDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="glass-card group-hover:bg-accent text-secondary group-hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
