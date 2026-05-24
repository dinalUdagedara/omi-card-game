"use client";
import { useStore } from "@/store/state";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const suitSymbol: Record<string, { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "text-red-400" },
  diamonds: { symbol: "♦", color: "text-red-400" },
  clubs:    { symbol: "♣", color: "text-zinc-200" },
  spades:   { symbol: "♠", color: "text-zinc-200" },
};

interface InfoPillProps {
  label: string;
  suit: string | null;
}

const SuitPill = ({ label, suit }: InfoPillProps) => {
  const info = suit ? suitSymbol[suit] : null;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-12 h-12 rounded-full bg-zinc-900/80 border border-zinc-700/60 flex items-center justify-center shadow-inner overflow-hidden">
        <AnimatePresence mode="wait">
          {suit ? (
            <motion.div
              key={suit}
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative w-8 h-8"
            >
              <Image
                src={`/assets/suits/${suit}.png`}
                alt={suit}
                fill
                className="object-contain p-0.5"
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-7 h-7 rounded-full bg-zinc-700 animate-pulse"
            />
          )}
        </AnimatePresence>
      </div>
      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-medium">
        {label}
      </span>
    </div>
  );
};

interface InfoStripV2Props {
  avatarSrc: string;
  roundNumber: number;
  turnNumber: number;
}

const InfoStripV2 = ({ avatarSrc, roundNumber, turnNumber }: InfoStripV2Props) => {
  const trumpSuit = useStore((s) => s.trumpSuit);
  const turnSuit  = useStore((s) => s.turnSuit);

  return (
    <div className="flex items-center gap-4 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/60 rounded-2xl px-5 py-3 shadow-lg">
      {/* Turn suit */}
      <SuitPill label="This trick" suit={turnSuit} />

      {/* Divider */}
      <div className="w-px h-10 bg-zinc-700/60" />

      {/* User avatar + round info */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative w-12 h-12 rounded-full border-2 border-amber-700/50 overflow-hidden bg-zinc-800 shadow-md">
          <Image src={avatarSrc} alt="You" fill className="object-cover" />
        </div>
        <div className="flex gap-2 text-[9px] uppercase tracking-widest text-zinc-500">
          <span>R{roundNumber}</span>
          <span className="text-zinc-700">·</span>
          <span>T{turnNumber}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-10 bg-zinc-700/60" />

      {/* Trump suit */}
      <SuitPill label="Trumps" suit={trumpSuit} />
    </div>
  );
};

export default InfoStripV2;
