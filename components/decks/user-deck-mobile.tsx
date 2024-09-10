import * as React from "react";
import CardComponent from "../cards/card";
import { Card } from "@/utils/types";
import { useStore } from "@/store/state";
import { motion } from "framer-motion";
import CardComponentMobile from "../cards/card-mobile";

interface UserDeckProps {
  userHand: Card[];
  onCardSelect: (cardIndex: number) => void;
}

export function UserDeckMobile({ userHand, onCardSelect }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);

  return (
    <div className="h-24 w-60">
      <div className="relative ">
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
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <button
                  disabled={
                    !!selectedCardByUser || !isCardsGenerated || !trumpSuit
                  }
                  onClick={() => onCardSelect(index)}
                  className="transform transition-transform duration-200 hover:scale-110 hover:z-10 hover:shadow-lg"
                >
                  <CardComponent card={card} />
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
