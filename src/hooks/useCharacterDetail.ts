import { useEffect } from "react";
import { useRoster } from "@context/rosterContext";

export const useCharacterDetail = (id?: number | string) => {
  const numericId = Number(id);
  const hasValidId = Number.isFinite(numericId);
  const { byId, details, prefetchDetail } = useRoster();

  const summary = hasValidId ? byId.get(numericId) : undefined;
  const entry = hasValidId ? details[numericId] : undefined;

  useEffect(() => {
    if (!hasValidId) {
      return;
    }

    void prefetchDetail(numericId, { priority: true });
  }, [hasValidId, numericId, prefetchDetail]);

  return {
    id: hasValidId ? numericId : undefined,
    summary,
    detail: entry?.data,
    status: entry?.status ?? "idle",
    error: entry?.error,
    retry: () => {
      if (hasValidId) {
        void prefetchDetail(numericId, { force: true, priority: true });
      }
    },
  };
};
