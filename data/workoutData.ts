
import { WorkoutRoutine } from '../types';
import { getExerciseGifUrl } from '../src/utils/exerciseUtils';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'fortalecimento',
    title: 'Fortalecimento (CORE)',
    description: 'Foco em estabilização e controle para Fibromialgia.',
    color: 'emerald',
    exercises: [
      { id: 'f1', name: 'Pingus (Abdomen Infra)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: getExerciseGifUrl('Pingus (Abdomen Infra)') },
      { id: 'f2', name: 'Frog (Pilates)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: getExerciseGifUrl('Frog (Pilates)') },
      { id: 'f3', name: 'One Hundred', muscleGroup: 'CORE', sets: 1, reps: '50', rest: 30, image: getExerciseGifUrl('One Hundred') },
      { id: 'f4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '4/4', rest: 30, image: getExerciseGifUrl('Single Leg Stretch') },
      { id: 'f5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30, image: getExerciseGifUrl('Double Leg Stretch') },
      { id: 'f6', name: 'Elevação Pélvica Solo', muscleGroup: 'Glúteo/CORE', sets: 1, reps: '8', rest: 30, image: getExerciseGifUrl('Elevação Pélvica Solo') }
    ]
  },
  {
    id: 'a',
    title: 'Treino A - Inferiores',
    description: 'Foco em pernas e abdômen infra.',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Abdomen Infra', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Abdomen Infra') },
      { id: 'a2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Agachamento Livre Banco') },
      { id: 'a3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Adutora') },
      { id: 'a4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Afundo') },
      { id: 'a5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Extensora') },
      { id: 'a6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45, image: getExerciseGifUrl('Panturrilha em pé') }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Abdomen Reto', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Abdomen Reto') },
      { id: 'b2', name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Elevação Lateral Halteres') },
      { id: 'b3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Supino Máquina') },
      { id: 'b4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Desenvolvimento Máquina') },
      { id: 'b5', name: 'Peck Deck', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Peck Deck') },
      { id: 'b6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Remada Alta Kettlebell') }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Posterior e Glúteo',
    description: 'Cadeia posterior e estabilização.',
    color: 'purple',
    exercises: [
      { id: 'c1', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: getExerciseGifUrl('Prancha') },
      { id: 'c2', name: 'Abdução Solo Pilates', muscleGroup: 'Quadril', sets: 3, reps: '16', rest: 60, image: getExerciseGifUrl('Abdução Solo Pilates') },
      { id: 'c3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Stiff Barra') },
      { id: 'c4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Gluteo Máquina Coice') },
      { id: 'c5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Flexora') },
      { id: 'c6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Elevação Pélvica') }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Tração e Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'd1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: getExerciseGifUrl('Canoa Estática') },
      { id: 'd2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Puxada Supinada') },
      { id: 'd3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Triceps Pulley Barra W') },
      { id: 'd4', name: 'Remada Baixa Máquina', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Remada Baixa Máquina') },
      { id: 'd5', name: 'Rosca Direta Pulley', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Rosca Direta Pulley') },
      { id: 'd6', name: 'Peck Deck Invertido', muscleGroup: 'Ombro', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Peck Deck Invertido') }
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
      { id: 'h1-1', name: 'Supino máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Supino máquina') },
      { id: 'h1-2', name: 'Supino inclinado iso articulado deitado (shua)', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Supino inclinado iso articulado deitado shua') },
      { id: 'h1-3', name: 'Crucifixo máquina', muscleGroup: 'Peito', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Crucifixo máquina') },
      { id: 'h1-4', name: 'Elevação lateral c/ halter 0º-180º neutra', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Elevação lateral c halter 0-180 neutra') },
      { id: 'h1-5', name: 'Elevação frontal no cross', muscleGroup: 'Ombros', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Elevação frontal no cross') },
      { id: 'h1-6', name: 'Tríceps no cross barra reta', muscleGroup: 'Tríceps', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Tríceps no cross barra reta') },
      { id: 'h1-7', name: 'Tríceps no cross corda', muscleGroup: 'Tríceps', sets: 4, reps: 'Máx rep', rest: 60, image: getExerciseGifUrl('Tríceps no cross corda') }
    ]
  },
  {
    id: 'h-2',
    title: 'Treino 2',
    description: 'Foco em Costas e Bíceps.',
    color: 'orange',
    exercises: [
      { id: 'h2-1', name: 'Pulley anterior aberta', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Pulley anterior aberta') },
      { id: 'h2-2', name: 'Remada articulada neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Remada articulada neutra') },
      { id: 'h2-3', name: 'Crucifixo inverso máquina pronada', muscleGroup: 'Ombros/Costas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Crucifixo inverso máquina pronada') },
      { id: 'h2-4', name: 'Remada baixa peg. neutra', muscleGroup: 'Costas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Remada baixa peg neutra') },
      { id: 'h2-5', name: 'Rosca martelo no cross corda', muscleGroup: 'Bíceps', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Rosca martelo no cross corda') },
      { id: 'h2-6', name: 'Rosca direta barra reta', muscleGroup: 'Bíceps', sets: 4, reps: 'Máx rep', rest: 60, image: getExerciseGifUrl('Rosca direta barra reta') }
    ]
  },
  {
    id: 'h-3',
    title: 'Treino 3',
    description: 'Foco em Membros Inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'h3-1', name: 'Banco abdutor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Banco abdutor') },
      { id: 'h3-2', name: 'Leg press 45º', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Leg press 45') },
      { id: 'h3-3', name: 'Agachamento livre', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Agachamento livre') },
      { id: 'h3-4', name: 'Banco extensor', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Banco extensor') },
      { id: 'h3-5', name: 'Mesa flexora', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Mesa flexora') },
      { id: 'h3-6', name: 'Banco sóleo', muscleGroup: 'Panturrilha', sets: 3, reps: '12 a 15', rest: 60, image: getExerciseGifUrl('Banco sóleo') },
      { id: 'h3-7', name: 'Extensão lombar no banco romano', muscleGroup: 'Lombar', sets: 3, reps: '15', rest: 60, image: getExerciseGifUrl('Extensão lombar no banco romano') }
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
      { id: 'ma1', name: 'Supino reto', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, notes: 'Carga 60%', image: getExerciseGifUrl('Supino reto') },
      { id: 'ma2', name: 'Elevação conjunta', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Elevação conjunta') },
      { id: 'ma3', name: 'Tríceps francês', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Tríceps francês') },
      { id: 'ma4', name: 'Crucifixo', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Crucifixo') },
      { id: 'ma5', name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Desenvolvimento Arnold') },
      { id: 'ma6', name: 'Tríceps na caixa ou nas argolas', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Tríceps na caixa ou nas argolas') },
      { id: 'ma7', name: 'Supino alternado', muscleGroup: 'Peito', sets: 3, reps: '10, 10', rest: 90, image: getExerciseGifUrl('Supino alternado') },
      { id: 'ma8', name: 'Flexão', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Flexão') }
    ]
  },
  {
    id: 'm-b',
    title: 'Treino B - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'mb1', name: 'Elevação de perna extendida', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, notes: 'Carga caneleira', image: getExerciseGifUrl('Elevação de perna extendida') },
      { id: 'mb2', name: 'Hip Thrust - elevação pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Hip Thrust - elevação pélvica') },
      { id: 'mb3', name: 'Clamshell - ostra', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: getExerciseGifUrl('Clamshell - ostra') },
      { id: 'mb4', name: 'Deadlift', muscleGroup: 'Posterior/Glúteo', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Deadlift') },
      { id: 'mb5', name: 'Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '10, 10', rest: 90, image: getExerciseGifUrl('Extensora') },
      { id: 'mb6', name: 'Flexora', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Flexora') },
      { id: 'mb7', name: 'Stiff', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Stiff') }
    ]
  },
  {
    id: 'm-c',
    title: 'Treino C - Superior',
    description: 'Foco em membros superiores.',
    color: 'blue',
    exercises: [
      { id: 'mc1', name: 'Remada curvada', muscleGroup: 'Costas', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Remada curvada') },
      { id: 'mc2', name: 'Encolhimento', muscleGroup: 'Trapézio', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Encolhimento') },
      { id: 'mc3', name: 'Rosca direta', muscleGroup: 'Bíceps', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Rosca direta') },
      { id: 'mc4', name: 'Crucifixo inverso', muscleGroup: 'Ombros/Costas', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Crucifixo inverso') },
      { id: 'mc5', name: 'Rosca alternada', muscleGroup: 'Bíceps', sets: 3, reps: '10, 10', rest: 90, image: getExerciseGifUrl('Rosca alternada') },
      { id: 'mc6', name: 'Remada alternada', muscleGroup: 'Costas', sets: 3, reps: '10, 10', rest: 90, image: getExerciseGifUrl('Remada alternada') }
    ]
  },
  {
    id: 'm-d',
    title: 'Treino D - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'purple',
    exercises: [
      { id: 'md1', name: 'Abdução de quadril em pé', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60, image: getExerciseGifUrl('Abdução de quadril em pé') },
      { id: 'md2', name: 'Stiff unilateral', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: getExerciseGifUrl('Stiff unilateral') },
      { id: 'md3', name: 'Sumô', muscleGroup: 'Pernas/Glúteo', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Sumô') },
      { id: 'md4', name: 'Flexão de joelho em pé', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60, image: getExerciseGifUrl('Flexão de joelho em pé') },
      { id: 'md5', name: 'Flexão de joelho na MB', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Flexão de joelho na MB') },
      { id: 'md6', name: 'Wall sit', muscleGroup: 'Pernas', sets: 3, reps: '30 a 45"', rest: 60, image: getExerciseGifUrl('Wall sit') },
      { id: 'md7', name: 'Back Squat', muscleGroup: 'Pernas', sets: 3, reps: '10', rest: 90, image: getExerciseGifUrl('Back Squat') }
    ]
  }
];

export const flaviaWorkouts: WorkoutRoutine[] = [
  {
    id: 'f-a',
    title: 'Treino A - Inferiores/CORE',
    description: 'Foco em pernas e estabilização.',
    color: 'blue',
    exercises: [
      { id: 'fa1', name: 'Abdomen Infra (Pingus)', muscleGroup: 'CORE', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Abdomen Infra (Pingus)') },
      { id: 'fa2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Agachamento Livre Banco') },
      { id: 'fa3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Adutora') },
      { id: 'fa4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Afundo') },
      { id: 'fa5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Extensora') },
      { id: 'fa6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45, image: getExerciseGifUrl('Panturrilha em pé') }
    ]
  },
  {
    id: 'f-b',
    title: 'Treino B - CORE/Fortalecimento',
    description: 'Fortalecimento específico do CORE.',
    color: 'emerald',
    exercises: [
      { id: 'fb1', name: 'Pingus', muscleGroup: 'CORE', sets: 3, reps: '12-15', rest: 30, image: getExerciseGifUrl('Pingus') },
      { id: 'fb2', name: 'Frog', muscleGroup: 'CORE', sets: 3, reps: '12-15', rest: 30, image: getExerciseGifUrl('Frog') },
      { id: 'fb3', name: 'One Hundred', muscleGroup: 'CORE', sets: 3, reps: '50', rest: 30, image: getExerciseGifUrl('One Hundred') },
      { id: 'fb4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 3, reps: '12-15', rest: 30, image: getExerciseGifUrl('Single Leg Stretch') },
      { id: 'fb5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 3, reps: '12-15', rest: 30, image: getExerciseGifUrl('Double Leg Stretch') },
      { id: 'fb6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo/CORE', sets: 3, reps: '12-15', rest: 30, image: getExerciseGifUrl('Elevação Pélvica') }
    ]
  },
  {
    id: 'f-c',
    title: 'Treino C - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'fc1', name: 'Abdomen Reto Pilates', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Abdomen Reto Pilates') },
      { id: 'fc2', name: 'Elevação Frontal Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Elevação Frontal Halteres') },
      { id: 'fc3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Supino Máquina') },
      { id: 'fc4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Desenvolvimento Máquina') },
      { id: 'fc5', name: 'Crucifixo Banco Halteres', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Crucifixo Banco Halteres') },
      { id: 'fc6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Remada Alta Kettlebell') }
    ]
  },
  {
    id: 'f-d',
    title: 'Treino D - Posterior/Glúteo',
    description: 'Cadeia posterior e glúteos.',
    color: 'purple',
    exercises: [
      { id: 'fd1', name: 'Extensão Lombar Livre', muscleGroup: 'Lombar', sets: 3, reps: '15', rest: 60, image: getExerciseGifUrl('Extensão Lombar Livre') },
      { id: 'fd2', name: 'Abdução Solo Pilates (Leg circles)', muscleGroup: 'Quadril', sets: 3, reps: '20', rest: 60, image: getExerciseGifUrl('Abdução Solo Pilates (Leg circles)') },
      { id: 'fd3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Stiff Barra') },
      { id: 'fd4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Gluteo Máquina Coice') },
      { id: 'fd5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Cadeira Flexora') },
      { id: 'fd6', name: 'Elevação Pélvica Livre', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Elevação Pélvica Livre') }
    ]
  },
  {
    id: 'f-e',
    title: 'Treino E - Tração/Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'fe1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60, image: getExerciseGifUrl('Canoa Estática') },
      { id: 'fe2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Puxada Supinada') },
      { id: 'fe3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Triceps Pulley Barra W') },
      { id: 'fe4', name: 'Remada Baixa Aberta', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Remada Baixa Aberta') },
      { id: 'fe5', name: 'Rosca Direta Pulley Corda', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Rosca Direta Pulley Corda') },
      { id: 'fe6', name: 'Serrote Halteres', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, image: getExerciseGifUrl('Serrote Halteres') }
    ]
  }
];
