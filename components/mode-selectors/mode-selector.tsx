"use client";
import Link from "next/link";
import Image from "next/image";
import background from "@/public/assets/images/background.png";
import GameModeCard from "./game-mode-card";
import { Spicy_Rice } from "next/font/google";
import textArea from "@/public/assets/images/text-area.png";
import { ParticlesComponent } from "../particles/particles";
import { motion } from "framer-motion";
import ParticlesComponentExample from "@/components-multiplayer/particles/winner-particles";
import { useHoverSound, useClickSound } from "@/utils/play-sounds";
import { useStore } from "@/store/state";
const spicy_rice = Spicy_Rice({
  subsets: ["latin"],
  weight: "400",
});

const ModeSelector = () => {
  const { playHoverSound } = useHoverSound();
  const muted = useStore((state) => state.muted);
  const { playClickButton } = useClickSound();

  const handleHover = () => {
    playHoverSound(muted);
  };

  return (
    <div className="flex flex-col  justify-start gap-[4vh] pt-5">
      <div className="flex flex-col items-center justify-center z-20 gap-2 w-full">
        <div className={`h-full font ${spicy_rice.className} text-7xl t-10 `}>
          Omi
        </div>
        <span>
          <div className="h-full text-black overflow-hidden flex flex-col gap-2 min-w-64">
            <div style={{ position: "relative", height: "60px" }}>
              <Image
                alt="Content Cover"
                src={textArea}
                fill
                style={{
                  objectFit: "fill",
                }}
              />
              {/* Text Overlay */}
              <div className="absolute w-full h-full flex flex-col justify-start items-center py-3">
                <span className={`text-2xl  font-extrabold`}>
                  Outplay, Outlast, Omi !
                </span>
              </div>
            </div>
          </div>
        </span>
      </div>
      <div className="flex flex-row h-full items-center sm:mt-5">
        <div
          onMouseEnter={handleHover}
          className="flex flex-col sm:flex-row justify-center md:justify-start md:ml-20 w-full gap-5 sm:gap-0"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="md:-rotate-6">
              <Link
                onClick={() => {
                  playClickButton(muted);
                }}
                href={"/practise"}
              >
                <GameModeCard
                  topic="Warm Up Before the Challenge"
                  contentHeader="Ready to Test your Limits"
                  title="Practice Mode"
                  content="Test Your Limits Before Challenging"
                  nextMessage="Jump In"
                />
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div
              // Sound Effects
              onMouseEnter={handleHover}
              onMouseLeave={handleHover}
              className="md:rotate-6 md:-ml-8"
            >
              <Link
                href={"/multiplayer"}
                onClick={() => {
                  playClickButton(muted);
                }}
              >
                <GameModeCard
                  topic=" Compete with Players Worldwide"
                  contentHeader="Rooms Await.."
                  title="Multiplayer Mode"
                  content="Play With Complete Strangers or Create Private Rooms to Play with Your Friends"
                  nextMessage=" Dive in"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
      {/* Smoke Effect */}
      {/* <ParticlesComponent /> */}

      {/* Winner PArticles */}
      {/* <ParticlesComponentExample/> */}
    </div>
  );
};

export default ModeSelector;
