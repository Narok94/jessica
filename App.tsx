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
  Users
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
      <div className={`min-h-screen ${theme} bg-bg text-ink flex flex-col items-center justify-center p-6 font-sans selection:bg-accent/30 relative overflow-hidden transition-colors duration-400`}>
        {/* Animated Mesh Background (CSS variable based) */}
        <div className="bg-mesh absolute inset-0 opacity-40 pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--accent-color)_5%,_transparent_40%)] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,_var(--highlight-color)_5%,_transparent_40%)] opacity-20 pointer-events-none"></div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md space-y-12 relative z-10"
        >
          <div className="flex flex-col items-center gap-6 text-center">
             <motion.div 
               whileHover={{ rotate: 5, scale: 1.05 }}
               className="p-8 glass-card rounded-[3rem] shadow-2xl relative"
             >
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-highlight rounded-full animate-pulse shadow-[0_0_15px_var(--highlight-color)]"></div>
                <Dumbbell size={64} className="text-accent" strokeWidth={2.5} />
             </motion.div>
             <div className="space-y-2">
                <h1 className="text-5xl font-black text-ink tracking-tighter italic uppercase leading-none">
                  TATU <span className="text-accent">GYM</span>
                </h1>
                <p className="text-[10px] font-black text-secondary uppercase tracking-[0.4em]">Elite Performance System</p>
             </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Usuário</label>
                <div className="relative group">
                  <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full glass-card rounded-2xl p-5 pl-16 text-ink font-bold outline-none focus:border-accent group-hover:bg-white/5 transition-all placeholder:text-secondary/30"
                    placeholder="Seu usuário"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-secondary group-focus-within:text-accent transition-colors" size={20} />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-card rounded-2xl p-5 pl-16 text-ink font-bold outline-none focus:border-accent group-hover:bg-white/5 transition-all placeholder:text-secondary/30"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div 
                  className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${rememberMe ? 'bg-accent border-accent shadow-lg shadow-accent/20' : 'border-line bg-white/5'}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleVibrate();
                    setRememberMe(!rememberMe);
                  }}
                >
                  {rememberMe && <Check size={14} className="text-white" strokeWidth={4} />}
                </div>
                <span className="text-[11px] font-black text-secondary uppercase tracking-widest">Lembrar acesso</span>
              </label>
              <button 
                type="button" 
                onClick={handleVibrate}
                className="text-[10px] font-black text-secondary uppercase tracking-widest hover:text-accent transition-colors"
              >
                Esqueci
              </button>
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.5em] transition-all flex items-center justify-center gap-4 border shadow-xl ${
                (username || password) 
                ? 'bg-accent text-white border-accent shadow-accent/20' 
                : 'bg-white/5 border-line text-secondary'
              }`}
            >
              ENTRAR <ArrowRight size={20} strokeWidth={3} />
            </motion.button>
          </form>

          <div className="pt-8 text-center">
             <p className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed opacity-50">
               © 2026 TATU GYM PRO • HIGH TECH FITNESS
             </p>
          </div>
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
    <div className={`min-h-screen ${theme} bg-bg text-ink ${isDashboard ? 'h-screen max-h-screen overflow-hidden pb-[74px]' : 'pb-24'} transition-colors duration-400`}>
      <div className={isDashboard ? 'max-w-md mx-auto px-4.5 pt-2 h-[calc(100vh-74px)] overflow-hidden flex flex-col justify-between' : 'max-w-md mx-auto px-4.5 pt-4'}>
        {renderView()}
      </div>

      {/* Navigation Bar */}
      {!selectedWorkout && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#050505] border-t border-white/[0.06] shadow-2xl select-none">
          <div className="max-w-md mx-auto h-[74px] px-4 flex items-center justify-around">
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
                    className={`transition-colors duration-200 ${isActive ? 'text-[#FF5F00]' : 'text-zinc-500'}`} 
                    strokeWidth={isActive ? 3 : 2} 
                  />
                  <span className={`text-[8.5px] font-black uppercase tracking-[0.14em] mt-1.5 transition-colors duration-200 ${isActive ? 'text-[#FF5F00]' : 'text-zinc-500'}`}>
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
