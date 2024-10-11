"use client";
import PoolUI from "@/components-multiplayer/pool-ui";
import Lottie from "lottie-react";
import ProfileAnimation from "@/public/assets/lottie-animations/enter-name.json";
import UserNameInput from "@/components-multiplayer/username-input";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

const Multiplayer = () => {
  const userName = MultiplayerStateStore((state) => state.userName);

  return (
    <div>
      {userName ? (
        <PoolUI />
      ) : (
        <div className="h-full min-h-screen flex flex-col lg:flex-row  gap-20 lg:gap-40 justify-center items-center">
          <Lottie animationData={ProfileAnimation} loop={true} />
          <UserNameInput />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
