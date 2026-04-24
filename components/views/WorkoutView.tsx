
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
      <header className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={exitWorkout} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest bg-zinc-900/60 px-4 py-2 rounded-xl border border-white/5 active:scale-95">
            <ChevronLeft size={16}/> Sair
          </button>
          {isWorkoutActive && (
            <button onClick={cancelWorkout} className="flex items-center gap-2 text-red-500/60 hover:text-red-500 transition-all text-[9px] font-black uppercase tracking-widest bg-red-500/5 px-4 py-2 rounded-xl border border-red-500/10 active:scale-95">
              Cancelar
            </button>
          )}
        </div>
        <div className="text-right">
           <div className="flex items-center gap-1.5 justify-end mb-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isWorkoutActive ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-700'}`}></span>
              <span className={`${isWorkoutActive ? 'text-emerald-500' : 'text-zinc-500'} text-[8px] font-black uppercase tracking-widest`}>
                {isWorkoutActive ? 'Sessão Ativa' : 'Sessão Pendente'}
              </span>
           </div>
           <p className="text-lg font-black text-white italic tracking-tighter uppercase">{selectedWorkout.title}</p>
        </div>
      </header>

      {!isWorkoutActive ? (
        <div className="glass-card p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/20">
            <Play size={40} className="text-zinc-950 ml-1" fill="currentColor" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Pronto para <span className="text-emerald-500">evoluir?</span></h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Inicie o cronômetro para começar seu treino.</p>
          </div>
          <button 
            onClick={startWorkout}
            className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-5 rounded-[1.5rem] shadow-xl uppercase tracking-[0.4em] active:scale-95 transition-all text-xs"
          >
            COMEÇAR TREINO
          </button>
        </div>
      ) : (
        <div className="glass-card p-6 rounded-[2rem] border border-white/10 flex items-center justify-between bg-zinc-900/40">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
              <Clock size={24} />
            </div>
            <div>
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Tempo de Treino</p>
              <p className="text-2xl font-black text-white font-mono">{formatTime(elapsedTime)}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Intensidade</p>
            <div className="flex gap-1 mt-1 justify-end">
              {[1,2,3,4,5].map(i => (
                <div key={i} className={`w-1.5 h-4 rounded-full ${i <= 3 ? 'bg-emerald-500' : 'bg-zinc-800'}`}></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className={`space-y-6 transition-all duration-500 ${!isWorkoutActive ? 'opacity-30 pointer-events-none grayscale' : 'opacity-100'}`}>
        <div className="bg-zinc-900/50 p-4 rounded-[1.5rem] border border-white/5">
           <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Progresso do Treino</span>
                <span className="text-[10px] font-bold text-white mt-0.5">{completedSets} de {totalSets} séries concluídas</span>
              </div>
              <span className="text-sm font-black text-emerald-500">{progressPercent}%</span>
           </div>
           <div className="h-2.5 w-full bg-zinc-950 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
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

        <div className="pt-8 pb-20">
          <button 
            onClick={handleFinishWorkout} 
            disabled={!isWorkoutActive || completedSets === 0} 
            className={`w-full font-black py-5 md:py-6 rounded-[1.8rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 flex items-center justify-center gap-3 text-[10px] transition-all border-b-4 ${
              isWorkoutActive && completedSets > 0 
              ? 'bg-emerald-500 text-zinc-950 border-emerald-700 shadow-emerald-500/30' 
              : 'bg-zinc-800 text-zinc-600 border-zinc-900 opacity-50 cursor-not-allowed'
            }`}
          >
            <CheckCircle2 size={20} strokeWidth={4} /> Finalizar Sessão
          </button>
        </div>
      </div>
    </div>
  );
};
