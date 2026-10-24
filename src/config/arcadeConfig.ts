export const ARCADE_CONFIG = {
  roster: {
    pageSize: 100,
    cacheTtlMs: 60 * 60 * 1000,
  },
  detail: {
    cacheTtlMs: 5 * 60 * 1000,
    prefetchDelayMs: 120,
    maxConcurrentPrefetches: 2,
  },
  audio: {
    volume: 0.045,
    musicVolume: 0.14,
  },
} as const;
