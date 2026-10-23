const RACE_ACCENTS: Record<string, string> = {
  Human: "#0e8aa0",
  Saiyan: "#d97706",
  Namekian: "#3d8f4e",
  Majin: "#b0436a",
  "Frieza Race": "#7b5bd6",
  Android: "#0f7f8f",
  "Jiren Race": "#c94b4b",
  God: "#c9780f",
  Angel: "#3f8fbf",
  Evil: "#8f2f55",
  Nucleico: "#2f8f5b",
  "Nucleico benigno": "#4a9e4f",
  Unknown: "#476f7c",
};

export const getCharacterAccent = (race: string): string =>
  RACE_ACCENTS[race] ?? "var(--arcade-cyan)";
