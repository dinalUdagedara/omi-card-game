"use client";
import { motion, AnimatePresence } from "framer-motion";
import CardComponentUserDeck from "@/components/cards/card-user-deck";
import OtherCardComponentUserDeck from "@/components/cards/other-card-user-deck";
import { Card } from "@/utils/practise/types";
import { useStore } from "@/store/state";
import { useHoverSound } from "@/utils/play-sounds";

interface UserHandV2Props {
  userHand: Card[];
  onCardSelect: (index: number) => void;
}

const UserHandV2 = ({ userHand, onCardSelect }: UserHandV2Props) => {
  const trumpSuit         = useStore((s) => s.trumpSuit);
  const selectedCardByUser = useStore((s) => s.selectedCardByUser);
  const isCardsGenerated  = useStore((s) => s.isCardsGenerated);
  const isUserTurn        = useStore((s) => s.isUserTurn);
  const muted             = useStore((s) => s.muted);
  const { playHoverSound } = useHoverSound();

  const canPlay = !selectedCardByUser && !!isCardsGenerated && !!trumpSuit;

  return (
    <div className="flex items-end justify-center w-full">
      <div className="flex items-end">
        {userHand.map((card, index) => {
          const isSelected = selectedCardByUser === card;

          return (
            <motion.button
              key={`${card.suit}-${card.value}-${index}`}
              disabled={!canPlay}
              onClick={() => {
                playHoverSound(muted);
                onCardSelect(index);
              }}
              style={{ marginLeft: index === 0 ? 0 : "-1.75rem" }}
              className="relative focus:outline-none group"
              initial={{ opacity: 0, y: 40, rotateY: 180 }}
              animate={{
                opacity: 1,
                y: isSelected ? -16 : 0,
                rotateY: 0,
                zIndex: isSelected ? 30 : index,
              }}
              transition={{
                opacity: { duration: 0.4, delay: index * 0.06 },
                y: { type: "spring", stiffness: 400, damping: 25 },
                rotateY: { duration: 0.5, delay: index * 0.06 },
              }}
              whileHover={canPlay ? { y: -12, zIndex: 40 } : {}}
              style={{ marginLeft: index === 0 ? 0 : "-1.75rem", transformStyle: "preserve-3d" }}
            >
              {/* Active-turn pulse ring */}
              {isUserTurn && trumpSuit && (
                <motion.div
                  className="absolute inset-0 rounded-lg pointer-events-none"
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(251,191,36,0)",
                      "0 0 10px rgba(251,191,36,0.7)",
                      "0 0 0px rgba(251,191,36,0)",
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.1 }}
                />
              )}

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400 z-50 shadow-sm shadow-amber-400"
                />
              )}

              {trumpSuit ? (
                <CardComponentUserDeck card={card} />
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                >
                  <OtherCardComponentUserDeck />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default UserHandV2;
