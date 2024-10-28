import { useCallback } from "react";
import useSound from "use-sound";

// to play mouse hover sound
export const useHoverSound = () => {
  const [playHoverSound] = useSound("assets/audio-files/select.mp3", {
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

// to play Click sound
export const useClickSound = () => {
  const [playClickButton] = useSound("assets/audio-files/click-button.mp3", {
    volume: 1,
  });

  const playClickSoundWithCheck = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playClickButton();
      }
    },
    [playClickButton]
  );

  return { playClickButton: playClickSoundWithCheck };
};
