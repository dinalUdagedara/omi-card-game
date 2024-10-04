"use client";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

const MyName = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  return (
    <>
      <div className="bg-blue-950 rounded-full p-20 ">{userName}</div>
    </>
  );
};

export default MyName;
