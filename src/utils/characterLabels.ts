const RACE_LABELS: Record<string, string> = {
  Human: "Humano",
  Saiyan: "Saiyajin",
  Namekian: "Namekiano",
  Majin: "Majin",
  "Frieza Race": "Raza de Freezer",
  Android: "Androide",
  "Jiren Race": "Raza de Jiren",
  God: "Dios",
  Angel: "Ángel",
  Evil: "Malvado",
  Nucleico: "Nucleico",
  "Nucleico benigno": "Nucleico benigno",
  Unknown: "Desconocido",
};

const AFFILIATION_LABELS: Record<string, string> = {
  "Z Fighter": "Guerrero Z",
  "Red Ribbon Army": "Ejército de la Cinta Roja",
  "Namekian Warrior": "Guerrero namekiano",
  Freelancer: "Independiente",
  "Army of Frieza": "Ejército de Freezer",
  "Pride Troopers": "Tropa del Orgullo",
  "Assistant of Vermoud": "Asistente de Vermoud",
  "God Assistant of Beerus": "Asistente divino de Beerus",
  Villain: "Villano",
  Other: "Otro",
};

const GENDER_LABELS: Record<string, string> = {
  Male: "Masculino",
  Female: "Femenino",
  Unknown: "Desconocido",
};

export const getRaceLabel = (race: string): string =>
  RACE_LABELS[race] ?? race;

export const getAffiliationLabel = (affiliation: string): string =>
  AFFILIATION_LABELS[affiliation] ?? affiliation;

export const getGenderLabel = (gender: string): string =>
  GENDER_LABELS[gender] ?? gender;

export const getCharacterStatusLabel = (deletedAt: string | null): string =>
  deletedAt ? "Retirado" : "Activo";

export const getPlanetStatusLabel = (isDestroyed: boolean): string =>
  isDestroyed ? "Destruido" : "Intacto";
