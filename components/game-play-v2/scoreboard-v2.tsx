"use client";
import { useStore } from "@/store/state";
import Image from "next/image";
import { motion } from "framer-motion";

const suitSymbol: Record<string, { symbol: string; color: string }> = {
  hearts:   { symbol: "♥", color: "text-red-500" },
  diamonds: { symbol: "♦", color: "text-red-400" },
  clubs:    { symbol: "♣", color: "text-zinc-200" },
  spades:   { symbol: "♠", color: "text-zinc-200" },
};

interface PenaltyBarProps {
  count: number;
  reverse?: boolean;
}

const PenaltyBar = ({ count, reverse }: PenaltyBarProps) => {
  const slots = Array.from({ length: 10 });
  return (
    <div className={`flex gap-0.5 ${reverse ? "flex-row-reverse" : "flex-row"}`}>
      {slots.map((_, i) => (
        <div
          key={i}
          className={`h-2 w-3 rounded-sm transition-all duration-300 ${
            i < count ? "bg-amber-500" : "bg-zinc-700"
          }`}
        />
      ))}
    </div>
  );
};

const ScoreboardV2 = () => {
  const team1Points      = useStore((s) => s.team1Points);
  const team2Points      = useStore((s) => s.team2Points);
  const trumpSuit        = useStore((s) => s.trumpSuit);
  const team1Penalty     = useStore((s) => s.team_1_penaltyCards);
  const team2Penalty     = useStore((s) => s.team_2_penaltyCards);

  const trump = trumpSuit ? suitSymbol[trumpSuit] : null;

  return (
    <div className="flex flex-col items-center gap-2 select-none">
      {/* Score card */}
      <div className="flex items-center gap-3 bg-zinc-900/90 backdrop-blur-sm border border-amber-800/40 rounded-2xl px-5 py-3 shadow-lg">
        {/* Team 1 score */}
        <div className="flex flex-col items-center min-w-[48px]">
          <motion.span
            key={team1Points}
            initial={{ scale: 1.4, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-white tabular-nums"
          >
            {team1Points}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mt-0.5">
            Ours
          </span>
        </div>

        {/* Trump divider */}
        <div className="flex flex-col items-center gap-1 px-3 border-x border-zinc-700">
          {trump ? (
            <motion.span
              key={trumpSuit}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`text-3xl leading-none ${trump.color}`}
            >
              {trump.symbol}
            </motion.span>
          ) : (
            <div className="w-8 h-8 rounded-full bg-zinc-700 animate-pulse" />
          )}
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-semibold">
            Trump
          </span>
        </div>

        {/* Team 2 score */}
        <div className="flex flex-col items-center min-w-[48px]">
          <motion.span
            key={team2Points}
            initial={{ scale: 1.4, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#ffffff" }}
            transition={{ duration: 0.4 }}
            className="text-3xl font-bold text-white tabular-nums"
          >
            {team2Points}
          </motion.span>
          <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold mt-0.5">
            Theirs
          </span>
        </div>
      </div>

      {/* Penalty bars */}
      <div className="flex items-center gap-2 w-full px-1">
        <PenaltyBar count={team1Penalty} />
        <span className="text-[9px] text-zinc-500 whitespace-nowrap">lives</span>
        <PenaltyBar count={team2Penalty} reverse />
      </div>
    </div>
  );
};

export default ScoreboardV2;
