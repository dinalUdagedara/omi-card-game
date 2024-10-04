"use client";
import PoolUI from "@/components-multiplayer/pool-ui";
import UserNameInput from "@/components-multiplayer/username-input";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

const Multiplayer = () => {
  const userName = MultiplayerStateStore((state) => state.userName);

  return (
    <div>
      {userName ? (
        <PoolUI />
      ) : (
        <div className="h-full min-h-screen flex justify-center items-center">
          <UserNameInput />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
