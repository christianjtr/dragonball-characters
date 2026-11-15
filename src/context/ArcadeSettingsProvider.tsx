import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArcadeSettingsContext,
  type ArcadeSettings,
} from "./arcadeSettings";

interface ArcadeSettingsProviderProps {
  children: React.ReactNode;
}

const EFFECTS_STORAGE_KEY = "dragonball-arcade:effects-enabled";
const MUSIC_STORAGE_KEY = "dragonball-arcade:music-enabled";

const readStoredFlag = (key: string): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(key) === "true";
  } catch {
    return false;
  }
};

const writeStoredFlag = (key: string, value: boolean): void => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Storage can be unavailable in private browsing or restricted contexts.
  }
};

export const ArcadeSettingsProvider: React.FC<
  ArcadeSettingsProviderProps
> = ({ children }) => {
  const [effectsEnabled, setEffectsEnabled] = useState(() =>
    readStoredFlag(EFFECTS_STORAGE_KEY),
  );
  const [musicEnabled, setMusicEnabled] = useState(() =>
    readStoredFlag(MUSIC_STORAGE_KEY),
  );

  useEffect(() => {
    writeStoredFlag(EFFECTS_STORAGE_KEY, effectsEnabled);
  }, [effectsEnabled]);

  useEffect(() => {
    writeStoredFlag(MUSIC_STORAGE_KEY, musicEnabled);
  }, [musicEnabled]);

  const toggleEffects = useCallback(() => {
    setEffectsEnabled((previous) => !previous);
  }, []);

  const toggleMusic = useCallback(() => {
    setMusicEnabled((previous) => !previous);
  }, []);

  const soundEnabled = effectsEnabled || musicEnabled;

  const toggleSound = useCallback(() => {
    const next = !soundEnabled;

    setEffectsEnabled(next);
    setMusicEnabled(next);
  }, [soundEnabled]);

  const value = useMemo<ArcadeSettings>(
    () => ({
      soundEnabled,
      effectsEnabled,
      musicEnabled,
      toggleSound,
      toggleEffects,
      toggleMusic,
    }),
    [
      effectsEnabled,
      musicEnabled,
      soundEnabled,
      toggleEffects,
      toggleMusic,
      toggleSound,
    ],
  );

  return (
    <ArcadeSettingsContext.Provider value={value}>
      {children}
    </ArcadeSettingsContext.Provider>
  );
};
