import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import {
  ArcadeSettingsContext,
  type ArcadeSettings,
} from "./arcadeSettings";

interface ArcadeSettingsProviderProps {
  children: React.ReactNode;
}

const readSoundPreference = (): boolean => {
  try {
    const raw = window.localStorage.getItem(
      ARCADE_CONFIG.storageKeys.settings,
    );

    if (!raw) {
      return false;
    }

    const parsed = JSON.parse(raw) as { soundEnabled?: unknown };
    return parsed.soundEnabled === true;
  } catch {
    return false;
  }
};

export const ArcadeSettingsProvider: React.FC<
  ArcadeSettingsProviderProps
> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(readSoundPreference);

  const toggleSound = useCallback(() => {
    setSoundEnabled((previous) => !previous);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        ARCADE_CONFIG.storageKeys.settings,
        JSON.stringify({ soundEnabled }),
      );
    } catch {
      // Storage can be unavailable in private mode; the app still works.
    }
  }, [soundEnabled]);

  const value = useMemo<ArcadeSettings>(
    () => ({ soundEnabled, toggleSound }),
    [soundEnabled, toggleSound],
  );

  return (
    <ArcadeSettingsContext.Provider value={value}>
      {children}
    </ArcadeSettingsContext.Provider>
  );
};
