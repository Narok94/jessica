
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
      {/* Header with Welcome */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            FORÇA, <span className="text-blue-500">{user.name.split(' ')[0]}</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 flex items-center gap-2">
            <Target size={12} className="text-blue-500" /> Seu progresso é sua prioridade
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-zinc-900/40 p-3 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
              <Flame size={24} className="text-orange-500 animate-pulse" />
            </div>
            <div>
              <span className="block text-xl font-black text-white leading-none">{user.streak || 0}</span>
              <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">DIAS SEGUIDOS</span>
            </div>
          </div>
          <button 
            onClick={() => logout()} 
            className="w-12 h-12 bg-zinc-900/40 rounded-2xl flex items-center justify-center text-rose-500 border border-white/5 hover:bg-rose-500/10 transition-all backdrop-blur-md"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Weekly Consistency (Check-in) - TOP POSITION */}
      <div className="glass-card p-6 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group bg-gradient-to-br from-zinc-900/40 to-black/40">
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[80px] rounded-full -mr-24 -mt-24 group-hover:bg-emerald-500/10 transition-all duration-700"></div>
        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
                <Calendar size={14} className="text-emerald-500" /> Consistência Semanal
              </h3>
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Mantenha o ritmo para melhores resultados</p>
            </div>
            {isCheckedInToday ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Check-in OK</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest">Pendente</span>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center gap-2">
            {weekActivity.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-3 flex-1">
                <button 
                  onClick={() => day.today && !day.active ? handleManualCheckIn() : null}
                  disabled={!day.today || day.active}
                  className={`w-full aspect-[4/5] rounded-2xl flex flex-col items-center justify-center transition-all duration-500 border ${
                    day.active 
                    ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/40 scale-105' 
                    : day.today 
                      ? 'bg-zinc-900/80 border-emerald-500/50 text-white shadow-lg shadow-emerald-500/10' 
                      : 'bg-zinc-900/40 border-white/5 text-zinc-600'
                  }`}
                >
                  <span className="text-[10px] font-black">{day.label}</span>
                  {day.today && !day.active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 animate-pulse"></div>}
                  {day.active && <Check size={14} className="mt-1" strokeWidth={4} />}
                </button>
              </div>
            ))}
          </div>

          {!isCheckedInToday && (
            <button 
              onClick={handleManualCheckIn}
              className="w-full py-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 group"
            >
              MARCAR PRESENÇA HOJE <Check size={18} strokeWidth={3} className="group-hover:scale-125 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-[2.5rem] p-6 border border-white/10 bg-gradient-to-br from-zinc-900/50 to-zinc-950 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Zap size={80} className="text-blue-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <ClipboardList size={28} className="text-blue-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Plano Atual</h3>
              <p className="text-sm font-black text-white uppercase tracking-tight mt-0.5">ABCD Elite</p>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-zinc-500">
              <span>Progresso</span>
              <span className="text-blue-500">65%</span>
            </div>
            <div className="h-1.5 bg-zinc-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full w-[65%] shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-[2.5rem] p-6 border border-white/10 bg-gradient-to-br from-zinc-900/50 to-zinc-950 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <Award size={80} className="text-purple-500" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
              <TrendingUp size={28} className="text-purple-500" />
            </div>
            <div>
              <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Treinos</h3>
              <p className="text-sm font-black text-white uppercase tracking-tight mt-0.5">{user.totalWorkouts || 0} Sessões</p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-zinc-950 bg-zinc-800 flex items-center justify-center">
                  <UserIcon size={12} className="text-zinc-500" />
                </div>
              ))}
            </div>
            <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">+12 AMIGOS</span>
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
