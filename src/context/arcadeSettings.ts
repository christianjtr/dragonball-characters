import { createContext, use } from "react";

export interface ArcadeSettings {
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const ArcadeSettingsContext = createContext<ArcadeSettings | null>(null);

export const useArcadeSettings = (): ArcadeSettings => {
  const context = use(ArcadeSettingsContext);

  if (!context) {
    throw new Error("useArcadeSettings must be used within an ArcadeSettingsProvider");
  }

  return context;
};
