
import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../store';
import { ChevronLeft, Clock, CheckCircle2, Play, LayoutDashboard, Quote, Camera, Download, Trash2, Share2, Dumbbell } from 'lucide-react';
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

  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const timerIntervalRef = useRef<number | null>(null);
  const wakeLockRef = useRef<any>(null);

  const requestWakeLock = async () => {
    if ('wakeLock' in navigator) {
      try {
        wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
        console.log('Wake Lock isActive');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  const releaseWakeLock = async () => {
    if (wakeLockRef.current) {
      try {
        await wakeLockRef.current.release();
        wakeLockRef.current = null;
        console.log('Wake Lock was released');
      } catch (err: any) {
        console.error(`${err.name}, ${err.message}`);
      }
    }
  };

  useEffect(() => {
    if (isWorkoutActive && workoutStartTime) {
      requestWakeLock();
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000));
      }, 1000);
    } else {
      releaseWakeLock();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      releaseWakeLock();
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
    setCapturedImage(null);
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

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadSummaryImage = () => {
    if (!canvasRef.current || !capturedImage) return;
    setIsGeneratingImage(true);
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = capturedImage;

    img.onload = () => {
      // Set canvas size to match image or a standard social media size
      const targetWidth = 1080;
      const targetHeight = 1350; // 4:5 aspect ratio
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      // Draw background image (proportional crop)
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidth / targetHeight;
      let drawW, drawH, drawX, drawY;

      if (imgAspect > targetAspect) {
        drawH = targetHeight;
        drawW = targetHeight * imgAspect;
        drawX = (targetWidth - drawW) / 2;
        drawY = 0;
      } else {
        drawW = targetWidth;
        drawH = targetWidth / imgAspect;
        drawX = 0;
        drawY = (targetHeight - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // Dark Overlay at bottom for better readability
      const gradient = ctx.createLinearGradient(0, targetHeight * 0.6, 0, targetHeight);
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.9)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, targetHeight * 0.6, targetWidth, targetHeight * 0.4);

      // Add "TATU GYM" Branding
      ctx.font = 'black 60px Inter';
      ctx.fillStyle = '#2979FF';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(41, 121, 255, 0.5)';
      ctx.shadowBlur = 20;
      ctx.fillText('TATU GYM', 60, targetHeight - 200);
      ctx.shadowBlur = 0;

      ctx.font = 'italic 40px Inter';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('PRO PERFORMANCE', 60, targetHeight - 150);

      // Add Workout Title
      ctx.font = '900 80px Inter';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(selectedWorkout.title.toUpperCase(), 60, targetHeight - 400);

      // Infer Focus from exercises or title
      const focusText = selectedWorkout.title.toLowerCase().includes('superior') ? 'SUPERIORES' :
                        selectedWorkout.title.toLowerCase().includes('inferior') || selectedWorkout.title.toLowerCase().includes('perna') ? 'INFERIORES' :
                        selectedWorkout.title.toLowerCase().includes('cardio') || selectedWorkout.title.toLowerCase().includes('aeró') ? 'AERÓBICO' :
                        selectedWorkout.title.toLowerCase().includes('abd') ? 'ABDÔMEN' : 'COMPLETO';

      ctx.font = 'black 50px Inter';
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText(focusText, 60, targetHeight - 330);

      // stats section removed volume

      // Duration
      ctx.font = 'bold 30px Inter';
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fillText('DURAÇÃO TOTAL', 60, targetHeight - 250);
      ctx.font = '900 80px Inter';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(workoutDuration ? formatTime(workoutDuration) : '00:00', 60, targetHeight - 170);

      // Blue accent line
      ctx.fillStyle = '#2979FF';
      ctx.fillRect(60, targetHeight - 450, 100, 10);

      // Trigger download
      const link = document.createElement('a');
      link.download = `tatu-gym-victory-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsGeneratingImage(false);
      handleVibrate(30);
    };
  };

  if (showSummary) {
    return (
      <div className="max-w-xl mx-auto space-y-8 animate-slide-up py-6 text-center pb-24">
         <div className="space-y-4">
            <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 transform rotate-12 animate-fade">
              <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic leading-none">Treino <span className="text-indigo-600">Concluído!</span></h1>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Sessão finalizada com sucesso.</p>
            </div>
         </div>

         {/* Victory Photo Section */}
         <div className="space-y-4">
            <div className="flex items-center justify-between px-4">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Victory Photo</span>
               {capturedImage && (
                 <button onClick={() => setCapturedImage(null)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                 </button>
               )}
            </div>
            
            {!capturedImage ? (
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full aspect-[4/5] glass-card rounded-[3rem] border-dashed border-slate-200 flex flex-col items-center justify-center gap-5 hover:bg-slate-50 transition-all group"
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-50 border border-slate-100 transition-all">
                  <Camera size={36} className="text-slate-300 group-hover:text-indigo-500" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] group-hover:text-slate-600 transition-colors">Registrar Evolução</p>
              </button>
            ) : (
              <div className="relative group rounded-[3rem] overflow-hidden border border-slate-200 shadow-2xl shadow-indigo-950/5">
                <img src={capturedImage} alt="Victory" className="w-full aspect-[4/5] object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between border-b border-white/20 pb-4">
                      <div className="text-left">
                        <p className="text-indigo-400 font-black italic text-[10px] leading-none uppercase tracking-[0.3em] mb-1.5">TATU GYM PRO</p>
                        <p className="text-white font-black text-2xl tracking-tighter uppercase italic leading-none">{selectedWorkout.title}</p>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em] mt-3">
                          {selectedWorkout.title.toLowerCase().includes('superior') ? 'SUPERIORES' :
                           selectedWorkout.title.toLowerCase().includes('inferior') || selectedWorkout.title.toLowerCase().includes('perna') ? 'INFERIORES' :
                           selectedWorkout.title.toLowerCase().includes('cardio') || selectedWorkout.title.toLowerCase().includes('aeró') ? 'AERÓBICO' :
                           selectedWorkout.title.toLowerCase().includes('abd') ? 'ABDÔMEN' : 'COMPLETO'}
                        </p>
                      </div>
                      <div className="w-px h-10 bg-white/20 mx-2"></div>
                      <div className="text-right">
                        <p className="text-[8px] font-black text-white/60 uppercase tracking-widest mb-1.5">DURAÇÃO</p>
                        <p className="text-2xl font-black text-white leading-none font-mono tracking-tighter">
                          {workoutDuration ? formatTime(workoutDuration) : '00:00'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Sessão Concluída</span>
                       </div>
                       <div className="px-3 py-1.5 bg-emerald-500 rounded-lg text-[9px] font-black text-white uppercase tracking-widest italic shadow-lg shadow-emerald-500/30">
                          VICTORY
                       </div>
                    </div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                   <button 
                     onClick={downloadSummaryImage}
                     disabled={isGeneratingImage}
                     className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 active:scale-95 transition-all"
                   >
                     {isGeneratingImage ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Download size={28} />}
                   </button>
                </div>
              </div>
            )}

            {capturedImage && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={downloadSummaryImage}
                disabled={isGeneratingImage}
                className="w-full py-5 bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl flex items-center justify-center gap-4 active:scale-95 transition-all shadow-sm"
              >
                {isGeneratingImage ? (
                  <>GENERATING... <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-600 rounded-full animate-spin"></div></>
                ) : (
                  <>BAIXAR FOTO DA VITÓRIA <Download size={20} /></>
                )}
              </motion.button>
            )}

            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageCapture} 
              accept="image/*" 
              capture="environment" 
              className="hidden" 
            />
            <canvas ref={canvasRef} className="hidden" />
         </div>

         <div className="grid grid-cols-1 gap-4">
            <div className="glass-card glass-card-hover p-10 rounded-[3rem] border-white shadow-indigo-950/5">
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3">Tempo Total de Treino</p>
               <div className="flex items-center justify-center gap-4">
                  <span className="text-5xl font-black text-slate-900 italic tracking-tighter">{workoutDuration ? formatTime(workoutDuration) : '00:00'}</span>
                  <Clock size={32} className="text-indigo-600" />
               </div>
            </div>
         </div>

         <div className="glass-card p-10 rounded-[3rem] space-y-5 relative overflow-hidden bg-slate-50 border-white shadow-sm">
            <Quote className="absolute -top-4 -left-4 text-slate-200 w-24 h-24 rotate-12" />
            <div className="relative z-10 px-4">
               <p className="text-slate-500 font-black italic text-xl leading-relaxed tracking-tight">
                 "A constância é a mãe da evolução. O esforço de hoje é a força de amanhã."
               </p>
            </div>
         </div>

         <button 
           onClick={closeSummary} 
           className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl shadow-2xl shadow-slate-200 uppercase tracking-[0.4em] active:scale-95 text-[11px] transition-all flex items-center justify-center gap-4 mt-6"
         >
           <LayoutDashboard size={20} /> VOLTAR AO INÍCIO
         </button>
      </div>
    );
  }

  const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
  const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + (perf ? perf.filter(p => p.completed).length : 0), 0);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  return (
    <div className="space-y-6 animate-slide-up pb-64">
      <header className="flex items-center justify-between sticky top-0 z-50 bg-white/80 backdrop-blur-2xl py-5 border-b border-slate-100 -mx-6 px-6">
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={exitWorkout} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all bg-slate-50 rounded-2xl border border-slate-200 active:scale-95">
            <ChevronLeft size={22} strokeWidth={2.5}/>
          </button>
          <div className="min-w-0">
            <h1 className="text-lg font-black text-slate-900 italic truncate leading-none uppercase tracking-tighter italic">{selectedWorkout.title}</h1>
            {isWorkoutActive && (
              <span className="text-[10px] font-black text-rose-500 mt-1.5 block tracking-widest uppercase flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                AO VIVO
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {isWorkoutActive ? (
             <>
               <div className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-2xl font-black text-slate-900 font-mono leading-none tracking-tighter">{formatTime(elapsedTime)}</span>
               </div>
               <button 
                 onClick={handleFinishWorkout}
                 className="px-6 py-2 bg-emerald-500 text-white font-black text-[11px] uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-lg shadow-emerald-100"
               >
                 COMPLETAR
               </button>
             </>
          ) : (
            <button 
              onClick={startWorkout}
              className="px-8 py-3 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl active:scale-95 transition-all shadow-xl shadow-indigo-100"
            >
              INICIAR TREINO
            </button>
          )}
        </div>
      </header>

      {isWorkoutActive && (
        <div className="space-y-10 animate-fade px-2">
          <div className="flex items-end justify-between px-4 pb-2 border-b border-slate-100 mb-2">
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">PROGRESSO SESSÃO</span>
                <div className="flex items-end gap-2">
                   <span className="text-4xl font-black text-slate-900 leading-none">{completedSets}</span>
                   <span className="text-lg font-black text-slate-300 mb-1">/ {totalSets}</span>
                </div>
             </div>
             <div className="text-right">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1 block">INTENSIDADE</span>
                <span className="block text-2xl font-black text-indigo-600 leading-none italic uppercase">LEVEL PRO</span>
             </div>
          </div>

          <div className="grid grid-cols-1 gap-8 items-start pb-40">
            {selectedWorkout.exercises.map((ex, idx) => {
              // Find previous performance for this exercise from user history
              const lastWorkoutWithEx = user.history?.find(h => 
                h.exercises.some(he => he.exerciseId === ex.id && he.performance.some(p => p.completed))
              );
              const lastPerf = lastWorkoutWithEx?.exercises.find(he => he.exerciseId === ex.id)?.performance.filter(p => p.completed);

              return (
                <motion.div
                  key={ex.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (idx * 0.05) }}
                >
                  <ExerciseItem 
                    exercise={ex} 
                    onSaveProgress={handleSaveProgress} 
                    savedWeight={user.weights?.[ex.id]} 
                    initialPerformance={currentSessionProgress[ex.id]}
                    lastPerformance={lastPerf}
                  />
                </motion.div>
              );
            })}
            
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="pt-10 flex flex-col gap-4"
            >
              <button 
                onClick={() => {
                  handleVibrate(30);
                  handleFinishWorkout();
                }}
                disabled={completedSets === 0}
                className={`w-full py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 ${
                  completedSets > 0 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
                  : 'bg-slate-50 border border-slate-200 text-slate-300 cursor-not-allowed'
                }`}
              >
                FINALIZAR SESSÃO
              </button>
              <button 
                onClick={() => {
                   handleVibrate(10);
                   cancelWorkout();
                }}
                className="w-full py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                CANCELAR SESSÃO
              </button>
            </motion.div>
          </div>
        </div>
      )}

      {!isWorkoutActive && (
         <div className="py-12 px-6 animate-fade">
            <div className="glass-card p-12 rounded-[3rem] text-center border-white shadow-indigo-950/5">
               <h2 className="text-3xl font-black italic text-slate-900 uppercase tracking-tighter mb-4">Pronto para o Próximo Nível?</h2>
               <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Treino {selectedWorkout.title} • {selectedWorkout.exercises.length} Exercícios Monitorados</p>
               <button 
                  onClick={startWorkout}
                  className="w-full bg-indigo-600 text-white py-6 rounded-2xl font-black text-[11px] uppercase tracking-[0.4em] active:scale-95 transition-all shadow-xl shadow-indigo-100"
               >
                  INICIAR SESSÃO
               </button>
            </div>
         </div>
      )}
    </div>
  );
};
