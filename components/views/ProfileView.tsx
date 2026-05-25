import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  UserCircle2, 
  ShieldCheck, 
  Trophy, 
  Award, 
  Rocket, 
  Flame, 
  Sun, 
  Moon, 
  Edit2, 
  X, 
  Scale, 
  Ruler, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { user, logout, theme, toggleTheme, updateUserProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editLevel, setEditLevel] = useState('');

  if (!user) return null;

  const handleLogout = () => {
    logout();
  };

  const handleVibrate = (ms = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(ms);
    }
  };

  const getBiometrics = () => {
    const usernameLower = user.username.toLowerCase();
    
    // Default values if not specified in user profile
    let defaultWeight = 75.0;
    let defaultHeight = 1.75;
    let defaultLevel = 'Atleta';
    
    if (usernameLower === 'henrique') {
      defaultWeight = 68.0;
      defaultHeight = 1.68;
      defaultLevel = 'Atleta Avançado';
    } else if (usernameLower === 'flavia' || usernameLower === 'flávia') {
      defaultWeight = 62.0;
      defaultHeight = 1.65;
      defaultLevel = 'Atleta Intermediário';
    } else if (usernameLower === 'jessica' || usernameLower === 'jéssica') {
      defaultWeight = 60.0;
      defaultHeight = 1.68;
      defaultLevel = 'Atleta Avançado';
    }

    return {
      weight: user.weight !== undefined && user.weight !== null ? user.weight : defaultWeight,
      height: user.height !== undefined && user.height !== null ? user.height : defaultHeight,
      level: user.goal || defaultLevel,
      initial: user.name ? user.name.charAt(0).toUpperCase() : (user.username ? user.username.charAt(0).toUpperCase() : 'U')
    };
  };

  const bio = getBiometrics();

  const handleOpenEdit = () => {
    handleVibrate(15);
    setEditName(user.name);
    setEditWeight(bio.weight.toString());
    setEditHeight(bio.height.toString());
    setEditLevel(bio.level);
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    handleVibrate(25);

    const weightNum = parseFloat(editWeight) || bio.weight;
    const heightNum = parseFloat(editHeight) || bio.height;

    updateUserProfile({
      name: editName.trim() || user.name,
      weight: weightNum,
      height: heightNum,
      goal: editLevel || bio.level
    });

    setIsEditing(false);
  };

   const badgeIcons: Record<string, any> = {
    Rocket: <Rocket size={18} className="text-accent" />,
    Trophy: <Trophy size={18} className="text-accent" />,
    Flame: <Flame size={18} className="text-accent" />,
    Award: <Award size={18} className="text-accent" />
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between pb-1.5 bg-transparent select-none font-sans relative">
       {/* Compact Header */}
       <header className="flex items-center justify-between py-1.5 px-1 border-b border-white/5 shrink-0">
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter italic uppercase leading-none">Meu <span className="text-accent">Perfil</span></h1>
            <p className="text-white/40 uppercase tracking-widest mt-1 text-[8px] font-mono leading-none">Configurações e conquistas.</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                handleVibrate(5);
                toggleTheme();
              }} 
              className="w-7 h-7 bg-white/[0.01] border border-white/5 rounded-lg flex items-center justify-center text-accent active:scale-95 transition-all"
            >
              {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button 
              onClick={() => {
                handleVibrate(15);
                handleLogout();
              }} 
              className="text-[7.5px] font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest transition-colors py-1 px-2 border border-rose-500/10 rounded bg-rose-500/[0.02]"
            >
              SAIR
            </button>
          </div>
       </header>

       {/* Biometrics Profile Card - Compact Horizontal */}
       <div className="bg-[#0c0c0c]/80 border border-white/5 p-2.5 rounded-xl flex items-center justify-between gap-3 shrink-0 mt-2 text-left">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20 shrink-0">
              <UserCircle2 size={32} className="text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-black text-white uppercase tracking-tight leading-none truncate">{user.name}</h2>
              <div className="flex items-center gap-1.5 mt-1 leading-none text-white/40">
                 <ShieldCheck size={10} className="text-emerald-500" />
                 <span className="text-[8px] font-black uppercase tracking-widest font-mono">Membro Pro</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleOpenEdit}
            className="flex items-center gap-1 py-1.5 px-2 text-[8px] font-black uppercase tracking-widest text-accent bg-accent/5 hover:bg-accent/10 border border-accent/15 rounded-lg transition-colors shrink-0"
          >
            <Edit2 size={10} />
            Editar
          </button>
       </div>

       {/* Real-time edited metrics display under card */}
       <div className="bg-[#0c0c0c]/60 border border-white/5 px-3 py-2 rounded-xl grid grid-cols-3 gap-1.5 mt-1.5 shrink-0 text-left">
          <div className="flex flex-col">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest">Nível</span>
            <span className="text-[9.5px] font-black text-accent uppercase truncate">{bio.level}</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-2">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-0.5">
              <Scale size={7} /> Peso
            </span>
            <span className="text-[9.5px] font-black text-white font-mono">{bio.weight} kg</span>
          </div>
          <div className="flex flex-col border-l border-white/5 pl-2">
            <span className="text-[7px] font-mono text-white/30 uppercase tracking-widest flex items-center gap-0.5">
              <Ruler size={7} /> Altura
            </span>
            <span className="text-[9.5px] font-black text-white font-mono">{bio.height} m</span>
          </div>
       </div>

       {/* Stats Grid Compact Horizontal */}
       <div className="grid grid-cols-2 gap-2 mt-2 shrink-0">
          <div className="bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl space-y-0.5 leading-none">
             <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest font-mono">Total de Treinos</p>
             <p className="text-lg font-black text-white font-mono leading-none">{user.totalWorkouts || 0}</p>
          </div>
          <div className="bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl flex justify-between items-center leading-none">
             <div>
                <p className="text-[7.5px] font-black text-white/40 uppercase tracking-widest font-mono">Sequência</p>
                <p className="text-lg font-black text-white font-mono leading-none mt-0.5">{user.streak || 0}</p>
             </div>
             <Flame size={16} className="text-accent" />
          </div>
       </div>

       {/* Horizontal medals slider avoids grids page overflows entirely */}
       <div className="flex-1 min-h-0 flex flex-col justify-end pb-1 mt-2.5">
          <h3 className="text-[8.5px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-1.5 px-1 shrink-0 mb-1.5">
            <Award size={11} className="text-emerald-500" /> Minhas Medalhas
          </h3>
          
          <div className="flex-1 min-h-0 py-0.5">
            {user.badges && user.badges.length > 0 ? (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
                {user.badges.map((badge, idx) => (
                  <motion.div 
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.04 }}
                    className="flex-shrink-0 w-28 bg-[#0c0c0c]/80 border border-white/5 p-2 rounded-xl flex flex-col items-center text-center space-y-1.5 shadow-sm"
                  >
                    <div className="w-8 h-8 bg-white/[0.02] rounded-lg flex items-center justify-center border border-white/5 shrink-0">
                      {badgeIcons[badge.icon] || <Award size={18} className="text-accent" />}
                    </div>
                    <div>
                      <p className="text-[8.5px] font-black text-white uppercase tracking-tight leading-tight truncate w-[100px]">{badge.name}</p>
                      <p className="text-[7px] font-black text-white/40 uppercase mt-0.5 leading-none truncate w-[100px]">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="w-full bg-[#0c0c0c]/50 p-4 rounded-xl border border-dashed border-white/5 text-center flex items-center justify-center">
                <p className="text-white/40 text-[7.5px] font-black uppercase tracking-widest leading-normal">
                  Nenhuma medalha conquistada ainda. Continue treinando!
                </p>
              </div>
            )}
          </div>
       </div>

       {/* Premium Dark Profile Edit Modal */}
       <AnimatePresence>
         {isEditing && (
           <div className="absolute inset-x-0 bottom-0 top-0 bg-black/85 backdrop-blur-md z-40 flex items-end sm:items-center justify-center">
             <motion.div 
               initial={{ y: "100%", opacity: 0.9 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: "100%", opacity: 0.9 }}
               transition={{ type: "spring", damping: 25, stiffness: 220 }}
               className="w-full sm:max-w-md bg-[#080808] border-t sm:border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 space-y-4 max-h-[90%] overflow-y-auto"
             >
               {/* Modal Header */}
               <div className="flex justify-between items-center text-left">
                 <div>
                   <h3 className="text-base font-black text-white uppercase italic tracking-wide">Editar Perfil</h3>
                   <p className="text-[8px] font-mono text-white/40 uppercase tracking-wider">Ajuste seus dados biométricos reais.</p>
                 </div>
                 <button 
                   onClick={() => {
                     handleVibrate(5);
                     setIsEditing(false);
                   }}
                   className="w-7 h-7 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                 >
                   <X size={14} />
                 </button>
               </div>

               {/* Edit Form */}
               <form onSubmit={handleSave} className="space-y-3.5 text-left">
                 {/* Name Input */}
                 <div className="space-y-1">
                   <label className="text-[7.5px] font-mono font-black text-white/40 uppercase tracking-widest">Nome de Atleta</label>
                   <input 
                     type="text" 
                     value={editName}
                     onChange={(e) => setEditName(e.target.value)}
                     className="w-full bg-[#0e0e0e] border border-white/5 text-white placeholder-zinc-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors font-bold uppercase tracking-wide"
                     required
                     maxLength={24}
                   />
                 </div>

                 {/* Weight & Height Inputs Grid */}
                 <div className="grid grid-cols-2 gap-3">
                   <div className="space-y-1">
                     <label className="text-[7.5px] font-mono font-black text-white/40 uppercase tracking-widest flex items-center gap-1">
                       <Scale size={10} className="text-accent" /> Peso Corporall (kg)
                     </label>
                     <input 
                       type="number" 
                       step="0.1" 
                       value={editWeight}
                       onChange={(e) => setEditWeight(e.target.value)}
                       className="w-full bg-[#0e0e0e] border border-white/5 text-white placeholder-zinc-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors font-mono font-bold"
                       required
                     />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[7.5px] font-mono font-black text-white/40 uppercase tracking-widest flex items-center gap-1">
                       <Ruler size={10} className="text-accent" /> Altura (m)
                     </label>
                     <input 
                       type="number" 
                       step="0.01" 
                       value={editHeight}
                       onChange={(e) => setEditHeight(e.target.value)}
                       className="w-full bg-[#0e0e0e] border border-white/5 text-white placeholder-zinc-700 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-accent transition-colors font-mono font-bold"
                       required
                     />
                   </div>
                 </div>

                 {/* Athlete Level Choice Options */}
                 <div className="space-y-1.5">
                   <label className="text-[7.5px] font-mono font-black text-white/40 uppercase tracking-widest">Nível do Atleta</label>
                   <div className="grid grid-cols-2 gap-1.5">
                     {[
                       'Atleta Iniciante',
                       'Atleta Intermediário',
                       'Atleta Avançado',
                       'Atleta Elite'
                     ].map((lvl) => (
                       <button
                         key={lvl}
                         type="button"
                         onClick={() => {
                           handleVibrate(5);
                           setEditLevel(lvl);
                         }}
                         className={`py-2 px-2.5 text-[8.5px] font-black uppercase tracking-wide rounded-lg border text-center transition-all ${
                           editLevel === lvl
                             ? 'bg-accent/10 border-accent text-white shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.15)]'
                             : 'bg-[#0f0f0f] border-white/5 text-white/40 hover:text-white hover:border-white/10'
                         }`}
                       >
                         {lvl.replace('Atleta ', '')}
                       </button>
                     ))}
                   </div>
                 </div>

                 {/* Save Button */}
                 <div className="pt-2">
                   <button
                     type="submit"
                     className="w-full bg-accent hover:bg-accent/90 text-[#050505] font-[950] italic uppercase py-3 rounded-xl text-xs transition-colors shadow-md flex justify-center items-center gap-2 cursor-pointer uppercase tracking-widest duration-200"
                   >
                     <Check size={14} strokeWidth={3} /> Salvar Alterações
                   </button>
                 </div>
               </form>
             </motion.div>
           </div>
         )}
       </AnimatePresence>
    </div>
  );
};
