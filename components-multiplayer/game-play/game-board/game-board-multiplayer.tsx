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
import { cardMultiplayer } from "@/utils/types-multiplayer";
import { isValidSuit, Suit } from "@/utils/types";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";

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

  const winningCard = useStore((state) => state.winningCard);
  const isSubmitted = useStore((state) => state.isSubmitted);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isGameOver = useStore((state) => state.isGameOver);

  // const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);
  const [myCard, setMyCard] = useState<cardMultiplayer>();
  const [opponentCard, setOpponentCard] = useState<cardMultiplayer>();
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const playingCards = useQuery(api.gameLogic.getPlayingCards, {
    roomName: roomName || "",
  });
  const trumpSuitInDB = useQuery(api.gameLogic.getTrumpSuit, {
    roomName: roomName || "",
  });

  useEffect(() => {
    if (trumpSuitInDB && isValidSuit(trumpSuitInDB)) {
      setSelectedSuit(trumpSuitInDB);
      setTrumpSuit(trumpSuitInDB);
      console.log("suit is selected");
    }
  }, [trumpSuitInDB]);

  useEffect(() => {
    if (playingCards) {
      playingCards.map((cardSet) => {
        if (cardSet.playerId === userID) {
          setMyCard(cardSet.card);
        } else {
          setOpponentCard(cardSet.card);
        }
      });
    }
  }, [playingCards]);
  return (
    <div>
      <div className="flex flex-col w-full h-full justify-between items-center gap-10 ">
        <div>
          {opponentCard && !winningCard && (
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, y: -100 }} // Start  values
              animate={{ opacity: 1, y: 0 }} // end to these values
              transition={{ duration: 0.8, delay: 1.6 }} // Animation duration
            >
              <CardComponentMultiplayer card={opponentCard} />
            </motion.div>
          )}
        </div>

        <div>
          {myCard && !winningCard && (
            <motion.div
              className="flex justify-center items-center"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <CardComponentMultiplayer card={myCard} />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameBoardMobileMultiplayer;
