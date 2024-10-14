"use client";
import Link from "next/link";
import Image from "next/image";
import background from "@/public/assets/images/background.png";
import ReactAudioPlayer from "react-audio-player";
import { useState } from "react";
import GameModeCard from "./mode-selector/game-mode-card";
import { Spicy_Rice } from "next/font/google";
import textArea from "@/public/assets/images/text-area.png";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
const spicy_rice = Spicy_Rice({
  subsets: ["latin"],
  weight: "400",
});

const ModeSelector = () => {
  const [playMusic, setPlayMusic] = useState(false);

  const handlePlayMusic = () => {
    setPlayMusic(!playMusic);
  };

  return (
    <div className="flex flex-col min-h-screen justify-start gap-[8vh] pt-10">
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
      <button
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
      )}

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

      <div className="flex flex-col lg:flex-row h-full  justify-start  items-center">
        {/* Background Image */}

        <div className="flex flex-col md:flex-row ml-20">
          <div className="lg:-rotate-6">
            <Link href={"/practise"}>
              <GameModeCard
                topic="Warm Up Before the Challenge"
                contentHeader="Ready to Test your Limits"
                title="Practise Mode"
                content="Test Your Limits Before Challenging"
                nextMessage="Jump In"
              />
            </Link>
          </div>

          <div className="md:rotate-6 md:-ml-8">
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
        </div>
      </div>
    </div>
  );
};

export default ModeSelector;
