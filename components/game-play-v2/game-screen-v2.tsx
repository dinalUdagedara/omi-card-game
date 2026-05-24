"use client";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import GamePlayV2 from "./game-play-v2";
import GamePlayMobileV2 from "./game-play-mobile-v2";

const GameScreenV2 = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-950">
      {/* Back button — sits above both variants */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <div className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 transition-colors text-sm font-medium">
            <IoArrowBackOutline className="w-4 h-4" />
            <span>Exit</span>
          </div>
        </Link>
      </div>

      {/* Mobile (sm:hidden) */}
      <GamePlayMobileV2 />

      {/* Desktop (hidden sm:flex) */}
      <GamePlayV2 />
    </div>
  );
};

export default GameScreenV2;
