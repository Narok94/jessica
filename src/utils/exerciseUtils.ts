
/**
 * Normaliza o nome do exercício para o padrão de arquivo do GitHub
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
    "Rosca martelo": "rosca-com-halteres",
    "Rosca Scott": "rosca-de-biceps-com-halteres-no-banco-scott",
    "Cadeira extensora": "cadeira-extensora",
    "Cadeira flexora": "cadeira-flexora",
    "Leg press": "leg-press-45",
    "Agachamento livre": "agachamento-livre",
    "Panturrilha em pe": "panturrilha-em-pe",
    "Pulley anterior aberta": "pulley-anterior-aberta",
    "Remada articulada neutra": "remada-articulada-neutra",
    "Crucifixo inverso máquina pronada": "crucifixo-inverso-maquina-pronada",
    "Remada baixa peg. neutra": "remada-baixa-peg-neutra",
    "Puxada anterior": "pulley-anterior-aberta",
    "Puxada frente": "pulley-anterior-aberta",
    "Supino inclinado iso articulado deitado (shua)": "supino-inclinado-iso-articulado-deitado-shua",
    "Elevação lateral c/ halter 0º-180º neutra": "elevacao-lateral-c-halter-0-180-neutra",
    "Abdomen Infra (Pingus)": "abdomen-infra",
    "Agachamento Livre Banco": "agachamento-livre-banco",
    "Cadeira Adutora": "cadeira-adutora",
    "Afundo": "afundo",
    "Panturrilha em pé inclinado": "panturrilha-em-pe-inclinado",
    "Abdomen Reto": "abdomen-reto",
    "Elevação Frontal Halteres": "elevacao-frontal-com-halteres",
    "Supino Máquina": "supino-maquina",
    "Desenvolvimento Máquina": "desenvolvimento-maquina",
    "Crucifixo Banco Halteres": "crucifixo-com-halteres-em-banco-plano",
    "Remada Alta Kettlebell": "remada-alta-com-kettlebell",
    "Extensão Lombar Livre": "extensao-lombar",
  };

  if (manualMapping[name]) return manualMapping[name];
  if (manualMapping[name.toLowerCase()]) return manualMapping[name.toLowerCase()];

  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .replace(/\s+/g, "-")           // Espaços para hifens
    .replace(/[^a-z0-9-()]/g, "")   // Remove caracteres especiais, mas mantém parênteses
    .replace(/-+/g, "-")            // Remove hifens duplos
    .trim();
};

/**
 * Retorna a URL do GIF do exercício no repositório do GitHub
 */
export const getExerciseGifUrl = (exerciseName: string): string => {
  const normalized = normalizeExerciseName(exerciseName);
  const urlFriendlyName = encodeURIComponent(normalized);
  return `https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${urlFriendlyName}.gif`;
};

/**
 * Retorna uma lista de URLs possíveis para o GIF (para fallback)
 */
export const getExerciseGifUrlVariations = (exerciseName: string): string[] => {
  const normalized = normalizeExerciseName(exerciseName);
  const original = exerciseName.trim();
  const originalWithHifens = original.replace(/\s+/g, "-");

  const variations = [
    normalized,
    original,
    originalWithHifens,
    original.toLowerCase(),
    original.toLowerCase().replace(/\s+/g, "-")
  ];

  // Remove duplicatas e gera URLs
  const uniqueVariations = Array.from(new Set(variations));
  
  // Tenta tanto jsDelivr quanto GitHub Raw em diferentes pastas e extensões
  const urls: string[] = [];
  const extensions = ['.gif', '.GIF', '.mp4', '.MP4'];
  const folders = ['', 'gifs/'];
  
  uniqueVariations.forEach(v => {
    const encoded = encodeURIComponent(v);
    
    folders.forEach(folder => {
      extensions.forEach(ext => {
        const filename = `${encoded}${ext}`;
        // GitHub Raw
        urls.push(`https://raw.githubusercontent.com/Narok94/tatu-gym-assets/main/${folder}${filename}`);
        // jsDelivr
        urls.push(`https://cdn.jsdelivr.net/gh/Narok94/tatu-gym-assets@main/${folder}${filename}`);
      });
    });
  });
  
  return urls;
};
