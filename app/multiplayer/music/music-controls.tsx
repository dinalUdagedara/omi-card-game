"use client";

import { useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { IoVolumeMuteOutline } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";

export default function MusicPlayer() {
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div className="music-player">
      <ReactAudioPlayer
        src="/path-to-your-audio-file.mp3"
        autoPlay
        loop
        muted={isMuted}
      />
      <button onClick={() => setIsMuted(!isMuted)}>
        {isMuted ? <VscUnmute /> : <IoVolumeMuteOutline />}
      </button>
    </div>
  );
}
