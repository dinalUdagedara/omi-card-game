"use client";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { isValidSuit, Suit } from "@/utils/practise/types";

import PlayingCards from "./playing-cards";
import RoundOverMultiplayer from "../round-over/round-over";
import { FinishStateStore } from "@/store/finish-round-state";
import { GameOverDialogMultiplayer } from "../game-over/game-over-multiplayer";

interface GameBoardProps {
  onTrumpSelected: () => void;
  roomName: string;
  userID: Id<"players">;
}

const GameBoardMobileMultiplayer: React.FC<GameBoardProps> = ({
  onTrumpSelected,
  roomName,
  userID,
}) => {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const [isCardsAvailable, setCardsAvailable] = useState<boolean>(false);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const isRoundOver = MultiplayerStateStore((state) => state.roundOver);
  const setRoundOver = MultiplayerStateStore((state) => state.setRoundOver);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const gameOver = MultiplayerStateStore((state) => state.gameOver);

  const gameWon = MultiplayerStateStore((state) => state.gameWon);

  const playingCards = useQuery(api.gameLogic.getPlayingCards, {
    roomName: roomName,
  });

  const playersDecks = useQuery(api.gameLogic.getPlayersDecks, {
    roomName: roomName,
  });

  const trumpSuitInDB = useQuery(api.gameLogic.getTrumpSuit, {
    roomName: roomName,
  });

  const isGameOver = useQuery(api.gameStates.isGameOver, {
    roomName: roomName,
    userid: userID,
  });
  useEffect(() => {
    if (trumpSuitInDB && isValidSuit(trumpSuitInDB)) {
      setSelectedSuit(trumpSuitInDB);
      setTrumpSuit(trumpSuitInDB);
      console.log("suit is selected");
    }
  }, [trumpSuitInDB]);

  useEffect(() => {
    if (playersDecks && playingCards) {
      // Ensure all decks have been loaded
      const hasDecks =
        playersDecks[0]?.deck &&
        playersDecks[1]?.deck &&
        playersDecks[2]?.deck &&
        playersDecks[3]?.deck;
      if (
        hasDecks &&
        (playersDecks[0].deck.length > 0 ||
          playersDecks[1].deck.length > 0 ||
          playersDecks[2].deck.length > 0 ||
          playersDecks[3].deck.length > 0)
      ) {
        setCardsAvailable(true);
      } else {
        setTimeout(() => {
          if (playingCards.length > 0) {
            setCardsAvailable(false);
            setRoundOver(true); // rendering the round over component
            setDialogOpen(true);
          }
        }, 3000);
      }
    }
  }, [playingCards, playersDecks]);

  return (
    <div>
      {isGameOver ? (
        <>
          <GameOverDialogMultiplayer roomName={roomName} userID={userID} />
        </>
      ) : (
        <>
          {isRoundOver ? (
            <>
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
        </>
      )}
    </div>
  );
};

export default GameBoardMobileMultiplayer;
