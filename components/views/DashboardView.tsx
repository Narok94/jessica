import React from 'react';
import { useStore } from '../../store';
import { AppTab } from '../../types';
import { Dumbbell, Shield, Scale, Ruler, Play } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { user, allWorkouts, setActiveTab, setSelectedWorkout, setIsWorkoutActive, setWorkoutStartTime, logout } = useStore();
  
  if (!user) return null;

  const handleVibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Profile biometrics and metadata
  const getBiometrics = () => {
    const usernameLower = user.username.toLowerCase();
    if (usernameLower === 'henrique') {
      return { weight: '84.5', height: '1.81', level: 'Atleta Avançado', initial: 'H' };
    } else if (usernameLower === 'flavia' || usernameLower === 'flávia') {
      return { weight: '62.0', height: '1.65', level: 'Atleta Intermediário', initial: 'F' };
    } else if (usernameLower === 'jessica' || usernameLower === 'jéssica') {
      return { weight: '60.0', height: '1.68', level: 'Atleta Avançado', initial: 'J' };
    } else {
      return { weight: '75.0', height: '1.75', level: 'Atleta', initial: user.name.charAt(0).toUpperCase() };
    }
  };
  const bio = getBiometrics();

  // Weekly consistency
  const getWeekDates = () => {
    const dates = [];
    const today = new Date();
    const day = today.getDay(); // 0 is Sunday, 1 is Monday...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjustment for monday
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
  // If the user hasn't made check-ins yet because they just loaded the app, default to 3/5
  const displayCount = user.checkIns && user.checkIns.length > 0 ? currentWeekWorkoutsCount : 3;

  // Active workout
  const workouts = allWorkouts[user.username.toLowerCase() as keyof typeof allWorkouts] || [];
  const currentWorkout = workouts[0] || {
    title: 'Treino D - Deltóides e Trapézio',
    description: 'Hipertrofia de Ombros, Correção de Postura',
    exercises: [
      { name: 'Elevação Lateral', sets: [{}, {}, {}] },
      { name: 'Desenvolvimento Militar', sets: [{}, {}, {}] },
      { name: 'Elevação Frontal', sets: [{}, {}, {}] }
    ]
  };

  const workoutTitle = currentWorkout.title;
  const workoutFocus = currentWorkout.description;
  const exercisesCount = currentWorkout.exercises?.length || 0;
  const seriesTotais = currentWorkout.exercises ? currentWorkout.exercises.reduce((acc: number, ex: any) => acc + (ex.sets?.length || 0), 0) : 18;

  const startActiveWorkout = () => {
    handleVibrate();
    if (workouts.length > 0) {
      setSelectedWorkout(workouts[0]);
      setIsWorkoutActive(true);
      setWorkoutStartTime(new Date().getTime());
    } else {
      setActiveTab(AppTab.WORKOUT);
    }
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between pb-3 bg-[#050505] text-white font-sans antialiased selection:bg-[#FF5F00]/30 select-none">
      
      {/* HEADER MINIMIZADO */}
      <div className="pt-2 px-4 flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-xl font-[950] italic uppercase tracking-tight text-white leading-none">
            TATU <span className="text-[#FF5F00]">GYM</span>
          </h1>
          <p className="text-white/40 text-[8px] mt-0.5 uppercase tracking-widest font-mono font-black leading-none">
            Estética Máxima Performance
          </p>
        </div>
        <button 
          onClick={() => {
            handleVibrate();
            logout();
          }} 
          className="text-[8px] font-black text-white/40 hover:text-white uppercase tracking-widest transition-colors py-1 px-2 border border-white/5 rounded-lg bg-white/[0.01]"
        >
          SAIR
        </button>
      </div>

      {/* BIOMETRIA EM LINHA ÚNICA COMPACTA */}
      <div className="px-4 mt-2 shrink-0">
        <div className="bg-[#0c0c0c] border border-white/5 p-2 rounded-xl flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#FF5F00]/10 border border-[#FF5F00]/20 flex items-center justify-center text-[#FF5F00] font-black italic text-xs shrink-0">
              {bio.initial}
            </div>
            <div>
              <h2 className="font-bold text-white leading-none text-[11px]">{user.name}</h2>
              <p className="text-[9px] text-white/40 leading-none mt-0.5">{bio.level}</p>
            </div>
          </div>
          <div className="flex gap-3 items-center border-l border-white/5 pl-3">
            <div className="flex items-center gap-1">
              <Scale className="w-3 h-3 text-[#FF5F00]" />
              <p className="font-mono font-bold text-white text-xs">
                {bio.weight}<span className="text-[9px] text-white/40 font-sans ml-0.5">kg</span>
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Ruler className="w-3 h-3 text-[#FF5F00]" />
              <p className="font-mono font-bold text-white text-xs">
                {bio.height}<span className="text-[9px] text-white/40 font-sans ml-0.5">m</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* VISÃO GERAL DE PERFORMANCE (CONSISTÊNCIA SEMANAL EXTRA COMPACTA) */}
      <div className="px-4 mt-2 shrink-0">
        <div className="bg-[#0c0c0c] border border-white/5 p-3 rounded-2xl space-y-2">
          <div className="flex justify-between items-baseline">
            <h3 className="text-[9px] font-black italic uppercase text-white tracking-widest">Performance</h3>
            <span className="text-[8px] font-mono text-white/40 uppercase font-black">Últimos 7 dias</span>
          </div>
          
          <div className="space-y-1.5">
            {/* Grid dos Dias compactado */}
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((dia, idx) => {
                let treinou = false;
                if (user.checkIns && user.checkIns.length > 0) {
                  const dateStr = weekDates[idx];
                  treinou = user.checkIns.includes(dateStr);
                } else {
                  treinou = idx >= 1 && idx <= 4;
                }
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-[8px] font-black font-mono text-white/40 leading-none">{dia}</span>
                    <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-all ${
                      treinou 
                        ? 'bg-[#FF5F00] text-black shadow-[0_0_8px_rgba(255,95,0,0.35)]' 
                        : 'bg-white/[0.01] border border-white/5 text-white/10'
                    }`}>
                      {treinou ? <Dumbbell className="w-3 h-3 text-black fill-black" strokeWidth={3.5} /> : <Shield className="w-3 h-3 text-white/10" />}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Sub-legendas de rotas rápidas */}
            <div className="flex gap-3 justify-center text-[8px] text-white/20 font-black tracking-wider uppercase font-mono">
              <span>A - Peito</span>
              <span>B - Costas</span>
              <span>R - Repouso</span>
            </div>
          </div>

          {/* Barra de Progresso da Meta ultrafina */}
          <div className="border-t border-white/5 pt-2 space-y-1">
            <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
              <div 
                className="bg-[#FF5F00] h-full rounded-full shadow-[0_0_6px_rgba(255,95,0,0.5)] transition-all duration-500"
                style={{ width: `${Math.min(100, (displayCount / 5) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[8px] font-black uppercase font-mono text-white/40 tracking-wider">
              <span>Meta: 5 treinos/semana</span>
              <span className="text-white/60">Atual: {displayCount}/5</span>
            </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO CARD DO TREINO OTIMIZADO */}
      <div className="px-4 mt-2 shrink-0">
        <div className="bg-[#0c0c0c] border border-white/5 p-3 rounded-2xl space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-[9px] font-black italic uppercase text-[#FF5F00] tracking-widest leading-none">Treino do Dia</p>
            <span className="text-[8px] font-mono font-black text-[#FF5F00] uppercase bg-[#FF5F00]/10 border border-[#FF5F00]/20 px-1.5 py-0.5 rounded leading-none shrink-0">
              {seriesTotais} Séries
            </span>
          </div>
          <div>
            <h4 className="text-[13px] font-black text-white uppercase italic tracking-tight leading-tight">{workoutTitle}</h4>
            {workoutFocus && (
              <p className="text-[10px] text-white/45 mt-0.5 font-semibold italic truncate">{workoutFocus}</p>
            )}
          </div>
          
          <div className="flex justify-between items-center text-[9px] text-white/35 pt-1.5 border-t border-white/5 font-sans font-black uppercase tracking-wider">
            <span>Metodologia Avançada</span>
            <span className="text-white/60 shrink-0">
              {exercisesCount} Exercícios Compactos
            </span>
          </div>
        </div>
      </div>

      {/* BOTÃO FLAMEJANTE MASSIVO DE INICIALIZAÇÃO */}
      <div className="px-4 mt-2 shrink-0">
        <button
          onClick={startActiveWorkout}
          className="w-full bg-[#FF5F00] hover:bg-[#ff7722] text-[#050505] font-[950] italic uppercase py-3 rounded-xl text-xs shadow-[0_0_20px_rgba(255,95,0,0.3)] active:scale-[0.97] transition-all transform flex justify-center items-center gap-1.5 tracking-widest cursor-pointer font-sans shrink-0"
        >
          <Play className="w-3 h-3 fill-[#050505] text-[#050505]" /> INICIAR TREINO DO DIA
        </button>
      </div>
      
    </div>
  );
};
