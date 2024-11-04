import * as React from "react";
import { motion } from "framer-motion";
import { Card } from "@/utils/types";
import { useStore } from "@/store/state";
import CardComponentMobile from "../cards/card-mobile";
import { useHoverSound } from "@/utils/play-sounds";

interface UserDeckProps {
  userHand: Card[];
  onCardSelect: (cardIndex: number) => void;
}

export function UserDeckMobile({ userHand, onCardSelect }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isUserTurn = useStore((state) => state.isUserTurn);
  const muted = useStore((state) => state.muted);
  const { playHoverSound } = useHoverSound();

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
                  disabled={
                    !!selectedCardByUser || !isCardsGenerated || !trumpSuit
                  }
                  onClick={() => {
                    playHoverSound(muted);
                    onCardSelect(index);
                  }}
                  className="transform transition-transform duration-200 hover:scale-110 hover:z-10 focus:outline-none"
                >
                  {" "}
                  <motion.div
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
