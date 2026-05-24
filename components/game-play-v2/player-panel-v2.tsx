"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Card } from "@/utils/practise/types";

interface PlayerPanelV2Props {
  name: string;
  avatarSrc: string;
  cardCount: number;
  isActive: boolean;
  /** Layout orientation: top/bottom uses horizontal card fan, left/right uses vertical */
  position: "top" | "left" | "right";
}

const FaceDownCard = () => (
  <div className="w-9 h-12 rounded-md bg-gradient-to-br from-red-900 via-red-800 to-red-950 border border-red-700/60 shadow-sm" />
);

const PlayerPanelV2 = ({
  name,
  avatarSrc,
  cardCount,
  isActive,
  position,
}: PlayerPanelV2Props) => {
  const isHorizontal = position === "top";

  return (
    <div
      className={`flex ${
        isHorizontal ? "flex-col items-center gap-2" : "flex-col items-center gap-2"
      }`}
    >
      {/* Card fan */}
      <div
        className={`relative flex ${
          isHorizontal ? "flex-row" : "flex-col"
        } items-center`}
      >
        {Array.from({ length: Math.min(cardCount, 8) }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: isHorizontal ? -20 : 0, y: isHorizontal ? 0 : -10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            style={{
              marginLeft: isHorizontal && i > 0 ? "-20px" : undefined,
              marginTop: !isHorizontal && i > 0 ? "-28px" : undefined,
            }}
          >
            <FaceDownCard />
          </motion.div>
        ))}
      </div>

      {/* Avatar + name */}
      <div className="flex flex-col items-center gap-1">
        <motion.div
          animate={
            isActive
              ? {
                  boxShadow: [
                    "0 0 0px rgba(251,191,36,0)",
                    "0 0 16px rgba(251,191,36,0.8)",
                    "0 0 0px rgba(251,191,36,0)",
                  ],
                }
              : { boxShadow: "0 0 0px rgba(251,191,36,0)" }
          }
          transition={{ duration: 1.2, repeat: isActive ? Infinity : 0 }}
          className="rounded-full"
        >
          <div className="relative w-12 h-12 rounded-full border-2 border-amber-700/60 overflow-hidden bg-zinc-800">
            <Image src={avatarSrc} alt={name} fill className="object-cover" />
          </div>
        </motion.div>

        <div
          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-colors ${
            isActive
              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              : "bg-zinc-800/80 text-zinc-400 border border-zinc-700/40"
          }`}
        >
          {name}
        </div>
      </div>
    </div>
  );
};

export default PlayerPanelV2;
