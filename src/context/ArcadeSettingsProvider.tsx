import React, { useCallback, useMemo, useState } from "react";
import {
  ArcadeSettingsContext,
  type ArcadeSettings,
} from "./arcadeSettings";

interface ArcadeSettingsProviderProps {
  children: React.ReactNode;
}

export const ArcadeSettingsProvider: React.FC<
  ArcadeSettingsProviderProps
> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleSound = useCallback(() => {
    setSoundEnabled((previous) => !previous);
  }, []);

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
