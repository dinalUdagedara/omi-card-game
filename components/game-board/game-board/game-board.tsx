"use client";
import { CardStore } from "@/store/player-card-state";
import CardComponent from "../../cards/card";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/state";
import Winner4 from "../collecting-cards/winner-4";
import Winner2 from "../collecting-cards/winner-2";
import Winner3 from "../collecting-cards/winner-3";
import Winner1 from "../collecting-cards/winner-1";
import ControllerStart from "../controller-start";
import ControllerNextRound from "../controller-next-round";
import { useEffect, useState } from "react";
import { GameOverDialog } from "../game-over/game-over-win";
import { GameOverDialogLose } from "../game-over/game-over-lose";
import { useCardSelectSound } from "@/utils/play-sounds";

interface GameBoardProps {
  onRestart: () => void;
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
}

const EmptySlot = () => (
  <div
    className="rounded-lg"
    style={{
      width: "62px",
      height: "86px",
      border: "1.5px dashed rgba(217,119,6,0.2)",
      background: "rgba(5,31,13,0.4)",
    }}
  />
);

const GameBoard: React.FC<GameBoardProps> = ({
  onRestart,
  onStart,
  onNextStart,
  onShuffleAgain,
}) => {
  const [isCardsGone, setIsCardsGone] = useState<boolean>(false);
  const player_1_card = CardStore((state) => state.player_1_card);
  const player_2_card = CardStore((state) => state.player_2_card);
  const player_3_card = CardStore((state) => state.player_3_card);
  const player_4_card = CardStore((state) => state.player_4_card);

  const winningCard = useStore((state) => state.winningCard);
  const isSubmitted = useStore((state) => state.isSubmitted);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const isGameOver = useStore((state) => state.isGameOver);
  const gameWinner = useStore((state) => state.gameWinner);
  const muted = useStore((state) => state.muted);
  const { playCardSelect } = useCardSelectSound();

  useEffect(() => {
    setIsCardsGone(false);
    if (isSubmitted) {
      const timer = setTimeout(() => setIsCardsGone(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  if (isGameOver) {
    return (
      <div className="flex justify-center gap-10">
        {gameWinner === 1 ? (
          <GameOverDialog onRestart={onRestart} />
        ) : (
          <GameOverDialogLose onRestart={onRestart} />
        )}
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-center">
      {/* ── Oval table ── */}
      <div className="relative w-full" style={{ height: "300px" }}>

        {/* Outer gold rim + green felt */}
        <div
          className="absolute pointer-events-none"
          style={{
            inset: "4% 2%",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 40%, #1a7a3a 0%, #0d4520 50%, #051f0d 100%)",
            boxShadow: `
              0 0 0 7px #d97706,
              0 0 0 11px #92400e,
              0 0 0 14px #1c0a00,
              0 20px 70px rgba(0,0,0,0.85),
              inset 0 0 80px rgba(0,0,0,0.45)
            `,
          }}
        >
          {/* Diamond cloth weave */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50%",
              opacity: 0.06,
              backgroundImage:
                "repeating-linear-gradient(45deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1px, transparent 0, transparent 50%)",
              backgroundSize: "8px 8px",
            }}
          />
          {/* Inner vignette */}
          <div
            className="absolute inset-0"
            style={{
              borderRadius: "50%",
              boxShadow: "inset 0 0 60px rgba(0,0,0,0.4)",
            }}
          />
        </div>

        {/* Center fleur-de-lis ornament */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[5]">
          <div
            className="flex items-center justify-center"
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              border: "1px solid rgba(217,119,6,0.22)",
              background: "rgba(5,31,13,0.55)",
              boxShadow: "0 0 18px rgba(217,119,6,0.08)",
            }}
          >
            <span style={{ color: "rgba(217,119,6,0.42)", fontSize: "24px" }}>
              ⚜
            </span>
          </div>
        </div>

        {/* ── Winning-card flyout animations ── */}
        {winningCard && !isCardsGone && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            {winningCard === player_1_card && <Winner1 />}
            {winningCard === player_2_card && <Winner2 />}
            {winningCard === player_3_card && <Winner3 />}
            {winningCard === player_4_card && <Winner4 />}
          </div>
        )}

        {/* ── Next-round control ── */}
        {isCardsGone && isSubmitted && (
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <ControllerNextRound onNextStart={onNextStart} />
          </div>
        )}

        {/* ── Card play area (no winner yet) ── */}
        {!winningCard && (
          <>
            {/* Start control */}
            {!isCardsGenerated && (
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <ControllerStart onStart={onStart} onShuffleAgain={onShuffleAgain} />
              </div>
            )}

            {/* Player 3 — top center (teammate) */}
            <div className="absolute top-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
              <span
                className="text-[8px] uppercase tracking-widest font-medium"
                style={{ color: "rgba(217,119,6,0.55)" }}
              >
                Ally
              </span>
              <AnimatePresence>
                {player_3_card ? (
                  <motion.div
                    key="p3"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    onAnimationStart={() =>
                      setTimeout(() => playCardSelect(muted), 300)
                    }
                  >
                    <CardComponent card={player_3_card} />
                  </motion.div>
                ) : (
                  <EmptySlot />
                )}
              </AnimatePresence>
            </div>

            {/* Player 1 — bottom center (user) */}
            <div className="absolute bottom-[5%] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10">
              <AnimatePresence>
                {player_1_card ? (
                  <motion.div
                    key="p1"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardComponent card={player_1_card} />
                  </motion.div>
                ) : (
                  <EmptySlot />
                )}
              </AnimatePresence>
              <span
                className="text-[8px] uppercase tracking-widest font-medium"
                style={{ color: "rgba(217,119,6,0.7)" }}
              >
                You
              </span>
            </div>

            {/* Player 4 — left middle
                left-[13%] ensures all four card corners stay inside the ellipse
                (verified: (13%−2%) / semi-major ≈ 0.84, ±card-half-height / semi-minor ≈ 0.29 → sum < 1) */}
            <div className="absolute left-[13%] top-1/2 -translate-y-1/2 z-10">
              <AnimatePresence>
                {player_4_card ? (
                  <motion.div
                    key="p4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    onAnimationStart={() =>
                      setTimeout(() => playCardSelect(muted), 700)
                    }
                  >
                    <CardComponent card={player_4_card} />
                  </motion.div>
                ) : (
                  <EmptySlot />
                )}
              </AnimatePresence>
            </div>

            {/* Player 2 — right middle */}
            <div className="absolute right-[13%] top-1/2 -translate-y-1/2 z-10">
              <AnimatePresence>
                {player_2_card ? (
                  <motion.div
                    key="p2"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    onAnimationStart={() =>
                      setTimeout(() => playCardSelect(muted), 500)
                    }
                  >
                    <CardComponent card={player_2_card} />
                  </motion.div>
                ) : (
                  <EmptySlot />
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameBoard;
