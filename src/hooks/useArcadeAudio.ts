import { useCallback, useEffect, useRef } from "react";
import { ARCADE_CONFIG } from "@config/arcadeConfig";
import { useArcadeSettings } from "@context/arcadeSettings";

export type ArcadeCue =
  | "move"
  | "confirm"
  | "back"
  | "error"
  | "lock-in"
  | "transform";

interface CueSpec {
  frequency: number;
  duration: number;
  type: OscillatorType;
  slideTo?: number;
}

const CUES: Record<ArcadeCue, CueSpec[]> = {
  move: [{ frequency: 320, duration: 0.04, type: "square" }],
  confirm: [
    { frequency: 440, duration: 0.06, type: "square" },
    { frequency: 660, duration: 0.08, type: "square" },
  ],
  back: [{ frequency: 220, duration: 0.08, type: "triangle", slideTo: 140 }],
  error: [{ frequency: 120, duration: 0.16, type: "sawtooth", slideTo: 70 }],
  "lock-in": [
    { frequency: 330, duration: 0.05, type: "square" },
    { frequency: 494, duration: 0.06, type: "square" },
    { frequency: 740, duration: 0.12, type: "triangle" },
  ],
  transform: [
    { frequency: 180, duration: 0.12, type: "sawtooth", slideTo: 360 },
    { frequency: 540, duration: 0.16, type: "triangle", slideTo: 1080 },
  ],
};

type AudioContextConstructor = typeof AudioContext;

const getAudioContextConstructor = (): AudioContextConstructor | undefined => {
  const legacyWindow = window as unknown as {
    webkitAudioContext?: AudioContextConstructor;
  };

  return window.AudioContext ?? legacyWindow.webkitAudioContext;
};

export const useArcadeAudio = () => {
  const { effectsEnabled } = useArcadeSettings();
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    return () => {
      void contextRef.current?.close();
      contextRef.current = null;
    };
  }, []);

  const play = useCallback(
    (cue: ArcadeCue) => {
      if (!effectsEnabled) {
        return;
      }

      const AudioContextConstructor = getAudioContextConstructor();

      if (!AudioContextConstructor) {
        return;
      }

      const context = contextRef.current ?? new AudioContextConstructor();
      contextRef.current = context;

      if (context.state === "suspended") {
        void context.resume();
      }

      let startAt = context.currentTime;

      CUES[cue].forEach((spec) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();

        oscillator.type = spec.type;
        oscillator.frequency.setValueAtTime(spec.frequency, startAt);

        if (spec.slideTo) {
          oscillator.frequency.exponentialRampToValueAtTime(
            spec.slideTo,
            startAt + spec.duration,
          );
        }

        gain.gain.setValueAtTime(ARCADE_CONFIG.audio.volume, startAt);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          startAt + spec.duration,
        );

        oscillator.connect(gain).connect(context.destination);
        oscillator.start(startAt);
        oscillator.stop(startAt + spec.duration);

        startAt += spec.duration;
      });
    },
    [effectsEnabled],
  );

  return play;
};
