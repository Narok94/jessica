
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
    "Remada unilateral": "remada-unilateral-com-halteres",
    "Remada curvada": "remada-curvada-com-barra",
    "Desenvolvimento halteres": "desenvolvimento-com-halteres",
    "Supino reto halteres": "supino-reto-com-halteres",
    "Supino inclinado halteres": "supino-inclinado-com-halteres",
    "Triceps testa": "triceps-testa-com-barra-w",
    "Triceps frances": "triceps-frances-com-halteres",
    "Stiff": "stiff-com-barra",
    "Levantamento terra": "levantamento-terra",
    "Puxada aberta": "puxada-aberta-no-pulley",
    "Rosca direta": "Rosca direta",
    "Rosca martelo": "Rosca martelo",
    "Rosca scott": "Rosca scott",
    "Rosca alternada": "Rosca alternada",
    "Triceps corda": "Triceps corda",
    "Triceps testa": "Triceps testa",
    "Triceps pulley": "Triceps pulley",
    "Supino reto": "Supino reto",
    "Supino inclinado": "Supino inclinado",
    "Crucifixo": "Crucifixo",
    "Elevação lateral": "Elevação lateral",
    "Elevação frontal": "Elevação frontal",
    "Desenvolvimento": "Desenvolvimento",
    "Remada baixa": "Remada baixa",
    "Remada unilateral": "Remada unilateral",
    "Puxada frente": "Puxada frente",
    "Agachamento": "Agachamento",
    "Leg press": "Leg press",
    "Extensora": "Extensora",
    "Flexora": "Flexora",
    "Panturrilha": "Panturrilha",
    "Stiff": "Stiff",
    "Levantamento terra": "Levantamento terra",
    "Afundo": "Afundo",
    "Passada": "Passada",
    "Abdominal": "Abdominal",
    "Prancha": "Prancha"
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
export const getExerciseGifUrlVariations = (exerciseName: string, originalUrl?: string): string[] => {
  const normalized = normalizeExerciseName(exerciseName);
  const original = exerciseName.trim();
  const originalWithHifens = original.replace(/\s+/g, "-");

  const variations = [
    normalized,
    original,
    original.replace(/\s+/g, "-"),
    original.replace(/\s+/g, "_"),
    original.toLowerCase(),
    original.toLowerCase().replace(/\s+/g, "-"),
    original.toLowerCase().replace(/\s+/g, "_"),
    original.replace(/\./g, ""),
    original.replace(/\./g, "").replace(/\s+/g, "-"),
    original.replace(/\./g, "").replace(/\s+/g, "_"),
    original.toLowerCase().replace(/\./g, "").replace(/\s+/g, "-"),
    original.toLowerCase().replace(/\./g, "").replace(/\s+/g, "_"),
    original.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-"),
    original.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_"),
    original.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, ""),
    original.replace(/\(.*\)/g, "").trim(),
    original.replace(/\(.*\)/g, "").trim().replace(/\s+/g, "-"),
    original.replace(/\(.*\)/g, "").trim().replace(/\s+/g, "_"),
    original.split('-')[0].trim(),
    original.split('-')[0].trim().replace(/\s+/g, "-"),
    original.split('-')[0].trim().replace(/\s+/g, "_"),
    original.split('(')[0].trim(),
    original.split('(')[0].trim().replace(/\s+/g, "-"),
    original.split('(')[0].trim().replace(/\s+/g, "_"),
    original.replace(/\s+/g, "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, "-").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, "_").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\./g, "").replace(/\s+/g, "-"),
    original.replace(/\./g, "").replace(/\s+/g, "_"),
    original.replace(/\./g, "").replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, ""),
    original.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "%20"),
    original.toLowerCase().replace(/\s+/g, "%20"),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, ""),
    original.replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.toLowerCase().replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
    original.replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, ""),
    original.replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, ""),
    original.replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, ""),
    original.replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, ""),
    original.toLowerCase().replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, ""),
    original.replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-"),
    original.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-"),
    original.replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_"),
    original.toLowerCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_"),
    original.replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, "."),
    original.toLowerCase().replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, "."),
    original.replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " "),
    original.toLowerCase().replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " "),
    original.replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.toLowerCase().replace(/\s+/g, " ").replace(/[^a-zA-Z0-9 ]/g, "").replace(/\s+/g, " ").trim(),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
    original.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-]/g, "").replace(/-+/g, "-").replace(/^-|-$/g, ""),
    original.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.toLowerCase().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_]/g, "").replace(/_+/g, "_").replace(/^_|_$/g, ""),
    original.replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.toLowerCase().replace(/\s+/g, ".").replace(/[^a-zA-Z0-9.]/g, "").replace(/\.+/g, ".").replace(/^\.|\.$/g, ""),
    original.replace(/\./g, ""),
    original.toLowerCase().replace(/\./g, ""),
    original.split("-")[0].trim(),
    original.split("(")[0].trim(),
    original.split("-")[0].toLowerCase().trim(),
    original.split("(")[0].toLowerCase().trim(),
    original.replace(/\s+/g, ""),
    original.toLowerCase().replace(/\s+/g, ""),
    original.replace(/[^a-zA-Z0-9]/g, ""),
    original.toLowerCase().replace(/[^a-zA-Z0-9]/g, ""),
  ];

  // Adiciona variações de primeiras palavras
  const words = original.split(/\s+/);
  if (words.length > 0) {
    variations.push(words[0].toLowerCase());
  }
  if (words.length > 1) {
    variations.push(words[0] + "-" + words[1]);
    variations.push(words[0].toLowerCase() + "-" + words[1].toLowerCase());
    variations.push(words[0] + "_" + words[1]);
    variations.push(words[0].toLowerCase() + "_" + words[1].toLowerCase());
  }
  
  // Variação simplificada (remove termos comuns)
  const simplified = original.replace(/\s+(aberta|fechada|pronada|supinada|neutra|com|no|na|de|do|da|barra|halter|halteres|maquina|cross|polia|corda|triangulo|reta|w)\s+/gi, " ");
  if (simplified !== original) {
    variations.push(simplified.replace(/\s+/g, "-").toLowerCase());
    variations.push(simplified.replace(/\s+/g, "_").toLowerCase());
  }

  // Variação que remove termos do final
  const cleanEnd = original.replace(/\s+(barra|halter|halteres|maquina|cross|polia|corda|triangulo|reta|w|aberta|fechada|pronada|supinada|neutra)$/gi, "");
  if (cleanEnd !== original) {
    variations.push(cleanEnd.replace(/\s+/g, "-").toLowerCase());
    variations.push(cleanEnd.replace(/\s+/g, "_").toLowerCase());
  }

  // Variação com pontos
  variations.push(original.replace(/\s+/g, "."));
  variations.push(original.toLowerCase().replace(/\s+/g, "."));
  variations.push(original.replace(/\s+/g, ".").toLowerCase());

  // Variação sem espaços
  variations.push(original.replace(/\s+/g, "").toLowerCase());
  variations.push(original.replace(/\s+/g, ""));

  // Remove duplicatas e gera URLs
  const uniqueVariations = Array.from(new Set(variations));
  
  // Tenta tanto jsDelivr quanto GitHub Raw em diferentes pastas e extensões
  const urls: string[] = [];
  const extensions = ['.gif', '.GIF', '.mp4', '.MP4', '.webp', '.WEBP', '.png', '.PNG', '.jpg', '.JPG', '.jpeg', '.JPEG'];
  const folders = ['', 'assets/', 'gifs/', 'assets/gifs/', 'exercises/', 'Exercises/'];
  
  const finalVariations = Array.from(new Set(uniqueVariations));

  // Adiciona variações de capitalização para cada variação única
  const allNamingVariations: string[] = [];
  finalVariations.forEach(v => {
    allNamingVariations.push(v);
    allNamingVariations.push(v.toLowerCase());
    // Se tiver espaços, tenta com hífens e sublinhados mantendo a capitalização
    if (v.includes(' ')) {
      allNamingVariations.push(v.replace(/\s+/g, '-'));
      allNamingVariations.push(v.replace(/\s+/g, '_'));
    }
  });

  const trulyUniqueVariations = Array.from(new Set(allNamingVariations));

  trulyUniqueVariations.forEach(v => {
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

  // Adiciona a URL original se fornecida e se não estiver já na lista
  if (originalUrl && !urls.includes(originalUrl)) {
    urls.push(originalUrl);
  }
  
  return urls;
};
