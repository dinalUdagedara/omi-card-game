import { Card, exampleCardSet } from "@/utils/types";
import { motion } from "framer-motion";
import PenaltyCardMobile from "@/components/cards/penalty-cards/penalty-card";

interface UserDeckProps {
  penaltyCardNumber: number;
}

export function PenaltyDeckMobile({ penaltyCardNumber }: UserDeckProps) {
  const displayedCards = exampleCardSet.slice(0, penaltyCardNumber);

  return (
    <div className="h-full w-full flex justify-center items-center p-4 rounded-lg">
      <div className="relative flex justify-center items-center">
        {displayedCards.map((card, index) => (
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
              <button className="">
                <PenaltyCardMobile />
              </button>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
