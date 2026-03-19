
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Save, 
  ChevronRight, 
  Search, 
  Dumbbell, 
  Clock, 
  Repeat, 
  FileText,
  ArrowLeft,
  Settings,
  Edit2
} from 'lucide-react';
import { useStore } from '../../store';
import { WorkoutRoutine, Exercise } from '../../types';
import { exerciseDatabase, BaseExercise } from '../../data/exerciseDatabase';

export const TeacherView: React.FC = () => {
  const { allWorkouts, setAllWorkouts, addToast } = useStore();
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<WorkoutRoutine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isDatabaseView, setIsDatabaseView] = useState(false);
  const [isNewStudentModalOpen, setIsNewStudentModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');

  const students = Object.keys(allWorkouts);
  const categories = Array.from(new Set(exerciseDatabase.map(ex => ex.muscleGroup)));

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const studentKey = newStudentName.trim().toLowerCase();
    if (allWorkouts[studentKey]) {
      if (addToast) addToast('Aluno já existe!', 'error');
      return;
    }

    const updatedAllWorkouts = { ...allWorkouts, [studentKey]: [] };
    setAllWorkouts(updatedAllWorkouts);
    setNewStudentName('');
    setIsNewStudentModalOpen(false);
    if (addToast) addToast(`Aluno ${newStudentName} adicionado!`, 'success');
  };

  const handleSaveWorkout = () => {
    if (!selectedStudent || !editingWorkout) return;

    const updatedAllWorkouts = { ...allWorkouts };
    const studentWorkouts = [...(updatedAllWorkouts[selectedStudent as keyof typeof allWorkouts] || [])];
    
    const index = studentWorkouts.findIndex(w => w.id === editingWorkout.id);
    if (index >= 0) {
      studentWorkouts[index] = editingWorkout;
    } else {
      studentWorkouts.push(editingWorkout);
    }

    updatedAllWorkouts[selectedStudent as keyof typeof allWorkouts] = studentWorkouts;
    setAllWorkouts(updatedAllWorkouts);
    setEditingWorkout(null);
    if (addToast) addToast('Treino salvo com sucesso!', 'success');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (!selectedStudent) return;
    if (!window.confirm('Tem certeza que deseja excluir este treino?')) return;

    const updatedAllWorkouts = { ...allWorkouts };
    updatedAllWorkouts[selectedStudent as keyof typeof allWorkouts] = 
      updatedAllWorkouts[selectedStudent as keyof typeof allWorkouts].filter(w => w.id !== workoutId);
    
    setAllWorkouts(updatedAllWorkouts);
    if (addToast) addToast('Treino excluído.', 'info');
  };

  const handleAddExercise = (baseEx: BaseExercise) => {
    if (!editingWorkout) return;
    const newExercise: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: baseEx.name,
      muscleGroup: baseEx.muscleGroup,
      sets: baseEx.defaultSets,
      reps: baseEx.defaultReps,
      rest: baseEx.defaultRest,
      image: baseEx.image
    };
    setEditingWorkout({
      ...editingWorkout,
      exercises: [...editingWorkout.exercises, newExercise]
    });
    setIsPickerOpen(false);
    if (addToast) addToast(`${baseEx.name} adicionado!`, 'success');
  };

  const handleUpdateExercise = (exerciseId: string, updates: Partial<Exercise>) => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, ...updates } : ex
      )
    });
  };

  const handleRemoveExercise = (exerciseId: string) => {
    if (!editingWorkout) return;
    setEditingWorkout({
      ...editingWorkout,
      exercises: editingWorkout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  if (isDatabaseView) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsDatabaseView(false)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Base de <span className="text-blue-500">Exercícios</span>
          </h2>
          <div className="w-10" />
        </div>

        <div className="relative group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-all" size={20} />
          <input 
            type="text" 
            placeholder="BUSCAR EXERCÍCIO..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-5 pl-14 text-white font-black outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
          >
            Todos
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {exerciseDatabase
            .filter(ex => 
              (!selectedCategory || ex.muscleGroup === selectedCategory) &&
              (ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(pickerSearch.toLowerCase()))
            )
            .map((ex) => (
              <div 
                key={ex.name}
                className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/5">
                    {ex.image ? (
                      <img 
                        src={ex.image} 
                        alt={ex.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Dumbbell size={24} className="text-zinc-500 group-hover:text-blue-500 transition-all" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black uppercase italic tracking-tight">{ex.name}</h4>
                    <div className="flex gap-3 mt-1">
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{ex.muscleGroup}</span>
                      <span className="text-[9px] font-bold text-blue-500/50 uppercase tracking-widest">{ex.defaultSets}x{ex.defaultReps}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (editingWorkout) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setEditingWorkout(null)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400"
          >
            <ArrowLeft size={24} />
          </button>
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Editando: <span className="text-blue-500">{editingWorkout.title}</span>
          </h2>
          <button 
            onClick={handleSaveWorkout}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <Save size={18} /> Salvar
          </button>
        </div>

        <div className="glass-card p-6 rounded-3xl space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Título do Treino</label>
            <input 
              type="text"
              value={editingWorkout.title}
              onChange={(e) => setEditingWorkout({ ...editingWorkout, title: e.target.value })}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Descrição</label>
            <textarea 
              value={editingWorkout.description}
              onChange={(e) => setEditingWorkout({ ...editingWorkout, description: e.target.value })}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50 transition-all min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Exercícios</h3>
            <button 
              onClick={() => setIsPickerOpen(true)}
              className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-black text-xs uppercase tracking-widest transition-colors"
            >
              <Plus size={18} /> Adicionar da Base
            </button>
          </div>

          <div className="space-y-4">
            {editingWorkout.exercises.map((ex, idx) => (
              <motion.div 
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 rounded-2xl border border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center text-[10px] font-black">
                      {idx + 1}
                    </span>
                    {ex.image && (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                        <img 
                          src={ex.image} 
                          alt={ex.name} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => handleRemoveExercise(ex.id)}
                    className="text-red-500/50 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome do Exercício</label>
                    <input 
                      type="text"
                      value={ex.name}
                      onChange={(e) => handleUpdateExercise(ex.id, { name: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Grupo Muscular</label>
                    <input 
                      type="text"
                      value={ex.muscleGroup}
                      onChange={(e) => handleUpdateExercise(ex.id, { muscleGroup: e.target.value })}
                      className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Séries</label>
                    <div className="relative">
                      <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="number"
                        value={ex.sets}
                        onChange={(e) => handleUpdateExercise(ex.id, { sets: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 pl-9 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Reps</label>
                    <div className="relative">
                      <Dumbbell className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="text"
                        value={ex.reps}
                        onChange={(e) => handleUpdateExercise(ex.id, { reps: e.target.value })}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 pl-9 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Descanso (s)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
                      <input 
                        type="number"
                        value={ex.rest}
                        onChange={(e) => handleUpdateExercise(ex.id, { rest: parseInt(e.target.value) || 0 })}
                        className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 pl-9 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button 
            onClick={() => setIsPickerOpen(true)}
            className="w-full p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-500 font-black uppercase italic tracking-tighter flex items-center justify-center gap-2 hover:bg-blue-600/20 transition-all"
          >
            <Plus size={20} />
            Adicionar Exercício
          </button>
        </div>

        <AnimatePresence>
          {isPickerOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPickerOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
              >
                <div className="p-6 border-b border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black uppercase italic tracking-tighter">Base de Exercícios</h3>
                    <button onClick={() => setIsPickerOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                      <Plus size={24} className="rotate-45" />
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                    <input 
                      type="text"
                      placeholder="Buscar exercício..."
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 pl-11 text-sm text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${!selectedCategory ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                    >
                      Todos
                    </button>
                    {categories.map(cat => (
                      <button 
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white/5 text-zinc-500 hover:bg-white/10'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {exerciseDatabase
                    .filter(ex => 
                      (!selectedCategory || ex.muscleGroup === selectedCategory) &&
                      (ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(pickerSearch.toLowerCase()))
                    )
                    .map(ex => (
                      <button 
                        key={ex.name}
                        onClick={() => handleAddExercise(ex)}
                        className="w-full p-4 rounded-2xl bg-white/5 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-4">
                          {ex.image && (
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-900 border border-white/5">
                              <img 
                                src={ex.image} 
                                alt={ex.name} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                          <div className="text-left">
                            <h4 className="font-black uppercase italic tracking-tight group-hover:text-blue-500 transition-colors">{ex.name}</h4>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{ex.muscleGroup}</span>
                          </div>
                        </div>
                        <Plus size={18} className="text-zinc-600 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (selectedStudent) {
    const studentWorkouts = allWorkouts[selectedStudent as keyof typeof allWorkouts] || [];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-zinc-400"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Treinos de <span className="text-blue-500">{selectedStudent.charAt(0).toUpperCase() + selectedStudent.slice(1)}</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Gerencie a rotina do aluno</p>
          </div>
          <button 
            onClick={() => setEditingWorkout({
              id: Math.random().toString(36).substr(2, 9),
              title: 'Novo Treino',
              description: '',
              exercises: [],
              color: 'blue'
            })}
            className="p-2 bg-blue-600/20 text-blue-500 rounded-xl hover:bg-blue-600/30 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {studentWorkouts.length === 0 ? (
            <div className="text-center py-20 glass-card rounded-3xl border-dashed border-white/10">
              <Dumbbell size={48} className="mx-auto text-zinc-800 mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Nenhum treino cadastrado.</p>
            </div>
          ) : (
            studentWorkouts.map((workout) => (
              <motion.div 
                key={workout.id}
                whileHover={{ scale: 1.01 }}
                className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-black uppercase italic tracking-tight">{workout.title}</h3>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      {workout.exercises.length} Exercícios
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setEditingWorkout(workout)}
                    className="p-3 hover:bg-blue-600/10 text-blue-500 rounded-xl transition-all"
                  >
                    <Edit2 size={20} />
                  </button>
                  <button 
                    onClick={() => handleDeleteWorkout(workout.id)}
                    className="p-3 hover:bg-red-500/10 text-red-500 rounded-xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
          ÁREA DO <span className="text-blue-500">PROFESSOR</span>
        </h2>
        <p className="text-xs font-bold text-zinc-500 uppercase tracking-[0.3em]">Gerencie seus alunos e treinos</p>
      </div>

      <div className="relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-all" size={20} />
        <input 
          type="text" 
          placeholder="BUSCAR ALUNO..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-5 pl-14 text-white font-black outline-none focus:border-blue-500/50 transition-all placeholder:text-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Seus Alunos</h3>
          </div>
          <button 
            onClick={() => setIsNewStudentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600/20 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <Plus size={14} />
            Novo Aluno
          </button>
        </div>

        {students
          .filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((student) => (
          <motion.button
            key={student}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedStudent(student)}
            className="glass-card p-6 rounded-3xl border border-white/5 flex items-center justify-between group text-left"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <UserIcon size={28} />
              </div>
              <div>
                <h4 className="text-lg font-black uppercase italic tracking-tight">{student.charAt(0).toUpperCase() + student.slice(1)}</h4>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {allWorkouts[student as keyof typeof allWorkouts]?.length || 0} Treinos Ativos
                </p>
              </div>
            </div>
            <div className="p-3 bg-white/5 rounded-xl group-hover:bg-blue-600/20 group-hover:text-blue-500 transition-all">
              <ChevronRight size={20} />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {isNewStudentModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewStudentModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md glass-card p-8 rounded-[2.5rem] border border-white/10 shadow-2xl"
            >
              <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
                Novo <span className="text-blue-500">Aluno</span>
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text"
                    value={newStudentName}
                    onChange={(e) => setNewStudentName(e.target.value)}
                    placeholder="Ex: João Silva"
                    className="w-full bg-zinc-950/40 border border-white/5 rounded-2xl p-5 text-white font-bold outline-none focus:border-blue-500/50 transition-all"
                    autoFocus
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setIsNewStudentModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={handleAddStudent}
                    className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20"
                  >
                    Criar Aluno
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="glass-card p-8 rounded-[2.5rem] border border-white/5 bg-gradient-to-br from-blue-600/10 to-transparent">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-600 rounded-2xl">
            <Settings size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-black uppercase italic tracking-tighter">Configurações Rápidas</h3>
        </div>
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">
          Ajuste as permissões globais ou adicione novos alunos à sua base de dados.
        </p>
        <button 
          onClick={() => setIsDatabaseView(true)}
          className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all"
        >
          Gerenciar Base de Dados
        </button>
      </div>
    </div>
  );
};

const UserIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
