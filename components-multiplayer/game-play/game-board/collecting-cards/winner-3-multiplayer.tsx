"use client";
import { CardStore } from "@/store/player-card-state";
import { motion } from "framer-motion";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useEffect } from "react";
import CardComponentMobileMultiplayer from "@/components-multiplayer/cards/card-mobile-multiplayer";
const Winner3Multiplayer = () => {
  const myCard = MultiplayerStateStore((state) => state.myCard);
  const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);
  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);

  const teammateCard = MultiplayerStateStore((state) => state.teamMateCard);
  const opponent1Card = MultiplayerStateStore((state) => state.opponent1Card);
  const opponent2Card = MultiplayerStateStore((state) => state.opponent2Card);

  useEffect(() => {
    setTimeout(() => {
      setWinningCard(null);
    }, 4000);
  }, []);

  return (
    <div>
      {opponent2Card && (
        <div className="flex flex-row w-full h-full justify-center items-center ">
          {opponent2Card && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -200 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <CardComponentMobileMultiplayer card={opponent2Card} />
            </motion.div>
          )}

          <div className="flex flex-col justify-between h-full gap-10 w-full z-20">
            {teammateCard && (
              <motion.div
                className="flex justify-center items-center"
                animate={{
                  scale: [1, 1.5, 1.5, 1, 1],
                  // rotate: [0, 0, 180, 180, 0],
                  borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeatDelay: 1,
                }}
              >
                <motion.div
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -100 }}
                  transition={{ duration: 0.8, delay: 2.0 }}
                >
                  <CardComponentMobileMultiplayer card={teammateCard} />
                </motion.div>
              </motion.div>
            )}

            {myCard && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -200 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                <CardComponentMobileMultiplayer card={myCard} />
              </motion.div>
            )}
          </div>
          {opponent1Card && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -200 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <CardComponentMobileMultiplayer card={opponent1Card} />
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default Winner3Multiplayer;
