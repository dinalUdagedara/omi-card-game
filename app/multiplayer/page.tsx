"use client";
import PoolUI from "@/components-multiplayer/pool-components/pool-ui";
import Lottie from "lottie-react";
import ProfileAnimation from "@/public/assets/lottie-animations/enter-name.json";
import UserNameInput from "@/components-multiplayer/user-name-input/user-name-input";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import wizardImage from "@/public/assets/images/wizard-character.png";
import wizardCover from "@/public/assets/images/backgrounds/wizard-cover.png";

const Multiplayer = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  // const [isAnimationLoaded, setIsAnimationLoaded] = useState<boolean>(false);

  // const handleAnimationComplete = () => {
  //   setIsAnimationLoaded(true);
  // };

  return (
    <div className="">
      {userName ? (
        <PoolUI />
      ) : (
        <div className="h-full min-h-screen flex flex-col lg:flex-row  gap-20 lg:gap-40 justify-center items-center">
          <div className="relative hidden lg:flex z-20">
            <Image
              src={wizardImage}
              width={400}
              height={400}
              quality={100}
              alt="Wizard Image"
              className="relative z-10"
            />
            {/* <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-black/20"></div> */}

            {/* Smoke SVG overlay */}
            <div className="absolute bottom-0 left- right- h-40  z-20 -mb-10">
              <Image
                src={wizardCover}
                alt="Smoke Effect"
                height={500}
                width={500}
              />
            </div>
          </div>

          <UserNameInput />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
