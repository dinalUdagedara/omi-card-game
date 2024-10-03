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
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  cardMultiplayer,
  getWinnerMultiplayer,
} from "@/utils/types-multiplayer";
import { isValidSuit, Suit } from "@/utils/types";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import PlayingCards from "./playing-cards";

interface GameBoardProps {
  onRestart: () => void;
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
  onTrumpSelected: () => void;
  roomName: string;
  userID: Id<"players">;
}

const GameBoardMobileMultiplayer: React.FC<GameBoardProps> = ({
  onRestart,
  onStart,
  onNextStart,
  onShuffleAgain,
  onTrumpSelected,
  roomName,
  userID,
}) => {
  const [isCardsGone, setIsCardsGone] = useState<boolean>(false);
  const gameWinner = useStore((state) => state.gameWinner);

  const isSubmitted = useStore((state) => state.isSubmitted);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isGameOver = useStore((state) => state.isGameOver);

  // const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);

  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [isCardsAvailable, setCardsAvailable] = useState<boolean>(false);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setmyCard = MultiplayerStateStore((state) => state.setMyCard);
  const setopponentCard = MultiplayerStateStore((state) => state.setOpponentCard);

  const playingCards = useQuery(api.gameLogic.getPlayingCards, {
    roomName: roomName,
  });

  const trumpSuitInDB = useQuery(api.gameLogic.getTrumpSuit, {
    roomName: roomName,
  });

  useEffect(() => {
    if (trumpSuitInDB && isValidSuit(trumpSuitInDB)) {
      setSelectedSuit(trumpSuitInDB);
      setTrumpSuit(trumpSuitInDB);
      console.log("suit is selected");
    }
  }, [trumpSuitInDB]);

  useEffect(() => {
    if (playingCards && playingCards.length > 0) {
      setCardsAvailable(true);

      
    }
  }, [playingCards]);

  return (
    <div>
      {isCardsAvailable && playingCards && trumpSuitInDB && (
        <PlayingCards
          trumps={trumpSuitInDB}
          playingCards={playingCards}
          roomName={roomName}
          userID={userID}
        />
      )}
    </div>
  );
};

export default GameBoardMobileMultiplayer;
