
import React from 'react';
import { useStore } from '../../store';
import { Calendar, UserCircle2, ChevronUp, Flame, User as UserIcon, ClipboardList, TrendingUp } from 'lucide-react';
import { AppTab } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const DashboardView: React.FC = () => {
  const { user, allWorkouts, setActiveTab, setSelectedWorkout, handleManualCheckIn } = useStore();
  
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
    <div className="space-y-6 animate-slide-up pb-10 max-w-2xl mx-auto">
      {/* Main Training Header Card */}
      <div className="glass-card rounded-[2rem] p-6 border border-white/10">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center border-2 border-blue-500/50">
              <UserCircle2 size={40} className="text-blue-500" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Treino ABCD</h2>
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold mt-1">
                <Calendar size={12} />
                <span>14/07/2025 - 22/09/2025</span>
              </div>
            </div>
          </div>
          <button className="text-zinc-500 hover:text-white transition-colors">
            <ChevronUp size={24} />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-6 pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
            <Flame size={14} className="text-orange-500" />
            <span>Redução de Gordura/Hipertrofia</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">
            <UserIcon size={14} className="text-blue-500" />
            <span>Iniciante</span>
          </div>
        </div>
      </div>

      {/* Volume Chart */}
      {chartData.length > 0 && (
        <div className="glass-card rounded-[2rem] p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-500" /> Evolução de Volume (kg)
            </h3>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#71717a', fontSize: 10, fontWeight: 700 }} 
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ 
                    backgroundColor: '#18181b', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '1rem',
                    fontSize: '10px',
                    fontWeight: 700,
                    color: '#fff'
                  }}
                />
                <Bar dataKey="volume" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#10b981' : '#3b82f6'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Workout Cards List */}
      <div className="space-y-4">
        {initialWorkouts.map((workout, index) => {
          const lastDate = getLastCompletedDate(workout.id);
          const historyCount = getHistoryCount(workout.id);
          
          return (
            <div key={workout.id} className="glass-card rounded-[2rem] overflow-hidden border border-white/5">
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Treino {index + 1}</h3>
                  <p className="text-zinc-500 text-sm font-medium mt-1">{workout.title}</p>
                </div>

                {lastDate && (
                  <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                    Último treino concluído em: {lastDate}
                  </p>
                )}

                <div className="grid grid-cols-1 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/10 hover:bg-white/5 transition-all group">
                    <ClipboardList size={16} className="text-blue-500" />
                    <span className="text-zinc-400 text-[10px] font-black uppercase tracking-widest group-hover:text-white">Histórico</span>
                    {historyCount > 0 && (
                      <span className="bg-blue-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                        {historyCount}
                      </span>
                    )}
                  </button>
                </div>

                <button 
                  onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 uppercase tracking-[0.2em] active:scale-[0.98] transition-all text-xs"
                >
                  VER TREINO
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly Consistency */}
      <div className="glass-card p-6 rounded-[2rem] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[9px] font-black text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-1.5">
            <Calendar size={14} className="text-emerald-500" /> Consistência Semanal
          </h3>
          <div className="flex items-center gap-2">
             <Flame size={14} className="text-orange-500" />
             <span className="text-sm font-black text-white">{user.streak || 0}</span>
          </div>
        </div>
        <div className="flex justify-between items-center max-w-lg mx-auto gap-1">
          {weekActivity.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <button 
                onClick={() => day.today && !day.active ? handleManualCheckIn() : null}
                disabled={!day.today || day.active}
                className={`w-9 h-11 md:w-12 md:h-14 rounded-[1rem] flex flex-col items-center justify-center transition-all duration-300 border ${
                  day.active 
                  ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-lg shadow-emerald-500/20 scale-105' 
                  : day.today 
                    ? 'bg-zinc-900 border-emerald-500/50 text-white animate-pulse' 
                    : 'bg-zinc-900/40 border-white/5 text-zinc-600'
                }`}
              >
                <span className="text-[10px] md:text-xs font-black">{day.label}</span>
                {day.today && !day.active && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5"></div>}
              </button>
            </div>
          ))}
        </div>
        {!isCheckedInToday && (
          <button 
            onClick={handleManualCheckIn}
            className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
          >
            Fazer Check-in Hoje
          </button>
        )}
      </div>
    </div>
  );
};
