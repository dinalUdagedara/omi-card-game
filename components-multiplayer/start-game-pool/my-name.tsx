"use client";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import Lottie from "lottie-react";
import person from "@/public/assets/lottie-animations/person.json";

const MyName = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  return (
    <>
      <div className="rounded-full items-center justify-center flex flex-col h-60 w-60  lg:h-96 lg:w-96 px-6 py-3 gap-5">
        <div>
          <Lottie animationData={person} loop={true} />
        </div>
        <span className="font-semibold font-sans">{userName}</span>
      </div>
    </>
  );
};
person;

export default MyName;
