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
import { motion } from "framer-motion";
import { useStore } from "@/store/state";
import { use, useEffect, useState } from "react";
import Winner1 from "@/components/game-board.tsx/collecting-cards/winner-1";
import Winner1Multiplayer from "./collecting-cards/winner-1-multiplayer";
import Winner2Multiplayer from "./collecting-cards/winner-2-multiplayer";

interface PlayingCardsProps {
  playingCards: {
    playerId: Id<"players">;
    card: {
      suit: string;
      value: string;
    };
  }[];
  trumps: string;
  roomName: string;
  userID: Id<"players">;
}

const PlayingCards: React.FC<PlayingCardsProps> = ({
  playingCards,
  roomName,
  userID,
  trumps,
}) => {
  //   const [myCard, setMyCard] = useState<cardMultiplayer>();
  //   const [opponentCard, setOpponentCard] = useState<cardMultiplayer>();
  //   const [winningCard, setWinningCard] = useState<cardMultiplayer>();
  const [isCardsGone, setIsCardsGone] = useState<boolean>(false);
  const [cardSet, setCardSet] = useState<cardMultiplayer[]>();

  const setMyCard = MultiplayerStateStore((state) => state.setMyCard);
  const setOpponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );
  const myCard = MultiplayerStateStore((state) => state.myCard);
  const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);

  const winningCard = MultiplayerStateStore((state) => state.winningCard);
  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);

  useEffect(() => {
    if (playingCards) {
      playingCards.map((cardSet) => {
        if (cardSet.playerId === userID) {
          setMyCard(cardSet.card);
        } else {
          setOpponentCard(cardSet.card);
        }
      });
      // Add all playing cards to the cardSet state
      setCardSet(playingCards.map((cardEntry) => cardEntry.card));
    }
  }, [playingCards]);

  const turnsuit = useQuery(api.gameLogic.getTurnSuit, {
    roomName: roomName,
  });

  function getWinner() {
    if (cardSet && trumps && turnsuit) {
      const winningCard = getWinnerMultiplayer(cardSet, trumps, turnsuit);
      return winningCard;
    }
  }

  useEffect(() => {
    if (cardSet && cardSet.length > 1) {
      const winningCard = getWinner();
      console.log("Winning Card", winningCard);
      if (winningCard)
        setTimeout(() => {
          setWinningCard(winningCard);
        }, 3000);
    }
  }, [cardSet]);

  return (
    <div className="flex flex-col w-full h-full justify-between items-center gap-10 ">
      {winningCard ? (
        <div>
          <div className="flex flex-col">
            {winningCard === myCard && <Winner1Multiplayer />}
            {winningCard === opponentCard && <Winner2Multiplayer />}
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default PlayingCards;
