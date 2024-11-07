"use client";
import { CardStore } from "@/store/player-card-state";
import CardComponent from "../../cards/card";
import { motion } from "framer-motion";
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
import {
  useCardSelectSound,
  useHoverSound,
  useCollectingCardSound,
} from "@/utils/play-sounds";

interface GameBoardProps {
  onRestart: () => void;
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
}

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
  const { playHoverSound } = useHoverSound();
  const { playCardSelect } = useCardSelectSound();

  useEffect(() => {
    setIsCardsGone(false);
    if (isSubmitted) {
      const timer = setTimeout(() => {
        setIsCardsGone(true);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  return (
    <div>
      {isGameOver ? (
        <>
          <div className="flex justify-center gap-10">
            <div>
              {gameWinner === 1 ? (
                <GameOverDialog onRestart={onRestart} />
              ) : (
                <GameOverDialogLose onRestart={onRestart} />
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex justify-center gap-10">
            {!isCardsGenerated && (
              <div>
                <ControllerStart
                  onStart={onStart}
                  onShuffleAgain={onShuffleAgain}
                />
              </div>
            )}
          </div>

          <div>
            {winningCard && !isGameOver ? (
              <div>
                {isCardsGone ? (
                  <div className="flex justify-center">
                    {isSubmitted && (
                      <div>
                        <ControllerNextRound onNextStart={onNextStart} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {winningCard === player_1_card && <Winner1 />}
                    {winningCard === player_2_card && <Winner2 />}
                    {winningCard === player_3_card && <Winner3 />}
                    {winningCard === player_4_card && <Winner4 />}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row w-full h-full justify-between items-center px-20">
                <div className="w-1/3">
                  {player_4_card && !winningCard && (
                    <motion.div
                      className="flex justify-center items-center"
                      initial={{ opacity: 0, x: -100 }} // Start  values
                      animate={{ opacity: 1, x: 0 }} // End values
                      transition={{ duration: 0.8, delay: 1.6 }} // Animation duration
                      onAnimationStart={() => {
                        const duration = 1.0 * 1000; // Convert seconds to milliseconds
                        setTimeout(() => {
                          playCardSelect(muted); // Play the sound just before animation ends
                        }, duration - 100); // 100ms before animation ends
                      }}
                    >
                      <CardComponent card={player_4_card} />
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-10  w-1/3">
                  <div className="">
                    {player_3_card && !winningCard && (
                      <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }} // Adding delay for animation
                        onAnimationStart={() => {
                          const duration = 0.8 * 1000;
                          setTimeout(() => {
                            playCardSelect(muted);
                          }, duration - 100);
                        }}
                      >
                        <CardComponent card={player_3_card} />
                      </motion.div>
                    )}
                  </div>
                  <div className="">
                    {player_1_card && !winningCard && (
                      <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CardComponent card={player_1_card} />
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="w-1/3">
                  {player_2_card && !winningCard && (
                    <motion.div
                      className="flex justify-center items-center"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                      onAnimationStart={() => {
                        const duration = 0.5 * 1000;
                        setTimeout(() => {
                          playCardSelect(muted);
                        }, duration - 100);
                      }}
                    >
                      <CardComponent card={player_2_card} />
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default GameBoard;
