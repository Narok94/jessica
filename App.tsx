
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { jessicaWorkouts, henriqueWorkouts, mariaWorkouts } from './data/workoutData';
import { AppTab, WorkoutRoutine, User, WorkoutHistoryEntry, SetPerformance } from './types';
import { ExerciseItem } from './components/ExerciseItem';
import { 
  Dumbbell, 
  ChevronRight, 
  Bot,
  Settings,
  Zap,
  Activity,
  History,
  CheckCircle2,
  Flame,
  Check,
  User as UserIcon,
  LogOut,
  ChevronLeft,
  Star,
  Quote,
  Clock,
  TrendingUp,
  Award,
  Calendar,
  Trophy,
  Target,
  Rocket,
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  Lock,
  Sparkles,
  BarChart3,
  MapPin,
  ChevronUp,
  ChevronDown,
  ClipboardList,
  UserCircle2
} from 'lucide-react';

declare var confetti: any;

const LOGIN_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '', remember: false });
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRoutine | null>(null);
  const [currentSessionProgress, setCurrentSessionProgress] = useState<Record<string, SetPerformance[]>>({});
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [lastWorkoutVolume, setLastWorkoutVolume] = useState(0);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  }, []);

  const initialWorkouts = useMemo(() => {
    if (!user) return [];
    const name = user.username.toLowerCase();
    if (name === 'henrique') return henriqueWorkouts;
    if (name === 'jessica') return jessicaWorkouts;
    if (name === 'maria') return mariaWorkouts;
    return [];
  }, [user]);

  useEffect(() => {
    const saved = localStorage.getItem('tatugym_remembered');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLoginData({ user: parsed.user, pass: parsed.pass, remember: true });
      handleLogin(parsed.user, parsed.pass, false);
    }
  }, []);

  // Automatic saving of current session to prevent data loss on refresh/exit
  useEffect(() => {
    if (user && selectedWorkout && !showSummary) {
      localStorage.setItem(`tatugym_active_session_${user.username.toLowerCase()}`, JSON.stringify({
        workoutId: selectedWorkout.id,
        progress: currentSessionProgress,
        timestamp: new Date().toISOString()
      }));
    }
  }, [selectedWorkout, currentSessionProgress, user, showSummary]);

  const handleLogin = (usernameInput: string, passwordInput: string, manual: boolean) => {
    const u = usernameInput.trim().toLowerCase();
    const isJessicaOrHenrique = (u === 'jessica' || u === 'henrique') && passwordInput === '9860';
    const isMaria = u === 'maria' && passwordInput === '6354';

    if (isJessicaOrHenrique || isMaria) {
      const storageKey = `tatugym_user_profile_${u}`;
      const savedUser = localStorage.getItem(storageKey);
      let userData: User;
      if (savedUser) {
        userData = JSON.parse(savedUser);
      } else {
        userData = {
          username: u.charAt(0).toUpperCase() + u.slice(1),
          name: u.charAt(0).toUpperCase() + u.slice(1),
          weight: 0,
          height: 0,
          sex: u === 'henrique' ? 'masculino' : 'feminino',
          streak: 0,
          totalWorkouts: 0,
          checkIns: [],
          isProfileComplete: false,
          weights: {},
          history: []
        };
      }
      setUser(userData);
      setIsLoggedIn(true);
      
      const activeSession = localStorage.getItem(`tatugym_active_session_${u}`);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        let workoutsSet: WorkoutRoutine[] = [];
        if (u === 'henrique') workoutsSet = henriqueWorkouts;
        else if (u === 'jessica') workoutsSet = jessicaWorkouts;
        else if (u === 'maria') workoutsSet = mariaWorkouts;

        const workout = workoutsSet.find(w => w.id === parsed.workoutId);
        if (workout) {
          setSelectedWorkout(workout);
          setCurrentSessionProgress(parsed.progress);
          setActiveTab(AppTab.WORKOUT);
        } else {
          setActiveTab(userData.isProfileComplete ? AppTab.DASHBOARD : AppTab.ONBOARDING);
        }
      } else {
        setActiveTab(userData.isProfileComplete ? AppTab.DASHBOARD : AppTab.ONBOARDING);
      }
      
      if (manual && loginData.remember) {
        localStorage.setItem('tatugym_remembered', JSON.stringify({ user: usernameInput, pass: passwordInput }));
      }
    } else if (manual) {
      alert('Dados incorretos.');
    }
  };

  const triggerConfetti = () => {
    if (typeof confetti !== 'undefined') {
      confetti({ 
        particleCount: 150, 
        spread: 80, 
        origin: { y: 0.6 }, 
        colors: ['#10b981', '#6366f1', '#fbbf24'] 
      });
    }
  };

  const handleUpdateProfile = (newData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem(`tatugym_user_profile_${user.username.toLowerCase()}`, JSON.stringify(updated));
  };

  const handleManualCheckIn = () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    if (user.checkIns.includes(today)) {
      alert("Você já realizou o check-in hoje!");
      return;
    }
    const newCheckIns = [...user.checkIns, today];
    handleUpdateProfile({ 
      checkIns: newCheckIns,
      streak: (user.streak || 0) + 1 
    });
    triggerConfetti();
  };

  const handleSaveProgress = (exerciseId: string, performance: SetPerformance[]) => {
    setCurrentSessionProgress(prev => ({ ...prev, [exerciseId]: performance }));
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

  const handleFinishWorkout = () => {
    if (!selectedWorkout || !user) return;
    const today = new Date().toISOString().split('T')[0];
    const volume = calculateVolume();
    setLastWorkoutVolume(volume);

    const historyEntry: WorkoutHistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      workoutId: selectedWorkout.id,
      workoutTitle: selectedWorkout.title,
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
    
    handleUpdateProfile({ 
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
    setActiveTab(AppTab.DASHBOARD);
  };

  const exitWorkout = () => {
    if(confirm('Sair do treino? Seu progresso atual está salvo e será mantido para quando você voltar.')) { 
      setSelectedWorkout(null);
      setShowSummary(false);
      setActiveTab(AppTab.DASHBOARD);
    }
  };

  const calculateIMC = () => {
    if (!user || !user.weight || !user.height) return { val: '0', status: 'N/A' };
    const h = user.height > 3 ? user.height / 100 : user.height;
    const imc = user.weight / (h * h);
    let status = 'Normal';
    if (imc < 18.5) status = 'Baixo';
    else if (imc > 25 && imc < 30) status = 'Sobrepeso';
    else if (imc >= 30) status = 'Obeso';
    return { val: imc.toFixed(1), status };
  };

  const NavItem = ({ tab, icon: Icon, label }: { tab: AppTab, icon: any, label: string }) => {
    const isActive = activeTab === tab || (tab === AppTab.DASHBOARD && activeTab === AppTab.WORKOUT);
    return (
      <button 
        onClick={() => { setActiveTab(tab); setSelectedWorkout(null); setShowSummary(false); setIsSidebarOpen(false); }}
        className={`flex items-center gap-4 px-6 py-4 rounded-[1.5rem] transition-all duration-300 w-full group ${
          isActive 
          ? 'bg-emerald-500 text-zinc-950 shadow-lg shadow-emerald-500/20' 
          : 'text-zinc-500 hover:text-white hover:bg-white/5'
        }`}
      >
        <Icon size={24} strokeWidth={isActive ? 3 : 2} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-black uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  const renderDashboard = () => {
    if (!user) return null;
    const imcInfo = calculateIMC();
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

    const getLastCompletedDate = (workoutId: string) => {
      const entry = user.history.find(h => h.workoutId === workoutId);
      if (!entry) return null;
      return new Date(entry.date).toLocaleDateString('pt-BR');
    };

    const getHistoryCount = (workoutId: string) => {
      return user.history.filter(h => h.workoutId === workoutId).length;
    };

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

        {/* Weekly Consistency (Moved to bottom or kept as is) */}
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

  const renderWorkoutMode = () => {
    if (!selectedWorkout || !user) return null;
    
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
              <div className="glass-card p-6 rounded-[2rem] border border-emerald-500/10 bg-emerald-500/5">
                 <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Volume de Carga</p>
                 <div className="flex items-end justify-center gap-1">
                    <span className="text-3xl font-black text-white">{lastWorkoutVolume}</span>
                    <span className="text-[10px] font-bold text-emerald-500 mb-1.5 uppercase">kg</span>
                 </div>
              </div>
              <div className="glass-card p-6 rounded-[2rem] border border-indigo-500/10 bg-indigo-500/5">
                 <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Frequência</p>
                 <div className="flex items-end justify-center gap-1">
                    <span className="text-3xl font-black text-white">{user.streak}</span>
                    <Flame size={20} className="text-orange-500 mb-1.5" />
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
      <div className="space-y-6 animate-slide-up pb-32">
        <header className="flex items-center justify-between">
          <button onClick={exitWorkout} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[9px] font-black uppercase tracking-widest bg-zinc-900/60 px-4 py-2 rounded-xl border border-white/5 active:scale-95">
            <ChevronLeft size={16}/> Voltar
          </button>
          <div className="text-right">
             <div className="flex items-center gap-1.5 justify-end mb-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-500 text-[8px] font-black uppercase tracking-widest">Sessão Ativa</span>
             </div>
             <p className="text-lg font-black text-white italic tracking-tighter uppercase">{selectedWorkout.title}</p>
          </div>
        </header>

        <div className="bg-zinc-900/50 p-4 rounded-[1.5rem] border border-white/5">
           <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Conclusão do Treino</span>
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

        <div className="fixed bottom-0 left-0 right-0 p-5 md:p-8 md:left-[240px] z-50 pointer-events-none">
           <div className="max-w-4xl mx-auto pointer-events-auto">
              <button 
                onClick={handleFinishWorkout} 
                disabled={completedSets === 0} 
                className={`w-full font-black py-5 md:py-6 rounded-[1.8rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 flex items-center justify-center gap-3 text-[10px] transition-all border-b-4 ${
                  completedSets > 0 
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

  const renderHistory = () => (
    <div className="space-y-6 animate-slide-up pb-10">
      <header>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Meus <span className="text-emerald-500">Treinos</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Histórico de progresso.</p>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="glass-card p-12 rounded-[2.5rem] text-center border border-dashed border-white/10">
           <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-800 mx-auto mb-4"><History size={32} /></div>
           <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.2em]">Sua história começa agora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {user?.history.map((entry) => {
            const vol = entry.exercises.reduce((acc, ex) => acc + (ex.performance ? ex.performance.reduce((sa, p) => sa + (p.weight * p.reps), 0) : 0), 0);
            return (
              <div key={entry.id} className="glass-card p-5 md:p-6 rounded-[2rem] space-y-4 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-zinc-500">
                        <Calendar size={10} />
                        <p className="text-[8px] font-black uppercase tracking-widest">
                          {new Date(entry.date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
                        </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Finalizado</span>
                    <span className="text-[9px] font-bold text-zinc-600 mt-1 uppercase tracking-tighter">{vol}kg movidos</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
                  {entry.exercises.slice(0, 4).map((ex, idx) => (
                    <div key={idx} className="space-y-0.5">
                      <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest truncate">{ex.name}</p>
                      <div className="flex flex-wrap gap-1">
                        {ex.performance && ex.performance.slice(0, 2).map((s, si) => (
                          <div key={si} className="text-[7px] font-bold bg-zinc-900/80 text-white px-1.5 py-0.5 rounded-md">
                             {s.weight}kg x {s.reps}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderAIAssistant = () => (
    <div className="flex flex-col h-[calc(100vh-10rem)] animate-slide-up pb-10">
       <header className="mb-4">
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Tatu <span className="text-indigo-500">Expert</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1 text-[9px]">Sua consultoria 24h.</p>
       </header>
       <div className="flex-1 overflow-y-auto space-y-4 px-1 scrollbar-hide mb-4">
          {chatMessages.length === 0 && (
             <div className="glass-card rounded-[2rem] p-8 text-center space-y-4 max-w-xl mx-auto border border-indigo-500/10 bg-indigo-500/5">
                <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center text-white mx-auto shadow-xl shadow-indigo-500/20"><Bot size={32}/></div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">O que vamos evoluir hoje?</h2>
                    <p className="text-zinc-400 text-[10px] font-medium mt-1 leading-relaxed">Tire dúvidas sobre execução, cargas ou peça motivação.</p>
                </div>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-xs font-bold shadow-lg leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass-card text-zinc-300 rounded-tl-none border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
              <div className="flex justify-start">
                  <div className="glass-card p-4 rounded-[1.2rem] rounded-tl-none border-white/10">
                      <div className="flex gap-1.5">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
          )}
       </div>
       <div className="flex gap-2 p-1.5 glass-card rounded-[1.8rem] border-white/10 items-center max-w-3xl mx-auto w-full">
          <input 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Pergunte ao Tatu..." 
            className="flex-1 bg-transparent px-4 py-2 text-xs font-bold text-white outline-none placeholder:text-zinc-700" 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isChatLoading || !chatInput.trim()}
            className="w-12 h-12 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50"
          >
            <ChevronRight size={24} strokeWidth={3} />
          </button>
       </div>
    </div>
  );

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsChatLoading(true);
    try {
      const { chatWithPersonal } = await import('./services/geminiService');
      const responseText = await chatWithPersonal(chatMessages.map(m => ({ role: m.role, parts: [{ text: m.text }] })), userMsg);
      setChatMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'model', text: "Conexão interrompida. Tente novamente." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const renderOnboarding = () => (
    <div className="max-w-md mx-auto space-y-8 py-8 animate-slide-up relative z-10 text-center">
      <div className="space-y-4">
        <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl mb-4 transform rotate-12 glow-emerald"><Zap size={32} className="text-zinc-950" fill="currentColor" /></div>
        <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">Perfil <span className="text-emerald-500">Body</span></h1>
        <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.2em] px-8 leading-relaxed">Calibramos o sistema com seus dados.</p>
      </div>
      <div className="glass-card p-8 rounded-[2.5rem] space-y-6">
        <div className="space-y-2 text-left">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.4em]">Peso (kg)</label>
          <input type="number" inputMode="decimal" step="0.1" value={user?.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900/60 border border-white/10 rounded-[1.5rem] p-5 text-white font-black text-xl outline-none focus:border-emerald-500/50 text-center" placeholder="0.0" />
        </div>
        <div className="space-y-2 text-left">
          <label className="text-[8px] font-black text-zinc-500 uppercase ml-4 tracking-[0.4em]">Altura (m)</label>
          <input type="number" inputMode="decimal" step="0.01" value={user?.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900/60 border border-white/10 rounded-[1.5rem] p-5 text-white font-black text-xl outline-none focus:border-emerald-500/50 text-center" placeholder="1.75" />
        </div>
      </div>
      <button onClick={() => { if (!user?.weight || !user?.height) return alert('Insira seus dados.'); handleUpdateProfile({ isProfileComplete: true }); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-white text-zinc-950 font-black py-5 rounded-[1.8rem] shadow-xl uppercase tracking-[0.4em] active:scale-95 text-xs transition-all hover:bg-emerald-500">Continuar</button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-5 animate-slide-up pb-10 max-w-2xl">
      <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter italic uppercase leading-none">Minha <span className="text-emerald-500">Conta</span></h1>
      <div className="glass-card p-8 md:p-10 rounded-[2.5rem] space-y-8">
         <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-4xl font-black shadow-xl border-4 border-zinc-900">{user?.name.charAt(0)}</div>
           <div className="text-center md:text-left">
             <h3 className="text-2xl font-black text-white uppercase tracking-tight">{user?.name}</h3>
             <div className="flex items-center gap-2 mt-2">
                <span className="inline-block text-emerald-500 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/10">Nível: Pro</span>
                <span className="inline-block text-orange-400 text-[9px] font-black uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/10">{user?.streak} dias de sequência</span>
             </div>
           </div>
         </div>
         <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-900/40 p-6 rounded-[1.8rem] border border-white/5 space-y-0.5 text-center">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Massa</p>
              <p className="text-3xl font-black text-white">{user?.weight}<span className="text-sm ml-1 text-zinc-500">kg</span></p>
            </div>
            <div className="bg-zinc-900/40 p-6 rounded-[1.8rem] border border-white/5 space-y-0.5 text-center">
              <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">Estatura</p>
              <p className="text-3xl font-black text-white">{user?.height}<span className="text-sm ml-1 text-zinc-500">m</span></p>
            </div>
         </div>
         <div className="pt-2">
             <button onClick={() => { if(confirm('Sair da conta?')) { setIsLoggedIn(false); setUser(null); } }} className="w-full bg-red-500/5 text-red-500 py-4 rounded-[1.5rem] font-black uppercase tracking-[0.3em] active:scale-95 border border-red-500/10 flex items-center justify-center gap-2 text-[10px]"><LogOut size={16}/> Sair do App</button>
         </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-5 relative overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div 
            className="absolute inset-0 opacity-60" 
            style={{ 
              backgroundImage: `url(${LOGIN_IMAGE})`, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              animation: 'kenburns 20s infinite alternate ease-in-out' 
            }} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>
        
        <style>{`@keyframes kenburns { from { transform: scale(1) translate(0, 0); } to { transform: scale(1.1) translate(-2%, -2%); } }`}</style>

        <div className="w-full max-w-xs space-y-10 animate-fade relative z-10 flex flex-col items-center">
          <div className="text-center space-y-4">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2.2rem] flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.3)] transform rotate-6 animate-pulse">
              <Dumbbell size={40} className="text-zinc-950" strokeWidth={3} />
            </div>
            <div className="space-y-1">
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none italic drop-shadow-2xl">
                TATU<span className="text-emerald-500">GYM</span>
              </h1>
              <p className="text-zinc-400 text-[9px] font-black uppercase tracking-[0.5em] mt-2 opacity-80">Personal AI System</p>
            </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); handleLogin(loginData.user, loginData.pass, true); }} 
            className="w-full space-y-4"
          >
            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                <UserIcon size={18} />
              </div>
              <input 
                type="text" 
                value={loginData.user} 
                onChange={e => setLoginData({...loginData, user: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-black text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all backdrop-blur-xl" 
                placeholder="USUÁRIO" 
              />
            </div>

            <div className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-emerald-500 transition-colors">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={loginData.pass} 
                onChange={e => setLoginData({...loginData, pass: e.target.value})} 
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-white font-black text-sm outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all backdrop-blur-xl" 
                placeholder="SENHA" 
              />
            </div>

            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black py-5 rounded-2xl shadow-[0_15px_30px_rgba(16,185,129,0.2)] uppercase tracking-[0.3em] active:scale-95 text-xs transition-all mt-2">
              Iniciar Sessão
            </button>
          </form>

          <p className="text-zinc-600 text-[8px] font-black uppercase tracking-widest mt-4">
            Security Protected v2.5
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] relative overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 z-50 w-[240px] glass-card border-r border-white/5 p-6 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-white italic tracking-tighter">TATU<span className="text-emerald-500">GYM</span></h1>
            <span className="text-[7px] font-black text-zinc-600 uppercase tracking-widest mt-0.5">Professional v2.5</span>
          </div>
          <button className="md:hidden text-zinc-500" onClick={() => setIsSidebarOpen(false)}><X size={20}/></button>
        </div>
        
        <nav className="flex-1 space-y-2">
           <NavItem tab={AppTab.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
           <NavItem tab={AppTab.HISTORY} icon={History} label="Meus Treinos" />
           <NavItem tab={AppTab.AI_ASSISTANT} icon={Bot} label="Personal AI" />
           <NavItem tab={AppTab.SETTINGS} icon={UserIcon} label="Meu Perfil" />
        </nav>

        <div className="pt-4 border-t border-white/5">
           <button onClick={() => { if(confirm('Sair da conta?')) { setIsLoggedIn(false); setUser(null); } }} className="flex items-center gap-3 px-5 py-2.5 rounded-xl text-red-500 hover:bg-red-500/10 transition-all w-full">
             <LogOut size={16} />
             <span className="text-[9px] font-black uppercase tracking-widest">Sair</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-[240px] p-4 md:p-8 relative z-10 max-w-6xl mx-auto w-full">
        <div className="flex md:hidden items-center justify-between mb-4">
           <h1 className="text-lg font-black text-white italic tracking-tighter">TATU<span className="text-emerald-500">GYM</span></h1>
           <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-zinc-900 rounded-lg text-zinc-400 border border-white/10"><Menu size={18}/></button>
        </div>

        <div className="animate-fade no-scrollbar">
          {activeTab === AppTab.ONBOARDING ? renderOnboarding() : (
            activeTab === AppTab.DASHBOARD ? renderDashboard() : 
            (activeTab === AppTab.WORKOUT) ? renderWorkoutMode() : 
            activeTab === AppTab.HISTORY ? renderHistory() : 
            activeTab === AppTab.AI_ASSISTANT ? renderAIAssistant() :
            activeTab === AppTab.SETTINGS ? renderSettings() : null
          )}
        </div>
      </main>

      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-md glass-card border border-white/10 p-1 rounded-[1.8rem] flex md:hidden items-center justify-between shadow-2xl z-50">
          <button onClick={() => { setActiveTab(AppTab.DASHBOARD); setSelectedWorkout(null); setShowSummary(false); }} className={`p-3.5 rounded-full transition-all ${activeTab === AppTab.DASHBOARD || activeTab === AppTab.WORKOUT ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><LayoutDashboard size={18}/></button>
          <button onClick={() => { setActiveTab(AppTab.HISTORY); setSelectedWorkout(null); setShowSummary(false); }} className={`p-3.5 rounded-full transition-all ${activeTab === AppTab.HISTORY ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><History size={18}/></button>
          <button onClick={() => { setActiveTab(AppTab.AI_ASSISTANT); setSelectedWorkout(null); setShowSummary(false); }} className={`p-3.5 rounded-full transition-all ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-600'}`}><Bot size={18}/></button>
          <button onClick={() => { setActiveTab(AppTab.SETTINGS); setSelectedWorkout(null); setShowSummary(false); }} className={`p-3.5 rounded-full transition-all ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><UserIcon size={18}/></button>
        </nav>
      )}
    </div>
  );
};

export default App;
