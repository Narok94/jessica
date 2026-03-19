
/**
 * Normaliza o nome do exercício para o padrão de arquivo do GitHub
 * Ex: "Supino Reto" -> "supino-reto"
 */
export const normalizeExerciseName = (name: string): string => {
  // Mapeamento manual para nomes que não seguem o padrão ou têm typos no repositório
  const manualMapping: Record<string, string> = {
    "Rosca no Cabo Deitado": "Rosca no Cabo Deitado",
    "Rosca direta": "rosca-direta-com-barra",
    "Rosca alternada": "rosca-alternada-com-halteres-sentado",
    "Rosca direta barra reta": "rosca-direta-com-barra",
    "Rosca direta barra w": "rosca-direta-barra-w",
    "Rosca martelo no cross corda": "rosca-martelo-no-cross-corda",
    "Rosca direta pulley": "rosca-com-polia-alta",
    "Rosca direta pulley corda": "rosca-com-polia-alta",
    "Rosca direta pegada aberta": "rosca-dierta-pegada-aberta",
    "Rosca direta pegada fechada": "rosca-dierta-pegada-fechada",
    "Supino máquina": "supino-maquina",
    "Crucifixo máquina": "crucifixo-maquina",
    "Elevação lateral": "elevacao-lateral-com-halteres",
    "Elevação frontal": "elevacao-frontal-com-halteres",
    "Puxada supinada": "puxada-supinada",
    "Remada baixa": "remada-baixa-com-triangulo",
    "Tríceps no cross": "triceps-no-cross-barra-reta",
    "Tríceps corda": "triceps-no-cross-corda",
    "Biceps concentrado": "biceps-concentrado-unilateral-no-cross",
    "Biceps polia alta": "biceps-polia-alta-dupla",
    "Rosca concentrada": "rosca-concentrada",
    "Rosca martelo": "rosca-com-halteres", // Geralmente martelo é com halteres
    "Rosca Scott": "rosca-de-biceps-com-halteres-no-banco-scott",
    "Cadeira extensora": "cadeira-extensora",
    "Cadeira flexora": "cadeira-flexora",
    "Leg press": "leg-press-45",
    "Agachamento livre": "agachamento-livre",
    "Panturrilha em pe": "panturrilha-em-pe",
  };

  if (manualMapping[name]) return manualMapping[name];
  if (manualMapping[name.toLowerCase()]) return manualMapping[name.toLowerCase()];

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "-")           // Espaços para hifens
    .replace(/[^a-z0-9-]/g, "")     // Remove caracteres especiais
    .replace(/-+/g, "-")            // Remove hifens duplos
    .trim();
};

/**
 * Retorna a URL do GIF do exercício no repositório do GitHub
 */
export const getExerciseGifUrl = (exerciseName: string): string => {
  const normalized = normalizeExerciseName(exerciseName);
  // Se o nome normalizado contém espaços ou maiúsculas (caso do manualMapping), 
  // precisamos garantir que a URL seja construída corretamente.
  // O GitHub raw URL aceita espaços como %20.
  const urlFriendlyName = encodeURIComponent(normalized);
  return `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${urlFriendlyName}.gif`;
};
