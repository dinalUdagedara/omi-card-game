"use client";
import Link from "next/link";
import Image from "next/image";
import background from "@/public/assets/images/background.png";
import ReactAudioPlayer from "react-audio-player";
import { useRef, useState } from "react";
import GameModeCard from "./mode-selector/game-mode-card";
import { Spicy_Rice } from "next/font/google";
import textArea from "@/public/assets/images/text-area.png";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { ParticlesComponent } from "./particles/particles";
import { motion } from "framer-motion";
const spicy_rice = Spicy_Rice({
  subsets: ["latin"],
  weight: "400",
});

const ModeSelector = () => {
  const [playMusic, setPlayMusic] = useState(false);

  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayMusic = () => {
    setPlayMusic(!playMusic);
  };

  const handleHover = () => {
    // Play the hover sound
    if (hoverAudioRef.current && playMusic) {
      hoverAudioRef.current.play();
    }
  };

  const handleClick = () => {
    //play click sound
    if (clickAudioRef.current && playMusic) {
      clickAudioRef.current.play();
    }
  };

  return (
    <div className="flex flex-col  justify-start gap-[4vh] pt-10">
      <div className="absolute inset-0">
        <Image
          alt="Mountains"
          src={background}
          placeholder="blur"
          quality={100}
          fill
          sizes="100vw"
          style={{
            objectFit: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent opacity-100" />
      </div>
      {/* Background Music */}
      {/* <button
        className="absolute top-5 right-5 p-2 rounded-full"
        onClick={handlePlayMusic}
      >
        {!playMusic ? <IoVolumeMuteOutline /> : <VscUnmute />}
      </button>
      {playMusic && (
        <ReactAudioPlayer
          // src="/assets/audio-files/the-magic-tree.mp3"
          src="/assets/audio-files/fireplace-with-crackling.mp3"
          autoPlay
          loop
        />
      )} */}
      <audio ref={hoverAudioRef} src="/assets/audio-files/select.mp3" />
      <audio ref={clickAudioRef} src="/assets/audio-files/click.mp3" />
      {/* Audio for hover effect */}
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
      <div className="flex flex-row h-full items-center mt-20 sm:mt-0">
        <div
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
          onClick={handleClick}
          className="flex flex-row md:flex-row justify-center md:justify-start md:ml-20 w-full gap-5 sm:gap-0 bg- "
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="-rotate-6">
              <Link href={"/practise"}>
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
              onClick={handleClick}
              className="md:rotate-6 md:-ml-8 -ml-16 rotate-6"
            >
              <Link href={"/multiplayer"}>
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
      {/* <ParticlesComponent /> */}
    </div>
  );
};

export default ModeSelector;
