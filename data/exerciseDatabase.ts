
export interface BaseExercise {
  name: string;
  muscleGroup: string;
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
}

export const exerciseDatabase: BaseExercise[] = [
  // PEITO
  { name: 'Supino Reto Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Supino Inclinado Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Supino Declinado Barra', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Supino Reto Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Supino Inclinado Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Crucifixo Reto Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Crucifixo Inclinado Halteres', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Crossover Polia Alta', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Crossover Polia Baixa', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Peck Deck (Voador)', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Flexão de Braços', muscleGroup: 'Peito', defaultSets: 3, defaultReps: 'Máx', defaultRest: 60 },
  { name: 'Dips (Paralelas) - Foco Peito', muscleGroup: 'Peito', defaultSets: 3, defaultReps: '8-12', defaultRest: 90 },

  // COSTAS
  { name: 'Puxada Frontal Aberta', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Puxada Frontal Supinada', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Puxada Triângulo', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Remada Curvada Barra', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '8-12', defaultRest: 90 },
  { name: 'Remada Cavalinho', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '8-12', defaultRest: 90 },
  { name: 'Remada Baixa Triângulo', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Remada Unilateral (Serrote)', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Pull Down Corda', muscleGroup: 'Costas', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Barra Fixa (Pull Up)', muscleGroup: 'Costas', defaultSets: 3, defaultReps: 'Máx', defaultRest: 90 },
  { name: 'Levantamento Terra', muscleGroup: 'Costas/Pernas', defaultSets: 3, defaultReps: '5-8', defaultRest: 120 },
  { name: 'Lombar no Banco Romano', muscleGroup: 'Lombar', defaultSets: 3, defaultReps: '15', defaultRest: 60 },

  // OMBROS
  { name: 'Desenvolvimento Barra Militar', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '8-10', defaultRest: 90 },
  { name: 'Desenvolvimento Halteres Sentado', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Desenvolvimento Arnold', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Elevação Lateral Halteres', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Elevação Lateral Polia', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Elevação Frontal Halteres', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Elevação Frontal Barra', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Crucifixo Inverso Halteres', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Crucifixo Inverso Peck Deck', muscleGroup: 'Ombros', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Encolhimento Halteres', muscleGroup: 'Trapézio', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Remada Alta Barra', muscleGroup: 'Trapézio/Ombros', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },

  // BÍCEPS
  { name: 'Rosca Direta Barra W', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Rosca Direta Barra Reta', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Rosca Alternada Halteres', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Rosca Martelo Halteres', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Rosca Concentrada', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '12', defaultRest: 60 },
  { name: 'Rosca Scott Barra W', muscleGroup: 'Bíceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Rosca Inversa Barra', muscleGroup: 'Antebraço', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Rosca Punho', muscleGroup: 'Antebraço', defaultSets: 3, defaultReps: '15', defaultRest: 45 },

  // TRÍCEPS
  { name: 'Tríceps Pulley Barra Reta', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Tríceps Pulley Corda', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Tríceps Testa Barra W', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Tríceps Francês Halter', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Tríceps Coice Polia', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 45 },
  { name: 'Supino Fechado', muscleGroup: 'Tríceps/Peito', defaultSets: 3, defaultReps: '8-10', defaultRest: 90 },
  { name: 'Mergulho no Banco', muscleGroup: 'Tríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },

  // PERNAS (QUADRÍCEPS)
  { name: 'Agachamento Livre', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '8-12', defaultRest: 120 },
  { name: 'Leg Press 45º', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 90 },
  { name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Agachamento Hack', muscleGroup: 'Quadríceps', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Afundo com Halteres', muscleGroup: 'Pernas', defaultSets: 3, defaultReps: '10-12', defaultRest: 60 },
  { name: 'Agachamento Sumô', muscleGroup: 'Pernas/Glúteo', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },

  // PERNAS (POSTERIOR E GLÚTEO)
  { name: 'Stiff Barra', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Mesa Flexora', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Cadeira Flexora', muscleGroup: 'Posterior', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  { name: 'Elevação Pélvica Barra', muscleGroup: 'Glúteo', defaultSets: 3, defaultReps: '10-12', defaultRest: 90 },
  { name: 'Glúteo Quatro Apoios Polia', muscleGroup: 'Glúteo', defaultSets: 3, defaultReps: '12-15', defaultRest: 45 },
  { name: 'Cadeira Abdutora', muscleGroup: 'Glúteo', defaultSets: 3, defaultReps: '15-20', defaultRest: 45 },
  { name: 'Cadeira Adutora', muscleGroup: 'Adutores', defaultSets: 3, defaultReps: '15-20', defaultRest: 45 },

  // PANTURRILHA
  { name: 'Panturrilha em Pé Máquina', muscleGroup: 'Panturrilha', defaultSets: 4, defaultReps: '15-20', defaultRest: 45 },
  { name: 'Panturrilha Sentado (Gêmeos)', muscleGroup: 'Panturrilha', defaultSets: 4, defaultReps: '15-20', defaultRest: 45 },
  { name: 'Panturrilha no Leg Press', muscleGroup: 'Panturrilha', defaultSets: 4, defaultReps: '15-20', defaultRest: 45 },

  // ABDÔMEN
  { name: 'Abdominal Supra Solo', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '20-30', defaultRest: 45 },
  { name: 'Abdominal Infra Solo', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 45 },
  { name: 'Abdominal Remador', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '20', defaultRest: 45 },
  { name: 'Prancha Isométrica', muscleGroup: 'CORE', defaultSets: 3, defaultReps: '45-60s', defaultRest: 45 },
  { name: 'Abdominal na Polia (Crunch)', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '15-20', defaultRest: 60 },
  { name: 'Elevação de Pernas na Barra', muscleGroup: 'Abdômen', defaultSets: 3, defaultReps: '12-15', defaultRest: 60 },
  
  // CARDIO
  { name: 'Esteira (Caminhada)', muscleGroup: 'Cardio', defaultSets: 1, defaultReps: '20-30 min', defaultRest: 0 },
  { name: 'Esteira (Corrida)', muscleGroup: 'Cardio', defaultSets: 1, defaultReps: '15-20 min', defaultRest: 0 },
  { name: 'Bicicleta Ergométrica', muscleGroup: 'Cardio', defaultSets: 1, defaultReps: '20-30 min', defaultRest: 0 },
  { name: 'Elíptico', muscleGroup: 'Cardio', defaultSets: 1, defaultReps: '20-30 min', defaultRest: 0 },
  { name: 'Escada (Stairmaster)', muscleGroup: 'Cardio', defaultSets: 1, defaultReps: '10-15 min', defaultRest: 0 },
  { name: 'Pular Corda', muscleGroup: 'Cardio', defaultSets: 3, defaultReps: '2-3 min', defaultRest: 60 },
  { name: 'Burpees', muscleGroup: 'Cardio/CORE', defaultSets: 3, defaultReps: '10-15', defaultRest: 60 },

  // MOBILIDADE / ALONGAMENTO
  { name: 'Alongamento de Isquiotibiais', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '30s cada lado', defaultRest: 0 },
  { name: 'Alongamento de Quadríceps', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '30s cada lado', defaultRest: 0 },
  { name: 'Mobilidade de Quadril (90/90)', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '10 reps cada lado', defaultRest: 0 },
  { name: 'Mobilidade de Tornozelo', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '12 reps cada lado', defaultRest: 0 },
  { name: 'Cat-Cow (Gato-Camelo)', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '15 reps', defaultRest: 0 },
  { name: 'Alongamento de Peitoral na Parede', muscleGroup: 'Mobilidade', defaultSets: 2, defaultReps: '30s cada lado', defaultRest: 0 },
];
