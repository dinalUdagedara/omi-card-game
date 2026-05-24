"use client";
import Link from "next/link";
import { IoArrowBackOutline } from "react-icons/io5";
import { useEffect, useState } from "react";

const GameScreenV2 = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isMounted) return null;

  // Lazy import to avoid circular dependency — components loaded after mount
  const GamePlayV2 = isMobile
    ? require("./game-play-mobile-v2").default
    : require("./game-play-v2").default;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Back button */}
      <div className="absolute top-4 left-4 z-50">
        <Link href="/">
          <div className="flex items-center gap-1.5 text-amber-300 hover:text-amber-100 transition-colors text-sm font-medium">
            <IoArrowBackOutline className="w-4 h-4" />
            <span>Exit</span>
          </div>
        </Link>
      </div>

      <GamePlayV2 />
    </div>
  );
};

export default GameScreenV2;
