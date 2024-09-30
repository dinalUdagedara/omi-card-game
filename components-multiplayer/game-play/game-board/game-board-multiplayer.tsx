"use client";
import { CardStore } from "@/store/player-card-state";
import { motion } from "framer-motion";
import { useStore } from "@/store/state";

import { useEffect, useState } from "react";

import Winner1Mobile from "@/components/game-board.tsx/collecting-cards/mobile/winner-1-mobile";
import Winner2Mobile from "@/components/game-board.tsx/collecting-cards/mobile/winner-2-mobile";
import Winner3Mobile from "@/components/game-board.tsx/collecting-cards/mobile/winner-3-mobile";
import Winner4Mobile from "@/components/game-board.tsx/collecting-cards/mobile/winner-4-mobile";
import CardComponentMobile from "@/components/cards/card-mobile";
import { GameOverDialogLose } from "@/components/game-board.tsx/game-over/game-over-lose";
import { GameOverDialog } from "@/components/game-board.tsx/game-over/game-over-win";
import ControllerStart from "@/components/game-board.tsx/controller-start";
import ControllerNextRound from "@/components/game-board.tsx/controller-next-round";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

interface GameBoardProps {
  onRestart: () => void;
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
}

const GameBoardMobileMultiplayer: React.FC<GameBoardProps> = ({
  onRestart,
  onStart,
  onNextStart,
  onShuffleAgain,
}) => {
  const [isCardsGone, setIsCardsGone] = useState<boolean>(false);
  const player_1_card = CardStore((state) => state.player_1_card);
  const player_2_card = CardStore((state) => state.player_2_card);
  const player_3_card = CardStore((state) => state.player_3_card);
  const player_4_card = CardStore((state) => state.player_4_card);
  const gameWinner = useStore((state) => state.gameWinner);

  const winningCard = useStore((state) => state.winningCard);
  const isSubmitted = useStore((state) => state.isSubmitted);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isGameOver = useStore((state) => state.isGameOver);
  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);

  return (
    <div>
      <p>
        Opponent's Card :{opponentCard?.suit} of{" "}
        {opponentCard?.value}
      </p>

      <p>
        Selected Card : {selectedCardByUser?.suit} of{" "}
        {selectedCardByUser?.value}
      </p>
    </div>
  );
};

export default GameBoardMobileMultiplayer;
