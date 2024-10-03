"use client";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";


import { motion } from "framer-motion";
import { useEffect } from "react";
const Winner2Multiplayer = () => {
  const myCard = MultiplayerStateStore((state) => state.myCard);
  const opponentCard = MultiplayerStateStore((state) => state.opponentsCard);
  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);

  useEffect(() => {
    setTimeout(() => {
      setWinningCard(null);
    }, 4000);
  }, []);

  return (
    <div>
      <div className="flex flex-col w-full h-full justify-center items-center gap-5">
        {opponentCard && (
          <div>
            <motion.div
              className="flex justify-center items-center w-24 h-36"
              animate={{
                scale: [1, 1.5, 1.5, 1, 1],
                rotate: [0, 0, 180, 180, 0],
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
                animate={{ opacity: 0, y: -200 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                <CardComponentMultiplayer card={opponentCard} />
              </motion.div>
            </motion.div>
            {/* <CardComponentMultiplayer card={opponentCard} /> */}
          </div>
        )}
        <div>
          {myCard && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: -400 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <CardComponentMultiplayer card={myCard} />
            </motion.div>
            // <CardComponentMultiplayer card={myCard} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Winner2Multiplayer;
