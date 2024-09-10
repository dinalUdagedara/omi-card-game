"use client";
import { CardStore } from "@/store/player-card-state";
import CardComponent from "../../../cards/card";
import { motion } from "framer-motion";
import CardComponentMobile from "@/components/cards/card-mobile";
const Winner1Mobile = () => {
  const player_1_card = CardStore((state) => state.player_1_card);
  const player_2_card = CardStore((state) => state.player_2_card);
  const player_3_card = CardStore((state) => state.player_3_card);
  const player_4_card = CardStore((state) => state.player_4_card);

  return (
    <div>
      {player_4_card && (
        <div className="flex flex-row w-full h-full justify-center items-center">
          {player_4_card && (
            <motion.div
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 0, y: 200 }}
              transition={{ duration: 0.8, delay: 2.0 }}
            >
              <CardComponentMobile card={player_4_card} />
            </motion.div>
          )}

          <div className="flex flex-col justify-between h-full gap-10 w-full">
            {player_3_card && (
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: 400 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                <CardComponentMobile card={player_3_card} />
              </motion.div>
            )}

            {player_1_card && (
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
                  animate={{ opacity: 0, y: 200 }}
                  transition={{ duration: 0.8, delay: 2.0 }}
                >
                  <CardComponentMobile card={player_1_card} />
                </motion.div>
              </motion.div>
            )}
          </div>
          {player_2_card && (
            <>
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: 200 }}
                transition={{ duration: 0.8, delay: 2.0 }}
              >
                <CardComponentMobile card={player_2_card} />
              </motion.div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Winner1Mobile;
