"use client";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

const MyName = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  return (
    <>
      <div className="bg-green-800 rounded-full items-center justify-center flex h-40 w-40 ">{userName}</div>
    </>
  );
};

export default MyName;
