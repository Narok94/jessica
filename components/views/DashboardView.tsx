
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

  return (
    <div className="space-y-8 animate-slide-up pb-10 max-w-2xl mx-auto">
      {/* Minimalist Header */}
      <header className="flex items-center justify-between py-4 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 overflow-hidden">
             {user.avatar ? (
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <UserIcon size={18} className="text-zinc-500" />
             )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl leading-none tracking-tight">JÉSSICA</h1>
            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-0.5">ABCD Elite</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           {!isCheckedInToday && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">PENDENTE</span>
              </div>
           )}
           <button onClick={() => logout()} className="p-2 text-zinc-500 hover:text-white transition-colors">
              <LogOut size={20} />
           </button>
        </div>
      </header>

      {/* Main Focus Action: Check-in */}
      {!isCheckedInToday && (
        <div className="animate-fade">
          <button 
            onClick={handleManualCheckIn}
            className="w-full py-6 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-green-600 text-bg text-[11px] font-black uppercase tracking-[0.4em] shadow-[0_20px_50px_rgba(16,185,129,0.2)] transition-all active:scale-95 flex items-center justify-center gap-3 group"
          >
            MARCAR PRESENÇA <Check size={20} strokeWidth={4} />
          </button>
        </div>
      )}

      {/* Simplified Weekly Consistency */}
      <div className="glass-card rounded-[2rem] p-5">
        <div className="flex items-center justify-between mb-4">
           <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">Calendário Semanal</h3>
           {isCheckedInToday && (
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
               <Check size={10} strokeWidth={4}/> Confirmada
             </span>
           )}
        </div>
        
        <div className="flex justify-between gap-2">
           {weekActivity.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                 <span className={`text-[10px] font-black ${day.today ? 'text-blue-500' : 'text-zinc-600'}`}>
                   {day.label}
                 </span>
                 <div className={`w-full aspect-square rounded-xl border flex items-center justify-center transition-all duration-300 ${
                   day.active 
                   ? 'bg-emerald-500 border-emerald-400 text-bg' 
                   : day.today 
                     ? 'bg-white/10 border-blue-500/50 text-white' 
                     : 'bg-transparent border-white/5 text-zinc-800'
                 }`}>
                   {day.active && <Check size={16} strokeWidth={4} />}
                   {!day.active && day.today && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>}
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Stats Grid - Symmetric and Compact */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-[2rem] p-5 border border-white/5 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
               <ClipboardList size={20} className="text-blue-500" />
             </div>
             <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Plano Atual</h3>
          </div>
          <p className="text-base font-black text-white uppercase tracking-tight">ABCD Elite</p>
          <div className="mt-4 flex items-center justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600">
            <span>Volume</span>
            <span className="text-blue-500">65%</span>
          </div>
          <div className="mt-1.5 h-1 bg-zinc-800/50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="glass-card rounded-[2rem] p-5 border border-white/5 bg-zinc-900/20">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
               <TrendingUp size={20} className="text-purple-500" />
             </div>
             <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Total Treinos</h3>
          </div>
          <p className="text-base font-black text-white uppercase tracking-tight">{user.totalWorkouts || 0} Sessões</p>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {[1,2,3].map(i => (
                <div key={i} className="w-5 h-5 rounded-full border border-zinc-950 bg-zinc-800 flex items-center justify-center">
                  <UserIcon size={10} className="text-zinc-600" />
                </div>
              ))}
            </div>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Ranking #3</span>
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-[2.5rem] p-6 border border-white/5 space-y-6 bg-zinc-900/20">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
              <TrendingUp size={14} className="text-blue-500" /> Evolução de Volume
            </h3>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
               <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">KG Levantados</span>
            </div>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity={0.4} />
                  </linearGradient>
                  <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#059669" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 800 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#09090b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1.5rem',
                    fontSize: '10px',
                    fontWeight: 800,
                    color: '#fff',
                    padding: '12px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
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
          <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Meus Treinos</h3>
          <button className="text-[9px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">Ver Todos</button>
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {initialWorkouts.map((workout, index) => {
            const lastDate = getLastCompletedDate(workout.id);
            const historyCount = getHistoryCount(workout.id);
            
            return (
              <div key={workout.id} className="glass-card glass-card-hover rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer" onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }}>
                <div className="p-6 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className={`w-16 h-16 rounded-2xl bg-${workout.color}-500/10 flex items-center justify-center border border-${workout.color}-500/20 group-hover:scale-110 group-hover:bg-${workout.color}-500/20 transition-all duration-500`}>
                      <Dumbbell size={32} className={`text-${workout.color}-500`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Treino {String.fromCharCode(65 + index)}</h3>
                        {historyCount > 0 && (
                          <span className="bg-zinc-800/50 text-zinc-500 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/5">
                            {historyCount}x
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-0.5">{workout.title}</p>
                      {lastDate && (
                        <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                          <Calendar size={10} /> {lastDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-zinc-900/50 group-hover:bg-blue-600 text-zinc-600 group-hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/5">
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
