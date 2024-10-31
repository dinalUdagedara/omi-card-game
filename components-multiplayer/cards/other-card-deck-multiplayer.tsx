"use client";
import * as React from "react";
import { motion } from "framer-motion";
import OtherCardComponentMultiplayer from "./other-card-multiplayer";
import { cardMultiplayer } from "@/utils/types-multiplayer";
import { useDealtingCardSound } from "@/utils/play-sounds";
import { useStore } from "@/store/state";
import { useEffect } from "react";

interface UserDeckProps {
  userHand: cardMultiplayer[];
}

export function OtherDecksMultiplayer({ userHand }: UserDeckProps) {
  const muted = useStore((state) => state.muted);
  const { playDealtCards } = useDealtingCardSound();

  useEffect(() => {
    if (userHand.length > 7) {
      playDealtCards(muted);
    }
  }, [userHand, muted]);
  return (
    <div className="h-full lg:w-full max-w-20 md:max-w-40 lg:max-w-full flex justify-center items-center  p-2 rounded-lg ">
      <div className="relative flex justify-center items-center">
        {userHand.map((card, index) => (
          <div
            key={index}
            className={`relative transform transition-transform duration-200  hover:shadow-lg `}
            style={{
              marginLeft: index === 0 ? "0" : "-2rem",
            }}
          >
            <motion.div
              initial={{ opacity: 0, x: -200 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="">
                <OtherCardComponentMultiplayer />
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
