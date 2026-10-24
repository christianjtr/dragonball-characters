import { useEffect, useRef } from "react";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import { useArcadeSettings } from "@context/arcadeSettings";

const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");
const MUSIC_SRC = `${BASE_PATH}/audio/dragon-ball-romantic-ageru-yo.mp4`;

export const useArcadeMusic = (): void => {
  const { soundEnabled } = useArcadeSettings();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.preload = "none";
    audio.volume = ARCADE_CONFIG.audio.musicVolume;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    if (!soundEnabled) {
      audio.pause();
      return;
    }

    const music = audio;
    let cancelled = false;

    function removeRetryListeners() {
      window.removeEventListener("pointerdown", handleFirstInteraction);
      window.removeEventListener("keydown", handleFirstInteraction);
    }

    function handleFirstInteraction() {
      if (cancelled) {
        return;
      }

      void music.play().then(removeRetryListeners).catch(() => {
        // Autoplay can be blocked until the next user gesture.
      });
    }

    handleFirstInteraction();
    window.addEventListener("pointerdown", handleFirstInteraction);
    window.addEventListener("keydown", handleFirstInteraction);

    return () => {
      cancelled = true;
      removeRetryListeners();
      music.pause();
    };
  }, [soundEnabled]);
};
