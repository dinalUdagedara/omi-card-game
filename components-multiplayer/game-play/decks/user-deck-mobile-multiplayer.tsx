import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/utils/types";
import { useStore } from "@/store/state";
import CardComponentMobile from "@/components/cards/card-mobile";

interface UserDeckProps {
  userHand: Card[];
  onCardSelect: (selectedCard: Card) => void;
}

export function UserDeckMobileMultiplayer({
  userHand,
  onCardSelect,
}: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);

  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isUserTurn = useStore((state) => state.isUserTurn);


  return (
    <div className="h-16 w-60 flex justify-center mr-5">
      <div className="bg-black flex justify-center">
        {userHand.map((card, index) => {
          const angle = (index - (userHand.length - 1) / 2) * 10;

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
                  disabled={!trumpSuit}
                  onClick={() => onCardSelect(card)}
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
                    <CardComponentMobile card={card} />{" "}
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
