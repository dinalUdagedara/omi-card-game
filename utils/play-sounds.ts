import { useCallback } from "react";
import useSound from "use-sound";

// to play mouse hover sound
export const useHoverSound = () => {
  const [playHoverSound] = useSound("/assets/audio-files/select.mp3", {
    volume: 0.2,
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
  const [playClickButton] = useSound("/assets/audio-files/click-button.mp3", {
    volume: 0.6,
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

// to play sound when collecting cards
export const useCollectingCardSound = () => {
  const [playCollectCards] = useSound("/assets/audio-files/woosh.mp3", {
    volume: 0.5,
  });

  const playCollectingCardSound = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playCollectCards();
      }
    },
    [playCollectCards]
  );
  return { playCollectCards: playCollectingCardSound };
};

// to play when round won
export const useRoundWonSound = () => {
  const [playRoundWon] = useSound("/assets/audio-files/game-won.mp3", {
    volume: 0.6,
  });

  const playRoundOverMusic = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playRoundWon();
      }
    },
    [playRoundWon]
  );
  return { playRoundWon: playRoundOverMusic };
};

// to play when round lose
export const useRoundLoseSound = () => {
  const [playRoundLose] = useSound("/assets/audio-files/game-lose.mp3", {
    volume: 0.6,
  });

  const playRoundLoseMusic = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playRoundLose();
      }
    },
    [playRoundLose]
  );
  return { playRoundLose: playRoundLoseMusic };
};

// to play Selecting card sound
export const useCardSelectSound = () => {
  const [playCardSelect] = useSound("/assets/audio-files/card-select.mp3", {
    volume: 1,
  });

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
  const [playSuitSelect] = useSound("/assets/audio-files/trump-selected.mp3", {
    volume: 1,
  });

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

export const useDealtingCardSound = () => {
  const [playDealtCards] = useSound("/assets/audio-files/card-dealting.mp3");

  const playDealtingCardSound = useCallback(
    (muted: boolean) => {
      if (!muted) {
        playDealtCards();
      }
    },
    [playDealtCards]
  );
  return { playDealtCards: playDealtingCardSound };
};
