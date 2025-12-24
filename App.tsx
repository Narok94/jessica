
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
        totalWorkouts: checkins.length
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
          setAiAdvice({ tips: ["Mantenha o foco"], motivation: "Bora treinar pesado!" });
        } finally {
          setIsLoading(false);
        }
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
      if (!user.isProfileComplete) {
        setActiveTab(AppTab.ONBOARDING);
      }
    } else {
      alert('Credenciais incorretas.');
    }
  };

  const handleCompleteOnboarding = () => {
    if (!user.name || !user.age || !user.weight || !user.height) {
      alert('Preencha os dados básicos.');
      return;
    }
    handleUpdateProfile({ isProfileComplete: true });
    setActiveTab(AppTab.DASHBOARD);
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
    <div className="space-y-8 py-10 animate-slide-up">
      <div className="text-center space-y-2">
        <div className="mx-auto w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl mb-4">
          <Zap size={32} className="text-zinc-900" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter">BEM-VINDA, JESSICA!</h1>
        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Configure seu perfil Tatu Gym pela primeira vez</p>
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
            <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-zinc-900 border-4 border-zinc-900 shadow-lg"><Camera size={18} /></button>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileUpload} />
          </div>
        </div>

        <div className="glass-card p-6 rounded-[2.2rem] space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Nome Completo</label>
            <input type="text" value={user.name} onChange={e => handleUpdateProfile({ name: e.target.value })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" placeholder="Jessica..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Peso (kg)</label>
              <input type="number" onChange={e => handleUpdateProfile({ weight: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Altura (m)</label>
              <input type="number" step="0.01" onChange={e => handleUpdateProfile({ height: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-black text-zinc-500 uppercase ml-2 tracking-widest">Idade</label>
            <input type="number" onChange={e => handleUpdateProfile({ age: Number(e.target.value) })} className="w-full bg-zinc-800/50 border border-white/5 rounded-2xl p-4 text-white font-bold" />
          </div>
        </div>

        <button onClick={handleCompleteOnboarding} className="w-full bg-emerald-500 text-zinc-900 font-black py-6 rounded-[2rem] shadow-xl uppercase tracking-widest">SALVAR E CONTINUAR</button>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] p-6">
        <div className="w-full max-w-sm space-y-8 animate-fade">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-500 rounded-[2rem] flex items-center justify-center shadow-2xl mb-6 transform rotate-12">
              <Dumbbell size={40} className="text-zinc-900" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">TATU GYM</h1>
            <p className="text-zinc-500 text-sm mt-2">Acesso restrito para Jessica</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" value={loginData.user} onChange={e => setLoginData({...loginData, user: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white" placeholder="Usuário (Jessica)" />
            <input type="password" value={loginData.pass} onChange={e => setLoginData({...loginData, pass: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-white" placeholder="Senha (1345)" />
            <button className="w-full bg-emerald-500 text-zinc-900 font-black py-5 rounded-2xl shadow-xl uppercase tracking-widest">ENTRAR</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#09090b] relative px-5 pt-8 overflow-x-hidden">
      <main>
        {activeTab === AppTab.ONBOARDING ? renderOnboarding() : (
          activeTab === AppTab.DASHBOARD ? (
            <div className="space-y-6 pb-28 pt-4 animate-slide-up">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">MEU <span className="text-emerald-500">PAINEL</span></h1>
                <button onClick={() => setActiveTab(AppTab.SETTINGS)} className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-500"><Settings size={20}/></button>
              </div>
              
              <div className="glass-card p-5 rounded-[2.5rem] border border-white/5 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                   <div className="w-20 h-20 rounded-3xl p-0.5 bg-gradient-to-tr from-emerald-500 to-indigo-500">
                     <img src={user.avatar || 'https://i.pravatar.cc/150?u=jessica'} className="w-full h-full rounded-[1.1rem] object-cover border-2 border-zinc-900" />
                   </div>
                   <div>
                     <h1 className="text-xl font-black text-white uppercase tracking-tighter">{user.name || 'JESSICA'}</h1>
                     <p className="text-emerald-500 text-[9px] font-black uppercase tracking-[0.2em]">{user.goal} • {calculateIMC()?.status || 'Aguardando dados'}</p>
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest px-1">MEUS TREINOS</h2>
                {initialWorkouts.map((workout) => (
                  <div key={workout.id} onClick={() => { setSelectedWorkout(workout); setActiveTab(AppTab.WORKOUT); }} className="glass-card p-5 rounded-[2.2rem] border border-white/5 flex items-center justify-between active:scale-95 transition-all">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight">{workout.title}</h3>
                      <p className="text-zinc-500 text-[10px] font-bold uppercase">{workout.exercises.length} exercícios</p>
                    </div>
                    <ChevronRight className="text-zinc-700" size={20} />
                  </div>
                ))}
              </div>
            </div>
          ) : (activeTab === AppTab.WORKOUT && selectedWorkout) ? (
            <div className="space-y-6 pb-32 pt-4 animate-slide-up">
              <button onClick={() => { setSelectedWorkout(null); setActiveTab(AppTab.DASHBOARD); }} className="flex items-center gap-2 text-zinc-500 text-xs font-black uppercase tracking-widest"><ArrowLeft size={16}/> Voltar</button>
              <h1 className="text-xl font-black text-white uppercase">{selectedWorkout.title}</h1>
              {selectedWorkout.exercises.map(ex => <ExerciseItem key={ex.id} exercise={ex} />)}
            </div>
          ) : null
        )}
      </main>

      {activeTab !== AppTab.ONBOARDING && (
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2.5rem)] max-w-[22rem] bg-[#121214]/90 backdrop-blur-2xl border border-white/5 p-2 rounded-[3rem] flex items-center justify-between shadow-2xl z-50">
          <button onClick={() => setActiveTab(AppTab.DASHBOARD)} className={`p-4 rounded-full ${activeTab === AppTab.DASHBOARD ? 'bg-emerald-500 text-zinc-900' : 'text-zinc-500'}`}><Dumbbell size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.SOCIAL)} className={`p-4 rounded-full ${activeTab === AppTab.SOCIAL ? 'bg-emerald-500 text-zinc-900' : 'text-zinc-500'}`}><Users size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.AI_ASSISTANT)} className={`p-4 rounded-full ${activeTab === AppTab.AI_ASSISTANT ? 'bg-indigo-500 text-white' : 'text-zinc-500'}`}><Bot size={22} /></button>
          <button onClick={() => setActiveTab(AppTab.SETTINGS)} className={`p-4 rounded-full ${activeTab === AppTab.SETTINGS ? 'bg-emerald-500 text-zinc-900' : 'text-zinc-500'}`}><Settings size={22} /></button>
        </nav>
      )}
    </div>
  );
};

export default App;
