import * as React from "react";
import { Suit, suitsWithLogos } from "@/utils/practise/types";
import { useStore } from "@/store/state";
import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const suitAccent: Record<string, string> = {
  hearts: "border-red-500 shadow-[0_0_14px_3px_rgba(239,68,68,0.5)] bg-red-50",
  diamonds: "border-red-400 shadow-[0_0_14px_3px_rgba(248,113,113,0.5)] bg-red-50",
  clubs: "border-gray-700 shadow-[0_0_14px_3px_rgba(55,65,81,0.5)] bg-gray-100",
  spades: "border-gray-800 shadow-[0_0_14px_3px_rgba(17,24,39,0.5)] bg-gray-100",
};

export function SuitSelectorMobile() {
  const [selectedSuit, setSelectedSuit] = useState<Suit | null>(null);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  function handleSuitSelected(suit: Suit) {
    setSelectedSuit(suit);
    setTrumpSuit(suit);
  }

  return (
    <div className="flex justify-center gap-2 py-2">
      {suitsWithLogos.map((suit, index) => {
        const isSelected = selectedSuit === suit.suit;
        return (
          <motion.button
            key={index}
            onClick={() => handleSuitSelected(suit.suit)}
            whileTap={{ scale: 0.9 }}
            animate={isSelected ? { scale: 1.1 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`relative flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 transition-colors duration-200 cursor-pointer
              ${isSelected ? suitAccent[suit.suit] : "border-gray-300 bg-white hover:border-gray-400"}`}
          >
            <Image
              src={suit.logoUrl}
              alt={suit.suit}
              height={36}
              width={36}
              className="rounded-full"
            />
            <span className={`text-[10px] font-semibold capitalize mt-0.5 ${
              suit.suit === "hearts" || suit.suit === "diamonds" ? "text-red-500" : "text-gray-800"
            }`}>
              {suit.suit}
            </span>
            {isSelected && (
              <motion.div
                className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white"
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
