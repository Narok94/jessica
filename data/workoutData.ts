
import { WorkoutRoutine } from '../types';
import { getExerciseGifUrl } from '../src/utils/exerciseUtils';

export const jessicaWorkouts: WorkoutRoutine[] = [
  {
    id: 'j-a',
    title: 'Treino A — Segunda: Glúteo + Quadríceps',
    description: 'Foco em pernas, glúteos e definição com cardio inclinado.',
    color: 'emerald',
    exercises: [
      { id: 'ja-aquec', name: 'Esteira (Caminhada Inclinada)', muscleGroup: 'Aquecimento', sets: 1, reps: '10 min', rest: 60, notes: 'Aquecimento inicial na esteira.', image: getExerciseGifUrl('Esteira (Caminhada Inclinada)') },
      { id: 'ja1', name: 'Agachamento Livre', muscleGroup: 'Quadríceps', sets: 4, reps: '10', rest: 90, notes: 'Priorize execução perfeita. Aumente carga gradualmente.', image: getExerciseGifUrl('Agachamento Livre') },
      { id: 'ja2', name: 'Leg Press 45', muscleGroup: 'Quadríceps/Glúteo', sets: 4, reps: '12', rest: 90, notes: 'Amplitude máxima com segurança.', image: getExerciseGifUrl('Leg Press 45') },
      { id: 'ja3', name: 'Afundo Caminhando', muscleGroup: 'Glúteo/Quadríceps', sets: 3, reps: '12/12', rest: 60, notes: '12 repetições para cada perna.', image: getExerciseGifUrl('Afundo Caminhando') },
      { id: 'ja4', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '15 + 10p', rest: 45, notes: '15 repetições completas + 10 parciais (pico de contração).', image: getExerciseGifUrl('Cadeira Extensora') },
      { id: 'ja5', name: 'Elevação Pélvica Barra', muscleGroup: 'Glúteo', sets: 4, reps: '12', rest: 60, notes: 'Esmague os glúteos no topo por 1 segundo.', image: getExerciseGifUrl('Elevação Pélvica Barra') },
      { id: 'ja6', name: 'Abdutora Máquina', muscleGroup: 'Glúteo/Quadril', sets: 4, reps: '20', rest: 45, notes: 'Mantenha inclinação para frente para recrutar mais glúteo médio.', image: getExerciseGifUrl('Abdutora Máquina') },
      { id: 'ja7', name: 'Panturrilha em pé', muscleGroup: 'Panturrilha', sets: 4, reps: '15', rest: 45, notes: 'Estique bem embaixo e contraia forte no topo.', image: getExerciseGifUrl('Panturrilha em pé') }
    ],
    cardio: { exercise: 'Caminhada inclinada (esteira)', duration: 20 }
  },
  {
    id: 'j-b',
    title: 'Treino B — Terça: Superiores + Core',
    description: 'Tronco, membros superiores definidos, core firme e queima calórica.',
    color: 'orange',
    exercises: [
      { id: 'jb1', name: 'Supino Máquina', muscleGroup: 'Peitoral', sets: 4, reps: '12', rest: 60, image: getExerciseGifUrl('Supino Máquina') },
      { id: 'jb2', name: 'Remada Baixa', muscleGroup: 'Costas', sets: 4, reps: '12', rest: 60, notes: 'Esmague as costas no pico do movimento.', image: getExerciseGifUrl('Remada Baixa') },
      { id: 'jb3', name: 'Desenvolvimento Halteres', muscleGroup: 'Ombros', sets: 3, reps: '12', rest: 60, image: getExerciseGifUrl('Desenvolvimento Halteres') },
      { id: 'jb4', name: 'Puxada Frontal', muscleGroup: 'Costas', sets: 4, reps: '12', rest: 60, notes: 'Puxe utilizando os cotovelos.', image: getExerciseGifUrl('Puxada Frontal') },
      { id: 'jb5', name: 'Elevação Lateral', muscleGroup: 'Ombros', sets: 3, reps: '15', rest: 60, notes: 'Postura firme, eleve até a linha dos ombros.', image: getExerciseGifUrl('Elevação Lateral') },
      { id: 'jb6', name: 'Rosca Direta', muscleGroup: 'Bíceps', sets: 3, reps: '12', rest: 60, image: getExerciseGifUrl('Rosca Direta') },
      { id: 'jb7', name: 'Tríceps Corda', muscleGroup: 'Tríceps', sets: 3, reps: '12', rest: 60, notes: 'Abra a corda no final da descida para contrair melhor.', image: getExerciseGifUrl('Tríceps Corda') },
      { id: 'jb8', name: 'Prancha para o Core', muscleGroup: 'CORE', sets: 3, reps: '40s', rest: 45, notes: 'Contração permanente do abdômen e glúteo.', image: getExerciseGifUrl('Prancha') },
      { id: 'jb9', name: 'Dead Bug', muscleGroup: 'CORE', sets: 3, reps: '12/12', rest: 45, notes: 'Movimento alternado lento e controlado.', image: getExerciseGifUrl('Dead Bug') },
      { id: 'jb10', name: 'Abdômen Infra Banco', muscleGroup: 'CORE', sets: 3, reps: '15', rest: 45, notes: 'Elevação de quadril sem balanço excesivo.', image: getExerciseGifUrl('Abdômen Infra Banco') }
    ],
    cardio: { exercise: 'HIIT leve (bike ou esteira)', duration: 18 }
  },
  {
    id: 'j-c',
    title: 'Treino C — Quarta: Posterior + Glúteo',
    description: 'Cadeia posterior das pernas e foco extra nos glúteos.',
    color: 'purple',
    exercises: [
      { id: 'jc1', name: 'Stiff Barra', muscleGroup: 'Posterior/Glúteo', sets: 4, reps: '10', rest: 90, notes: 'Coluna reta, sinta alongar o posterior de coxa.', image: getExerciseGifUrl('Stiff Barra') },
      { id: 'jc2', name: 'Mesa Flexora', muscleGroup: 'Posterior', sets: 4, reps: '12', rest: 60, notes: 'Retorne segurando o peso de forma controlada.', image: getExerciseGifUrl('Mesa Flexora') },
      { id: 'jc3', name: 'Elevação Pélvica', muscleGroup: 'Glúteo', sets: 4, reps: '10', rest: 90, notes: 'Com barra ou halter grande, esprema forte no topo.', image: getExerciseGifUrl('Elevação Pélvica') },
      { id: 'jc4', name: 'Coice Máquina', muscleGroup: 'Glúteo', sets: 3, reps: '15', rest: 60, notes: 'Chute direcionado para cima e para trás.', image: getExerciseGifUrl('Coice Máquina') },
      { id: 'jc5', name: 'Cadeira Abdutora', muscleGroup: 'Glúteo', sets: 4, reps: '20', rest: 45, notes: 'Volume de repetições altas para queimar.', image: getExerciseGifUrl('Cadeira Abdutora') },
      { id: 'jc6', name: 'Passada no Smith', muscleGroup: 'Pernas/Glúteo', sets: 3, reps: '12/12', rest: 60, notes: 'Agachamento búlgaro ou passada estática com excelente postura.', image: getExerciseGifUrl('Passada no Smith') },
      { id: 'jc7', name: 'Panturrilha Sentada', muscleGroup: 'Panturrilha', sets: 4, reps: '15', rest: 45, image: getExerciseGifUrl('Panturrilha Sentada') }
    ],
    cardio: { exercise: 'Bike com intensidade moderada', duration: 15 }
  },
  {
    id: 'j-d',
    title: 'Treino D — Quinta: Metabólico + Abdômen',
    description: 'Circuito dinâmico para acelerar o metabolismo e queimar gordura.',
    color: 'red',
    exercises: [
      { id: 'jd1', name: 'Agachamento Goblet', muscleGroup: 'Metabólico', sets: 4, reps: '15', rest: 0, notes: 'CIRCUITO! Não descanse e passe direto para o Kettlebell Swing.', image: getExerciseGifUrl('Agachamento Goblet') },
      { id: 'jd2', name: 'Kettlebell Swing', muscleGroup: 'Metabólico', sets: 4, reps: '15', rest: 0, notes: 'Circuito dinâmico, impulsione com o quadril.', image: getExerciseGifUrl('Kettlebell Swing') },
      { id: 'jd3', name: 'Step-up Banco', muscleGroup: 'Metabólico', sets: 4, reps: '12/12', rest: 0, notes: '12 subidas para cada perna. Sem descanso.', image: getExerciseGifUrl('Step-up Banco') },
      { id: 'jd4', name: 'Battle Rope (Corda Naval)', muscleGroup: 'Metabólico', sets: 4, reps: '30s', rest: 0, notes: 'Movimentação intensa e ritmada. Sem descanso.', image: getExerciseGifUrl('Battle Rope (Corda Naval)') },
      { id: 'jd5', name: 'Burpee Adaptado', muscleGroup: 'Metabólico', sets: 4, reps: '10', rest: 0, notes: 'Apoie as mãos no banco ou solo de forma controlada.', image: getExerciseGifUrl('Burpee Adaptado') },
      { id: 'jd6', name: 'Bicicleta Abdominal', muscleGroup: 'CORE', sets: 4, reps: '20', rest: 90, notes: 'Fim da volta! Descanse 90s antes de reiniciar o circuito.', image: getExerciseGifUrl('Bicicleta Abdominal') }
    ],
    cardio: { exercise: 'Esteira Caminhada Inclinada', duration: 25 }
  },
  {
    id: 'j-e',
    title: 'Treino E — Sexta: Glúteo Premium 🍑',
    description: 'Foco elite em lapidar e firmar os glúteos de forma avançada.',
    color: 'pink',
    exercises: [
      { id: 'je1', name: 'Elevação Pélvica Extrema', muscleGroup: 'Glúteo', sets: 5, reps: '10', rest: 90, notes: 'Controle de descida super lento. Segure 2s no topo.', image: getExerciseGifUrl('Elevação Pélvica Extrema') },
      { id: 'je2', name: 'Agachamento Sumô', muscleGroup: 'Glúteo/Interno Coxa', sets: 4, reps: '12', rest: 90, notes: 'Pés bem abertos, agache profundo com as costas retas.', image: getExerciseGifUrl('Agachamento Sumô') },
      { id: 'je3', name: 'Bulgarian Split Squat', muscleGroup: 'Glúteo/Quadríceps', sets: 3, reps: '10/10', rest: 60, notes: 'Pé de trás apoiado no banco, 10 repetições por perna.', image: getExerciseGifUrl('Bulgarian Split Squat') },
      { id: 'je4', name: 'Cadeira Abdutora', muscleGroup: 'Glúteo Médio', sets: 4, reps: '20', rest: 45, notes: 'Mantenha inclinação tronco para frente, sinta queimar.', image: getExerciseGifUrl('Cadeira Abdutora') },
      { id: 'je5', name: 'Glúteo Cabo (Coice)', muscleGroup: 'Glúteo Máximo', sets: 4, reps: '15', rest: 60, notes: 'Não flexione a coluna lombar na extensão da perna.', image: getExerciseGifUrl('Glúteo Cabo (Coice)') },
      { id: 'je6', name: 'Stiff Halteres', muscleGroup: 'Posterior/Glúteo', sets: 3, reps: '12', rest: 60, notes: 'Flexão limpa do quadril, alongando bem a metade inferior.', image: getExerciseGifUrl('Stiff Halteres') },
      { id: 'je7', name: 'Frog Pump', muscleGroup: 'Glúteo Isolado', sets: 3, reps: '25', rest: 45, notes: 'Sola do pé contra sola do pé, eleve o quadril rapidamente esmagando.', image: getExerciseGifUrl('Frog Pump') }
    ]
  }
];

export const henriqueWorkouts: WorkoutRoutine[] = [
  {
    id: 'h-a',
    title: 'Treino A — Peito, Ombro e Tríceps',
    description: 'Foco em estética, peitoral superior e ombro largo.',
    color: 'orange',
    exercises: [
      { id: 'ha1', name: 'Supino Inclinado Máquina ou Halteres', muscleGroup: 'Peitoral', sets: 4, reps: '8-12', rest: 90, notes: 'Foco em peitoral superior, movimento controlado.', image: getExerciseGifUrl('Supino Inclinado Máquina') },
      { id: 'ha2', name: 'Supino Reto Máquina ou Halteres', muscleGroup: 'Peitoral', sets: 3, reps: '8-12', rest: 90, notes: 'Manter escápulas aduzidas para maior segurança.', image: getExerciseGifUrl('Supino Reto Halteres') },
      { id: 'ha3', name: 'Crucifixo Máquina', muscleGroup: 'Peitoral', sets: 2, reps: '12-15', rest: 45, notes: 'Sinta o alongamento máximo no peitoral.', image: getExerciseGifUrl('Crucifixo Máquina') },
      { id: 'ha4', name: 'Desenvolvimento Máquina (pegada neutra)', muscleGroup: 'Ombros', sets: 3, reps: '10-12', rest: 90, notes: 'Pegada neutra para proteger a articulação dos ombros.', image: getExerciseGifUrl('Desenvolvimento Máquina') },
      { id: 'ha5', name: 'Elevação Lateral Polia', muscleGroup: 'Ombros', sets: 4, reps: '12-15', rest: 45, notes: 'Tensão contínua, sinta a ativação do feixe lateral.', image: getExerciseGifUrl('Elevação Lateral Polia') },
      { id: 'ha6', name: 'Tríceps Corda', muscleGroup: 'Tríceps', sets: 3, reps: '10-12', rest: 45, notes: 'Abra as pontas da corda no final para pico de contração.', image: getExerciseGifUrl('Tríceps Corda') }
    ]
  },
  {
    id: 'h-b',
    title: 'Treino B — Costas, Trapézio, Bíceps e Antebraço',
    description: 'Foco em V-taper, braços mais cheios e trapézio.',
    color: 'purple',
    exercises: [
      { id: 'hb1', name: 'Puxada Alta', muscleGroup: 'Costas', sets: 4, reps: '8-12', rest: 90, notes: 'Foco em expandir dorsal ("asa"). Puxe pelos cotovelos.', image: getExerciseGifUrl('Puxada Alta') },
      { id: 'hb2', name: 'Remada Baixa Triângulo', muscleGroup: 'Costas', sets: 3, reps: '10-12', rest: 90, notes: 'Desenvolvimento de espessura de costas.', image: getExerciseGifUrl('Remada Baixa Triângulo') },
      { id: 'hb3', name: 'Pulldown Unilateral OU Pullover Polia', muscleGroup: 'Costas', sets: 3, reps: '12-15', rest: 60, notes: 'Recrutamento isolado do latíssimo do dorso.', image: getExerciseGifUrl('Pullover Polia') },
      { id: 'hb4', name: 'Encolhimento Halteres', muscleGroup: 'Trapézio', sets: 4, reps: '12-15', rest: 60, notes: 'Segure 1 segundo no topo com contração máxima.', image: getExerciseGifUrl('Encolhimento Halteres') },
      { id: 'hb5', name: 'Rosca Martelo', muscleGroup: 'Bíceps', sets: 4, reps: '10-12', rest: 60, notes: 'Foco no braquioestetismo e braquiorradial.', image: getExerciseGifUrl('Rosca Martelo') },
      { id: 'hb6', name: 'Rosca Scott Máquina OU Barra W', muscleGroup: 'Bíceps', sets: 3, reps: '10-12', rest: 60, notes: 'Alongamento profundo com pico de contração.', image: getExerciseGifUrl('Rosca Scott') },
      { id: 'hb7', name: 'Rosca Inversa Barra W', muscleGroup: 'Bíceps', sets: 3, reps: '12-15', rest: 60, notes: 'Fortalecimento de antebraço e braquiorradial.', image: getExerciseGifUrl('Rosca Inversa Barra W') },
      { id: 'hb8', name: 'Flexão de Punho (Antebraço)', muscleGroup: 'Antebraço', sets: 3, reps: '15-20', rest: 60, notes: 'Movimento lento e controlado para antebraço massivo.', image: getExerciseGifUrl('Flexão de Punho') }
    ]
  },
  {
    id: 'h-c',
    title: 'Treino C — Pernas e Abdômen',
    description: 'Foco em pernas equilibradas, core e cintura estética.',
    color: 'emerald',
    exercises: [
      { id: 'hc1', name: 'Leg Press', muscleGroup: 'Pernas', sets: 4, reps: '10-12', rest: 90, notes: 'Amplitude profunda com controle de descida.', image: getExerciseGifUrl('Leg Press') },
      { id: 'hc2', name: 'Stiff', muscleGroup: 'Posterior', sets: 4, reps: '10-12', rest: 90, notes: 'Quadris para trás, sinta alongar o posterior.', image: getExerciseGifUrl('Stiff') },
      { id: 'hc3', name: 'Cadeira Extensora', muscleGroup: 'Quadríceps', sets: 3, reps: '12-15', rest: 60, notes: 'Pausa isométrica de 1s no topo de cada repetição.', image: getExerciseGifUrl('Cadeira Extensora') },
      { id: 'hc4', name: 'Mesa Flexora', muscleGroup: 'Posterior', sets: 3, reps: '12-15', rest: 60, notes: 'Não levante o quadril do banco durante a contração.', image: getExerciseGifUrl('Mesa Flexora') },
      { id: 'hc5', name: 'Panturrilha', muscleGroup: 'Panturrilha', sets: 4, reps: '12-15', rest: 60, notes: 'Amplitude completa de movimento para hipertrofia.', image: getExerciseGifUrl('Panturrilha em pé') },
      { id: 'hc6', name: 'Abdômen Infra', muscleGroup: 'CORE', sets: 3, reps: '15-20', rest: 60, notes: 'Ecrute o abdômen inferior de forma coordenada.', image: getExerciseGifUrl('Abdômen Infra') },
      { id: 'hc7', name: 'Prancha', muscleGroup: 'CORE', sets: 3, reps: '45-60s', rest: 60, notes: 'Manter core active e coluna reta.', image: getExerciseGifUrl('Prancha') }
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
