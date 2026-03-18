
import { WorkoutRoutine } from '../types';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'fortalecimento',
    title: 'Fortalecimento (CORE)',
    description: 'Foco em estabilização e controle para Fibromialgia.',
    color: 'emerald',
    exercises: [
      { id: 'f1', name: 'Pingus (Abdomen Infra)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lying-Leg-Raise.gif' },
      { id: 'f2', name: 'Frog (Pilates)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Frog-Crunch.gif' },
      { id: 'f3', name: 'One Hundred', muscleGroup: 'CORE', sets: 1, reps: '50', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Pilates-Hundred.gif' },
      { id: 'f4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '4/4', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Single-Leg-Stretch.gif' },
      { id: 'f5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Double-Leg-Stretch.gif' },
      { id: 'f6', name: 'Elevação Pélvica Solo', muscleGroup: 'Glúteo/CORE', sets: 1, reps: '8', rest: 30, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Hip-Thrust.gif' }
    ]
  },
  {
    id: 'a',
    title: 'Treino A - Inferiores',
    description: 'Foco em pernas e abdômen infra.',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Abdomen Infra', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lying-Leg-Raise.gif' },
      { id: 'a2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Squat.gif' },
      { id: 'a3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Seated-Adduction.gif' },
      { id: 'a4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Lunge.gif' },
      { id: 'a5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Leg-Extension.gif' },
      { id: 'a6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Standing-Calf-Raise.gif' }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Abdomen Reto', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Crunch.gif' },
      { id: 'b2', name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Lateral-Raise.gif' },
      { id: 'b3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Chest-Press.gif' },
      { id: 'b4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Shoulder-Press.gif' },
      { id: 'b5', name: 'Peck Deck', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Pec-Deck-Fly.gif' },
      { id: 'b6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Kettlebell-Upright-Row.gif' }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Posterior e Glúteo',
    description: 'Cadeia posterior e estabilização.',
    color: 'purple',
    exercises: [
      { id: 'c1', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Plank.gif' },
      { id: 'c2', name: 'Abdução Solo Pilates', muscleGroup: 'Quadril', sets: 3, reps: '16', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Side-Lying-Leg-Lift.gif' },
      { id: 'c3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Stiff-Leg-Deadlift.gif' },
      { id: 'c4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Lever-Glute-Kickback.gif' },
      { id: 'c5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Seated-Leg-Curl.gif' },
      { id: 'c6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Hip-Thrust.gif' }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Tração e Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'd1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Hollow-Hold.gif' },
      { id: 'd2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Underhand-Lat-Pulldown.gif' },
      { id: 'd3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Cable-Pushdown.gif' },
      { id: 'd4', name: 'Remada Baixa Máquina', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Seated-Cable-Row.gif' },
      { id: 'd5', name: 'Rosca Direta Pulley', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Cable-Curl.gif' },
      { id: 'd6', name: 'Peck Deck Invertido', muscleGroup: 'Ombro', sets: 3, reps: '12-15', rest: 60, image: 'https://fitnessprogramer.com/wp-content/uploads/2021/02/Reverse-Pec-Deck-Fly.gif' }
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
      { id: 'h1-1', name: 'Supino máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Chest-Press.gif' },
      { id: 'h1-2', name: 'Supino inclinado iso articulado deitado (shua)', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Incline-Chest-Press.gif' },
      { id: 'h1-3', name: 'Crucifixo máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Pec-Deck-Fly.gif' },
      { id: 'h1-4', name: 'Elevação lateral c/ halter 0º-180º neutra', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Lateral-Raise.gif' },
      { id: 'h1-5', name: 'Elevação frontal no cross', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Cable-Front-Raise.gif' },
      { id: 'h1-6', name: 'Tríceps no cross barra reta', muscleGroup: 'Tríceps', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Pushdown.gif' },
      { id: 'h1-7', name: 'Tríceps no cross corda', muscleGroup: 'Tríceps', sets: 4, reps: 'Máx rep', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Cable-Rope-Pushdown.gif' }
    ]
  },
  {
    id: 'h-2',
    title: 'Treino 2',
    description: 'Foco em Costas e Bíceps.',
    color: 'orange',
    exercises: [
      { id: 'h2-1', name: 'Pulley anterior aberta', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lat-Pulldown.gif' },
      { id: 'h2-2', name: 'Remada articulada neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Seated-Row.gif' },
      { id: 'h2-3', name: 'Crucifixo inverso máquina pronada', muscleGroup: 'Ombros/Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Reverse-Pec-Deck-Fly.gif' },
      { id: 'h2-4', name: 'Remada baixa peg. neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Seated-Cable-Row.gif' },
      { id: 'h2-5', name: 'Rosca martelo no cross corda', muscleGroup: 'Bíceps', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Cable-Hammer-Curl.gif' },
      { id: 'h2-6', name: 'Rosca direta barra reta', muscleGroup: 'Bíceps', sets: 4, reps: 'Máx rep', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Curl.gif' }
    ]
  },
  {
    id: 'h-3',
    title: 'Treino 3',
    description: 'Foco em Membros Inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'h3-1', name: 'Banco abdutor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lever-Seated-Hip-Abduction.gif' },
      { id: 'h3-2', name: 'Leg press 45º', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/45-degree-Leg-Press.gif' },
      { id: 'h3-3', name: 'Agachamento livre', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Squat.gif' },
      { id: 'h3-4', name: 'Banco extensor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Leg-Extension.gif' },
      { id: 'h3-5', name: 'Mesa flexora', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lying-Leg-Curl.gif' },
      { id: 'h3-6', name: 'Banco sóleo', muscleGroup: 'Panturrilha', sets: 3, reps: '12 a 15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Seated-Calf-Raise.gif' },
      { id: 'h3-7', name: 'Extensão lombar no banco romano', muscleGroup: 'Lombar', sets: 3, reps: '15', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Hyperextension.gif' }
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
      { id: 'ma1', name: 'Supino reto', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, notes: 'Carga 60%', image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Bench-Press.gif' },
      { id: 'ma2', name: 'Elevação conjunta', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Front-Raise.gif' },
      { id: 'ma3', name: 'Tríceps francês', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Triceps-Extension.gif' },
      { id: 'ma4', name: 'Crucifixo', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Fly.gif' },
      { id: 'ma5', name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Arnold-Press.gif' },
      { id: 'ma6', name: 'Tríceps na caixa ou nas argolas', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Bench-Dip.gif' },
      { id: 'ma7', name: 'Supino alternado', muscleGroup: 'Peito', sets: 3, reps: '10, 10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Alternating-Bench-Press.gif' },
      { id: 'ma8', name: 'Flexão', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Push-Up.gif' }
    ]
  },
  {
    id: 'm-b',
    title: 'Treino B - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'mb1', name: 'Elevação de perna extendida', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, notes: 'Carga caneleira', image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lying-Leg-Raise.gif' },
      { id: 'mb2', name: 'Hip Thrust - elevação pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Hip-Thrust.gif' },
      { id: 'mb3', name: 'Clamshell - ostra', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Clamshell.gif' },
      { id: 'mb4', name: 'Deadlift', muscleGroup: 'Posterior/Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Deadlift.gif' },
      { id: 'mb5', name: 'Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '10, 10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Leg-Extension.gif' },
      { id: 'mb6', name: 'Flexora', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Lying-Leg-Curl.gif' },
      { id: 'mb7', name: 'Stiff', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Stiff-Leg-Deadlift.gif' }
    ]
  },
  {
    id: 'm-c',
    title: 'Treino C - Superior',
    description: 'Foco em membros superiores.',
    color: 'blue',
    exercises: [
      { id: 'mc1', name: 'Remada curvada', muscleGroup: 'Costas', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Bent-Over-Row.gif' },
      { id: 'mc2', name: 'Encolhimento', muscleGroup: 'Trapézio', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Shrug.gif' },
      { id: 'mc3', name: 'Rosca direta', muscleGroup: 'Bíceps', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Curl.gif' },
      { id: 'mc4', name: 'Crucifixo inverso', muscleGroup: 'Ombros/Costas', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Rear-Lateral-Raise.gif' },
      { id: 'mc5', name: 'Rosca alternada', muscleGroup: 'Bíceps', sets: 3, reps: '10, 10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Alternate-Bicep-Curl.gif' },
      { id: 'mc6', name: 'Remada alternada', muscleGroup: 'Costas', sets: 3, reps: '10, 10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-One-Arm-Row.gif' }
    ]
  },
  {
    id: 'm-d',
    title: 'Treino D - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'purple',
    exercises: [
      { id: 'md1', name: 'Abdução de quadril em pé', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Standing-Hip-Abduction.gif' },
      { id: 'md2', name: 'Stiff unilateral', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Single-Leg-Deadlift.gif' },
      { id: 'md3', name: 'Sumô', muscleGroup: 'Pernas/Glúteo', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Dumbbell-Sumo-Squat.gif' },
      { id: 'md4', name: 'Flexão de joelho em pé', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Standing-Leg-Curl.gif' },
      { id: 'md5', name: 'Flexão de joelho na MB', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Stability-Ball-Leg-Curl.gif' },
      { id: 'md6', name: 'Wall sit', muscleGroup: 'Pernas', sets: 3, reps: '30 a 45"', rest: 60, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Wall-Sit.gif' },
      { id: 'md7', name: 'Back Squat', muscleGroup: 'Pernas', sets: 3, reps: '10', rest: 90, image: 'https://www.fitliferegimen.com/wp-content/uploads/2021/05/Barbell-Squat.gif' }
    ]
  }
];
