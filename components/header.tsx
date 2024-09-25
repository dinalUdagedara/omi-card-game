"use client";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { NightModeToggle } from "./night-mode-selector";

const Header = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  return (
    <div className="flex justify-end pr-4 pt-4 gap-10 items-center">
      <p>{userName}</p>
      <NightModeToggle />
    </div>
  );
};

export default Header;
