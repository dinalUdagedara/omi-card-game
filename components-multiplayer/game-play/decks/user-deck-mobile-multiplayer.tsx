import * as React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cardMultiplayer } from "@/utils/types-multiplayer";
import CardComponentMobileMultiplayer from "@/components-multiplayer/cards/card-mobile-multiplayer";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { checkIfViolationOccured } from "@/utils/multiplayer/game-logic-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

interface UserDeckProps {
  userID: Id<"players">;
  roomName: string;
}

export function UserDeckMobileMultiplayer({ userID, roomName }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const isUserTurn = useStore((state) => state.isUserTurn);
  const setUserTurn = useStore((state) => state.setIsUserTurn);
  const userName = MultiplayerStateStore((state) => state.userName);

  const [myCardDeck, setMyCardDeck] = useState<
    { suit: string; value: string }[] | null
  >(null);

  const myCardSet = useQuery(api.gameStates.getMyCardSet, {
    playerId: userID,
    roomName: roomName,
  });

  const turnPlayerID = useQuery(api.gameLogic.getPlayerTurn, {
    roomName: roomName,
  });

  const noOfPlayingcards = useQuery(api.gameLogic.noOfPlayingCards, {
    roomName: roomName,
  });

  const selectCard = useMutation(api.gameLogic.updatePlayingCards);
  const updateViolation = useMutation(api.gameStates.updateViolationOccured);
  const updatePlayerStatus = useMutation(api.rooms.updatePlayerStatus);
  const turnsuit = useQuery(api.gameLogic.getTurnSuit, {
    roomName: roomName,
  });
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  useEffect(() => {
    if (turnPlayerID) {
      const num = noOfPlayingcards ?? 0;
      if (turnPlayerID === userID && num < 4) {
        setUserTurn(true);
      } else {
        setUserTurn(false);
      }
    }
  }, [turnPlayerID, noOfPlayingcards]);

  async function handleCardSelect(card: cardMultiplayer) {
    // update this player status to "playing"
    updatePlayerStatus({
      status: "playing",
      userId: userID,
    });
    if (myCardSet && turnsuit) {
      const validationOccured = checkIfViolationOccured(
        card,
        myCardSet,
        turnsuit
      );
      if (validationOccured && userName && myTeam) {
        updateViolation({
          roomName: roomName,
          teamNumber: myTeam,
          userName: userName,
          violation: "Played a Diffferent Card from the Turn Suit",
        });
      }
    }
    const userId = userID;
    await selectCard({
      card,
      roomName,
      userId,
    });
  }

  return (
    <div className="h-2 w-96 flex justify-center mr-5 ">
      <div className="flex justify-center">
        {myCardSet?.map((card, index) => {
          const angle = (index - (myCardSet.length - 1) / 2) * 10;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                transform: `rotate(${angle}deg) translateY(-110px)`,
                transformOrigin: "bottom center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -200 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
              >
                <button
                  disabled={!trumpSuit || !isUserTurn}
                  onClick={() => handleCardSelect(card)}
                  className="transform transition-transform duration-200 hover:scale-110 hover:z-10 focus:outline-none rounded-lg"
                >
                  <motion.div
                    className="rounded-lg"
                    initial={{ boxShadow: "none" }}
                    animate={{
                      boxShadow: isUserTurn
                        ? "0 0 12px rgba(254 , 250 ,224 ,1)" // Glowing effect
                        : "none", // No shadow when it's not user's turn
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      repeat: isUserTurn ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <CardComponentMultiplayer card={card} />
                  </motion.div>
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
