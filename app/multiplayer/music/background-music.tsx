"use client";

import { useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";

const MusicPlayer = () => {
  const [playMusic, setPlayMusic] = useState(true);

  const handlePlayMusic = () => {
    setPlayMusic(!playMusic);
  };

  return (
    <div className="z-40 bg-white">
      dfgdfdfgdfgdfg
      {/* Background Music Control */}
      <button
        className="absolute top-5 right-5 p-2 rounded-full"
        onClick={handlePlayMusic}
      >
        {!playMusic ? <IoVolumeMuteOutline /> : <VscUnmute />}
      </button>
      {playMusic && (
        <ReactAudioPlayer
          src="/assets/audio-files/fireplace-with-crackling.mp3"
          autoPlay
          loop
        />
      )}
    </div>
  );
};

export default MusicPlayer;
