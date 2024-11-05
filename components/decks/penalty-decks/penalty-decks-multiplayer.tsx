import { Card, exampleCardSet } from "@/utils/types";
import { motion } from "framer-motion";
import PenaltyCard from "@/components-multiplayer/cards/penalty-cards/penalty-cards-multiplayer";
import PenaltyCardMultiplayerMobile from "@/components-multiplayer/cards/penalty-cards/penalty-cards-mobile-multiplayer";

interface UserDeckProps {
  penaltyCardNumber: number;
  reverse?: boolean; //reverse prop
}

export function PenaltyDeckMobile({
  penaltyCardNumber,
  reverse = false,
}: UserDeckProps) {
  // Conditionally reverse the order of the cards if reverse is true
  const displayedCards = reverse
    ? [...exampleCardSet].reverse()
    : exampleCardSet;

  return (
    <div className="h-full w-full flex justify-center items-center p-6 lg:p-8 rounded-lg">
      <div className="relative flex justify-center items-center">
        {displayedCards.map((card, index) => {
          // Calculate index for "X" mark depending on reverse
          const cardIndex = reverse ? displayedCards.length - 1 - index : index;
          const shouldMarkCard =
            cardIndex < displayedCards.length - penaltyCardNumber;

          return (
            <div
              key={index}
              className={`relative transform transition-transform duration-200 hover:shadow-lg
                          ${index !== 0 ? "ml-[-1.7rem] lg:ml-[-2.9rem]" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, x: reverse ? 200 : -200 }} // Animation direction changes based on reverse
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div>
                  <div className="hidden lg:flex">
                    <PenaltyCard />
                  </div>
                  <div className="flex lg:hidden">
                    <PenaltyCardMultiplayerMobile />
                  </div>

                  {/* Cross mark overlay */}
                  {shouldMarkCard && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="text-black text-1xl font-bold">✕</span>
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
