
import React, { useState, useEffect, useRef } from 'react';
import { initialWorkouts } from './data/workoutData';
import { AppTab, WorkoutRoutine, User, SocialPost } from './types';
import { ExerciseItem } from './components/ExerciseItem';
import { 
  Dumbbell, 
  Flame, 
  Calendar, 
  ChevronRight, 
  Bot,
  Plus,
  ArrowLeft,
  Sparkles,
  Users,
  Heart,
  MessageCircle,
  LogOut,
  CheckCircle2,
  Settings,
  Scale,
  Ruler,
  Target,
  UserCircle,
  Camera,
  CalendarDays,
  UserCheck,
  Zap
} from 'lucide-react';
import { getWorkoutAdvice, chatWithPersonal } from './services/geminiService';

const MOCK_SOCIAL_POSTS: SocialPost[] = [
  { id: '1', user: 'Jessica', avatar: 'https://i.pravatar.cc/150?u=jessica', content: 'Treino de hoje finalizado na Tatu Gym! 🔥🏋️‍♀️', time: '2h ago', likes: 12 },
  { id: '2', user: 'Tatu Personal', avatar: 'https://i.pravatar.cc/150?u=marcos', content: 'Lembrem-se: a consistência na Tatu Gym é o segredo.', time: '5h ago', likes: 45 },
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({ user: '', pass: '', remember: false });
  
  // Estado inicial zerado
  const [user, setUser] = useState<User>({
    username: 'Jessica',
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    goal: 'Hipertrofia',
    streak: 0,
    goalStreak: 20,
    totalWorkouts: 0,
    goalWorkouts: 20,
    checkIns: [],
    avatar: '',
    isProfileComplete: false
  });

  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.DASHBOARD);
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutRoutine | null>(null);
  const [aiAdvice, setAiAdvice] = useState<{tips: string[], motivation: string} | null>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('tatugym_remembered');
    if (saved) {
      const parsed = JSON.parse(saved);
      setLoginData({ user: parsed.user, pass: parsed.pass, remember: true });
    }
    
    const savedUser = localStorage.getItem('tatugym_user_profile');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      // Se o perfil já estiver completo, garante que não fique no onboarding
      if (parsedUser.isProfileComplete && activeTab === AppTab.ONBOARDING) {
        setActiveTab(AppTab.DASHBOARD);
      }
    }

    const savedCheckins = localStorage.getItem('tatugym_checkins_jessica');
    if (savedCheckins) {
      const checkins = JSON.parse(savedCheckins);
      setUser(prev => ({ 
        ...prev, 
        checkIns: checkins, 
        totalWorkouts: prev.totalWorkouts + checkins.length
      }));
    }
  }, []);

  useEffect(() => {
    const fetchAdvice = async () => {
      if (selectedWorkout) {
        setIsLoading(true);
        try {
          const advice = await getWorkoutAdvice(selectedWorkout, user.goal || 'Hipertrofia');
          setAiAdvice(advice);
        } catch (error) {
          console.error("Error fetching advice:", error);
          setAiAdvice({ tips: ["Mantenha o foco"], motivation: "Bora treinar pesado!" });
        } finally {
          setIsLoading(false);
        }
      } else {
        setAiAdvice(null);
      }
    };
    fetchAdvice();
  }, [selectedWorkout, user.goal]);

  const handleUpdateProfile = (newData: Partial<User>) => {
    const updated = { ...user, ...newData };
    setUser(updated);
    localStorage.setItem('tatugym_user_profile', JSON.stringify(updated));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleUpdateProfile({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.user.trim().toLowerCase() === 'jessica' && loginData.pass === '1345') {
      setIsLoggedIn(true);
      if (loginData.remember) {
        localStorage.setItem('tatugym_remembered', JSON.stringify(loginData));
      }
      
      // Se o perfil não estiver completo, forçar onboarding
      if (!user.isProfileComplete) {
        setActiveTab(AppTab.ONBOARDING);
      }
    } else {
      alert('Atenção: Apenas o usuário Jessica (senha 1345) está cadastrado.');
    }
  };

  const handleCompleteOnboarding = () => {
    if (!user.name || !user.age || !user.weight || !user.height) {
      alert('Por favor, preencha todas as informações essenciais para o seu plano Tatu Gym.');
      return;
    }
    handleUpdateProfile({ isProfileComplete: true });
    setActiveTab(AppTab.DASHBOARD);
  };

  const handleCheckIn = () => {
    const today = new Date().toISOString().split('T')[0];
    if (user.checkIns.includes(today)) {
      alert('Você já marcou presença hoje na Tatu Gym! ✅');
      return;
    }
    const newCheckins = [...user.checkIns, today];
    setUser(prev => ({ ...prev, checkIns: newCheckins, totalWorkouts: prev.totalWorkouts + 1 }));
    localStorage.setItem('tatugym_checkins_jessica', JSON.stringify(newCheckins));
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isLoading) return;
    const userText = chatMessage;
    setChatMessage('');
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    try {
      const history = chatHistory.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      }));
      const response = await chatWithPersonal(history as any, userText);
      setChatHistory(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setChatHistory(prev => [...prev, { role: 'model', text: "Erro ao conectar com o Tatu IA." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateIMC = () => {
    if (!user.weight || !user.height) return null;
    const imc = (user.weight / (user.height * user.height));
    let status = "";
    if (imc < 18.5) status = "Abaixo do peso";
    else if (imc < 25) status = "Peso normal";
    else if (imc < 30) status = "Sobrepeso";
    else status = "Obesidade";
    return { value: imc.toFixed(1), status };
  };

  const renderOnboarding = () => (
    <div className="space-y-8 py-8 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
          <Zap size={32} className="text-zinc-900" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">Bem-vinda, Jessica!</h1>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Vamos configurar seu perfil de atleta</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-28 h-28 rounded-[2.5rem] p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-2xl">
              {user.avatar ? (
                <img src={user.avatar} className="w-full h-full rounded-[2.3rem] object-cover border-4 border-zinc-900" />
              ) : (
                <div className="w-full h-full rounded-[2.3rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
                  <UserCircle size={48} />
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-900 border-4 border-zinc-900 shadow-lg active:scale-90 transition-all"
            >
              <Camera size={18} />
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2.2rem] space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Seu Nome de Atleta</label>
            <input 
              type="text" 
              value={user.name} 
              onChange={e => handleUpdateProfile({ name: e.target.value })}
              className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
              placeholder="Ex: Jessica Silva"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Peso (kg)</label>
              <input 
                type="number" 
                onChange={e => handleUpdateProfile({ weight: Number(e.target.value) })}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                placeholder="00"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Altura (m)</label>
              <input 
                type="number" 
                step="0.01"
                onChange={e => handleUpdateProfile({ height: Number(e.target.value) })}
                className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500 transition-all font-bold"
                placeholder="1.70"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Seu Objetivo</label>
            <select 
              value={user.goal}
              onChange={e => handleUpdateProfile({ goal: e.target.value })}
              className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white appearance-none focus:outline-none focus:border-emerald-500 transition-all font-bold"
            >
              <option value="Hipertrofia">Hipertrofia</option>
              <option value="Emagrecimento">Emagrecimento</option>
              <option value="Definição Muscular">Definição Muscular</option>
              <option value="Ganho de Força">Ganho de Força</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleCompleteOnboarding}
          className="w-full bg-emerald-500 text-zinc-900 font-black py-6 rounded-[2rem] shadow-xl active:scale-[0.98] transition-all uppercase tracking-widest flex items-center justify-center gap-3"
        >
          Começar Treinos <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const imcInfo = calculateIMC();
    return (
      <div className="space-y-6 pb-28 pt-4 animate-slide-up relative">
        <button 
          onClick={() => setActiveTab(AppTab.SETTINGS)}
          className="absolute top-4 right-0 w-12 h-12 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center text-zinc-400 active:scale-90 transition-all z-20 shadow-xl"
        >
          <Settings size={22} />
        </button>

        <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-4 relative z-10">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500">
                <img src={user.avatar || 'https://i.pravatar.cc/150?u=jessica'} className="w-full h-full rounded-[1.1rem] object-cover border-2 border-zinc-900" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center border-2 border-zinc-900">
                <CheckCircle2 size={12} className="text-zinc-900" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-black text-white truncate uppercase tracking-tighter">{user.name || 'Jessica'}</h1>
              <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">{user.age || '--'} Anos • {user.goal}</p>
              <div className="flex gap-2 mt-2">
                <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                  <span className="text-[8px] block text-zinc-500 font-bold uppercase">IMC</span>
                  <span className="text-xs font-bold text-white">{imcInfo?.value || '--'}</span>
                </div>
                <div className="bg-white/5 px-2 py-1 rounded-lg border border-white/5 flex-1">
                  <span className="text-[8px] block text-zinc-500 font-bold uppercase">Status</span>
                  <span className="text-xs font-bold text-emerald-400 truncate">{imcInfo?.status || '--'}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-500/10 blur-[50px] rounded-full pointer-events-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#121214] p-5 rounded-[2.2rem] border border-white/5 shadow-xl relative overflow-hidden group active:scale-95 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Flame size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-500/80">Streak</span>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-black text-white leading-none mb-1">{user.streak} <span className="text-sm text-zinc-500 font-bold">Dias</span></p>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-orange-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((user.streak / (user.goalStreak || 20)) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="bg-[#121214] p-5 rounded-[2.2rem] border border-white/5 shadow-xl relative overflow-hidden group active:scale-95 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <CalendarDays size={18} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-emerald-500/80">Treinos</span>
            </div>
            <div className="flex flex-col">
              <p className="text-2xl font-black text-white leading-none mb-1">{user.totalWorkouts} <span className="text-sm text-zinc-500 font-bold">Total</span></p>
              <div className="w-full bg-zinc-800 h-1 rounded-full mt-2 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${Math.min((user.totalWorkouts / (user.goalWorkouts || 20)) * 100, 100)}%` }} 
                />
              </div>
            </div>
          </div>
        </div>

        <button 
          onClick={handleCheckIn}
          className="w-full bg-emerald-500 p-5 rounded-[2rem] flex items-center justify-between active:scale-[0.97] transition-all shadow-xl shadow-emerald-500/10 border-b-4 border-emerald-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
              <UserCheck size={20} />
            </div>
            <div className="text-left">
              <p className="text-zinc-900 font-black uppercase text-sm">Registrar Hoje</p>
              <p className="text-emerald-900/60 text-[9px] font-extrabold uppercase tracking-widest">Presença Tatu Gym</p>
            </div>
          </div>
          <ChevronRight className="text-zinc-900/40" size={20} />
        </button>

        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] px-1">Seus Treinos Tatu</h2>
          <div className="space-y-3">
            {initialWorkouts.map((workout) => (
              <div 
                key={workout.id}
                onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }}
                className="glass-card p-5 rounded-[2.2rem] border border-white/5 hover:border-emerald-500/30 transition-all cursor-pointer active:scale-[0.98] flex items-center justify-between"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white tracking-tight leading-tight">{workout.title}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider mt-1">{workout.exercises.length} exercícios</p>
                </div>
                <div className="w-10 h-10 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 transition-colors">
                  <Plus size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderSettings = () => {
    const imcInfo = calculateIMC();
    return (
      <div className="space-y-6 pb-32 pt-4 animate-slide-up">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-400">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter italic">Personalizar Perfil</h1>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col items-center py-4">
            <div className="relative">
                <div className="w-24 h-24 rounded-[2.5rem] p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500 shadow-2xl">
                  {user.avatar ? (
                    <img src={user.avatar} className="w-full h-full rounded-[2.3rem] object-cover border-4 border-zinc-900" />
                  ) : (
                    <div className="w-full h-full rounded-[2.3rem] bg-zinc-900 flex items-center justify-center text-zinc-700">
                      <UserCircle size={48} />
                    </div>
                  )}
                </div>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-900 border-4 border-zinc-900 shadow-lg active:scale-90 transition-all"
                >
                  <Camera size={18} />
                </button>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-4 tracking-widest text-center">{user.name || 'Sem nome'} • {imcInfo?.status || 'Calculando...'}</p>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-6 rounded-[2.2rem] space-y-5">
              <div className="flex items-center gap-2 text-emerald-500">
                 <UserCircle size={18} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Informações Pessoais</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1 col-span-2">
                   <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nome Completo</label>
                   <input type="text" value={user.name} onChange={e => handleUpdateProfile({ name: e.target.value })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
                </div>
                <div className="space-y-1 col-span-2">
                   <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Idade</label>
                   <input type="number" value={user.age} onChange={e => handleUpdateProfile({ age: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Peso (kg)</label>
                  <input type="number" value={user.weight} onChange={e => handleUpdateProfile({ weight: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Altura (m)</label>
                  <input type="number" step="0.01" value={user.height} onChange={e => handleUpdateProfile({ height: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
                </div>
              </div>
            </div>

            <button onClick={() => { setIsLoggedIn(false); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-red-500/10 border border-red-500/20 text-red-500 font-black py-5 rounded-[2.2rem] flex items-center justify-center gap-2 active:scale-[0.98] transition-all text-xs tracking-widest">
               <LogOut size={16} /> ENCERRAR SESSÃO
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6 pt-[var(--safe-area-inset-top)] pb-[var(--safe-area-inset-bottom)]">
        <div className="w-full max-w-sm space-y-8 animate-fade">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/20 mb-6 transform rotate-12">
              <Dumbbell size={40} className="text-zinc-900" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">TATU <span className="text-emerald-500">GYM</span></h1>
            <p className="text-zinc-500 font-medium mt-2 text-sm">Acesso exclusivo para Jessica.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Identificação</label>
              <input type="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700" placeholder="Ex: Jessica" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Senha Tatu</label>
              <input type="password" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white focus:outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700" placeholder="••••" />
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-900 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/10 transition-all active:scale-[0.98] uppercase tracking-widest">
              ENTRAR NO PAINEL
            </button>
            <p className="text-[9px] text-center text-zinc-700 font-bold uppercase tracking-[0.2em] mt-6 leading-relaxed">Jessica (Senha: 1345)</p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#09090b] relative px-5 pt-8 overflow-x-hidden pt-[var(--safe-area-inset-top)]">
      <main>
        {activeTab === AppTab.ONBOARDING && renderOnboarding()}
        {activeTab === AppTab.DASHBOARD && renderDashboard()}
        
        {activeTab === AppTab.WORKOUT && (selectedWorkout ? (
            <div className="space-y-6 pb-32 pt-4 animate-slide-up">
               <div className="flex items-center gap-4">
                  <button onClick={() => setSelectedWorkout(null)} className="w-10 h-10 bg-zinc-900 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-400">
                    <ArrowLeft size={18} />
                  </button>
                  <h1 className="text-xl font-black text-white uppercase tracking-tighter truncate">{selectedWorkout.title}</h1>
               </div>
               <div className="glass-card p-5 rounded-[2.2rem] border-l-4 border-emerald-500/50 shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-emerald-400" size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Tatu IA Insight</span>
                  </div>
                  {isLoading ? <div className="h-10 bg-zinc-800/50 rounded-lg animate-pulse" /> : <p className="text-xs italic text-emerald-100/70 font-medium leading-relaxed">"{aiAdvice?.motivation || 'Mantenha o foco na amplitude do movimento.'}"</p>}
               </div>
               <div className="space-y-4">
                  {selectedWorkout.exercises.map(ex => <ExerciseItem key={ex.id} exercise={ex} />)}
               </div>
               <button onClick={() => { alert('Treino Finalizado! 🏆'); setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); }} className="w-full bg-emerald-500 text-zinc-900 font-black py-6 rounded-[2.2rem] text-sm shadow-xl active:scale-[0.98] transition-all border-b-4 border-emerald-700 uppercase tracking-widest">Finalizar Treino</button>
            </div>
          ) : renderDashboard())}

        {activeTab === AppTab.SOCIAL && (
          <div className="space-y-6 pb-32 pt-4 animate-slide-up">
             <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter italic">Gym<span className="text-emerald-500">rats</span></h1>
             <div className="space-y-5">
                {MOCK_SOCIAL_POSTS.map(post => (
                  <div key={post.id} className="glass-card rounded-[2.5rem] overflow-hidden border border-white/5">
                    <div className="p-4 flex items-center gap-3">
                      <img src={post.avatar} className="w-10 h-10 rounded-xl border border-white/10" />
                      <div>
                        <p className="font-bold text-sm text-white">{post.user}</p>
                        <p className="text-[9px] text-zinc-500 font-black tracking-widest uppercase">{post.time}</p>
                      </div>
                    </div>
                    <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">{post.content}</div>
                    <div className="p-4 border-t border-white/5 flex items-center gap-8 px-8">
                      <button className="flex items-center gap-1.5 text-zinc-500"><Heart size={18}/> <span className="text-xs font-black">{post.likes}</span></button>
                      <button className="text-zinc-500"><MessageCircle size={18}/></button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === AppTab.AI_ASSISTANT && (
          <div className="pb-32 pt-4 animate-slide-up h-[85vh] flex flex-col">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3 border-b-4 border-indigo-700"><Bot size={24} /></div>
                <div>
                  <h1 className="text-lg font-black text-white uppercase tracking-tighter leading-none">TATU IA</h1>
                  <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase">Coach Inteligente</span>
                </div>
             </div>
             <div className="flex-1 overflow-y-auto space-y-4 pr-1 custom-scrollbar">
                <div className="glass-card p-5 rounded-[1.5rem] border border-white/5 text-sm text-zinc-300 leading-relaxed">
                  Fala Jessica! Analisando seu progresso atual de <b>{user.totalWorkouts} treinos</b>, você está no caminho certo para o objetivo de <b>{user.goal}</b>. Tem alguma dúvida específica hoje?
                </div>
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`p-4 rounded-[1.2rem] max-w-[85%] text-sm shadow-md ${msg.role === 'user' ? 'bg-emerald-500 text-zinc-900 font-bold' : 'glass-card border border-white/5 text-zinc-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-4 relative">
                <input type="text" value={chatMessage} onChange={e => setChatMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="Tirar dúvida técnica..." className="w-full bg-zinc-900 border border-white/5 rounded-full py-5 pl-7 pr-16 text-white focus:outline-none focus:border-indigo-500 transition-all text-sm shadow-2xl" />
                <button onClick={handleSendMessage} className="absolute right-2 top-2 bottom-2 w-11 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg active:scale-[0.9] transition-all"><ChevronRight size={20}/></button>
             </div>
          </div>
        )}

        {activeTab === AppTab.SETTINGS && renderSettings()}
      </main>

      {/* Nav oculta durante onboarding para evitar bypass */}
      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[22rem] bg-[#121214]/90 backdrop-blur-2xl border border-white/5 p-2 rounded-[3rem] flex items-center justify-between shadow-2xl z-50 ring-1 ring-white/10 pb-[calc(0.5rem+var(--safe-area-inset-bottom))]">
          <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className={`p-4 sm:p-5 rounded-full transition-all active:scale-[0.9] ${activeTab === AppTab.DASHBOARD ? 'bg-emerald-500 text-zinc-900 shadow-xl' : 'text-zinc-500'}`}><Dumbbell size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.SOCIAL)} className={`p-4 sm:p-5 rounded-full transition-all active:scale-[0.9] ${activeTab === AppTab.SOCIAL ? 'bg-emerald-500 text-zinc-900 shadow-xl' : 'text-zinc-500'}`}><Users size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.AI_ASSISTANT)} className={`p-4 sm:p-5 rounded-full transition-all active:scale-[0.9] ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white shadow-xl' : 'text-zinc-500'}`}><Bot size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.SETTINGS)} className={`p-4 sm:p-5 rounded-full transition-all active:scale-[0.9] ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-900 shadow-xl' : 'text-zinc-500'}`}><Settings size={22} /></button>
        </nav>
      )}
    </div>
  );
};

export default App;
