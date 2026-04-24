
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

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const startWorkout = () => {
    handleVibrate(20);
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
      <header className="flex items-center justify-between sticky top-0 z-50 bg-bg/80 backdrop-blur-xl py-4 border-b border-white/[0.08] -mx-4 px-4">
        <div className="flex items-center gap-3 min-w-0">
          <button onClick={exitWorkout} className="w-10 h-10 flex items-center justify-center text-zinc-600 hover:text-white transition-all bg-white/[0.02] rounded-xl border border-white/[0.08] active:scale-95">
            <ChevronLeft size={18}/>
          </button>
          <div className="min-w-0">
            <h1 className="text-base font-black text-white italic truncate leading-none uppercase tracking-tighter">{selectedWorkout.title}</h1>
            {isWorkoutActive && (
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block tracking-tight uppercase">SESSÃO EM CURSO</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isWorkoutActive ? (
             <>
               <div className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.08] rounded-lg">
                  <span className="text-xl font-bold text-white font-mono leading-none tracking-tight">{formatTime(elapsedTime)}</span>
               </div>
               <button 
                 onClick={handleFinishWorkout}
                 className="px-4 py-1.5 bg-emerald-500 text-bg font-black text-[10px] uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
               >
                 FINALIZAR
               </button>
             </>
          ) : (
            <button 
              onClick={startWorkout}
              className="px-6 py-2.5 bg-emerald-500 text-bg font-black text-[10px] uppercase tracking-widest rounded-lg active:scale-95 transition-all shadow-[0_0_20px_rgba(16,185,129,0.15)]"
            >
              INICIAR TREINO
            </button>
          )}
        </div>
      </header>

      {isWorkoutActive && (
        <div className="space-y-8 animate-fade px-4">
          <div className="flex items-center justify-between">
             <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">PROGRESSO TOTAL</span>
                <span className="text-xl font-black text-white leading-none mt-1">{completedSets} / {totalSets}</span>
             </div>
             <div className="text-right">
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">VOLUME TOTAL</span>
                <span className="block text-xl font-black text-emerald-500 leading-none mt-1">{calculateVolume()} KG</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-4 items-start pb-40">
            {selectedWorkout.exercises.map(ex => (
              <ExerciseItem 
                key={ex.id} 
                exercise={ex} 
                onSaveProgress={handleSaveProgress} 
                savedWeight={user.weights?.[ex.id]} 
                initialPerformance={currentSessionProgress[ex.id]}
              />
            ))}
            
            <div className="pt-10 flex flex-col gap-4">
              <button 
                onClick={() => {
                  handleVibrate(30);
                  handleFinishWorkout();
                }}
                disabled={completedSets === 0}
                className={`w-full py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-3 ${
                  completedSets > 0 
                  ? 'bg-emerald-500 text-bg shadow-[0_0_20px_rgba(16,185,129,0.15)]' 
                  : 'bg-white/[0.03] border border-white/[0.08] text-zinc-700 cursor-not-allowed'
                }`}
              >
                FINALIZAR SESSÃO
              </button>
              <button 
                onClick={() => {
                   handleVibrate(10);
                   cancelWorkout();
                }}
                className="w-full py-3 text-[10px] font-black text-zinc-600 hover:text-white uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                CANCELAR TREINO
              </button>
            </div>
          </div>
        </div>
      )}

      {!isWorkoutActive && (
         <div className="py-12 px-4 animate-fade">
            <div className="glass-card p-10 rounded-[2rem] text-center border-white/[0.05]">
               <h2 className="text-2xl font-black italic text-white uppercase tracking-tighter mb-2">Pronto para começar?</h2>
               <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-8">Treino {selectedWorkout.title} • {selectedWorkout.exercises.length} Exercícios</p>
               <button 
                  onClick={startWorkout}
                  className="w-full bg-white text-bg py-5 rounded-xl font-black text-[11px] uppercase tracking-[0.4em] active:scale-95 transition-all"
               >
                  INICIAR TREINO
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
