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
import RoundOverMultiplayer from "../round-over/round-over";
import { FinishStateStore } from "@/store/finish-round-state";

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
  const setopponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const setwonCallingTrumps = FinishStateStore(
    (state) => state.setwonCallingTrumps
  );

  const isRoundOver = MultiplayerStateStore((state) => state.roundOver);
  const setRoundOver = MultiplayerStateStore((state) => state.setRoundOver);

  const playingCards = useQuery(api.gameLogic.getPlayingCards, {
    roomName: roomName,
  });

  const playersDecks = useQuery(api.gameLogic.getPlayersDecks, {
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
    if (playersDecks)
      if (
        playingCards &&
        (playersDecks[0].deck.length > 0 || playersDecks[1].deck.length > 0)
      ) {
        console.log("cards Available")
        setCardsAvailable(true);
      } else {
        setTimeout(() => {
          console.log("cards NOT Available")
          setCardsAvailable(false);
          setRoundOver(true); // rendering the round over component
          setDialogOpen(true);
        }, 3000);
      }
  }, [playingCards]);

  return (
    <div>
      {isRoundOver ? (
        <>
          {isRoundOver}
          <RoundOverMultiplayer userID={userID} roomName={roomName} />
        </>
      ) : (
        <>
          {isCardsAvailable && playingCards && trumpSuitInDB && (
            <PlayingCards
              trumps={trumpSuitInDB}
              playingCards={playingCards}
              roomName={roomName}
              userID={userID}
            />
          )}
        </>
      )}
    </div>
  );
};

export default GameBoardMobileMultiplayer;
