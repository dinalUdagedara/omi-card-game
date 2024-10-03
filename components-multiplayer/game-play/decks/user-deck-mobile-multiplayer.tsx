import * as React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cardMultiplayer } from "@/utils/types-multiplayer";
import CardComponentMobileMultiplayer from "@/components-multiplayer/cards/card-mobile-multiplayer";

interface UserDeckProps {
  userID: Id<"players">;
  roomName: string;
}

export function UserDeckMobileMultiplayer({ userID, roomName }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const isUserTurn = useStore((state) => state.isUserTurn);
  const setUserTurn = useStore((state) => state.setIsUserTurn);

  const [myCardDeck, setMyCardDeck] = useState<
    { suit: string; value: string }[] | null
  >(null);

  const myCardSet = useQuery(api.gameStates.getMyCardSet, {
    playerId: userID,
    roomName: roomName || "",
  });

  const turnPlayerID = useQuery(api.gameLogic.getPlayerTurn, {
    roomName: roomName || "",
  });

  const selectCard = useMutation(api.gameLogic.updatePlayingCards);

  useEffect(() => {
    if (turnPlayerID) {
      if (turnPlayerID === userID) {
        setUserTurn(true);
      } else {
        setUserTurn(false);
      }
    }
  }, [turnPlayerID]);

  async function handleCardSelect(card: cardMultiplayer) {
    console.log("Selected Card", card);
    const userId = userID;
    await selectCard({
      card,
      roomName,
      userId,
    });
  }

  return (
    <div className="h-16 w-60 flex justify-center mr-5">
      <div className="bg-black flex justify-center">
        {myCardSet?.map((card, index) => {
          const angle = (index - (myCardSet.length - 1) / 2) * 10;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                transform: `rotate(${angle}deg) translateY(-40px)`,
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
                  className="transform transition-transform duration-200 hover:scale-110 hover:z-10 focus:outline-none"
                >
                  {" "}
                  <motion.div
                    initial={{ boxShadow: "none" }}
                    animate={{
                      boxShadow: isUserTurn
                        ? "0 0 12px rgba(255, 255, 0, 0.8)" // Glowing effect
                        : "none", // No shadow when it's not user's turn
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      repeat: isUserTurn ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <CardComponentMobileMultiplayer card={card} />{" "}
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
