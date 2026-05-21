import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Shield } from 'lucide-react';
import { useStore } from '../../store';
import { AppTab, WorkoutRoutine } from '../../types';

export const WorkoutsListView: React.FC = () => {
  const { user, allWorkouts, setSelectedWorkout, setActiveTab } = useStore();

  if (!user) return null;

  const workouts = allWorkouts[user.username.toLowerCase() as keyof typeof allWorkouts] || [];

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const startWorkout = (workout: WorkoutRoutine) => {
    handleVibrate(20);
    setSelectedWorkout(workout);
    setActiveTab(AppTab.WORKOUT);
  };

  const getWorkoutFocus = (workout: WorkoutRoutine) => {
    const groups = Array.from(new Set(workout.exercises.map(ex => ex.muscleGroup)))
      .filter(g => g && g.toLowerCase() !== 'manguito')
      .map(g => g.toUpperCase());
    
    if (groups.length > 0) {
      return groups.join(', ');
    }
    return workout.title.replace(/Treino\s+[A-Z]\s*-\s*/i, '').toUpperCase();
  };

  const getWorkoutCardLabel = (workout: WorkoutRoutine, index: number) => {
    const match = workout.title.match(/Treino\s+([A-Z])/i);
    if (match) {
      return `TREINO ${match[1].toUpperCase()}`;
    }
    return `TREINO ${String.fromCharCode(65 + index)}`;
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between pb-1 bg-transparent select-none font-sans">
      {/* Header Container */}
      <div className="space-y-0.5 px-1 pt-1 text-left shrink-0">
        <h1 className="text-xl font-black italic tracking-tighter leading-none text-white uppercase">
          TREINOS <span className="text-[#FF5F00]">TATU GYM</span>
        </h1>
        <p className="text-[9px] font-medium text-white/50 leading-normal max-w-xs mt-0.5">
          Selecione o protocolo fisiológico prescrito para a sessão de <span className="text-white font-bold">{user.name}</span> hoje e esmague as cargas.
        </p>
      </div>

      {/* List of Workout Routines inside an active scrollable list with zero styling borders */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-1.5 space-y-1.5 mt-1.5">
        {workouts.map((workout, index) => {
          const focus = getWorkoutFocus(workout);
          const label = getWorkoutCardLabel(workout, index);
          const exerciseCount = workout.exercises.length;
          
          return (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0b0b0d]/70 p-2 hover:border-[#FF5F00]/40 active:scale-[0.99] transition-all duration-300 cursor-pointer flex items-center justify-between gap-3 shadow-md"
              onClick={() => startWorkout(workout)}
            >
              {/* Active accent dots */}
              <span className="w-1 h-3 rounded bg-[#FF5F00] shrink-0"></span>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block bg-[#FF5F00]/15 border border-[#FF5F00]/25 text-[#FF5F00] text-[8px] font-black uppercase tracking-wider px-1 py-0.5 rounded leading-none">
                    {label}
                  </span>
                  <span className="text-[7.5px] font-mono font-bold text-white/40 uppercase tracking-widest">{exerciseCount} EXERCÍCIOS COMPACTOS</span>
                </div>
                
                <h2 className="text-xs font-black italic text-white tracking-tight uppercase leading-none truncate">
                  {focus}
                </h2>
              </div>

              <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white font-black text-[9px] uppercase tracking-wider hover:bg-[#FF5F00] hover:border-[#FF5F00] hover:text-[#050505] active:scale-95 transition-all duration-300 shrink-0 leading-none">
                TREINAR <span className="text-[8px] font-serif font-black">❯</span>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Info Box at the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-xl border border-white/5 bg-[#09090b]/80 p-1.5 flex gap-2 items-start shadow-sm mt-1 shrink-0"
      >
        <div className="w-5 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5F00] shrink-0">
          <Shield size={10} />
        </div>
        <p className="text-[8.5px] font-semibold text-white/45 leading-snug italic">
          "O progresso estético de <span className="text-white font-black not-italic">{user.name}</span> reside na consistência linear. Complete as séries sem roubar, registre as cargas e respeite o repouso planejado."
        </p>
      </motion.div>
    </div>
  );
};
