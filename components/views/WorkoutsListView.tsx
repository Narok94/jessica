import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, ArrowRight, Shield, Award, Sparkles, Flame } from 'lucide-react';
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

  // Helper to extract clean muscle groups or exercises focus
  const getWorkoutFocus = (workout: WorkoutRoutine) => {
    const groups = Array.from(new Set(workout.exercises.map(ex => ex.muscleGroup)))
      .filter(g => g && g.toLowerCase() !== 'manguito')
      .map(g => g.toUpperCase());
    
    if (groups.length > 0) {
      return groups.join(', ');
    }
    
    // Fallback to title without the "Treino X" prefix
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
    <div className="space-y-6 animate-slide-up pb-28 px-1 max-w-md mx-auto select-none">
      {/* Header Container exactly as shown in the attachment */}
      <div className="space-y-2 px-1 pt-6 text-left">
        <h1 className="text-4xl font-black italic tracking-tighter leading-none text-white uppercase font-sans">
          TREINOS <span className="text-[#FF5F00]">TATU GYM</span>
        </h1>
        <p className="text-[11px] font-medium text-white/55 leading-relaxed max-w-xs font-sans">
          Selecione o protocolo fisiológico prescrito para a sessão de <span className="text-white font-bold">{user.name}</span> hoje e esmague as cargas.
        </p>
      </div>

      {/* Grid of Workout Routines */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        {workouts.map((workout, index) => {
          const focus = getWorkoutFocus(workout);
          const label = getWorkoutCardLabel(workout, index);
          const exerciseCount = workout.exercises.length;
          
          // If odd total workouts, the last one spans full width. For exactly 3 workouts, Treino C spans full
          const isFullWidthCard = (workouts.length === 1) || (workouts.length === 3 && index === 2) || (workouts.length % 2 !== 0 && index === workouts.length - 1);

          if (isFullWidthCard) {
            return (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0b0b0d] p-6 hover:border-[#FF5F00]/40 active:scale-[0.99] transition-all duration-300 cursor-pointer shadow-lg"
                onClick={() => startWorkout(workout)}
              >
                {/* Subtle top-right accent dot */}
                <span className="absolute top-6 right-6 w-1.5 h-1.5 bg-[#FF5F00] rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]"></span>
                
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div>
                      <span className="inline-block bg-[#FF5F00]/10 border border-[#FF5F00]/15 text-[#FF5F00] text-[9.5px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-[10px]">
                        {label}
                      </span>
                    </div>
                    
                    <h2 className="text-[20px] font-black italic text-white tracking-tight uppercase leading-tight truncate font-sans">
                      {focus}
                    </h2>
                    
                    {workout.description && (
                      <p className="text-[11px] font-medium text-white/40 max-w-[240px] leading-relaxed italic pr-2 truncate">
                        {workout.description}
                      </p>
                    )}

                    <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-white/50 uppercase tracking-widest font-mono">
                      <span>{exerciseCount} EXERCÍCIOS COMPACTOS</span>
                    </div>
                  </div>

                  <div className="flex justify-end items-center shrink-0">
                    <button className="flex items-center gap-1 px-5 py-3.5 rounded-2xl border border-white/10 bg-white/5 text-white font-black text-[11px] uppercase tracking-[0.14em] hover:bg-[#FF5F00] hover:border-[#FF5F00] hover:text-[#050505] active:scale-95 transition-all duration-300">
                      TREINAR
                      <span className="text-[9.5px] font-serif font-black">❯</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          }

          return (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 bg-[#0b0b0d] p-5.5 hover:border-[#FF5F00]/40 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between h-[210px] shadow-lg"
              onClick={() => startWorkout(workout)}
            >
              {/* Subtle top-right accent dot */}
              <span className="absolute top-6 right-6 w-1.5 h-1.5 bg-[#FF5F00] rounded-full shadow-[0_0_8px_rgba(255,95,0,0.8)]"></span>

              <div className="space-y-3">
                <div>
                  <span className="inline-block bg-[#FF5F00]/10 border border-[#FF5F00]/15 text-[#FF5F00] text-[9.5px] font-black uppercase tracking-[0.1em] px-3 py-1 rounded-[10px]">
                    {label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <h2 className="text-[18px] font-black italic text-white tracking-tight uppercase leading-[1.18] line-clamp-3 font-sans">
                    {focus}
                  </h2>
                </div>
              </div>

              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest font-mono">
                  {exerciseCount} EXERCÍCIOS
                </p>
                <div className="flex items-center gap-1 text-[10.5px] font-black text-[#FF5F00] uppercase tracking-[0.14em] group-hover:translate-x-1 transition-transform duration-300">
                  TREINAR <span className="text-[9.5px] font-serif font-black">❯</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Motivational Info Box at the bottom matching the attachment */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: workouts.length * 0.15 }}
        className="rounded-[2rem] border border-white/5 bg-[#09090b] p-5 flex gap-4 items-start shadow-sm"
      >
        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#FF5F00] shrink-0 mt-0.5">
          <Shield size={15} />
        </div>
        <p className="text-[11px] font-bold text-white/50 leading-relaxed italic">
          "O progresso estético de <span className="text-white font-black not-italic">{user.name}</span> reside na consistência linear. Complete as séries sem roubar, registre as cargas e respeite o repouso planejado."
        </p>
      </motion.div>
    </div>
  );
};
