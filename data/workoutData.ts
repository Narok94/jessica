
import { WorkoutRoutine } from '../types';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'fortalecimento',
    title: 'Fortalecimento (CORE)',
    description: 'Foco em estabilização e controle para Fibromialgia.',
    color: 'emerald',
    exercises: [
      { id: 'f1', name: 'Pingus (Abdomen Infra)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Raise/0.jpg' },
      { id: 'f2', name: 'Frog (Pilates)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Frog_Crunch/0.jpg' },
      { id: 'f3', name: 'One Hundred', muscleGroup: 'CORE', sets: 1, reps: '50', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pilates_Hundred/0.jpg' },
      { id: 'f4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '4/4', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Single_Leg_Stretch/0.jpg' },
      { id: 'f5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Double_Leg_Stretch/0.jpg' },
      { id: 'f6', name: 'Elevação Pélvica Solo', muscleGroup: 'Glúteo/CORE', sets: 1, reps: '8', rest: 30, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hip_Thrust/0.jpg' }
    ]
  },
  {
    id: 'a',
    title: 'Treino A - Inferiores',
    description: 'Foco em pernas e abdômen infra.',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Abdomen Infra', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Raise/0.jpg' },
      { id: 'a2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg' },
      { id: 'a3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Seated_Adduction/0.jpg' },
      { id: 'a4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lunge/0.jpg' },
      { id: 'a5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extension/0.jpg' },
      { id: 'a6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raise/0.jpg' }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Abdomen Reto', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Crunch/0.jpg' },
      { id: 'b2', name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lateral_Raise/0.jpg' },
      { id: 'b3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Chest_Press/0.jpg' },
      { id: 'b4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Shoulder_Press/0.jpg' },
      { id: 'b5', name: 'Peck Deck', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pec_Deck_Fly/0.jpg' },
      { id: 'b6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Kettlebell_Upright_Row/0.jpg' }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Posterior e Glúteo',
    description: 'Cadeia posterior e estabilização.',
    color: 'purple',
    exercises: [
      { id: 'c1', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Plank/0.jpg' },
      { id: 'c2', name: 'Abdução Solo Pilates', muscleGroup: 'Quadril', sets: 3, reps: '16', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lying_Leg_Lift/0.jpg' },
      { id: 'c3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Stiff_Leg_Deadlift/0.jpg' },
      { id: 'c4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Glute_Kickback/0.jpg' },
      { id: 'c5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg' },
      { id: 'c6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg' }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Tração e Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'd1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hollow_Hold/0.jpg' },
      { id: 'd2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Underhand_Lat_Pulldown/0.jpg' },
      { id: 'd3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Pushdown/0.jpg' },
      { id: 'd4', name: 'Remada Baixa Máquina', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Row/0.jpg' },
      { id: 'd5', name: 'Rosca Direta Pulley', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Curl/0.jpg' },
      { id: 'd6', name: 'Peck Deck Invertido', muscleGroup: 'Ombro', sets: 3, reps: '12-15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Pec_Deck_Fly/0.jpg' }
    ]
  }
];

export const henriqueWorkouts: WorkoutRoutine[] = [
  {
    id: 'h-1',
    title: 'Treino 1',
    description: 'Foco em Peito, Ombros e Tríceps.',
    color: 'blue',
    exercises: [
      { id: 'h1-1', name: 'Supino máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Chest_Press/0.jpg' },
      { id: 'h1-2', name: 'Supino inclinado iso articulado deitado (shua)', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Incline_Chest_Press/0.jpg' },
      { id: 'h1-3', name: 'Crucifixo máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pec_Deck_Fly/0.jpg' },
      { id: 'h1-4', name: 'Elevação lateral c/ halter 0º-180º neutra', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Lateral_Raise/0.jpg' },
      { id: 'h1-5', name: 'Elevação frontal no cross', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Front_Raise/0.jpg' },
      { id: 'h1-6', name: 'Tríceps no cross barra reta', muscleGroup: 'Tríceps', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushdown/0.jpg' },
      { id: 'h1-7', name: 'Tríceps no cross corda', muscleGroup: 'Tríceps', sets: 4, reps: 'Máx rep', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Pushdown/0.jpg' }
    ]
  },
  {
    id: 'h-2',
    title: 'Treino 2',
    description: 'Foco em Costas e Bíceps.',
    color: 'orange',
    exercises: [
      { id: 'h2-1', name: 'Pulley anterior aberta', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lat_Pulldown/0.jpg' },
      { id: 'h2-2', name: 'Remada articulada neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Seated_Row/0.jpg' },
      { id: 'h2-3', name: 'Crucifixo inverso máquina pronada', muscleGroup: 'Ombros/Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Pec_Deck_Fly/0.jpg' },
      { id: 'h2-4', name: 'Remada baixa peg. neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Row/0.jpg' },
      { id: 'h2-5', name: 'Rosca martelo no cross corda', muscleGroup: 'Bíceps', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Hammer_Curl/0.jpg' },
      { id: 'h2-6', name: 'Rosca direta barra reta', muscleGroup: 'Bíceps', sets: 4, reps: 'Máx rep', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg' }
    ]
  },
  {
    id: 'h-3',
    title: 'Treino 3',
    description: 'Foco em Membros Inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'h3-1', name: 'Banco abdutor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lever_Seated_Hip_Abduction/0.jpg' },
      { id: 'h3-2', name: 'Leg press 45º', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/45_degree_Leg_Press/0.jpg' },
      { id: 'h3-3', name: 'Agachamento livre', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg' },
      { id: 'h3-4', name: 'Banco extensor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extension/0.jpg' },
      { id: 'h3-5', name: 'Mesa flexora', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curl/0.jpg' },
      { id: 'h3-6', name: 'Banco sóleo', muscleGroup: 'Panturrilha', sets: 3, reps: '12 a 15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg' },
      { id: 'h3-7', name: 'Extensão lombar no banco romano', muscleGroup: 'Lombar', sets: 3, reps: '15', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextension/0.jpg' }
    ]
  }
];

export const mariaWorkouts: WorkoutRoutine[] = [
  {
    id: 'm-a',
    title: 'Treino A - Superior',
    description: 'Foco em membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'ma1', name: 'Supino reto', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, notes: 'Carga 60%', image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg' },
      { id: 'ma2', name: 'Elevação conjunta', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Front_Raise/0.jpg' },
      { id: 'ma3', name: 'Tríceps francês', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Triceps_Extension/0.jpg' },
      { id: 'ma4', name: 'Crucifixo', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Fly/0.jpg' },
      { id: 'ma5', name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Arnold_Press/0.jpg' },
      { id: 'ma6', name: 'Tríceps na caixa ou nas argolas', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Bench_Dip/0.jpg' },
      { id: 'ma7', name: 'Supino alternado', muscleGroup: 'Peito', sets: 3, reps: '10, 10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Alternating_Bench_Press/0.jpg' },
      { id: 'ma8', name: 'Flexão', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Push-Up/0.jpg' }
    ]
  },
  {
    id: 'm-b',
    title: 'Treino B - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'mb1', name: 'Elevação de perna extendida', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, notes: 'Carga caneleira', image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Raise/0.jpg' },
      { id: 'mb2', name: 'Hip Thrust - elevação pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg' },
      { id: 'mb3', name: 'Clamshell - ostra', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Clamshell/0.jpg' },
      { id: 'mb4', name: 'Deadlift', muscleGroup: 'Posterior/Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Deadlift/0.jpg' },
      { id: 'mb5', name: 'Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '10, 10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Extension/0.jpg' },
      { id: 'mb6', name: 'Flexora', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curl/0.jpg' },
      { id: 'mb7', name: 'Stiff', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Stiff_Leg_Deadlift/0.jpg' }
    ]
  },
  {
    id: 'm-c',
    title: 'Treino C - Superior',
    description: 'Foco em membros superiores.',
    color: 'blue',
    exercises: [
      { id: 'mc1', name: 'Remada curvada', muscleGroup: 'Costas', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bent_Over_Row/0.jpg' },
      { id: 'mc2', name: 'Encolhimento', muscleGroup: 'Trapézio', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Shrug/0.jpg' },
      { id: 'mc3', name: 'Rosca direta', muscleGroup: 'Bíceps', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Curl/0.jpg' },
      { id: 'mc4', name: 'Crucifixo inverso', muscleGroup: 'Ombros/Costas', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Rear_Lateral_Raise/0.jpg' },
      { id: 'mc5', name: 'Rosca alternada', muscleGroup: 'Bíceps', sets: 3, reps: '10, 10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Alternate_Bicep_Curl/0.jpg' },
      { id: 'mc6', name: 'Remada alternada', muscleGroup: 'Costas', sets: 3, reps: '10, 10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_One_Arm_Row/0.jpg' }
    ]
  },
  {
    id: 'm-d',
    title: 'Treino D - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'purple',
    exercises: [
      { id: 'md1', name: 'Abdução de quadril em pé', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Hip_Abduction/0.jpg' },
      { id: 'md2', name: 'Stiff unilateral', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Single_Leg_Deadlift/0.jpg' },
      { id: 'md3', name: 'Sumô', muscleGroup: 'Pernas/Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Sumo_Squat/0.jpg' },
      { id: 'md4', name: 'Flexão de joelho em pé', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Leg_Curl/0.jpg' },
      { id: 'md5', name: 'Flexão de joelho na MB', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Stability_Ball_Leg_Curl/0.jpg' },
      { id: 'md6', name: 'Wall sit', muscleGroup: 'Pernas', sets: 3, reps: '30 a 45"', rest: 60, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Wall_Sit/0.jpg' },
      { id: 'md7', name: 'Back Squat', muscleGroup: 'Pernas', sets: 3, reps: '10', rest: 90, image: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Squat/0.jpg' }
    ]
  }
];
