import { useCallback } from "react";
import useSound from "use-sound";

// to play mouse hover sound
export const useHoverSound = () => {
  const [playHoverSound] = useSound("assets/audio-files/hover.mp3", {
    volume: 1,
  });

  const playHoverSoundWithCheck = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playHoverSound();
      }
    },
    [playHoverSound]
  );

  return { playHoverSound: playHoverSoundWithCheck };
};
