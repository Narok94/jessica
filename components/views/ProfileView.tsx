import React, { useState } from 'react';
import { useStore } from '../../store';
import { 
  Trophy, 
  Award, 
  Rocket, 
  Flame, 
  Edit2, 
  X, 
  Scale, 
  Ruler, 
  Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProfileView: React.FC = () => {
  const { user, updateUserProfile } = useStore();
  const [isEditing, setIsEditing] = useState(false);

  // Form states
  const [editName, setEditName] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editLevel, setEditLevel] = useState('');

  if (!user) return null;

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
    Rocket: <Rocket size={14} className="text-accent" />,
    Trophy: <Trophy size={14} className="text-accent" />,
    Flame: <Flame size={14} className="text-accent" />,
    Award: <Award size={14} className="text-accent" />
  };

  return (
    <div className="h-full max-h-full overflow-hidden flex flex-col justify-between py-4 px-3 bg-transparent text-white font-sans antialiased select-none relative">
      
      {/* HEADER: Minimalist header matching Dashboard and Workouts */}
      <div className="space-y-1 px-1 shrink-0 mb-4 text-left">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent font-mono">Configurações</span>
        <h1 className="text-xl font-extrabold text-white tracking-tight leading-none mt-1">
          Meu Perfil
        </h1>
        <p className="text-xs text-zinc-500 leading-normal">
          Monitore sua evolução e dados de atleta.
        </p>
      </div>

      {/* BODY CONFIGURATOR AREA */}
      <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar space-y-6 px-1">
        
        {/* ATHLETE IDENTIFIER CARD */}
        <div className="bg-[#080808] border border-white/5 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm relative">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-base font-black text-accent shrink-0 select-none">
              {bio.initial}
            </div>
            <div className="min-w-0 text-left">
              <span className="text-[7.5px] font-mono text-zinc-500 font-extrabold uppercase tracking-widest block mb-1">Membro Confirmado Pro</span>
              <h2 className="text-[15px] font-black text-white uppercase tracking-tight leading-none truncate mb-1.5">{user.name}</h2>
              <p className="text-[9px] text-zinc-400 font-mono font-bold leading-none uppercase">{bio.level}</p>
            </div>
          </div>
          
          <button 
            onClick={handleOpenEdit}
            className="w-8 h-8 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-accent transition-colors shrink-0"
            title="Editar Perfil"
          >
            <Edit2 size={11} />
          </button>
        </div>

        {/* BIOMETRICS & METRICS ROW */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Biometrics widget */}
          <div className="bg-[#080808] border border-white/5 p-4 rounded-2xl space-y-3.5 shadow-sm text-left">
            <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase font-mono block">Biometria</span>
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-zinc-550 uppercase text-[8px] tracking-wider font-semibold">PESO</span>
                <span className="font-extrabold text-zinc-200">{bio.weight} kg</span>
              </div>
              <div className="h-px bg-white/[0.03]" />
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-zinc-550 uppercase text-[8px] tracking-wider font-semibold">ALTURA</span>
                <span className="font-extrabold text-zinc-200">{bio.height} m</span>
              </div>
            </div>
          </div>

          {/* Activity counts widget */}
          <div className="bg-[#080808] border border-white/5 p-4 rounded-2xl space-y-3.5 shadow-sm text-left">
            <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase font-mono block">Consistência</span>
            <div className="space-y-2.5">
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-zinc-550 uppercase text-[8px] tracking-wider font-semibold">TOTAL</span>
                <span className="font-extrabold text-zinc-200">{user.totalWorkouts || 0} treinos</span>
              </div>
              <div className="h-px bg-white/[0.03]" />
              <div className="flex justify-between items-baseline font-mono text-xs">
                <span className="text-zinc-550 uppercase text-[8px] tracking-wider font-semibold">STREAK</span>
                <span className="font-extrabold text-amber-500 flex items-center gap-0.5">
                  <Flame size={10} className="fill-amber-500/10" />
                  {user.streak || 0} dias
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MEDALS SLIDER */}
        <div className="space-y-3 text-left">
          <span className="text-[7.5px] font-extrabold tracking-[0.2em] text-zinc-500 uppercase font-mono block px-0.5">Minhas Conquistas</span>
          
          {user.badges && user.badges.length > 0 ? (
            <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1 max-w-full">
              {user.badges.map((badge, idx) => (
                <motion.div 
                  key={badge.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="flex-shrink-0 w-28 bg-[#080808] border border-white/5 p-3 rounded-2xl flex flex-col items-center text-center space-y-2.5 shadow-sm"
                >
                  <div className="w-8 h-8 bg-zinc-900 border border-white/5 rounded-xl flex items-center justify-center shrink-0">
                    {badgeIcons[badge.icon] || <Award size={13} className="text-accent" />}
                  </div>
                  <div className="min-w-0 w-full text-center">
                    <p className="text-[9px] font-extrabold text-zinc-200 uppercase tracking-tight leading-tight truncate">{badge.name}</p>
                    <p className="text-[7px] font-normal text-zinc-500 uppercase mt-0.5 leading-none truncate">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="w-full bg-zinc-950/10 p-5 rounded-2xl border border-dashed border-white/5 text-center flex items-center justify-center">
              <span className="text-zinc-650 text-[8px] font-bold uppercase tracking-widest leading-normal">
                Nenhuma medalha conquistada ainda.
              </span>
            </div>
          )}
        </div>

      </div>

      {/* PRESERVING USER FOOTER ALIGNMENTS */}
      <div className="px-1 shrink-0 pt-3 text-center">
        <span className="text-[7.5px] font-mono font-bold text-zinc-650 tracking-widest uppercase">
          Tatu Pro Premium Active Account
        </span>
      </div>

      {/* PREMIUM ATHLETE EDIT MODAL */}
      <AnimatePresence>
        {isEditing && (
          <div className="absolute inset-x-0 bottom-0 top-0 bg-black/90 backdrop-blur-md z-40 flex items-center justify-center p-3">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-sm bg-[#080808] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl max-h-[90%] overflow-y-auto text-left"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">Editar Atleta</h3>
                  <p className="text-[7.5px] font-mono text-zinc-500 uppercase tracking-wider">Mantenha seus dados reais em dia.</p>
                </div>
                <button 
                  onClick={() => {
                    handleVibrate(5);
                    setIsEditing(false);
                  }}
                  className="w-7 h-7 bg-zinc-900 hover:bg-zinc-800 border border-white/5 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                >
                  <X size={12} />
                </button>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-[7.5px] font-mono font-black text-zinc-500 uppercase tracking-widest">Nome do Atleta</label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full bg-zinc-950 border border-white/5 text-white placeholder-zinc-750 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent transition-colors font-bold uppercase tracking-wide"
                    required
                    maxLength={24}
                  />
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[7.5px] font-mono font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Scale size={9} className="text-zinc-650" /> PESO (KG)
                    </label>
                    <input 
                      type="number" 
                      step="0.1" 
                      value={editWeight}
                      onChange={(e) => setEditWeight(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 text-white placeholder-zinc-750 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent transition-colors font-mono font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[7.5px] font-mono font-black text-zinc-500 uppercase tracking-widest flex items-center gap-1">
                      <Ruler size={9} className="text-zinc-650" /> ALTURA (M)
                    </label>
                    <input 
                      type="number" 
                      step="0.01" 
                      value={editHeight}
                      onChange={(e) => setEditHeight(e.target.value)}
                      className="w-full bg-zinc-950 border border-white/5 text-white placeholder-zinc-750 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-accent transition-colors font-mono font-bold"
                      required
                    />
                  </div>
                </div>

                {/* Level Choice Options */}
                <div className="space-y-1.5">
                  <label className="text-[7.5px] font-mono font-black text-zinc-500 uppercase tracking-widest">Nível Atual</label>
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
                            ? 'bg-accent/10 border-accent/40 text-white shadow-[0_0_8px_rgba(var(--accent-color-rgb),0.1)]'
                            : 'bg-zinc-950 border-white/5 text-zinc-500 hover:text-white hover:border-white/10'
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
                    className="w-full bg-accent hover:bg-accent/95 text-black font-extrabold uppercase py-3 rounded-xl text-xs transition-colors flex justify-center items-center gap-1.5 cursor-pointer shadow-md duration-200"
                  >
                    <Check size={11} strokeWidth={3} /> Salvar Alterações
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
