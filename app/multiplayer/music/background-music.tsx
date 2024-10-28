"use client";

import { useStore } from "@/store/state";
import { useRef, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";

const MusicPlayer = () => {
  const muted = useStore((state) => state.muted);
  const setMuted = useStore((state) => state.setMuted);

  const handlePlayMusic = () => {
    setMuted(!muted);
  };

  return (
    <div>
      {/* Background Music Control */}
      <button
        className="absolute top-5 right-5 p-2 rounded-full z-20"
        onClick={handlePlayMusic}
      >
        {muted ? <IoVolumeMuteOutline /> : <VscUnmute />}
      </button>
      {!muted && (
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
