import React from 'react';
import { useStore } from '../../store';
import { AppTab } from '../../types';
import { Play, CheckCircle2, Flame, Clock, Calendar, LogOut } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { 
    user, 
    allWorkouts, 
    setActiveTab, 
    setSelectedWorkout, 
    logout, 
    handleManualCheckIn 
  } = useStore();
  
  if (!user) return null;

  const handleVibrate = (duration = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const checkedInToday = user.checkIns?.includes(todayStr) || false;

  const handleCheckInClick = () => {
    handleVibrate(30);
    handleManualCheckIn();
  };

  // Weekly consistency dates
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday adjustment
    const monday = new Date(today.setDate(diff));
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };
  
  const weekDates = getWeekDates();
  const weekDays = ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'];
  const currentWeekWorkoutsCount = weekDates.filter(date => user.checkIns?.includes(date)).length;

  // Next/Active workout
  const workouts = allWorkouts[user.username.toLowerCase() as keyof typeof allWorkouts] || [];
  const nextWorkout = workouts[0] || null;

  const startActiveWorkout = () => {
    handleVibrate();
    if (nextWorkout) {
      setSelectedWorkout(nextWorkout);
    } else {
      setActiveTab(AppTab.WORKOUT);
    }
  };

  // Last workout
  const lastWorkout = user.history && user.history.length > 0 ? user.history[0] : null;

  const formatDatePT = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      
      const dStr = d.toISOString().split('T')[0];
      const todayStr = today.toISOString().split('T')[0];
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      if (dStr === todayStr) {
        return `Hoje às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      } else if (dStr === yesterdayStr) {
        return `Ontem às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      } else {
        return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} às ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
      }
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between py-4 px-3 bg-transparent text-white font-sans antialiased select-none">
      
      {/* HEADER: Ultra Minimalist */}
      <div className="flex justify-between items-center shrink-0 mb-4 px-1">
        <div>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent font-mono">TATU GYM</span>
          <h1 className="text-xl font-extrabold text-white tracking-tight leading-none mt-1">
            Olá, <span className="text-zinc-100">{user.name.split(' ')[0]}</span>
          </h1>
        </div>
        
        <button 
          onClick={() => {
            handleVibrate();
            logout();
          }} 
          className="text-zinc-500 hover:text-rose-400 p-2 transition-colors rounded-lg hover:bg-white/[0.02]"
          title="Sair"
        >
          <LogOut size={15} />
        </button>
      </div>

      {/* BODY PANEL: Floating cards removed to maintain elegant negative space */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-7 pb-2 px-1">
        
        {/* SECTION 1: TODAY'S SESSION (Main Focal Point) */}
        {nextWorkout ? (
          <div className="space-y-3">
            <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase font-mono block">Sua sessão de hoje</span>
            <div className="relative overflow-hidden group bg-gradient-to-b from-zinc-900/50 to-zinc-950/20 border border-white/5 rounded-2xl p-5 shadow-lg">
              
              <div className="space-y-1.5 text-left mb-6">
                <span className="text-[8px] font-black bg-accent/10 border border-accent/20 text-accent px-2 py-0.5 rounded-full uppercase tracking-wider font-mono inline-block mb-1">
                  Recomendado
                </span>
                <h2 className="text-lg font-black text-white uppercase tracking-tight leading-tight group-hover:text-accent transition-colors">
                  {nextWorkout.title}
                </h2>
                <p className="text-xs font-medium text-zinc-400 leading-relaxed max-w-sm">
                  {nextWorkout.description || 'Hipertrofia de Fibras'}
                </p>
              </div>

              {/* Workout technical specs */}
              <div className="flex gap-4 items-center text-[10px] font-mono text-zinc-500 border-t border-white/[0.03] pt-3.5">
                <div>
                  <span className="text-[7px] text-zinc-500 uppercase block tracking-wider">COMPOSIÇÃO</span>
                  <span className="font-extrabold text-zinc-300 mt-1 block leading-none">{nextWorkout.exercises?.length || 0} EXERCÍCIOS</span>
                </div>
                <div className="h-5 w-px bg-white/5" />
                <div>
                  <span className="text-[7px] text-zinc-500 uppercase block tracking-wider">ESTIMAÇÃO</span>
                  <span className="font-extrabold text-zinc-300 mt-1 block leading-none">~45 MINUTOS</span>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-zinc-650 italic">
            Nenhum protocolo cadastrado hoje.
          </div>
        )}

        {/* SECTION 2: LAST WORKOUT DETAIL (Compact inline design) */}
        <div>
          {lastWorkout ? (
            <div className="bg-zinc-950/20 border border-white/[0.03] rounded-xl py-3 px-4 flex items-center justify-between gap-3 text-left">
              <div className="min-w-0 flex-grow">
                <span className="text-[7px] font-black tracking-widest text-zinc-500 uppercase font-mono block mb-1">Último treino realizado</span>
                <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-tight truncate">
                  {lastWorkout.workoutTitle}
                </h4>
                <div className="flex items-center gap-1.5 text-[8.5px] font-semibold text-zinc-500 mt-1 uppercase">
                  <Clock size={9} />
                  <span>{formatDatePT(lastWorkout.date)}</span>
                </div>
              </div>
              <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/5 text-emerald-400 border border-emerald-500/10">
                <CheckCircle2 size={13} strokeWidth={2.5} />
              </div>
            </div>
          ) : (
            <div className="text-center text-[9.5px] font-mono text-zinc-650 py-1 uppercase tracking-widest">
              Nenhum treino completado ainda.
            </div>
          )}
        </div>

        {/* SECTION 3: CONSISTENCY + QUICK CHECK-IN (Combined Horizontal Layout) */}
        <div className="space-y-4 pt-1">
          {/* Consistency indicator title */}
          <div className="flex justify-between items-baseline px-0.5">
            <span className="text-[7.5px] font-black tracking-[0.2em] text-zinc-500 uppercase font-mono">Frequência Semanal</span>
            <span className="text-[8px] font-semibold text-zinc-400 font-mono">
              {currentWeekWorkoutsCount} de 5 dias
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 items-center bg-zinc-950/10 border border-white/[0.02] rounded-xl p-3">
            {/* Days Dots Grid (Sleek minimalist dots representation) */}
            <div className="col-span-7 flex justify-between px-1">
              {weekDays.map((dia, idx) => {
                const dateStr = weekDates[idx];
                const treinou = user.checkIns?.includes(dateStr) || false;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <span className="text-[8px] font-bold font-mono text-zinc-500 leading-none">{dia}</span>
                    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      treinou 
                        ? 'bg-accent shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.75)] scale-110' 
                        : 'bg-zinc-800'
                    }`} />
                  </div>
                );
              })}
            </div>

            <div className="h-8 w-px bg-white/5 col-span-1 justify-self-center" />

            {/* Quick Check-in Button / Streak Status */}
            <div className="col-span-4 flex flex-col justify-center items-stretch my-auto">
              {checkedInToday ? (
                <div className="flex flex-col items-center justify-center leading-none text-center">
                  <div className="flex items-center gap-1 text-emerald-400 font-black text-[7.5px] uppercase tracking-wider mb-1">
                    <CheckCircle2 size={8} strokeWidth={3} /> PRESENÇA✓
                  </div>
                  <div className="flex items-center gap-0.5 text-amber-500 font-mono text-[9px] font-bold mt-0.5">
                    <Flame size={9} className="fill-amber-500/10" />
                    <span>{user.streak || 0}d streak</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleCheckInClick}
                  className="w-full bg-accent hover:brightness-105 active:scale-95 text-black font-extrabold text-[8.5px] py-2 rounded-lg leading-none uppercase tracking-wider transition-all cursor-pointer shadow-md duration-200"
                >
                  Check-in
                </button>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* QUICK FOOTER DIRECT ACTION: Floating-like style with negative contrast */}
      <div className="px-1 shrink-0 pt-3">
        <button
          onClick={startActiveWorkout}
          className="w-full bg-accent hover:bg-accent/90 text-black font-black uppercase py-3 rounded-xl text-xs active:scale-[0.98] transition-all flex justify-center items-center gap-1.5 tracking-wider shadow-[0_4px_16px_rgba(var(--accent-color-rgb),0.12)] cursor-pointer"
        >
          <Play size={11} className="fill-black text-black" /> Iniciar Treino
        </button>
      </div>
      
    </div>
  );
};
