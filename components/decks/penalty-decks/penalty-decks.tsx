import { Card, exampleCardSet } from "@/utils/practise/types";
import { motion } from "framer-motion";
import PenaltyCardMobile from "@/components/cards/penalty-cards/penalty-card-mobile";

interface UserDeckProps {
  penaltyCardNumber: number;
  reverse?: boolean; //reverse prop
}

export function PenaltyDeckMobile({ penaltyCardNumber, reverse = false }: UserDeckProps) {
  // Conditionally reverse the order of the cards if reverse is true
  const displayedCards = reverse ? [...exampleCardSet].reverse() : exampleCardSet;

  return (
    <div className="h-full w-full flex justify-center items-center p-4 rounded-lg">
      <div className="relative flex justify-center items-center">
        {displayedCards.map((card, index) => {
          // Calculate index for "X" mark depending on reverse
          const cardIndex = reverse ? displayedCards.length - 1 - index : index;
          const shouldMarkCard = cardIndex < displayedCards.length - penaltyCardNumber;

          return (
            <div
              key={index}
              className={`relative transform transition-transform duration-200 hover:shadow-lg`}
              style={{
                marginLeft: index === 0 ? "0" : "-1.7rem",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="">
                  <PenaltyCardMobile />

                  {/* Cross mark overlay */}
                  {shouldMarkCard && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="text-black text-xl font-bold">✕</span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
