import { useCallback } from "react";
import useSound from "use-sound";

// to play mouse hover sound
export const useHoverSound = () => {
  const [playHoverSound] = useSound("assets/audio-files/select.mp3", {
    volume: 1,
  });
  console.log("Hover Sound");
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

// to play Selecting card sound
export const useCardSelectSound = () => {
  const [playCardSelect] = useSound("assets/audio-files/card-select.mp3", {
    volume: 1,
  });
  console.log("Card Sound");
  const playCardSelectSound = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playCardSelect();
      }
    },
    [playCardSelect]
  );

  return { playCardSelect: playCardSelectSound };
};

// to play Selecting Suit sound
export const useSuitSelectSound = () => {
  const [playSuitSelect] = useSound("assets/audio-files/trump-selected.mp3", {
    volume: 1,
  });
  console.log("Suit select Sound");
  const playSuitSelectSound = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playSuitSelect();
      }
    },
    [playSuitSelect]
  );

  return { playSuitSelected: playSuitSelectSound };
};
