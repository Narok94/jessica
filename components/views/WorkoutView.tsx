
import React, { useEffect, useRef } from 'react';
import { useStore } from '../../store';
import { ChevronLeft, Clock, CheckCircle2, Play, LayoutDashboard, Quote } from 'lucide-react';
import { ExerciseItem } from '../ExerciseItem';
import { SetPerformance, WorkoutHistoryEntry, AppTab } from '../../types';

export const WorkoutView: React.FC = () => {
  const { 
    selectedWorkout, 
    user, 
    showSummary, 
    isWorkoutActive, 
    elapsedTime, 
    currentSessionProgress,
    workoutDuration,
    lastWorkoutVolume,
    setIsWorkoutActive,
    setWorkoutStartTime,
    setElapsedTime,
    setCurrentSessionProgress,
    setShowSummary,
    setLastWorkoutVolume,
    setWorkoutDuration,
    updateUserProfile,
    triggerConfetti,
    setActiveTab,
    setSelectedWorkout,
    workoutStartTime
  } = useStore();

  const timerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isWorkoutActive && workoutStartTime) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isWorkoutActive, workoutStartTime, setElapsedTime]);

  if (!selectedWorkout || !user) return null;

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":");
  };

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setWorkoutStartTime(Date.now());
    setElapsedTime(0);
  };

  const calculateVolume = () => {
    let total = 0;
    (Object.values(currentSessionProgress) as SetPerformance[][]).forEach((perf) => {
      if (perf) {
        perf.filter(p => p.completed).forEach(p => {
          total += (p.weight * p.reps);
        });
      }
    });
    return total;
  };

  const handleSaveProgress = (exerciseId: string, performance: SetPerformance[]) => {
    setCurrentSessionProgress({ ...currentSessionProgress, [exerciseId]: performance });
  };

  const handleFinishWorkout = () => {
    if (!selectedWorkout || !user || !workoutStartTime) return;
    const today = new Date().toISOString().split('T')[0];
    const volume = calculateVolume();
    setLastWorkoutVolume(volume);
    
    const duration = Math.floor((Date.now() - workoutStartTime) / 1000);
    setWorkoutDuration(duration);
    setIsWorkoutActive(false);

    const historyEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
      duration: duration,
      exercises: selectedWorkout.exercises.map(ex => ({
        exerciseId: ex.id,
        name: ex.name,
        performance: currentSessionProgress[ex.id] || []
      }))
    };

    const newWeights: Record<string, number> = { ...(user.weights || {}) };
    
    Object.entries(currentSessionProgress).forEach(([id, perf]) => {
      const p = perf as SetPerformance[];
      const lastWeight = p.filter(item => item.completed).reverse()[0]?.weight;
      if (lastWeight) newWeights[id] = lastWeight;
    });

    const newCheckIns = user.checkIns.includes(today) ? user.checkIns : [...user.checkIns, today];
    
    updateUserProfile({ 
      history: [historyEntry, ...user.history],
      totalWorkouts: (user.totalWorkouts || 0) + 1,
      weights: newWeights,
      checkIns: newCheckIns,
      streak: (user.streak || 0) + 1
    });

    triggerConfetti();
    localStorage.removeItem(`tatugym_active_session_${user.username.toLowerCase()}`);
    setShowSummary(true);
  };

  const closeSummary = () => {
    setShowSummary(false);
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setWorkoutStartTime(null);
    setWorkoutDuration(null);
    setElapsedTime(0);
    setIsWorkoutActive(false);
    setActiveTab(AppTab.DASHBOARD);
  };

  const exitWorkout = () => {
      setSelectedWorkout(null);
      setShowSummary(false);
      setActiveTab(AppTab.DASHBOARD);
  };

  const cancelWorkout = () => {
    if(confirm('Tem certeza que deseja descarar este treino? Todo o progresso desta sessão será perdido.')) { 
      if (user) {
        localStorage.removeItem(`tatugym_active_session_${user.username.toLowerCase()}`);
      }
      setSelectedWorkout(null);
      setCurrentSessionProgress({});
      setWorkoutStartTime(null);
      setElapsedTime(0);
      setIsWorkoutActive(false);
      setActiveTab(AppTab.DASHBOARD);
    }
  };

  if (showSummary) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-slide-up py-6 text-center">
         <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30 transform rotate-12 animate-fade">
              <CheckCircle2 size={48} className="text-zinc-950" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none">Treino <span className="text-emerald-500">Concluído!</span></h1>
              <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Sessão finalizada com sucesso.</p>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-4">
            <div className="glass-card glass-card-hover p-6 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Volume de Carga</p>
               <div className="flex items-end justify-center gap-1">
                  <span className="text-3xl font-black text-white">{lastWorkoutVolume}</span>
                  <span className="text-[10px] font-bold text-emerald-500 mb-1.5 uppercase">kg</span>
               </div>
            </div>
            <div className="glass-card glass-card-hover p-6 rounded-[2rem] border border-blue-500/10 bg-blue-500/5">
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Duração</p>
               <div className="flex items-end justify-center gap-1">
                  <span className="text-2xl font-black text-white">{workoutDuration ? formatTime(workoutDuration) : '00:00'}</span>
                  <Clock size={16} className="text-blue-500 mb-1.5" />
               </div>
            </div>
         </div>

         <div className="glass-card p-8 rounded-[2.5rem] space-y-4 relative overflow-hidden">
            <Quote className="absolute -top-4 -left-4 text-white/5 w-24 h-24" />
            <div className="relative z-10">
               <p className="text-zinc-300 font-bold italic text-lg leading-relaxed">
                 "A constância é a mãe da evolução. Parabéns por hoje."
               </p>
            </div>
         </div>

         <button 
           onClick={closeSummary} 
           className="w-full bg-white text-zinc-950 font-black py-5 rounded-[1.8rem] shadow-xl uppercase tracking-[0.4em] active:scale-95 text-[10px] transition-all flex items-center justify-center gap-3"
         >
           <LayoutDashboard size={18} /> Voltar para o Dashboard
         </button>
      </div>
    );
  }

  const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + (perf ? perf.filter(p => p.completed).length : 0), 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-up pb-64">
      <header className="flex items-center justify-between sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-lg py-4 border-b border-white/5 -mx-4 px-4">
        <div className="flex items-center gap-3">
          <button onClick={exitWorkout} className="w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white transition-all bg-zinc-900 rounded-xl border border-white/5 active:scale-95">
            <ChevronLeft size={20}/>
          </button>
          <div>
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">{selectedWorkout.title}</p>
            <div className="flex items-center gap-2">
               <span className={`w-1.5 h-1.5 rounded-full ${isWorkoutActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
               <span className="text-xs font-black text-white italic uppercase tracking-tight">SESSÃO ATIVA</span>
            </div>
          </div>
        </div>

        {isWorkoutActive && (
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Volume (kg)</p>
              <p className="text-sm font-black text-blue-500">{calculateVolume()}</p>
            </div>
            <div className="bg-zinc-900 border border-white/10 px-4 py-2 rounded-2xl flex items-center gap-3">
              <Clock size={16} className="text-emerald-500" />
              <span className="text-lg font-black text-white font-mono leading-none">{formatTime(elapsedTime)}</span>
            </div>
          </div>
        )}
      </header>

      {!isWorkoutActive && (
        <div className="glass-card p-10 rounded-[3rem] border border-emerald-500/20 bg-zinc-900/40 text-center space-y-8 animate-fade">
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30 transform rotate-12">
            <Play size={44} className="text-zinc-950 ml-1.5" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">BORA <span className="text-emerald-500">EVOLUIR?</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Clique abaixo para iniciar sua sessão.</p>
          </div>
          <button 
            onClick={startWorkout}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-6 rounded-[2rem] shadow-2xl shadow-emerald-500/20 uppercase tracking-[0.5em] active:scale-95 transition-all text-xs"
          >
            INICIAR TREINO
          </button>
        </div>
      )}

      {isWorkoutActive && (
        <div className="space-y-8">
          <div className="bg-zinc-900/60 p-5 rounded-[2rem] border border-white/5 backdrop-blur-md">
             <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">PROGRESSO TOTAL</span>
                  <span className="text-[10px] font-black text-white uppercase tracking-tight mt-0.5">{completedSets} / {totalSets} SÉRIES</span>
                </div>
                <div className="flex items-center gap-2">
                   <div className="text-right sm:hidden">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">VOLUME</p>
                      <p className="text-[10px] font-black text-blue-500">{calculateVolume()} kg</p>
                   </div>
                   <span className="text-xl font-black text-emerald-500 italic">{progressPercent}%</span>
                </div>
             </div>
             <div className="h-3 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {selectedWorkout.exercises.map(ex => (
              <ExerciseItem 
                key={ex.id} 
                exercise={ex} 
                onSaveProgress={handleSaveProgress} 
                savedWeight={user.weights?.[ex.id]} 
                initialPerformance={currentSessionProgress[ex.id]}
              />
            ))}
          </div>

          <div className="pt-8 pb-32">
            {completedSets > 0 && (
               <button 
                onClick={handleFinishWorkout} 
                className="w-full font-black py-6 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.5em] active:scale-95 flex items-center justify-center gap-4 text-xs transition-all bg-emerald-500 text-zinc-950 shadow-emerald-500/40 hover:bg-emerald-400 group"
              >
                <CheckCircle2 size={24} strokeWidth={4} className="group-hover:scale-125 transition-transform" /> FINALIZAR TREINO
              </button>
            )}
            <button 
              onClick={cancelWorkout}
              className="w-full mt-4 text-[9px] font-black text-zinc-600 hover:text-red-500 uppercase tracking-widest transition-colors py-2 active:scale-95"
            >
              DESCARTAR SESSÃO ATUAL
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
