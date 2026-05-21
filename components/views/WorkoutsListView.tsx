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
    if (workout.title.includes('Treino A') || workout.id === 'h-a') return 'PEITO, OMBROS E TRÍCEPS';
    if (workout.title.includes('Treino B') || workout.id === 'h-b') return 'COSTAS, TRAPÉZIO E BÍCEPS';
    if (workout.title.includes('Treino C') || workout.id === 'h-c') return 'COXAS, PANTURRILHAS E CORE';

    const groups = Array.from(new Set(workout.exercises.map(ex => ex.muscleGroup)))
      .filter(g => g && g.toLowerCase() !== 'manguito')
      .map(g => g.toUpperCase());
    
    if (groups.length > 0) {
      if (groups.length > 1) {
        const last = groups[groups.length - 1];
        const rest = groups.slice(0, -1).join(', ');
        return `${rest} E ${last}`;
      }
      return groups[0];
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
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar py-2 space-y-2 mt-1.5">
        {workouts.map((workout, index) => {
          const focus = getWorkoutFocus(workout);
          const label = getWorkoutCardLabel(workout, index);
          const exerciseCount = workout.exercises.length;
          const cleanDesc = workout.description ? workout.description.replace(/^Foco:\s*/i, '') : 'Fisiologia linear de máxima sobrecarga progressiva.';
          
          return (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl border border-white/5 bg-[#0b0b0d]/75 p-3 hover:border-[#FF5F00]/40 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col gap-1.5 shadow-md"
              onClick={() => startWorkout(workout)}
            >
              {/* Active accent dot in top right */}
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#FF5F00] shadow-[0_0_8px_rgba(255,95,0,0.8)]"></span>

              {/* Tag header */}
              <div className="flex items-center">
                <span className="inline-block bg-[#FF5F00]/10 border border-[#FF5F00]/20 text-[#FF5F00] text-[8.5px] font-[900] uppercase tracking-wider px-1.5 py-0.5 rounded leading-none">
                  {label}
                </span>
              </div>

              {/* Workout Focus & Description */}
              <div className="space-y-0.5">
                <h2 className={`text-sm font-[950] italic tracking-tight uppercase leading-none ${
                  index % 2 === 0 ? 'text-white' : 'text-[#FF5F00]'
                }`}>
                  {focus}
                </h2>
                <p className="text-[9.5px] font-medium text-white/45 leading-relaxed italic truncate max-w-full">
                  {cleanDesc}
                </p>
              </div>

              {/* Footer row with metrics on left and "TREINAR >" button on right */}
              <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-white/5">
                <span className="text-[8.5px] font-mono font-black text-white/40 uppercase tracking-widest leading-none">
                  {exerciseCount} EXERCÍCIOS COMPACTOS
                </span>
                
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-white font-black text-[9px] uppercase tracking-wider hover:bg-[#FF5F00] hover:border-[#FF5F00] hover:text-[#050505] active:scale-95 transition-all duration-300 shrink-0 leading-none">
                  TREINAR <span className="text-[8px] font-serif font-black">❯</span>
                </button>
              </div>
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
