import * as React from "react";
import { Suit, suitsWithLogos } from "@/utils/practise/types";
import { useStore } from "@/store/state";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const suitAccent: Record<string, string> = {
  hearts: "border-red-500 shadow-[0_0_16px_4px_rgba(239,68,68,0.5)] bg-red-50",
  diamonds: "border-red-400 shadow-[0_0_16px_4px_rgba(248,113,113,0.5)] bg-red-50",
  clubs: "border-gray-700 shadow-[0_0_16px_4px_rgba(55,65,81,0.5)] bg-gray-100",
  spades: "border-gray-800 shadow-[0_0_16px_4px_rgba(17,24,39,0.5)] bg-gray-100",
};

export function SuitSelector() {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  function handleSuitSelected(suit: Suit) {
    setSelectedSuit(suit);
    setTrumpSuit(suit);
  }

  return (
    <div className="flex justify-center gap-3 py-2">
      {suitsWithLogos.map((suit, index) => {
        const isSelected = selectedSuit === suit.suit;
        return (
          <motion.button
            key={index}
            onClick={() => handleSuitSelected(suit.suit)}
            whileTap={{ scale: 0.92 }}
            animate={isSelected ? { scale: 1.12 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`relative flex flex-col items-center justify-center w-20 h-20 rounded-2xl border-2 transition-colors duration-200 cursor-pointer
              ${isSelected ? suitAccent[suit.suit] : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50"}`}
          >
            <Image
              src={suit.logoUrl}
              alt={suit.suit}
              height={44}
              width={44}
              className="rounded-full"
            />
            <span className={`text-xs font-semibold capitalize mt-1 ${
              suit.suit === "hearts" || suit.suit === "diamonds" ? "text-red-500" : "text-gray-800"
            }`}>
              {suit.suit}
            </span>
            {isSelected && (
              <motion.div
                layoutId="suit-indicator"
                className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-500 border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
