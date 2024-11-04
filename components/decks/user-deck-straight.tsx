import * as React from "react";
import CardComponent from "../cards/card";
import { Card } from "@/utils/types";
import { useStore } from "@/store/state";
import OtherCardComponent from "../cards/other-card";
import { motion } from "framer-motion";
import CardComponentUserDeck from "../cards/card-user-deck";
import OtherCardComponentUserDeck from "../cards/other-card-user-deck";

interface UserDeckProps {
  userHand: Card[];
  onCardSelect: (cardIndex: number) => void;
}

export function UserDeckStraight({ userHand, onCardSelect }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const isTrumpSelected = useStore((state) => state.trumpSelected);
  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isUserTurn = useStore((state) => state.isUserTurn);

  return (
    <div className="w-full flex justify-center ">
      <div>
        {userHand.map((card, index) => (
          <button
            key={index}
            style={{
              marginLeft: index === 0 ? "0" : "-2rem",
            }}
            disabled={!!selectedCardByUser || !isCardsGenerated || !trumpSuit}
            onClick={() => onCardSelect(index)}
            className="mx-2 transform transition-transform duration-200 hover:scale-110 hover:z-10 hover:shadow-lg"
          >
            {trumpSuit ? (
              <motion.div
                initial={{ opacity: 0, y: 20, rotateY: 180 }}
                animate={{ opacity: 1, y: 0, rotateY: 0 }}
                transition={{ duration: 0.8, delay: index * 0.3 }}
                style={{ transformStyle: "preserve-3d" }}
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
                  <CardComponentUserDeck card={card} />
                </motion.div>
              </motion.div>
            ) : (
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -200 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <OtherCardComponentUserDeck />
                </motion.div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
