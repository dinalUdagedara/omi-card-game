"use client";
import { CardStore } from "@/store/player-card-state";
import { motion } from "framer-motion";
import { useStore } from "@/store/state";
import ControllerStart from "../controller-start";
import ControllerNextRound from "../controller-next-round";
import { useEffect, useState } from "react";
import { GameOverDialog } from "../game-over";
import Winner1Mobile from "../collecting-cards/mobile/winner-1-mobile";
import Winner2Mobile from "../collecting-cards/mobile/winner-2-mobile";
import Winner3Mobile from "../collecting-cards/mobile/winner-3-mobile";
import Winner4Mobile from "../collecting-cards/mobile/winner-4-mobile";
import CardComponentMobile from "@/components/cards/card-mobile";

interface GameBoardProps {
  onRestart: () => void;
  onStart: () => void;
  onNextStart: () => void;
  onShuffleAgain: () => void;
}

const GameBoardMobile: React.FC<GameBoardProps> = ({
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
              <GameOverDialog onRestart={onRestart} />
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
                  <div className="flex justify-center w-full">
                    {isSubmitted && (
                      <div>
                        <ControllerNextRound onNextStart={onNextStart} />
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {winningCard === player_1_card && <Winner1Mobile />}
                    {winningCard === player_2_card && <Winner2Mobile />}
                    {winningCard === player_3_card && <Winner3Mobile />}
                    {winningCard === player_4_card && <Winner4Mobile />}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-row w-full  justify-between items-center  min-h-72 gap-5 mt-10 ">
                <div className="w-1/3 min-w-16">
                  {player_4_card && !winningCard && (
                    <motion.div
                      className="flex justify-center items-center"
                      initial={{ opacity: 0, x: -100 }} // Start  values
                      animate={{ opacity: 1, x: 0 }} // end to these values
                      transition={{ duration: 0.8, delay: 1.6 }} // Animation duration
                    >
                      <CardComponentMobile card={player_4_card} />
                    </motion.div>
                  )}
                </div>

                <div className="flex flex-col justify-between gap-10  w-1/3 ">
                  <div className="">
                    {player_3_card && !winningCard && (
                      <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }} // Adding delay for animation
                      >
                        <CardComponentMobile card={player_3_card} />
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
                        <CardComponentMobile card={player_1_card} />
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
                    >
                      <CardComponentMobile card={player_2_card} />
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

export default GameBoardMobile;
