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
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  cardMultiplayer,
  getWinnerMultiplayer,
} from "@/utils/types-multiplayer";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { motion } from "framer-motion";
import { use, useEffect, useState } from "react";
import Winner1Multiplayer from "./collecting-cards/winner-1-multiplayer";
import Winner2Multiplayer from "./collecting-cards/winner-2-multiplayer";

interface PlayingCardsProps {
  playingCards: {
    playerId: Id<"players">;
    teamInfo: {
      teamNum: number;
      index: number;
    };
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
  const [isCardsGone, setIsCardsGone] = useState<boolean>(false);
  const [cardSet, setCardSet] = useState<cardMultiplayer[] | null>(null);

  const setMyCard = MultiplayerStateStore((state) => state.setMyCard);
  const setOpponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );
  const myCard = MultiplayerStateStore((state) => state.myCard);
  const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);
  const winningCard = MultiplayerStateStore((state) => state.winningCard);
  const teamMemberID = MultiplayerStateStore((state) => state.teamMemberID);
  const opponent_1_ID = MultiplayerStateStore((state) => state.opponent_1_ID);
  const opponent_2_ID = MultiplayerStateStore((state) => state.opponent_2_ID);

  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);
  const incrementPoints = useMutation(api.gameLogic.incrementPlayerPoints);
  const updateTurnWinner = useMutation(api.gameLogic.updateTurnWinner);
  const updatePlayerTurn = useMutation(api.gameLogic.updatePlayerTurn);

  // Query to fetch all players' IDs in the room
  const playersInRoom = useQuery(api.rooms.getAllPlayersIDInTheRoom, {
    roomName: roomName || "",
  });

  const teammateCard = MultiplayerStateStore((state) => state.teamMateCard);
  const opponent1Card = MultiplayerStateStore((state) => state.opponent1Card);
  const opponent2Card = MultiplayerStateStore((state) => state.opponent2Card);

  const setTeammateCard = MultiplayerStateStore(
    (state) => state.setTeammateCard
  );
  const setOpponent1Card = MultiplayerStateStore(
    (state) => state.setOpponent1Card
  );
  const setOpponent2Card = MultiplayerStateStore(
    (state) => state.setOpponent2Card
  );

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
    if (cardSet && cardSet.length > 3) {
      const winningCard = getWinner();
      console.log("Winning Card", winningCard);
      if (winningCard === myCard) {
        incrementPoints({
          roomName: roomName,
          userId: userID,
        });
        updateTurnWinner({
          roomName: roomName,
          userId: userID,
        });
        updatePlayerTurn({
          roomName: roomName,
          userId: userID,
        });
      }
      if (winningCard)
        setTimeout(() => {
          setWinningCard(winningCard);
        }, 1000);
    }
  }, [cardSet]);

  useEffect(() => {
    if (playingCards?.length && playersInRoom?.length) {
      const currentPlayerIndex = playersInRoom.findIndex(
        (card) => card === userID
      );

      if (currentPlayerIndex !== -1) {
        // Find my card
        if (userID) {
          const myCard = playingCards.find(
            (cards) => cards.playerId === userID
          );
          console.log("myCard", myCard);
          if (myCard) {
            setMyCard(myCard.card);
          }
        }

        // Find team member's card
        if (teamMemberID) {
          const teamMemberCard = playingCards.find(
            (cards) => cards.playerId === teamMemberID
          );
          console.log("teamMemberCard", teamMemberCard);
          if (teamMemberCard) {
            setTeammateCard(teamMemberCard.card);
          }
        }

        // Find opponent 1's card
        if (opponent_1_ID) {
          const opponent_1_Card = playingCards.find(
            (cards) => cards.playerId === opponent_1_ID
          );
          console.log("opponent_1_Card", opponent_1_Card);
          if (opponent_1_Card) {
            setOpponent1Card(opponent_1_Card.card);
          }
        }

        // Find opponent 2's card
        if (opponent_2_ID) {
          const opponent_2_Card = playingCards.find(
            (cards) => cards.playerId === opponent_2_ID
          );
          console.log("opponent_2_Card", opponent_2_Card);
          if (opponent_2_Card) {
            setOpponent2Card(opponent_2_Card.card);
          }
        }
      }
    }
  }, [
    playingCards,
    playersInRoom,
    userID,
    teamMemberID,
    opponent_1_ID,
    opponent_2_ID,
  ]);

  return (
    // <div className="flex flex-col w-full h-full justify-between items-center gap-10 ">
    //   {winningCard ? (
    //     <div>
    //       <div className="flex flex-col">
    //         {winningCard === myCard && <Winner1Multiplayer />}
    //         {winningCard === opponentCard && <Winner2Multiplayer />}
    //       </div>
    //     </div>
    //   ) : (
    //     <>
    //       <div>
    //         {opponentCard && !winningCard && (
    //           <motion.div
    //             className="flex justify-center items-center"
    //             initial={{ opacity: 0, y: -100 }} // Start  values
    //             animate={{ opacity: 1, y: 0 }} // end to these values
    //             transition={{ duration: 0.8 }} // Animation duration
    //           >
    //             <CardComponentMultiplayer card={opponentCard} />
    //           </motion.div>
    //         )}
    //       </div>
    //       <div>
    //         {myCard && !winningCard && (
    //           <motion.div
    //             className="flex justify-center items-center"
    //             initial={{ opacity: 0, y: 100 }}
    //             animate={{ opacity: 1, y: 0 }}
    //             transition={{ duration: 0.5 }}
    //           >
    //             <CardComponentMultiplayer card={myCard} />
    //           </motion.div>
    //         )}
    //       </div>
    //     </>
    //   )}
    // </div>

    <div className="relative w-full h-full flex items-center justify-center">
      {/* Teammate Card (Top) */}
      {/* {teammateCard && (
        <motion.div
          className="absolute top-0 flex justify-center"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CardComponentMultiplayer card={teammateCard} /> teamMate
        </motion.div>
      )} */}

      <div className="min-h-80 min-w-60 flex justify-center">
        {teammateCard && !winningCard && (
          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, y: -120 }} // Start  values
            animate={{ opacity: 1, y: -60 }} // end to these values
            transition={{ duration: 0.8 }} // Animation duration
          >
            <CardComponentMultiplayer card={teammateCard} />
          </motion.div>
        )}
      </div>

      {/* Opponent 1 Card (Right) */}
      {/* {opponent1Card && (
        <motion.div
          className="absolute right-0 flex items-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CardComponentMultiplayer card={opponent1Card} /> opponent1
        </motion.div>
      )} */}

      {opponent1Card && !winningCard && (
        <motion.div
          className="absolute right-0 flex items-center"
          initial={{ opacity: 0, x: 50 }} // Start  values
          animate={{ opacity: 1, x: 0 }} // end to these values
          transition={{ duration: 0.8 }} // Animation duration
        >
          <CardComponentMultiplayer card={opponent1Card} />
        </motion.div>
      )}

      {/* Opponent 2 Card (Left) */}
      {opponent2Card && !winningCard && (
        <motion.div
          className="absolute left-0 flex items-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CardComponentMultiplayer card={opponent2Card} />
        </motion.div>
      )}

      {/* My Card (Bottom) */}
      {/* {myCard && (
        <motion.div
          className="absolute bottom-0 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <CardComponentMultiplayer card={myCard} /> my card
        </motion.div>
      )} */}

      {/* {myCard && !winningCard && ( */}
      {myCard && !winningCard && (
        <motion.div
          className="absolute bottom-0 flex justify-center"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <CardComponentMultiplayer card={myCard} />
        </motion.div>
      )}
    </div>
  );
};

export default PlayingCards;
