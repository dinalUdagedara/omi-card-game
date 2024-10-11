import { Card, exampleCardSet } from "@/utils/types";
import { motion } from "framer-motion";
import PenaltyCard from "@/components/cards/penalty-cards/penalty-card";
import PenaltyCardMobile from "@/components/cards/penalty-cards/penalty-card-mobile";

interface UserDeckProps {
  penaltyCardNumber: number;
}

export function PenaltyDeckMobile({ penaltyCardNumber }: UserDeckProps) {
  const displayedCards = exampleCardSet;

  return (
    <div className="h-full w-full flex justify-center items-center p-6 lg:p-8 rounded-lg">
      <div className="relative flex justify-center items-center">
        {displayedCards.map((card, index) => {
          const shouldMarkCard =
            index < displayedCards.length - penaltyCardNumber;
          return (
            <div
              key={index}
              className={`relative transform transition-transform duration-200 hover:shadow-lg
                          ${index !== 0 ? "ml-[-1.7rem] lg:ml-[-2.9rem]" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div>
                  <div className="hidden lg:flex">
                    <PenaltyCard />
                  </div>
                  <div className="flex lg:hidden">
                    <PenaltyCardMobile />
                  </div>

                  {/* Cross mark overlay */}
                  {shouldMarkCard && (
                    <div className="absolute inset-0 flex justify-center items-center">
                      <span className="text-red-600 text-1xl font-bold">✕</span>
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
