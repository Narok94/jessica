
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { jessicaWorkouts, henriqueWorkouts } from './data/workoutData';
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
  LayoutDashboard
} from 'lucide-react';

declare var confetti: any;

const LOGIN_IMAGE = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop";
const DASHBOARD_BG = "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop";

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

  useEffect(() => {
    if (user && selectedWorkout) {
      localStorage.setItem(`tatugym_active_session_${user.username}`, JSON.stringify({
        workoutId: selectedWorkout.id,
        progress: currentSessionProgress,
        timestamp: new Date().toISOString()
      }));
    } else if (user) {
      localStorage.removeItem(`tatugym_active_session_${user.username}`);
    }
  }, [selectedWorkout, currentSessionProgress, user]);

  const handleLogin = (usernameInput: string, passwordInput: string, manual: boolean) => {
    const u = usernameInput.trim().toLowerCase();
    if ((u === 'jessica' || u === 'henrique') && passwordInput === '9860') {
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
      const activeSession = localStorage.getItem(`tatugym_active_session_${userData.username}`);
      if (activeSession) {
        const parsed = JSON.parse(activeSession);
        const workoutsSet = u === 'henrique' ? henriqueWorkouts : jessicaWorkouts;
        const workout = workoutsSet.find(w => w.id === parsed.workoutId);
        if (workout) {
          setSelectedWorkout(workout);
          setCurrentSessionProgress(parsed.progress);
          setActiveTab(AppTab.WORKOUT);
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
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#10b981', '#6366f1', '#fbbf24'] });
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
    if (user.checkIns.includes(today)) return;
    const newCheckIns = [...user.checkIns, today];
    handleUpdateProfile({ checkIns: newCheckIns });
    triggerConfetti();
  };

  const handleSaveProgress = (exerciseId: string, performance: SetPerformance[]) => {
    setCurrentSessionProgress(prev => ({ ...prev, [exerciseId]: performance }));
  };

  const handleFinishWorkout = () => {
    if (!selectedWorkout || !user) return;
    const today = new Date().toISOString().split('T')[0];
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
    (Object.entries(currentSessionProgress) as [string, SetPerformance[]][]).forEach(([id, perf]) => {
      const lastWeight = perf.filter(p => p.completed).reverse()[0]?.weight;
      if (lastWeight) newWeights[id] = lastWeight;
    });
    const newCheckIns = user.checkIns.includes(today) ? user.checkIns : [...user.checkIns, today];
    handleUpdateProfile({ 
      history: [historyEntry, ...user.history],
      totalWorkouts: (user.totalWorkouts || 0) + 1,
      weights: newWeights,
      checkIns: newCheckIns,
      streak: user.streak + 1
    });
    triggerConfetti();
    localStorage.removeItem(`tatugym_active_session_${user.username}`);
    setSelectedWorkout(null);
    setCurrentSessionProgress({});
    setActiveTab(AppTab.DASHBOARD);
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
        onClick={() => { setActiveTab(tab); setSelectedWorkout(null); setIsSidebarOpen(false); }}
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
        return { label, active: user.checkIns?.includes(iso), today: iso === today };
    });

    return (
      <div className="space-y-8 animate-slide-up pb-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
              Bem-vindo, <span className="text-emerald-500">{user.name}</span>
            </h1>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 text-xs">{greeting}! Sua performance está em alta.</p>
          </div>
          <div className="hidden md:flex gap-4">
             <div className="glass-card px-6 py-3 rounded-2xl flex items-center gap-3">
                <Flame size={20} className="text-orange-500" />
                <span className="text-xl font-black text-white">{user.streak || 0}</span>
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Main Action & Consistancy */}
          <div className="lg:col-span-8 space-y-6">
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-emerald-400 to-emerald-600 p-8 md:p-12 group cursor-pointer" onClick={() => { if(initialWorkouts[0]) { setSelectedWorkout(initialWorkouts[0]); setActiveTab(AppTab.WORKOUT); } }}>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 blur-[100px] rounded-full -mr-20 -mt-20"></div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-3">
                  <span className="bg-zinc-950 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Sessão Sugerida</span>
                  <h2 className="text-4xl md:text-5xl font-black text-zinc-950 uppercase tracking-tight">{initialWorkouts[0]?.title || 'Treino A'}</h2>
                  <div className="flex gap-4 text-zinc-900/70 font-black text-sm uppercase">
                    <span className="flex items-center gap-1.5"><Clock size={16}/> ~45 min</span>
                    <span className="flex items-center gap-1.5"><Activity size={16}/> {initialWorkouts[0]?.exercises.length} Exercícios</span>
                  </div>
                </div>
                <button className="bg-zinc-950 text-white w-16 h-16 md:w-24 md:h-24 rounded-[2rem] flex items-center justify-center shadow-2xl hover:scale-105 transition-transform group-hover:rotate-6">
                   <ArrowRight size={32} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[3rem] space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-3">
                  <Calendar size={18} className="text-emerald-500" /> Consistência Semanal
                </h3>
              </div>
              <div className="flex justify-between items-center max-w-2xl mx-auto">
                {weekActivity.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-4">
                    <div className={`w-12 h-14 md:w-16 md:h-20 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 border-2 ${
                      day.active 
                      ? 'bg-emerald-500 border-emerald-400 text-zinc-950 shadow-2xl shadow-emerald-500/40 scale-110' 
                      : day.today ? 'bg-zinc-900 border-emerald-500/30 text-white' : 'bg-zinc-900/50 border-white/5 text-zinc-600'
                    }`}>
                      <span className="text-sm md:text-lg font-black">{day.label}</span>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full ${day.active ? 'bg-emerald-500' : 'bg-transparent'}`}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & AI */}
          <div className="lg:col-span-4 space-y-6">
             <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
                <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between h-40">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total de Treinos</p>
                  <div className="flex items-end justify-between">
                    <span className="text-5xl font-black text-white">{user.totalWorkouts}</span>
                    <Trophy className="text-emerald-500/20" size={48} />
                  </div>
                </div>
                <div className="glass-card p-8 rounded-[2.5rem] flex flex-col justify-between h-40">
                  <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Índice IMC</p>
                  <div className="flex items-end justify-between">
                    <span className="text-5xl font-black text-white">{imcInfo.val}</span>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">{imcInfo.status}</span>
                  </div>
                </div>
             </div>

             <div className="bg-indigo-600/10 border border-indigo-500/20 p-8 rounded-[3rem] relative overflow-hidden group">
               <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
               <div className="flex items-start gap-6 relative z-10">
                 <div className="w-14 h-14 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
                    <Bot size={28} />
                 </div>
                 <div className="space-y-2">
                    <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">Personal Tatu Insight</p>
                    <p className="text-zinc-300 font-bold italic leading-relaxed">"O sucesso é a soma de pequenos esforços repetidos dia após dia."</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Workout Library Grid */}
        <section className="space-y-6 pt-6">
          <h2 className="text-sm font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Biblioteca de Sessões</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialWorkouts.map((workout) => (
              <div 
                key={workout.id}
                onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }}
                className="glass-card p-8 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer group hover:bg-white/5"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                    <Dumbbell size={28} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-white group-hover:bg-emerald-500 transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{workout.title}</h3>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{workout.exercises.length} Exercícios selecionados</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const renderWorkoutMode = () => {
    if (!selectedWorkout || !user) return null;
    const totalSets = selectedWorkout.exercises.reduce((acc, ex) => acc + ex.sets, 0);
    const completedSets = (Object.values(currentSessionProgress) as SetPerformance[][]).reduce((acc, perf) => acc + perf.filter(p => p.completed).length, 0);
    const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

    return (
      <div className="space-y-8 animate-slide-up pb-32">
        <header className="flex items-center justify-between">
          <button onClick={() => { if(confirm('Sair do treino?')) { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); } }} className="flex items-center gap-3 text-zinc-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"><ChevronLeft size={20}/> Cancelar Sessão</button>
          <div className="text-right">
             <div className="flex items-center gap-2 justify-end mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Sessão em curso</span>
             </div>
             <p className="text-2xl font-black text-white italic tracking-tighter uppercase">{selectedWorkout.title}</p>
          </div>
        </header>

        <div className="h-4 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
           <div className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all duration-700 ease-out" style={{ width: `${progressPercent}%` }}></div>
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

        <div className="fixed bottom-0 left-0 right-0 p-6 md:p-10 md:left-[280px] z-50 pointer-events-none">
           <div className="max-w-4xl mx-auto pointer-events-auto">
              <button 
                onClick={handleFinishWorkout} 
                disabled={completedSets === 0} 
                className={`w-full font-black py-6 md:py-8 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 flex items-center justify-center gap-4 text-sm md:text-base transition-all border-b-4 ${
                  completedSets > 0 
                  ? 'bg-emerald-500 text-zinc-950 border-emerald-700 shadow-emerald-500/40' 
                  : 'bg-zinc-800 text-zinc-600 border-zinc-900 opacity-50 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 size={24} strokeWidth={4} /> Finalizar & Sincronizar
              </button>
           </div>
        </div>
      </div>
    );
  };

  const renderHistory = () => (
    <div className="space-y-8 animate-slide-up pb-10">
      <header>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Log de <span className="text-emerald-500">Performance</span></h1>
        <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 text-xs">Registro histórico de todas as suas sessões de elite.</p>
      </header>
      
      {user?.history.length === 0 ? (
        <div className="glass-card p-20 rounded-[4rem] text-center border border-dashed border-white/10">
           <div className="w-24 h-24 bg-zinc-900 rounded-[2.5rem] flex items-center justify-center text-zinc-800 mx-auto mb-8"><History size={48} /></div>
           <p className="text-zinc-500 text-sm font-black uppercase tracking-[0.2em]">Nenhum registro encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {user?.history.map((entry) => (
            <div key={entry.id} className="glass-card p-8 rounded-[3rem] space-y-6 border-l-8 border-l-emerald-500">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{entry.workoutTitle}</h3>
                  <div className="flex items-center gap-2 mt-2 text-zinc-500">
                      <Calendar size={14} />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                  </div>
                </div>
                <span className="bg-emerald-500 text-zinc-950 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20">Finalizado</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-white/5">
                {entry.exercises.map((ex, idx) => (
                  <div key={idx} className="space-y-2">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest truncate">{ex.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ex.performance.map((s, si) => (
                        <div key={si} className="text-[9px] font-bold bg-zinc-900/80 text-white px-2 py-1 rounded-lg border border-white/5">
                           {s.weight}kg × {s.reps}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAIAssistant = () => (
    <div className="flex flex-col h-[calc(100vh-10rem)] animate-slide-up pb-10">
       <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Tatu <span className="text-indigo-500">Assistant</span></h1>
          <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] mt-2 text-xs">Inteligência Artificial aplicada ao seu treino.</p>
       </header>
       <div className="flex-1 overflow-y-auto space-y-6 px-1 scrollbar-hide mb-8">
          {chatMessages.length === 0 && (
             <div className="glass-card rounded-[3.5rem] p-12 text-center space-y-6 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-indigo-500/40"><Bot size={40}/></div>
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Fala, Atleta!</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-3 leading-relaxed">Estou aqui para otimizar sua técnica, sugerir ajustes de carga ou simplesmente te motivar a quebrar limites. Como posso ajudar hoje?</p>
                </div>
             </div>
          )}
          {chatMessages.map((msg, i) => (
             <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-6 rounded-[2.2rem] text-sm font-bold shadow-xl leading-relaxed ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass-card text-zinc-300 rounded-tl-none border-white/10'}`}>
                   {msg.text}
                </div>
             </div>
          ))}
          {isChatLoading && (
              <div className="flex justify-start">
                  <div className="glass-card p-6 rounded-[2rem] rounded-tl-none border-white/10">
                      <div className="flex gap-2">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                      </div>
                  </div>
              </div>
          )}
       </div>
       <div className="flex gap-4 p-3 glass-card rounded-[2.5rem] border-white/10 items-center max-w-4xl mx-auto w-full">
          <input 
            value={chatInput} 
            onChange={e => setChatInput(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
            placeholder="Pergunte algo técnico ou peça motivação..." 
            className="flex-1 bg-transparent px-6 py-4 text-base font-bold text-white outline-none placeholder:text-zinc-700" 
          />
          <button 
            onClick={handleSendMessage} 
            disabled={isChatLoading || !chatInput.trim()}
            className="w-14 h-14 bg-indigo-500 text-white rounded-2xl flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50"
          >
            <ChevronRight size={28} strokeWidth={3} />
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
    <div className="max-w-xl mx-auto space-y-12 py-10 animate-slide-up relative z-10 text-center">
      <div className="space-y-6">
        <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[3rem] flex items-center justify-center shadow-2xl mb-8 transform rotate-12 glow-emerald"><Zap size={48} className="text-zinc-950" fill="currentColor" /></div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter italic leading-none">Ativar <span className="text-emerald-500">Potencial</span></h1>
        <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.3em] px-10 leading-relaxed">Configure seu perfil biométrico para calibração dos treinos.</p>
      </div>
      <div className="glass-card p-12 rounded-[4rem] space-y-10">
        <div className="space-y-4 text-left">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-6 tracking-[0.4em]">Massa Corporal (kg)</label>
          <input type="number" inputMode="decimal" step="0.1" value={user?.weight || ''} onChange={e => handleUpdateProfile({ weight: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900/60 border border-white/10 rounded-[2.5rem] p-8 text-white font-black text-3xl outline-none focus:border-emerald-500/50 text-center" placeholder="0.0" />
        </div>
        <div className="space-y-4 text-left">
          <label className="text-[10px] font-black text-zinc-500 uppercase ml-6 tracking-[0.4em]">Estatura (m)</label>
          <input type="number" inputMode="decimal" step="0.01" value={user?.height || ''} onChange={e => handleUpdateProfile({ height: parseFloat(e.target.value) || 0 })} className="w-full bg-zinc-900/60 border border-white/10 rounded-[2.5rem] p-8 text-white font-black text-3xl outline-none focus:border-emerald-500/50 text-center" placeholder="1.75" />
        </div>
      </div>
      <button onClick={() => { if (!user?.weight || !user?.height) return alert('Insira seus dados para prosseguir.'); handleUpdateProfile({ isProfileComplete: true }); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-white text-zinc-950 font-black py-8 rounded-[3rem] shadow-2xl uppercase tracking-[0.5em] active:scale-95 text-base transition-all hover:bg-emerald-500">Calibrar Sistema</button>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-8 animate-slide-up pb-10 max-w-4xl">
      <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">Perfil do <span className="text-emerald-500">Usuário</span></h1>
      <div className="glass-card p-10 md:p-14 rounded-[4rem] space-y-12">
         <div className="flex flex-col md:flex-row items-center gap-10">
           <div className="w-32 h-32 rounded-[3rem] bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white text-5xl font-black shadow-2xl border-4 border-zinc-900">{user?.name.charAt(0)}</div>
           <div className="text-center md:text-left">
             <h3 className="text-3xl font-black text-white uppercase tracking-tight">{user?.name}</h3>
             <span className="inline-block mt-3 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/10">Status: Elite Athlete</span>
           </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Peso Atual</p>
              <p className="text-4xl font-black text-white">{user?.weight} <span className="text-xs font-bold text-zinc-600">KG</span></p>
            </div>
            <div className="bg-zinc-900/40 p-10 rounded-[3rem] border border-white/5 space-y-2">
              <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Altura</p>
              <p className="text-4xl font-black text-white">{user?.height} <span className="text-xs font-bold text-zinc-600">M</span></p>
            </div>
         </div>
         <div className="pt-6">
             <button onClick={() => { setIsLoggedIn(false); setUser(null); }} className="w-full bg-red-500/10 text-red-500 py-8 rounded-[3rem] font-black uppercase tracking-[0.4em] active:scale-95 border border-red-500/20 flex items-center justify-center gap-4 text-sm"><LogOut size={20}/> Encerrar Sessão</button>
         </div>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${LOGIN_IMAGE})`, backgroundSize: 'cover', backgroundPosition: 'center', animation: 'kenburns 20s infinite alternate ease-in-out' }} />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[4px]"></div>
        </div>
        <style>{`@keyframes kenburns { from { transform: scale(1); } to { transform: scale(1.15); } }`}</style>
        <div className="w-full max-w-sm space-y-10 animate-fade relative z-10">
          <div className="text-center">
            <div className="mx-auto w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl mb-8 transform rotate-6 glow-emerald">
              <Dumbbell size={48} className="text-zinc-950" strokeWidth={3} />
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none italic">TATU<span className="text-emerald-500">GYM</span></h1>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] mt-4">Personal AI System</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(loginData.user, loginData.pass, true); }} className="space-y-6">
            <input type="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-7 text-white text-center font-black text-lg outline-none focus:border-emerald-500/50 backdrop-blur-md" placeholder="USUÁRIO" />
            <input type="password" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-7 text-white text-center font-black text-lg outline-none focus:border-emerald-500/50 backdrop-blur-md" placeholder="CÓDIGO" />
            <button className="w-full bg-white text-zinc-950 font-black py-7 rounded-[2.5rem] shadow-2xl uppercase tracking-[0.4em] active:scale-95 text-xs">Acessar Ecossistema</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] relative overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-[280px] glass-card border-r border-white/5 p-8 flex flex-col transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-16">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-white italic tracking-tighter">TATU<span className="text-emerald-500">GYM</span></h1>
            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">v2.5 Professional</span>
          </div>
          <button className="md:hidden text-zinc-500" onClick={() => setIsSidebarOpen(false)}><X size={24}/></button>
        </div>
        
        <nav className="flex-1 space-y-4">
           <NavItem tab={AppTab.DASHBOARD} icon={LayoutDashboard} label="Dashboard" />
           <NavItem tab={AppTab.HISTORY} icon={History} label="Histórico" />
           <NavItem tab={AppTab.AI_ASSISTANT} icon={Bot} label="Personal AI" />
           <NavItem tab={AppTab.SETTINGS} icon={UserIcon} label="Perfil" />
        </nav>

        <div className="pt-8 border-t border-white/5">
           <button onClick={() => { setIsLoggedIn(false); setUser(null); }} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all w-full group">
             <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-xs font-black uppercase tracking-widest">Sair</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[280px] p-6 md:p-12 relative z-10 max-w-7xl mx-auto w-full">
        {/* Mobile Navbar */}
        <div className="flex md:hidden items-center justify-between mb-8">
           <h1 className="text-2xl font-black text-white italic tracking-tighter">TATU<span className="text-emerald-500">GYM</span></h1>
           <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-zinc-900 rounded-2xl text-zinc-400 border border-white/10"><Menu size={24}/></button>
        </div>

        <div className="animate-fade no-scrollbar">
          {activeTab === AppTab.ONBOARDING ? renderOnboarding() : (
            activeTab === AppTab.DASHBOARD ? renderDashboard() : 
            (activeTab === AppTab.WORKOUT && selectedWorkout) ? renderWorkoutMode() : 
            activeTab === AppTab.HISTORY ? renderHistory() : 
            activeTab === AppTab.AI_ASSISTANT ? renderAIAssistant() :
            activeTab === AppTab.SETTINGS ? renderSettings() : null
          )}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm glass-card border border-white/10 p-2 rounded-[2.5rem] flex md:hidden items-center justify-between shadow-2xl z-50">
          <button onClick={() => { setActiveTab(AppTab.DASHBOARD); setSelectedWorkout(null); }} className={`p-4 rounded-full transition-all ${activeTab === AppTab.DASHBOARD || activeTab === AppTab.WORKOUT ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><LayoutDashboard size={20}/></button>
          <button onClick={() => { setActiveTab(AppTab.HISTORY); setSelectedWorkout(null); }} className={`p-4 rounded-full transition-all ${activeTab === AppTab.HISTORY ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><History size={20}/></button>
          <button onClick={() => { setActiveTab(AppTab.AI_ASSISTANT); setSelectedWorkout(null); }} className={`p-4 rounded-full transition-all ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white shadow-lg' : 'text-zinc-600'}`}><Bot size={20}/></button>
          <button onClick={() => { setActiveTab(AppTab.SETTINGS); setSelectedWorkout(null); }} className={`p-4 rounded-full transition-all ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-950 shadow-lg' : 'text-zinc-600'}`}><UserIcon size={20}/></button>
        </nav>
      )}
    </div>
  );
};

export default App;
