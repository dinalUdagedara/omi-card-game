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
import Winner3Multiplayer from "./collecting-cards/winner-3-multiplayer";
import Winner4Multiplayer from "./collecting-cards/winner-4-multiplayer";
import CardComponentMobileMultiplayer from "@/components-multiplayer/cards/card-mobile-multiplayer";

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
  const [cardSet, setCardSet] = useState<cardMultiplayer[] | null>(null);

  const setMyCard = MultiplayerStateStore((state) => state.setMyCard);
  const setOpponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );
  const myCard = MultiplayerStateStore((state) => state.myCard);
  const winningCard = MultiplayerStateStore((state) => state.winningCard);
  const teamMemberID = MultiplayerStateStore((state) => state.teamMemberID);
  const opponent_1_ID = MultiplayerStateStore((state) => state.opponent_1_ID);
  const opponent_2_ID = MultiplayerStateStore((state) => state.opponent_2_ID);
  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);
  const incrementPoints = useMutation(api.gameLogic.incrementPlayerPoints);
  const updateTurnWinner = useMutation(api.gameLogic.updateTurnWinner);
  const updatePlayerTurn = useMutation(api.gameLogic.updatePlayerTurn);
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

  // Query to fetch all players' IDs in the room
  const playersInRoom = useQuery(api.rooms.getAllPlayersIDInTheRoom, {
    roomName: roomName || "",
  });

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
        }, 2000);
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
          if (myCard) {
            setMyCard(myCard.card);
          }
        }

        // Find team member's card
        if (teamMemberID) {
          const teamMemberCard = playingCards.find(
            (cards) => cards.playerId === teamMemberID
          );
          if (teamMemberCard) {
            setTeammateCard(teamMemberCard.card);
          }
        }

        // Find opponent 1's card
        if (opponent_1_ID) {
          const opponent_1_Card = playingCards.find(
            (cards) => cards.playerId === opponent_1_ID
          );
          if (opponent_1_Card) {
            setOpponent1Card(opponent_1_Card.card);
          }
        }

        // Find opponent 2's card
        if (opponent_2_ID) {
          const opponent_2_Card = playingCards.find(
            (cards) => cards.playerId === opponent_2_ID
          );
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
    <div className="flex bg- w-full py-12 px-28">
      {winningCard ? (
        <>
          <div className="w-full h-ful">
            <div className="flex flex-col">
              {winningCard === myCard && <Winner1Multiplayer />}
              {winningCard === opponent1Card && <Winner2Multiplayer />}
              {winningCard === teammateCard && <Winner3Multiplayer />}
              {winningCard === opponent2Card && <Winner4Multiplayer />}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-row w-full h-full justify-center items-center gap-2">
          <div className=" justify-center items-center flex w-full ">
            {opponent2Card && !winningCard && (
              <div className="">
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <CardComponentMobileMultiplayer card={opponent2Card} />
                </motion.div>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-between gap-5 w-full lg:min-h-[250px]">
            <div>
              {teammateCard && !winningCard && (
                <motion.div
                  className="flex justify-center items-center"
                  initial={{ opacity: 0, y: -120 }} // Start  values
                  animate={{ opacity: 1, y: 0 }} // end to these values
                  transition={{ duration: 0.8 }} // Animation duration
                >
                  <CardComponentMobileMultiplayer card={teammateCard} />
                </motion.div>
              )}
            </div>

            <div>
              {myCard && !winningCard && (
                <motion.div
                  className="flex justify-center"
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <CardComponentMobileMultiplayer card={myCard} />
                </motion.div>
              )}
            </div>
          </div>

          <div className="justify-center items-center flex w-full">
            {opponent1Card && !winningCard && (
              <>
                <motion.div
                  className="flex items-center"
                  initial={{ opacity: 0, x: 50 }} // Start  values
                  animate={{ opacity: 1, x: 0 }} // end to these values
                  transition={{ duration: 0.8 }} // Animation duration
                >
                  <CardComponentMobileMultiplayer card={opponent1Card} />
                </motion.div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayingCards;
