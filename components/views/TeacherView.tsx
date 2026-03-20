
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  ChevronRight, 
  Dumbbell, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  User as UserIcon,
  Database,
  ArrowLeft,
  Check,
  Calendar,
  History as HistoryIcon,
  PlusCircle,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Upload,
  Loader2
} from 'lucide-react';
import { useStore } from '../../store';
import { User, WorkoutRoutine, Exercise, AppTab } from '../../types';
import { exerciseDatabase, BaseExercise } from '../../data/exerciseDatabase';
import { GifImage } from '../ui/GifImage';
import { storage, db } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, getDoc, collection, getDocs } from 'firebase/firestore';
import { normalizeExerciseName } from '../../src/utils/exerciseUtils';

export const TeacherView: React.FC = () => {
  const { allWorkouts, setAllWorkouts, user: currentUser, addToast, customGifs, setCustomGifs } = useStore();
  const [activeSubTab, setActiveSubTab] = useState<'students' | 'database'>('students');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [newStudentData, setNewStudentData] = useState({
    username: '',
    name: '',
    password: '',
    age: ''
  });

  const [editingWorkout, setEditingWorkout] = useState<WorkoutRoutine | null>(null);
  const [isAddingWorkout, setIsAddingWorkout] = useState(false);
  const [newWorkoutData, setNewWorkoutData] = useState<Partial<WorkoutRoutine>>({
    title: '',
    description: '',
    exercises: [],
    color: 'blue'
  });

  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [uploadingExercise, setUploadingExercise] = useState<string | null>(null);

  const handleGifUpload = async (exerciseName: string, file: File) => {
    setUploadingExercise(exerciseName);
    try {
      const normalizedName = normalizeExerciseName(exerciseName);
      const storageRef = ref(storage, `exercise_gifs/${normalizedName}.gif`);
      
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      
      // Save to Firestore so all users get it
      await setDoc(doc(db, 'exercise_gifs', normalizedName), {
        url: downloadURL,
        updatedAt: new Date().toISOString()
      });

      // Update global store
      setCustomGifs({ ...customGifs, [normalizedName]: downloadURL });
      if (addToast) addToast('GIF enviado com sucesso!', 'success');
    } catch (error) {
      console.error('Error uploading GIF:', error);
      if (addToast) addToast('Erro ao enviar GIF.', 'error');
    } finally {
      setUploadingExercise(null);
    }
  };

  // Get all students from localStorage profiles + allWorkouts keys
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const loadStudents = () => {
      const studentList: User[] = [];
      const usernames = Object.keys(allWorkouts);
      
      usernames.forEach(username => {
        const profile = localStorage.getItem(`tatugym_user_profile_${username.toLowerCase()}`);
        if (profile) {
          try {
            const userData = JSON.parse(profile);
            if (userData.role === 'student') {
              studentList.push(userData);
            }
          } catch (e) {
            console.error('Error parsing student profile:', e);
          }
        } else {
          // Fallback if no profile but has workouts
          studentList.push({
            username,
            name: username.charAt(0).toUpperCase() + username.slice(1),
            role: 'student',
            streak: 0,
            totalWorkouts: 0,
            checkIns: [],
            history: [],
            isProfileComplete: false
          });
        }
      });
      setStudents(studentList);
    };

    loadStudents();
  }, [allWorkouts]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const lowerUsername = newStudentData.username.toLowerCase();
    
    if (allWorkouts[lowerUsername]) {
      if (addToast) addToast('Usuário já existe.', 'error');
      return;
    }

    const newUser: User = {
      username: lowerUsername,
      name: newStudentData.name,
      password: newStudentData.password,
      age: parseInt(newStudentData.age) || undefined,
      role: 'student',
      streak: 0,
      totalWorkouts: 0,
      checkIns: [],
      history: [],
      isProfileComplete: true
    };

    // Save profile
    localStorage.setItem(`tatugym_user_profile_${lowerUsername}`, JSON.stringify(newUser));
    
    // Add to allWorkouts
    const updatedWorkouts = { ...allWorkouts, [lowerUsername]: [] };
    setAllWorkouts(updatedWorkouts);

    setIsAddingStudent(false);
    setNewStudentData({ username: '', name: '', password: '', age: '' });
    if (addToast) addToast('Aluno adicionado com sucesso!', 'success');
  };

  const handleDeleteStudent = (username: string) => {
    if (confirm(`Tem certeza que deseja excluir o aluno ${username}?`)) {
      const updatedWorkouts = { ...allWorkouts };
      delete updatedWorkouts[username.toLowerCase()];
      setAllWorkouts(updatedWorkouts);
      localStorage.removeItem(`tatugym_user_profile_${username.toLowerCase()}`);
      if (addToast) addToast('Aluno removido.', 'info');
    }
  };

  const handleAddWorkout = () => {
    if (!selectedStudent) return;
    
    const workout: WorkoutRoutine = {
      id: Math.random().toString(36).substr(2, 9),
      title: newWorkoutData.title || 'Novo Treino',
      description: newWorkoutData.description || '',
      exercises: newWorkoutData.exercises || [],
      color: newWorkoutData.color || 'blue'
    };

    const updatedWorkouts = {
      ...allWorkouts,
      [selectedStudent.toLowerCase()]: [...(allWorkouts[selectedStudent.toLowerCase()] || []), workout]
    };
    
    setAllWorkouts(updatedWorkouts);
    setIsAddingWorkout(false);
    setNewWorkoutData({ title: '', description: '', exercises: [], color: 'blue' });
    if (addToast) addToast('Treino criado!', 'success');
  };

  const handleUpdateWorkout = () => {
    if (!selectedStudent || !editingWorkout) return;

    const updatedList = allWorkouts[selectedStudent.toLowerCase()].map(w => 
      w.id === editingWorkout.id ? editingWorkout : w
    );

    const updatedWorkouts = {
      ...allWorkouts,
      [selectedStudent.toLowerCase()]: updatedList
    };

    setAllWorkouts(updatedWorkouts);
    setEditingWorkout(null);
    if (addToast) addToast('Treino atualizado!', 'success');
  };

  const handleDeleteWorkout = (workoutId: string) => {
    if (!selectedStudent) return;
    if (confirm('Excluir este treino?')) {
      const updatedList = allWorkouts[selectedStudent.toLowerCase()].filter(w => w.id !== workoutId);
      const updatedWorkouts = {
        ...allWorkouts,
        [selectedStudent.toLowerCase()]: updatedList
      };
      setAllWorkouts(updatedWorkouts);
      if (addToast) addToast('Treino removido.', 'info');
    }
  };

  const addExerciseToWorkout = (baseEx: BaseExercise) => {
    const newEx: Exercise = {
      id: Math.random().toString(36).substr(2, 9),
      name: baseEx.name,
      muscleGroup: baseEx.muscleGroup,
      sets: baseEx.defaultSets,
      reps: baseEx.defaultReps,
      rest: baseEx.defaultRest,
      image: baseEx.image
    };

    if (editingWorkout) {
      setEditingWorkout({
        ...editingWorkout,
        exercises: [...editingWorkout.exercises, newEx]
      });
    } else if (isAddingWorkout) {
      setNewWorkoutData({
        ...newWorkoutData,
        exercises: [...(newWorkoutData.exercises || []), newEx]
      });
    }
    setIsExercisePickerOpen(false);
  };

  const removeExerciseFromWorkout = (exId: string) => {
    if (editingWorkout) {
      setEditingWorkout({
        ...editingWorkout,
        exercises: editingWorkout.exercises.filter(e => e.id !== exId)
      });
    } else if (isAddingWorkout) {
      setNewWorkoutData({
        ...newWorkoutData,
        exercises: (newWorkoutData.exercises || []).filter(e => e.id !== exId)
      });
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExercises = exerciseDatabase.filter(e => 
    e.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
    e.muscleGroup.toLowerCase().includes(exerciseSearch.toLowerCase())
  );

  if (selectedStudent) {
    const studentWorkouts = allWorkouts[selectedStudent.toLowerCase()] || [];
    const studentProfile = students.find(s => s.username.toLowerCase() === selectedStudent.toLowerCase());

    return (
      <div className="space-y-6 animate-slide-up pb-20">
        <header className="flex items-center gap-4">
          <button 
            onClick={() => setSelectedStudent(null)}
            className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">
              {studentProfile?.name || selectedStudent}
            </h2>
            <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Gerenciar treinos do aluno</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4 rounded-3xl border border-white/5 bg-zinc-900/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Treinos Concluídos</p>
            <p className="text-2xl font-black text-white">{studentProfile?.totalWorkouts || 0}</p>
          </div>
          <div className="glass-card p-4 rounded-3xl border border-white/5 bg-zinc-900/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Sequência Atual</p>
            <p className="text-2xl font-black text-orange-500">{studentProfile?.streak || 0} dias</p>
          </div>
          <div className="glass-card p-4 rounded-3xl border border-white/5 bg-zinc-900/20">
            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Último Acesso</p>
            <p className="text-sm font-black text-white uppercase">
              {studentProfile?.checkIns?.length ? new Date(studentProfile.checkIns[studentProfile.checkIns.length - 1]).toLocaleDateString('pt-BR') : 'Nunca'}
            </p>
          </div>
        </div>

        {/* Configured Exercises Summary */}
        <div className="space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest">Exercícios Configurados</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(studentWorkouts.flatMap(w => w.exercises.map(e => e.name)))).map(exName => (
              <span key={exName} className="px-3 py-1.5 bg-zinc-900 border border-white/5 rounded-full text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
                {exName}
              </span>
            ))}
            {studentWorkouts.length === 0 && (
              <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Nenhum exercício configurado.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Planilhas de Treino</h3>
            <button 
              onClick={() => setIsAddingWorkout(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-500 transition-all"
            >
              <Plus size={14} /> Novo Treino
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {studentWorkouts.map((workout, idx) => (
              <div key={workout.id} className="glass-card rounded-3xl border border-white/5 overflow-hidden group">
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-${workout.color}-500/10 flex items-center justify-center border border-${workout.color}-500/20`}>
                      <Dumbbell size={24} className={`text-${workout.color}-500`} />
                    </div>
                    <div>
                      <h4 className="font-black text-white uppercase tracking-tight italic">Treino {String.fromCharCode(65 + idx)}: {workout.title}</h4>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{workout.exercises.length} exercícios</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setEditingWorkout(workout)}
                      className="p-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-blue-500 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDeleteWorkout(workout.id)}
                      className="p-3 rounded-xl bg-zinc-900 text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {studentWorkouts.length === 0 && (
              <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">Nenhum treino atribuído.</p>
              </div>
            )}
          </div>
        </div>

        {/* Workout Editor Modal */}
        {(isAddingWorkout || editingWorkout) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-zinc-950 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border border-white/10 flex flex-col shadow-2xl">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                  {editingWorkout ? 'Editar Treino' : 'Novo Treino'}
                </h3>
                <button 
                  onClick={() => { setIsAddingWorkout(false); setEditingWorkout(null); }}
                  className="p-2 text-zinc-500 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Título</label>
                    <input 
                      type="text"
                      value={editingWorkout ? editingWorkout.title : newWorkoutData.title}
                      onChange={(e) => editingWorkout ? setEditingWorkout({...editingWorkout, title: e.target.value}) : setNewWorkoutData({...newWorkoutData, title: e.target.value})}
                      className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50"
                      placeholder="Ex: Peito e Tríceps"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Cor</label>
                    <div className="flex gap-2">
                      {['blue', 'emerald', 'purple', 'orange', 'rose'].map(color => (
                        <button
                          key={color}
                          onClick={() => editingWorkout ? setEditingWorkout({...editingWorkout, color}) : setNewWorkoutData({...newWorkoutData, color})}
                          className={`w-10 h-10 rounded-xl bg-${color}-500 transition-all ${
                            (editingWorkout ? editingWorkout.color : newWorkoutData.color) === color ? 'ring-4 ring-white/20 scale-110' : 'opacity-40 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Exercícios</h4>
                    <button 
                      onClick={() => setIsExercisePickerOpen(true)}
                      className="text-[10px] font-black text-blue-500 uppercase tracking-widest flex items-center gap-1"
                    >
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(editingWorkout ? editingWorkout.exercises : newWorkoutData.exercises || []).map((ex, idx) => (
                      <div key={ex.id} className="bg-zinc-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 flex-1">
                          <GifImage exerciseName={ex.name} originalUrl={ex.image} className="w-12 h-12 rounded-lg object-cover bg-zinc-800" />
                          <div className="flex-1">
                            <p className="text-xs font-black text-white uppercase tracking-tight">{ex.name}</p>
                            <div className="flex gap-3 mt-1">
                              <div className="flex items-center gap-1">
                                <span className="text-[8px] font-black text-zinc-500 uppercase">Séries:</span>
                                <input 
                                  type="number"
                                  value={ex.sets}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    const updateEx = (exercises: Exercise[]) => exercises.map(item => item.id === ex.id ? {...item, sets: val} : item);
                                    if (editingWorkout) setEditingWorkout({...editingWorkout, exercises: updateEx(editingWorkout.exercises)});
                                    else setNewWorkoutData({...newWorkoutData, exercises: updateEx(newWorkoutData.exercises || [])});
                                  }}
                                  className="w-8 bg-transparent text-[10px] font-black text-blue-500 outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-[8px] font-black text-zinc-500 uppercase">Reps:</span>
                                <input 
                                  type="text"
                                  value={ex.reps}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    const updateEx = (exercises: Exercise[]) => exercises.map(item => item.id === ex.id ? {...item, reps: val} : item);
                                    if (editingWorkout) setEditingWorkout({...editingWorkout, exercises: updateEx(editingWorkout.exercises)});
                                    else setNewWorkoutData({...newWorkoutData, exercises: updateEx(newWorkoutData.exercises || [])});
                                  }}
                                  className="w-12 bg-transparent text-[10px] font-black text-blue-500 outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeExerciseFromWorkout(ex.id)}
                          className="p-2 text-zinc-600 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/5 bg-zinc-900/20">
                <button 
                  onClick={editingWorkout ? handleUpdateWorkout : handleAddWorkout}
                  className="w-full py-4 bg-blue-600 rounded-2xl text-white font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} /> {editingWorkout ? 'Salvar Alterações' : 'Criar Treino'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Exercise Picker Modal */}
        {isExercisePickerOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <div className="bg-zinc-950 w-full max-w-lg max-h-[80vh] overflow-hidden rounded-[2.5rem] border border-white/10 flex flex-col">
              <div className="p-6 border-b border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-tighter italic">Escolher Exercício</h3>
                  <button onClick={() => setIsExercisePickerOpen(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
                </div>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
                  <input 
                    type="text"
                    value={exerciseSearch}
                    onChange={(e) => setExerciseSearch(e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-xl p-3 pl-12 text-sm text-white outline-none focus:border-blue-500/50"
                    placeholder="Buscar exercício..."
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {filteredExercises.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => addExerciseToWorkout(ex)}
                    className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-white/5 transition-colors text-left group"
                  >
                    <GifImage exerciseName={ex.name} originalUrl={ex.image} className="w-12 h-12 rounded-lg object-cover bg-zinc-900" />
                    <div className="flex-1">
                      <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{ex.name}</p>
                      <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{ex.muscleGroup}</p>
                    </div>
                    <PlusCircle size={20} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-up pb-20">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none">
            ÁREA DO <span className="text-blue-500">PROFESSOR</span>
          </h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">Gestão de alunos e treinos</p>
        </div>
        <div className="flex bg-zinc-900/40 p-1 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'students' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Alunos
          </button>
          <button 
            onClick={() => setActiveSubTab('database')}
            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeSubTab === 'database' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            Base
          </button>
        </div>
      </header>

      {activeSubTab === 'students' ? (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-5 pl-14 text-white font-bold outline-none focus:border-blue-500/50 backdrop-blur-sm"
                placeholder="BUSCAR ALUNO..."
              />
            </div>
            <button 
              onClick={() => setIsAddingStudent(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all"
            >
              <Plus size={20} /> NOVO ALUNO
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((student) => (
              <div 
                key={student.username}
                className="glass-card rounded-[2.5rem] border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden"
              >
                <div className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-zinc-900 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500">
                      <UserIcon size={32} className="text-zinc-700 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight italic">{student.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">@{student.username}</span>
                        <div className="w-1 h-1 bg-zinc-800 rounded-full"></div>
                        <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{allWorkouts[student.username.toLowerCase()]?.length || 0} TREINOS</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedStudent(student.username)}
                      className="bg-zinc-900/50 hover:bg-blue-600 text-zinc-600 hover:text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/5"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <button 
                      onClick={() => handleDeleteStudent(student.username)}
                      className="bg-zinc-900/50 hover:bg-rose-500/20 text-zinc-600 hover:text-rose-500 w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/5"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredStudents.length === 0 && (
              <div className="p-20 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
                <Users size={48} className="text-zinc-800 mx-auto mb-4" />
                <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.2em]">Nenhum aluno encontrado.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600" size={20} />
            <input 
              type="text"
              value={exerciseSearch}
              onChange={(e) => setExerciseSearch(e.target.value)}
              className="w-full bg-zinc-900/40 border border-white/5 rounded-2xl p-5 pl-14 text-white font-bold outline-none focus:border-blue-500/50 backdrop-blur-sm"
              placeholder="BUSCAR NA BASE DE EXERCÍCIOS..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredExercises.map((ex, i) => {
              const normalizedName = normalizeExerciseName(ex.name);
              const hasCustomGif = !!customGifs[normalizedName];
              
              return (
                <div key={i} className="glass-card p-4 rounded-3xl border border-white/5 flex items-center gap-4 bg-zinc-900/20">
                  <div className="relative group/gif">
                    <GifImage 
                      exerciseName={ex.name} 
                      originalUrl={hasCustomGif ? customGifs[normalizedName] : ex.image} 
                      className="w-20 h-20 rounded-2xl object-cover bg-zinc-950 border border-white/5" 
                    />
                    <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/gif:opacity-100 transition-opacity rounded-2xl cursor-pointer">
                      {uploadingExercise === ex.name ? (
                        <Loader2 size={24} className="text-white animate-spin" />
                      ) : (
                        <>
                          <Upload size={24} className="text-white" />
                          <input 
                            type="file" 
                            accept="image/gif" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleGifUpload(ex.name, file);
                            }}
                          />
                        </>
                      )}
                    </label>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-white uppercase tracking-tight italic">{ex.name}</h4>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">{ex.muscleGroup}</p>
                    <div className="flex gap-3 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-zinc-600 uppercase">Séries</span>
                        <span className="text-[10px] font-bold text-zinc-400">{ex.defaultSets}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-zinc-600 uppercase">Reps</span>
                        <span className="text-[10px] font-bold text-zinc-400">{ex.defaultReps}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-zinc-600 uppercase">Descanso</span>
                        <span className="text-[10px] font-bold text-zinc-400">{ex.defaultRest}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddingStudent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-950 w-full max-w-md rounded-[2.5rem] border border-white/10 p-8 space-y-8 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Novo Aluno</h3>
              <button onClick={() => setIsAddingStudent(false)} className="text-zinc-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddStudent} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="student-name" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Nome Completo</label>
                <input 
                  id="student-name"
                  name="name"
                  autoComplete="name"
                  type="text"
                  required
                  value={newStudentData.name}
                  onChange={(e) => setNewStudentData({...newStudentData, name: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50"
                  placeholder="Ex: João Silva"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="student-username" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Usuário (Login)</label>
                <input 
                  id="student-username"
                  name="username"
                  autoComplete="username"
                  type="text"
                  required
                  value={newStudentData.username}
                  onChange={(e) => setNewStudentData({...newStudentData, username: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50"
                  placeholder="Ex: joaosilva"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="student-password" className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Senha</label>
                <input 
                  id="student-password"
                  name="password"
                  autoComplete="new-password"
                  type="password"
                  required
                  value={newStudentData.password}
                  onChange={(e) => setNewStudentData({...newStudentData, password: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Idade (Opcional)</label>
                <input 
                  type="number"
                  value={newStudentData.age}
                  onChange={(e) => setNewStudentData({...newStudentData, age: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold outline-none focus:border-blue-500/50"
                  placeholder="Ex: 25"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-[0.4em] rounded-2xl shadow-xl shadow-blue-600/20 transition-all mt-4"
              >
                CADASTRAR ALUNO
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
