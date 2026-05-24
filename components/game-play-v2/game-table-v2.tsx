"use client";
import { motion, AnimatePresence } from "framer-motion";
import CardComponent from "@/components/cards/card";
import { CardStore } from "@/store/player-card-state";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import { useCardSelectSound } from "@/utils/play-sounds";
import Winner1 from "@/components/game-board/collecting-cards/winner-1";
import Winner2 from "@/components/game-board/collecting-cards/winner-2";
import Winner3 from "@/components/game-board/collecting-cards/winner-3";
import Winner4 from "@/components/game-board/collecting-cards/winner-4";
import ControllerStart from "@/components/game-board/controller-start";
import ControllerNextRound from "@/components/game-board/controller-next-round";

interface GameTableV2Props {
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
  onRestart: () => void;
}

const CardSlot = ({ children, label }: { children: React.ReactNode; label?: string }) => (
  <div className="flex flex-col items-center gap-1">
    {children}
    {label && (
      <span className="text-[9px] uppercase tracking-widest text-zinc-500">{label}</span>
    )}
  </div>
);

const EmptySlot = () => (
  <div className="w-[72px] h-[96px] rounded-lg border border-dashed border-zinc-700/50 bg-emerald-900/20" />
);

const GameTableV2 = ({ onStart, onNextStart, onShuffleAgain, onRestart }: GameTableV2Props) => {
  const [isCardsGone, setIsCardsGone] = useState(false);

  const player_1_card = CardStore((s) => s.player_1_card);
  const player_2_card = CardStore((s) => s.player_2_card);
  const player_3_card = CardStore((s) => s.player_3_card);
  const player_4_card = CardStore((s) => s.player_4_card);

  const winningCard    = useStore((s) => s.winningCard);
  const isSubmitted    = useStore((s) => s.isSubmitted);
  const isCardsGenerated = useStore((s) => s.isCardsGenerated);
  const isGameOver     = useStore((s) => s.isGameOver);
  const roundWinners   = useStore((s) => s.roundWinners);
  const muted          = useStore((s) => s.muted);
  const { playCardSelect } = useCardSelectSound();

  useEffect(() => {
    setIsCardsGone(false);
    if (isSubmitted) {
      const t = setTimeout(() => setIsCardsGone(true), 3000);
      return () => clearTimeout(t);
    }
  }, [isSubmitted]);

  const showControls = !isCardsGenerated;
  const showNextRound = isCardsGone && isSubmitted;

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full rounded-3xl overflow-hidden"
      style={{
        background: "radial-gradient(ellipse at center, #1a5c2a 0%, #0f3d1a 60%, #0a2910 100%)",
        boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), inset 0 0 20px rgba(0,0,0,0.4)",
        border: "10px solid #78350f",
        outline: "3px solid #451a03",
      }}
    >
      {/* Felt texture overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.05) 2px,
            rgba(0,0,0,0.05) 4px
          )`,
        }}
      />

      {/* Inner wooden rim highlight */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{ boxShadow: "inset 0 2px 6px rgba(255,200,100,0.12), inset 0 -2px 6px rgba(0,0,0,0.3)" }}
      />

      {/* Card play area */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-4 w-full px-6 py-4">
        {isGameOver ? (
          <div className="text-amber-300 text-xl font-bold tracking-wide">Game Over</div>
        ) : winningCard ? (
          isCardsGone ? (
            showNextRound && (
              <div className="flex justify-center">
                <ControllerNextRound onNextStart={onNextStart} />
              </div>
            )
          ) : (
            <div className="w-full">
              {winningCard === player_1_card && <Winner1 />}
              {winningCard === player_2_card && <Winner2 />}
              {winningCard === player_3_card && <Winner3 />}
              {winningCard === player_4_card && <Winner4 />}
            </div>
          )
        ) : (
          <>
            {showControls && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2">
                <ControllerStart onStart={onStart} onShuffleAgain={onShuffleAgain} />
              </div>
            )}

            {/* 4-card cross layout */}
            <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-2 w-full max-w-xs">
              {/* Top — P3 */}
              <div className="col-start-2 row-start-1">
                <AnimatePresence>
                  {player_3_card ? (
                    <motion.div
                      key="p3"
                      initial={{ opacity: 0, y: -40 }}
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

              {/* Left — P4 */}
              <div className="col-start-1 row-start-2">
                <AnimatePresence>
                  {player_4_card ? (
                    <motion.div
                      key="p4"
                      initial={{ opacity: 0, x: -40 }}
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

              {/* Center — decorative logo */}
              <div className="col-start-2 row-start-2 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full border border-amber-700/30 bg-emerald-900/40 flex items-center justify-center">
                  <span className="text-amber-600/60 text-lg">♠</span>
                </div>
              </div>

              {/* Right — P2 */}
              <div className="col-start-3 row-start-2">
                <AnimatePresence>
                  {player_2_card ? (
                    <motion.div
                      key="p2"
                      initial={{ opacity: 0, x: 40 }}
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

              {/* Bottom — P1 (user) */}
              <div className="col-start-2 row-start-3">
                <AnimatePresence>
                  {player_1_card ? (
                    <motion.div
                      key="p1"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <CardComponent card={player_1_card} />
                    </motion.div>
                  ) : (
                    <EmptySlot />
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GameTableV2;
