
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
          <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm overflow-hidden">
             {user.avatar ? (
               <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
             ) : (
               <UserIcon size={20} className="text-slate-300" />
             )}
          </div>
          <div className="flex flex-col">
            <h1 className="text-3xl font-black italic tracking-tighter leading-none text-slate-900">{user.name.toUpperCase()}</h1>
            <div className="flex items-center gap-2 mt-1.5">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                 {initialWorkouts.length === 3 ? 'ABC' : 
                  initialWorkouts.length === 4 ? 'ABCD' : 
                  initialWorkouts.length === 5 ? 'ABCDE' : 'Personalizado'} Elite
               </span>
               {!isCheckedInToday && (
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest leading-none border-l border-slate-200 pl-2">Pendente</span>
               )}
            </div>
          </div>
        </div>
        <button onClick={() => logout()} className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors py-2 px-5 bg-white border border-slate-200 rounded-full shadow-sm active:scale-95">
           SAIR
        </button>
      </header>

      {/* Main Focus Action: Check-in */}
      {!isCheckedInToday && (
        <div className="px-4 animate-fade">
          <button 
            onClick={onCheckIn}
            className="w-full py-6 rounded-2xl bg-indigo-600 text-white text-[11px] font-black uppercase tracking-[0.4em] shadow-xl shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            MARCAR PRESENÇA <Check size={20} strokeWidth={4} />
          </button>
        </div>
      )}

      {/* Simplified Weekly Consistency */}
      <div className="glass-card rounded-[2.5rem] p-6">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Consistência Semanal</h3>
           {isCheckedInToday && (
             <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               Check-in Realizado
             </span>
           )}
        </div>
        
        <div className="flex justify-between gap-3">
           {weekActivity.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                 <span className={`text-[10px] font-black ${day.today ? 'text-indigo-600' : 'text-slate-400'}`}>
                   {day.label}
                 </span>
                 <div className={`w-full aspect-square rounded-2xl border-2 flex items-center justify-center transition-all duration-500 ${
                   day.active 
                   ? 'bg-emerald-500 border-emerald-400 text-white shadow-lg shadow-emerald-100' 
                   : day.today 
                     ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                     : 'bg-slate-50 border-slate-100 text-transparent'
                 }`}>
                   {day.active && <Check size={18} strokeWidth={4} />}
                   {!day.active && day.today && <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>}
                 </div>
              </div>
           ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-5">
        <div className="glass-card rounded-[2.5rem] p-6 border-white shadow-indigo-950/5">
          <div className="flex items-center gap-4 mb-5">
             <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
               <ClipboardList size={22} className="text-indigo-600" />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Plano<br/>Atual</h3>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">
            {initialWorkouts.length === 3 ? 'ABC' : 
             initialWorkouts.length === 4 ? 'ABCD' : 
             initialWorkouts.length === 5 ? 'ABCDE' : 'Personalizado'}
          </p>
          <div className="mt-5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
            <span>Progressão</span>
            <span className="text-indigo-600">72%</span>
          </div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full w-[72%]"></div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-6 border-white shadow-indigo-950/5">
          <div className="flex items-center gap-4 mb-5">
             <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-100">
               <TrendingUp size={22} className="text-rose-500" />
             </div>
             <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Total<br/>Treinos</h3>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tighter italic uppercase">{user.totalWorkouts || 0} Sessões</p>
          <div className="mt-5 flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center">
                  <UserIcon size={12} className="text-slate-400" />
                </div>
              ))}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Global Rank #5</span>
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-[2.5rem] p-8 border-white shadow-indigo-950/5 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center gap-3">
              <div className="w-1 h-1 bg-indigo-600"></div> Performance
            </h3>
            <div className="flex items-center gap-3">
               <div className="w-2.5 h-2.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-full"></div>
               <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume (KG)</span>
            </div>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#818cf8" stopOpacity={0.6} />
                  </linearGradient>
                  <linearGradient id="activeBarGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 900 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9', radius: 8 }}
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: 'none',
                    borderRadius: '1.5rem',
                    fontSize: '11px',
                    fontWeight: 900,
                    color: '#0f172a',
                    padding: '16px',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)'
                  }}
                />
                <Bar dataKey="volume" radius={[12, 12, 12, 12]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === chartData.length - 1 ? 'url(#activeBarGradient)' : 'url(#barGradient)'} 
                      className="transition-all duration-300 hover:opacity-80"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Cards List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Selecione seu Treino</h3>
          <ArrowRight size={16} className="text-slate-300" />
        </div>
        
        <div className="grid grid-cols-1 gap-5 px-2">
          {initialWorkouts.map((workout, index) => {
            const lastDate = getLastCompletedDate(workout.id);
            const historyCount = getHistoryCount(workout.id);
            
            const colorMap: Record<string, string> = {
              blue: 'bg-indigo-600',
              orange: 'bg-orange-500',
              green: 'bg-emerald-500',
              emerald: 'bg-emerald-500'
            };

            const lightColorMap: Record<string, string> = {
              blue: 'bg-indigo-50 border-indigo-100 text-indigo-600',
              orange: 'bg-orange-50 border-orange-100 text-orange-600',
              green: 'bg-emerald-50 border-emerald-100 text-emerald-600',
              emerald: 'bg-emerald-50 border-emerald-100 text-emerald-600'
            };

            return (
              <div 
                key={workout.id} 
                className="glass-card glass-card-hover rounded-[2.5rem] overflow-hidden border-white shadow-indigo-950/5 group cursor-pointer" 
                onClick={() => { 
                  handleVibrate();
                  setSelectedWorkout(workout); 
                  setActiveTab(AppTab.WORKOUT); 
                }}
              >
                <div className="p-6 flex items-center justify-between gap-5">
                  <div className="flex items-center gap-6">
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center border group-hover:scale-105 transition-all duration-700 ${lightColorMap[workout.color] || 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                      <Dumbbell size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Treino {String.fromCharCode(65 + index)}</h3>
                        {historyCount > 0 && (
                          <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-indigo-100">
                            {historyCount}x
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1.5">{workout.title}</p>
                      {lastDate && (
                        <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                          <Calendar size={12} /> {lastDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 group-hover:bg-indigo-600 text-slate-300 group-hover:text-white w-14 h-14 rounded-2xl flex items-center justify-center transition-all border border-slate-100 group-hover:border-indigo-500 shadow-sm group-hover:shadow-indigo-200">
                    <ArrowRight size={24} strokeWidth={3} />
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
