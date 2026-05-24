import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import CardComponent from "../../cards/card";
import { Card } from "@/utils/practise/types";
import { SuitSelector } from "../suit-selector";
import { useStore } from "@/store/state";
import { motion } from "framer-motion";
import { SuitSelectorMobile } from "./suit-selector-mobile";

const exampleCards: Card[] = [
  { suit: "clubs", value: "10" },
  { suit: "diamonds", value: "K" },
  { suit: "clubs", value: "J" },
  { suit: "spades", value: "A" },
];

interface SuitDrawerProps {
  userHand: Card[];
  onClose: () => void;
}

export function SuitDrawerMobile({ userHand, onClose }: SuitDrawerProps) {
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);
  const trumpSuit = useStore((state) => state.trumpSuit);

  function handleDeselectSuit() {
    setTrumpSuit(null);
  }

  const suitColor: Record<string, string> = {
    hearts: "bg-red-500 hover:bg-red-600",
    diamonds: "bg-red-400 hover:bg-red-500",
    clubs: "bg-gray-800 hover:bg-gray-900",
    spades: "bg-gray-900 hover:bg-black",
  };

  return (
    <Drawer open={true} onClose={onClose}>
      <DrawerContent className="bg-zinc-950 border-t border-zinc-800">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="flex items-center justify-center gap-2 text-amber-300 text-lg font-bold tracking-wide">
              <span>♛</span>
              <span>Select Trumps</span>
              <span>♛</span>
            </DrawerTitle>
            <p className="text-center text-xs text-zinc-400 mt-1">
              Choose the trump suit for this round
            </p>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="relative flex items-center justify-center h-56">
              {userHand.slice(0, 4).map((card, index) => {
                const angle = (index - (exampleCards.length - 1) / 2) * 30;

                return (
                  <div
                    key={index}
                    className="absolute"
                    style={{
                      transform: `rotate(${angle}deg) translateY(-50px)`,
                      transformOrigin: "bottom center",
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -200 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: index * 0.2 }}
                    >
                      <CardComponent card={card} />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            <div className="bg-zinc-900 rounded-2xl p-3">
              <SuitSelectorMobile />
            </div>
          </div>
          <DrawerFooter className="pt-4">
            <DrawerClose asChild>
              <Button
                onClick={() => {
                  setTrumpSelected(true);
                  onClose();
                }}
                disabled={!trumpSuit}
                className={`w-full h-11 rounded-xl text-sm font-bold tracking-wide text-white transition-all duration-300 ${
                  trumpSuit
                    ? suitColor[trumpSuit] + " shadow-lg"
                    : "bg-gray-600 opacity-50 cursor-not-allowed"
                }`}
              >
                {trumpSuit ? `Set ${trumpSuit.charAt(0).toUpperCase() + trumpSuit.slice(1)} as Trump` : "Select a Suit"}
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
