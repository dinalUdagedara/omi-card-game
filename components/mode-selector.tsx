"use client";
import Link from "next/link";
import { Card, CardFooter, Image, Button, CardHeader } from "@nextui-org/react";
import NextImage from "next/image";
import background from "@/public/assets/images/background.png";
import ReactAudioPlayer from "react-audio-player";
import { useState } from "react";
import GameModeCard from "./mode-selector/game-mode-card";

const ModeSelector = () => {
  const [playMusic, setPlayMusic] = useState(false);

  const handlePlayMusic = () => {
    setPlayMusic(!playMusic);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen justify-center gap-20 items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <NextImage
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
        className="absolute top-5 right-5 bg-white text-black p-2 rounded-full"
        onClick={handlePlayMusic}
      >
        Music
      </button>

      {playMusic && (
        <ReactAudioPlayer
          src="/assets/audio-files/the-magic-tree.mp3"
          autoPlay
          loop
        />
      )}

      <Link href={"/practise"}>
        <GameModeCard
          topic="Warm Up Before the Challenge"
          contentHeader="Ready to Test your Limits"
          title="Practise Mode"
          content="Test Your Limits Before Challenging"
          nextMessage="Jump In"
        />
      </Link>

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
  );
};

export default ModeSelector;
