import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
  cardMultiplayer,
  getWinnerMultiplayer,
} from "@/utils/multiplayer/types-multiplayer";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Winner1Multiplayer from "./collecting-cards/winner-1-multiplayer";
import Winner2Multiplayer from "./collecting-cards/winner-2-multiplayer";
import Winner3Multiplayer from "./collecting-cards/winner-3-multiplayer";
import Winner4Multiplayer from "./collecting-cards/winner-4-multiplayer";
import CardComponentMobileMultiplayer from "@/components-multiplayer/cards/card-mobile-multiplayer";
import {
  useCollectingCardSound,
  useCardSelectSound,
} from "@/utils/play-sounds";
import { useStore } from "@/store/state";

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
  const getWinnerID = useMutation(api.gameStates.getWinnerID);
  const checkPlayerStatus = useMutation(api.autoPlayingBot.checkPlayerStatus);
  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomName || "",
  });
  const userName = MultiplayerStateStore((state) => state.userName);

  const muted = useStore((state) => state.muted);
  const { playCollectCards } = useCollectingCardSound();
  const { playCardSelect } = useCardSelectSound();

  // playing select card when a card is selected
  useEffect(() => {
    // console.log("playing cards lenght ", playingCards.length);
    if (playingCards.length !== 0) {
      playCardSelect(muted);
    }
  }, [playingCards]);

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

  async function handleWinningCard() {
    if (cardSet && cardSet.length > 3) {
      const winningCard = getWinner();

      if (winningCard) {
        //finding the winner using the winning card
        const winnerID = await getWinnerID({
          roomName: roomName,
          winningCard: winningCard,
        });
        if (winnerID) {
          //Logic to settingWinner only from a one connected player

          const players = roomdataFromDB?.playerUserNames || [];
          const isPlayer1Offline = await checkPlayerStatus({
            roomName: roomName,
            userName: players[0],
          });
          const isPlayer2Offline = await checkPlayerStatus({
            roomName: roomName,
            userName: players[1],
          });
          const isPlayer3Offline = await checkPlayerStatus({
            roomName: roomName,
            userName: players[2],
          });
          const isPlayer4Offline = await checkPlayerStatus({
            roomName: roomName,
            userName: players[3],
          });

          if (!isPlayer1Offline) {
            if (players[0] === userName) {
              console.log(`Player ${players[0]} is Setting Winner.`);
              settingWinner(winnerID);
            }
          } else if (!isPlayer2Offline) {
            if (players[1] === userName) {
              console.log(`Player ${players[1]} is Setting Winner.`);
              settingWinner(winnerID);
            }
          } else if (!isPlayer3Offline) {
            if (players[2] === userName) {
              console.log(`Player ${players[2]} is Setting Winner.`);
              settingWinner(winnerID);
            }
          } else if (!isPlayer4Offline) {
            if (players[3] === userName) {
              console.log(`Player ${players[3]} is Setting Winner.`);
              settingWinner(winnerID);
            }
          }
        }
      }

      if (winningCard)
        setTimeout(() => {
          setWinningCard(winningCard);
          playCollectCards(muted);
        }, 2000);
    }
  }

  function settingWinner(winnerID: Id<"players">) {
    console.log("setting winner", winnerID);

    incrementPoints({
      roomName: roomName,
      userId: winnerID,
    });
    updateTurnWinner({
      roomName: roomName,
      userId: winnerID,
    });
    updatePlayerTurn({
      roomName: roomName,
      userId: winnerID,
    });
  }

  useEffect(() => {
    handleWinningCard();
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
    <div className="flex w-full px-4 lg:py-12 lg:px-28">
      {winningCard ? (
        <>
          <div className="md:w-full md:h-full h-[125px]">
            <div className="flex flex-col">
              {winningCard === myCard && <Winner1Multiplayer />}
              {winningCard === opponent1Card && <Winner2Multiplayer />}
              {winningCard === teammateCard && <Winner3Multiplayer />}
              {winningCard === opponent2Card && <Winner4Multiplayer />}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-row w-full h-full justify-center items-center gap-2  py-10 lg:py-0 ">
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

          <div className="flex flex-col justify-between gap-5 w-full min-h-[175px] z-20 lg:min-h-[250px]">
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
