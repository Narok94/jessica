
import { WorkoutRoutine } from '../types';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'fortalecimento',
    title: 'Fortalecimento (CORE)',
    description: 'Foco em estabilização e controle para Fibromialgia.',
    color: 'emerald',
    exercises: [
      { id: 'f1', name: 'Pingus (Abdomen Infra)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f2', name: 'Frog (Pilates)', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f3', name: 'One Hundred', muscleGroup: 'CORE', sets: 1, reps: '50', rest: 30 },
      { id: 'f4', name: 'Single Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '4/4', rest: 30 },
      { id: 'f5', name: 'Double Leg Stretch', muscleGroup: 'CORE', sets: 1, reps: '8', rest: 30 },
      { id: 'f6', name: 'Elevação Pélvica Solo', muscleGroup: 'Glúteo/CORE', sets: 1, reps: '8', rest: 30 }
    ]
  },
  {
    id: 'a',
    title: 'Treino A - Inferiores',
    description: 'Foco em pernas e abdômen infra.',
    color: 'blue',
    exercises: [
      { id: 'a1', name: 'Abdomen Infra', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a2', name: 'Agachamento Livre Banco', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a3', name: 'Cadeira Adutora', muscleGroup: 'Adutores', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a4', name: 'Afundo', muscleGroup: 'Pernas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a5', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'a6', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 3, reps: '15', rest: 45 }
    ]
  },
  {
    id: 'b',
    title: 'Treino B - Superiores',
    description: 'Tronco e membros superiores.',
    color: 'orange',
    exercises: [
      { id: 'b1', name: 'Abdomen Reto', muscleGroup: 'Abdomen', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b2', name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b3', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b4', name: 'Desenvolvimento Máquina', muscleGroup: 'Ombros', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b5', name: 'Peck Deck', muscleGroup: 'Peitoral', sets: 3, reps: '12-15', rest: 60 },
      { id: 'b6', name: 'Remada Alta Kettlebell', muscleGroup: 'Costas/Ombro', sets: 3, reps: '12-15', rest: 60 }
    ]
  },
  {
    id: 'c',
    title: 'Treino C - Posterior e Glúteo',
    description: 'Cadeia posterior e estabilização.',
    color: 'purple',
    exercises: [
      { id: 'c1', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60 },
      { id: 'c2', name: 'Abdução Solo Pilates', muscleGroup: 'Quadril', sets: 3, reps: '16', rest: 60 },
      { id: 'c3', name: 'Stiff Barra', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c4', name: 'Gluteo Máquina Coice', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c5', name: 'Cadeira Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60 },
      { id: 'c6', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '12-15', rest: 60 }
    ]
  },
  {
    id: 'd',
    title: 'Treino D - Tração e Braços',
    description: 'Costas e braços.',
    color: 'red',
    exercises: [
      { id: 'd1', name: 'Canoa Estática', muscleGroup: 'CORE', sets: 3, reps: '90s', rest: 60 },
      { id: 'd2', name: 'Puxada Supinada', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd3', name: 'Triceps Pulley Barra W', muscleGroup: 'Tríceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd4', name: 'Remada Baixa Máquina', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd5', name: 'Rosca Direta Pulley', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60 },
      { id: 'd6', name: 'Peck Deck Invertido', muscleGroup: 'Ombro', sets: 3, reps: '12-15', rest: 60 }
    ]
  }
];

export const henriqueWorkouts: WorkoutRoutine[] = [
  {
    id: 'h-seg',
    title: 'SEG: Peito e Braços',
    description: 'HIPERTROFIA. Segredo: descida bem devagar (3s). Se fácil, segure o elástico mais curto.',
    color: 'blue',
    exercises: [
      { id: 'hn1', name: 'Flexão no Chão (Joelhos)', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45, notes: 'Cotovelos a 45° (seta) para proteger o ombro.' },
      { id: 'hn2', name: 'Fly com Elástico/Pano', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45, notes: 'Aperte bem um braço contra o outro no meio.' },
      { id: 'hn3', name: 'Rosca Direta (Elástico/Pano)', muscleGroup: 'Bíceps', sets: 4, reps: '12-20', rest: 45, notes: 'Pise no pano e puxe com força máxima.' },
      { id: 'hn4', name: 'Tríceps Francês (Elástico)', muscleGroup: 'Tríceps', sets: 4, reps: '12-20', rest: 45, notes: 'Cotovelo apontado para o teto e bem fechado.' },
      { id: 'hn5', name: 'Remada Sentada (Pano/Elástico)', muscleGroup: 'Costas', sets: 4, reps: '12-20', rest: 45, notes: 'Passe o pano nos pés e puxe para o umbigo.' }
    ]
  },
  {
    id: 'h-ter',
    title: 'TER: Pernas e Core',
    description: 'QUEIMA METABÓLICA. Meta: 14% de gordura. Com o pano, faça força contra a própria resistência.',
    color: 'emerald',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: '20-30', rest: 45, notes: 'Mantenha o peso nos calcanhares.' },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: '10/10 a 15/15', rest: 45 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn10', name: 'Prancha Isométrica', muscleGroup: 'CORE', sets: 4, reps: '45-60s', rest: 45 }
    ]
  },
  {
    id: 'h-qua',
    title: 'QUA: Peito e Braços',
    description: 'HIPERTROFIA. Foco na descida lenta (3 segundos) para romper mais fibras musculares.',
    color: 'blue',
    exercises: [
      { id: 'hn1', name: 'Flexão no Chão (Joelhos)', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn2', name: 'Fly com Elástico/Pano', muscleGroup: 'Peito', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn3', name: 'Rosca Direta (Elástico/Pano)', muscleGroup: 'Bíceps', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn4', name: 'Tríceps Francês (Elástico)', muscleGroup: 'Tríceps', sets: 4, reps: '12-20', rest: 45 },
      { id: 'hn5', name: 'Remada Sentada (Pano/Elástico)', muscleGroup: 'Costas', sets: 4, reps: '12-20', rest: 45 }
    ]
  },
  {
    id: 'h-qui',
    title: 'QUI: Pernas e Core',
    description: 'QUEIMA. Mantenha a intensidade alta para reduzir o percentual de gordura.',
    color: 'emerald',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: '10/10 a 15/15', rest: 45 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: '20-30', rest: 45 },
      { id: 'hn10', name: 'Prancha Isométrica', muscleGroup: 'CORE', sets: 4, reps: '45-60s', rest: 45 }
    ]
  },
  {
    id: 'h-sex',
    title: 'SEX: Queima Total (DIA DE CHOQUE) ⚡',
    description: 'DIA DE CHOQUE! Repetições MÁXIMAS e apenas 30s de descanso. Acelere o metabolismo!',
    color: 'red',
    exercises: [
      { id: 'hn6', name: 'Agachamento Livre', muscleGroup: 'Pernas', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn7', name: 'Afundo Alternado', muscleGroup: 'Pernas', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn8', name: 'Abdominal Crunch (Curto)', muscleGroup: 'Abdômen', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn10', name: 'Prancha Isométrica', muscleGroup: 'CORE', sets: 4, reps: 'Máximas', rest: 30 },
      { id: 'hn11', name: 'Polichinelo "Baixo"', muscleGroup: 'Cardio', sets: 4, reps: 'Máximas', rest: 30, notes: 'Sem subir braços acima dos ombros.' }
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
      { id: 'ma1', name: 'Supino reto', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90, notes: 'Carga 60%' },
      { id: 'ma2', name: 'Elevação conjunta', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90 },
      { id: 'ma3', name: 'Tríceps francês', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90 },
      { id: 'ma4', name: 'Crucifixo', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90 },
      { id: 'ma5', name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', sets: 3, reps: '10', rest: 90 },
      { id: 'ma6', name: 'Tríceps na caixa ou nas argolas', muscleGroup: 'Tríceps', sets: 3, reps: '10', rest: 90 },
      { id: 'ma7', name: 'Supino alternado', muscleGroup: 'Peito', sets: 3, reps: '10, 10', rest: 90 },
      { id: 'ma8', name: 'Flexão', muscleGroup: 'Peito', sets: 3, reps: '10', rest: 90 }
    ]
  },
  {
    id: 'm-b',
    title: 'Treino B - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'emerald',
    exercises: [
      { id: 'mb1', name: 'Elevação de perna extendida', muscleGroup: 'Pernas', sets: 3, reps: '12 a 15', rest: 60, notes: 'Carga caneleira' },
      { id: 'mb2', name: 'Hip Thrust - elevação pélvica', muscleGroup: 'Glúteo', sets: 3, reps: '10', rest: 90 },
      { id: 'mb3', name: 'Clamshell - ostra', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60 },
      { id: 'mb4', name: 'Deadlift', muscleGroup: 'Posterior/Glúteo', sets: 3, reps: '10', rest: 90 },
      { id: 'mb5', name: 'Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '10, 10', rest: 90 },
      { id: 'mb6', name: 'Flexora', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90 },
      { id: 'mb7', name: 'Stiff', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90 }
    ]
  },
  {
    id: 'm-c',
    title: 'Treino C - Superior',
    description: 'Foco em membros superiores.',
    color: 'blue',
    exercises: [
      { id: 'mc1', name: 'Remada curvada', muscleGroup: 'Costas', sets: 3, reps: '10', rest: 90 },
      { id: 'mc2', name: 'Encolhimento', muscleGroup: 'Trapézio', sets: 3, reps: '10', rest: 90 },
      { id: 'mc3', name: 'Rosca direta', muscleGroup: 'Bíceps', sets: 3, reps: '10', rest: 90 },
      { id: 'mc4', name: 'Crucifixo inverso', muscleGroup: 'Ombros/Costas', sets: 3, reps: '10', rest: 90 },
      { id: 'mc5', name: 'Rosca alternada', muscleGroup: 'Bíceps', sets: 3, reps: '10, 10', rest: 90 },
      { id: 'mc6', name: 'Remada alternada', muscleGroup: 'Costas', sets: 3, reps: '10, 10', rest: 90 }
    ]
  },
  {
    id: 'm-d',
    title: 'Treino D - Inferior',
    description: 'Foco em membros inferiores.',
    color: 'purple',
    exercises: [
      { id: 'md1', name: 'Abdução de quadril em pé', muscleGroup: 'Glúteo', sets: 3, reps: '10, 10', rest: 60 },
      { id: 'md2', name: 'Stiff unilateral', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60 },
      { id: 'md3', name: 'Sumô', muscleGroup: 'Pernas/Glúteo', sets: 3, reps: '10', rest: 90 },
      { id: 'md4', name: 'Flexão de joelho em pé', muscleGroup: 'Posterior', sets: 3, reps: '10, 10', rest: 60 },
      { id: 'md5', name: 'Flexão de joelho na MB', muscleGroup: 'Posterior', sets: 3, reps: '10', rest: 90 },
      { id: 'md6', name: 'Wall sit', muscleGroup: 'Pernas', sets: 3, reps: '30 a 45"', rest: 60 },
      { id: 'md7', name: 'Back Squat', muscleGroup: 'Pernas', sets: 3, reps: '10', rest: 90 }
    ]
  }
];
