import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  LayoutDashboard, 
  History as HistoryIcon, 
  User as UserIcon,
  Lock,
  Check,
  ArrowRight,
  Users,
  Plus
} from 'lucide-react';
import { useStore } from './store';
import { useWorkoutPersistence } from './hooks/useWorkoutPersistence';
import { AppTab, User } from './types';
import { ToastProvider, useToast } from './components/ui/Toast';
import { DashboardSkeleton } from './components/ui/Skeleton';
import { db, auth } from './firebase';
import { collection, getDocs, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';

// Views
import { DashboardView } from './components/views/DashboardView';
import { WorkoutView } from './components/views/WorkoutView';
import { HistoryView } from './components/views/HistoryView';
import { ProfileView } from './components/views/ProfileView';
import { TeacherView } from './components/views/TeacherView';
import { WorkoutsListView } from './components/views/WorkoutsListView';

const AppContent: React.FC = () => {
  const { 
    user, 
    isLoggedIn, 
    activeTab, 
    selectedWorkout, 
    isWorkoutActive, 
    currentSessionProgress,
    workoutStartTime,
    allWorkouts,
    theme,
    setUser, 
    setIsLoggedIn, 
    setActiveTab, 
    setSelectedWorkout,
    setCurrentSessionProgress,
    setIsWorkoutActive,
    setWorkoutStartTime,
    addToast,
    setAddToast
  } = useStore();

  useWorkoutPersistence();

  const { addToast: toastFn } = useToast();

  useEffect(() => {
    setAddToast(toastFn);
  }, [toastFn, setAddToast]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Sync Dynamic User Accent Color with global CSS variables based on target layouts
  useEffect(() => {
    let accentColor = '#00D2FF'; // Default / Henrique Electric Blue
    let accentRgb = '0, 210, 255';
    
    if (user) {
      const uName = user.username.toLowerCase();
      if (uName.includes('jessica') || uName.includes('jéssica')) {
        accentColor = '#FF2A85'; // Jessica Premium Pink
        accentRgb = '255, 42, 133';
      } else if (uName.includes('henrique')) {
        accentColor = '#00D2FF'; // Henrique Electric Blue
        accentRgb = '0, 210, 255';
      } else if (uName.includes('flavia') || uName.includes('flávia')) {
        accentColor = '#D4AF37'; // Flávia Premium Gold
        accentRgb = '212, 175, 55';
      } else {
        accentColor = '#00D2FF';
        accentRgb = '0, 210, 255';
      }
    }
    
    const root = document.documentElement;
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-color-rgb', accentRgb);
    root.style.setProperty('--highlight-color', accentColor);
    root.style.setProperty('--glow-color', `rgba(${accentRgb}, 0.15)`);
  }, [user]);

  // Safety sync for already logged-in users to ensure security rules work
  useEffect(() => {
    if (isLoggedIn && user && auth.currentUser) {
      const uid = auth.currentUser.uid;
      console.log(`[App] Sincronizando UID: ${uid} com papel: ${user.role}`);
      setDoc(doc(db, 'uids', uid), { 
        role: user.role,
        username: user.username,
        updatedAt: new Date().toISOString()
      }).then(() => {
        console.log(`[App] Sincronização de UID concluída com sucesso.`);
      }).catch(err => {
        console.error('[App] Erro na sincronização de UID:', err);
      });
    }
  }, [isLoggedIn, user]);

  const [isLoading, setIsLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(() => {
    const saved = localStorage.getItem('tatugym_remember_me_checked');
    if (saved !== null) return saved === 'true';
    return localStorage.getItem('tatugym_remembered') !== null;
  });

  // Sync rememberMe state with localStorage on change
  useEffect(() => {
    if (!rememberMe) {
      // We don't remove 'tatugym_remembered' here because it might be needed for auto-login
      // but we update the preference for NEXT login
    }
  }, [rememberMe]);

  useEffect(() => {
    const checkAutoLogin = async () => {
      try {
        console.log('[App] Verificando auto-login...');
        const remembered = localStorage.getItem('tatugym_remembered');
        if (remembered) {
          const userData = JSON.parse(remembered);
          console.log(`[App] Usuário lembrado encontrado: ${userData.username}`);
          
          const profile = localStorage.getItem(`tatugym_user_profile_${userData.username.toLowerCase()}`);
          const finalUser = profile ? JSON.parse(profile) : userData;
          
          // Ensure Firebase Auth session for security rules
          try {
            const userCredential = await signInAnonymously(auth);
            const uid = userCredential.user.uid;
            console.log(`[App] Auto-login Firebase sync UID: ${uid}`);
            
            // Sync role to uids collection for security rules
            await setDoc(doc(db, 'uids', uid), { 
              role: finalUser.role,
              username: finalUser.username,
              updatedAt: new Date().toISOString()
            });
          } catch (err: any) {
            if (err.code === 'auth/admin-restricted-operation') {
              console.warn('[App] Anonymous Authentication is disabled in Firebase Console. Auto-login falling back to offline mode.');
            } else {
              console.error('[App] Erro na sincronização Firebase durante auto-login:', err);
            }
          }

          setUser(finalUser);
          setIsLoggedIn(true);
        } else {
          console.log('[App] Nenhum usuário lembrado encontrado.');
        }
      } catch (error) {
        console.error('[App] Erro ao carregar usuário lembrado:', error);
        localStorage.removeItem('tatugym_remembered');
      } finally {
        setIsLoading(false);
      }
    };

    checkAutoLogin();
  }, []);

  const handleVibrate = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    handleVibrate();
    const lowerUser = username.toLowerCase();
    
    if (allWorkouts[lowerUser as keyof typeof allWorkouts] || lowerUser === 'professor' || lowerUser === 'admin') {
      let userData: User | null = null;
      let uid: string | null = null;

      try {
        // 1. Sign in anonymously first to get a UID for Firestore rules
        const userCredential = await signInAnonymously(auth);
        uid = userCredential.user.uid;
        
        // 2. Save UID mapping first to establish ownership so that isOwner(username) is instantly true
        await setDoc(doc(db, 'uids', uid), { 
          role: (lowerUser === 'professor' || lowerUser === 'admin') ? 'teacher' : 'student',
          username: lowerUser,
          updatedAt: new Date().toISOString()
        });
        console.log(`[App] Firebase session synchronized for ${lowerUser} (UID: ${uid})`);
      } catch (error: any) {
        if (error.code === 'auth/admin-restricted-operation') {
          console.warn('[App] Anonymous Authentication is disabled in Firebase Console. Continuing in offline/local fallback mode.');
        } else {
          console.error('[App] Firebase Authentication sync error:', error);
        }
      }

      try {
        // 3. Now we can safely perform our read since ownership has been registered
        const userDoc = await getDoc(doc(db, 'users', lowerUser));
        if (userDoc.exists()) {
          userData = userDoc.data() as User;
        } else {
          // Fallback to localStorage
          const profile = localStorage.getItem(`tatugym_user_profile_${lowerUser}`);
          if (profile) {
            userData = JSON.parse(profile);
          }
        }
      } catch (error) {
        // Quieter warning for permission policy errors when auth is restricted or database is not yet ready
        console.warn('Error parsing profile, falling back to local state:', error);
      }

      // Password check logic
      if (userData?.password) {
        if (password !== userData.password) {
          if (addToast) addToast('Senha incorreta.', 'error');
          return;
        }
      } else {
        // Fallback for hardcoded users if no profile exists yet
        if (lowerUser === 'flavia' && password !== '6087') {
          if (addToast) addToast('Senha incorreta para Flavia.', 'error');
          return;
        }
        if (lowerUser === 'henrique' && password !== '9860') {
          if (addToast) addToast('Senha incorreta para Henrique.', 'error');
          return;
        }
        if (lowerUser === 'jessica' && password !== '9860') {
          if (addToast) addToast('Senha incorreta para Jéssica.', 'error');
          return;
        }
        if (lowerUser === 'professor' && password !== 'admin') {
          if (addToast) addToast('Senha incorreta para Professor.', 'error');
          return;
        }
        if (lowerUser === 'admin' && password !== '9860') {
          if (addToast) addToast('Senha incorreta para Admin.', 'error');
          return;
        }
      }

      // If no profile exists, create default one
      if (!userData) {
        userData = {
          username: lowerUser,
          name: lowerUser === 'flavia' ? 'Flávia Reis' : lowerUser === 'professor' ? 'Professor Tatu' : lowerUser === 'admin' ? 'Administrador' : username.charAt(0).toUpperCase() + username.slice(1),
          age: lowerUser === 'flavia' ? 41 : undefined,
          goal: lowerUser === 'flavia' ? 'Saúde/ Tônus muscular' : undefined,
          totalWorkouts: 0,
          history: [],
          weights: {},
          checkIns: [],
          streak: 0,
          badges: [],
          isProfileComplete: true,
          role: (lowerUser === 'professor' || lowerUser === 'admin') ? 'teacher' : 'student'
        };
      }
      
      try {
        if (uid) {
          // Save to Firestore
          await setDoc(doc(db, 'users', lowerUser), userData);
        }
      } catch (error) {
        console.error('Error syncing with Firebase:', error);
      }

      setUser(userData);
      setIsLoggedIn(true);
      if (userData.role === 'teacher') {
        setActiveTab(AppTab.TEACHER);
      } else {
        setActiveTab(AppTab.DASHBOARD);
      }
      
      // Persistência de login
      console.log(`[App] Login bem-sucedido. Lembrar-me: ${rememberMe}`);
      localStorage.setItem('tatugym_remember_me_checked', rememberMe.toString());
      
      if (rememberMe) {
        console.log('[App] Salvando credenciais para "Lembrar-me" no localStorage');
        localStorage.setItem('tatugym_remembered', JSON.stringify(userData));
      } else {
        console.log('[App] Removendo credenciais de "Lembrar-me" do localStorage');
        localStorage.removeItem('tatugym_remembered');
      }
      
      if (addToast) addToast(`Bem-vindo de volta, ${userData.name}!`, 'success');
    } else {
      if (addToast) addToast('Usuário não encontrado.', 'error');
    }
  };

  if (isLoading) return <DashboardSkeleton />;

  if (!isLoggedIn) {
    return (
      <div className="h-screen overflow-hidden bg-[#050505] relative flex flex-col justify-center items-center p-6 font-sans selection:bg-accent/30 select-none">
        
        {/* Fundo Tecnológico (Efeito de Linhas Conexas) */}
        <svg className="absolute inset-0 w-full h-full opacity-30 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
              <circle cx="40" cy="0" r="1.5" fill="rgba(var(--accent-color-rgb), 0.08)" />
              <circle cx="0" cy="40" r="1.5" fill="rgba(var(--accent-color-rgb), 0.08)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          <line x1="10%" y1="20%" x2="30%" y2="40%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="30%" y1="40%" x2="25%" y2="70%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="25%" y1="70%" x2="60%" y2="85%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="60%" y1="85%" x2="80%" y2="45%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="80%" y1="45%" x2="55%" y2="25%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="55%" y1="25%" x2="10%" y2="20%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="30%" y1="40%" x2="55%" y2="25%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="25%" y1="70%" x2="55%" y2="25%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          <line x1="60%" y1="85%" x2="55%" y2="25%" stroke="rgba(var(--accent-color-rgb), 0.03)" strokeWidth="0.5" />
          
          <circle cx="10%" cy="20%" r="2" fill="rgba(var(--accent-color-rgb), 0.15)" />
          <circle cx="30%" cy="40%" r="2.5" fill="rgba(var(--accent-color-rgb), 0.2)" />
          <circle cx="25%" cy="70%" r="2" fill="rgba(var(--accent-color-rgb), 0.15)" />
          <circle cx="60%" cy="85%" r="3" fill="rgba(var(--accent-color-rgb), 0.2)" />
          <circle cx="80%" cy="45%" r="2" fill="rgba(var(--accent-color-rgb), 0.15)" />
          <circle cx="55%" cy="25%" r="2.5" fill="rgba(var(--accent-color-rgb), 0.2)" />
        </svg>

        {/* Efeito de iluminação sutil no topo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-sm space-y-10 relative z-10"
        >
          {/* Bloco do Logotipo (Brand Header) */}
          <div className="flex flex-col items-center text-center space-y-3">
            <Dumbbell size={48} className="text-accent drop-shadow-[0_0_15px_rgba(var(--accent-color-rgb),0.3)]" strokeWidth={2.5} />
            <div className="space-y-1">
              <h1 className="text-3xl font-[950] italic uppercase tracking-wider text-white">
                TATU<span className="text-accent">GYM</span>
              </h1>
              <p className="text-white/40 text-[10px] uppercase tracking-[0.25em] font-mono mt-1">
                ELITE PERFORMANCE SYSTEM
              </p>
            </div>
          </div>

          {" "}
          {/* Formulário com Inputs Otimizados */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-4">
              {/* Input Usuário */}
              <div className="space-y-1.5">
                <label className="text-white/50 text-[11px] uppercase tracking-wider font-bold mb-1.5 px-1 block">
                  USUÁRIO
                </label>
                <div className="bg-[#0c0c0c] border border-white/5 focus-within:border-accent/40 rounded-2xl p-4 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <UserIcon className="text-accent shrink-0" size={18} />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full bg-transparent text-white font-bold outline-none text-sm placeholder:text-white/20"
                      placeholder="Seu usuário"
                      required
                    />
                  </div>
                  <Plus className="text-white/20 shrink-0" size={16} />
                </div>
              </div>
              
              {" "}
              {/* Input Senha */}
              <div className="space-y-1.5">
                <label className="text-white/50 text-[11px] uppercase tracking-wider font-bold mb-1.5 px-1 block">
                  SENHA
                </label>
                <div className="bg-[#0c0c0c] border border-white/5 focus-within:border-accent/40 rounded-2xl p-4 transition-all flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Lock className="text-accent shrink-0" size={18} />
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-white font-bold outline-none text-sm placeholder:text-white/20"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  <Plus className="text-white/20 shrink-0" size={16} />
                </div>
              </div>
            </div>

            {" "}
            {/* Opção Unica de Lembrar Acesso */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                    rememberMe ? 'bg-accent border-accent' : 'border-white/10 bg-[#0c0c0c]'
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVibrate();
                    setRememberMe(!rememberMe);
                  }}
                >
                  {rememberMe && <Check size={11} className="text-black" strokeWidth={4.5} />}
                </div>
                <span className="text-[11px] font-black text-white/50 uppercase tracking-widest">
                  Lembrar acesso
                </span>
              </label>
            </div>

            {" "}
            {/* Botão de Entrada Massivo (CTA) */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full mt-6 bg-accent hover:opacity-90 text-[#050505] font-black italic uppercase py-4 rounded-3xl text-[15px] tracking-widest shadow-[0_0_25px_rgba(var(--accent-color-rgb),0.35)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 font-sans cursor-pointer border-0"
            >
              ENTRAR <ArrowRight size={18} strokeWidth={3} />
            </motion.button>
          </form>

        </motion.div>
      </div>
    );
  }

  const renderView = () => {
    if (selectedWorkout) return <WorkoutView />;
    
    switch (activeTab) {
      case AppTab.DASHBOARD: return <DashboardView />;
      case AppTab.WORKOUT: return <WorkoutsListView />;
      case AppTab.HISTORY: return <HistoryView />;
      case AppTab.PROFILE: return <ProfileView />;
      case AppTab.TEACHER: return <TeacherView />;
      default: return <DashboardView />;
    }
  };

  const isDashboard = isLoggedIn && activeTab === AppTab.DASHBOARD && !selectedWorkout;

  return (
    <div className={`h-[100dvh] max-h-[100dvh] overflow-hidden relative flex flex-col bg-[#050505] text-white transition-colors duration-400 select-none font-sans`}>
      {/* Plexus Connection Grid Background available across all screens - extremely subtle and highly refined */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="global-grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
            <circle cx="40" cy="0" r="1.0" fill="rgba(255, 255, 255, 0.05)" />
            <circle cx="0" cy="40" r="1.0" fill="rgba(255, 255, 255, 0.05)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#global-grid-pattern)" />
        
        <line x1="15%" y1="15%" x2="40%" y2="28%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="40%" y1="28%" x2="25%" y2="65%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="25%" y1="65%" x2="65%" y2="80%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="65%" y1="80%" x2="80%" y2="40%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="80%" y1="40%" x2="55%" y2="20%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="55%" y1="20%" x2="15%" y2="15%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        <line x1="40%" y1="28%" x2="55%" y2="20%" stroke="rgba(255, 255, 255, 0.02)" strokeWidth="0.5" />
        
        <circle cx="15%" cy="15%" r="1.2" fill="rgba(255, 255, 255, 0.06)" />
        <circle cx="40%" cy="28%" r="1.5" fill="rgba(255, 255, 255, 0.08)" />
        <circle cx="25%" cy="65%" r="1.2" fill="rgba(255, 255, 255, 0.06)" />
        <circle cx="65%" cy="80%" r="2.0" fill="rgba(255, 255, 255, 0.08)" />
        <circle cx="80%" cy="40%" r="1.2" fill="rgba(255, 255, 255, 0.06)" />
        <circle cx="55%" cy="20%" r="1.5" fill="rgba(255, 255, 255, 0.08)" />
      </svg>

      {/* Sutil lighting on top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-accent/5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Main viewport-bounded view container */}
      <div className="flex-grow flex-1 min-h-0 w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto px-2.5 md:px-4 lg:px-6 pt-1 pb-[74px] relative z-10 flex flex-col justify-between overflow-hidden">
        {renderView()}
      </div>

      {/* Navigation Bar */}
      {!selectedWorkout && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-white/[0.06] shadow-2xl select-none">
          <div className="w-full max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto h-[74px] px-4 flex items-center justify-around">
            {[
              ...(user?.role === 'teacher' ? [{ id: AppTab.TEACHER, icon: Users, label: 'Alunos' }] : []),
              { id: AppTab.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
              { id: AppTab.WORKOUT, icon: Dumbbell, label: 'Treinos' },
              { id: AppTab.HISTORY, icon: HistoryIcon, label: 'Histórico' },
              { id: AppTab.PROFILE, icon: UserIcon, label: 'Perfil' }
            ].map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    handleVibrate();
                    setActiveTab(item.id);
                  }}
                  className="relative flex flex-col items-center justify-center flex-1 h-full py-1 focus:outline-none"
                >
                  <item.icon 
                    size={20} 
                    className={`transition-colors duration-200 ${isActive ? 'text-accent' : 'text-zinc-500'}`} 
                    strokeWidth={isActive ? 3 : 2} 
                  />
                  <span className={`text-[8.5px] font-black uppercase tracking-[0.14em] mt-1.5 transition-colors duration-200 ${isActive ? 'text-accent' : 'text-zinc-500'}`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
