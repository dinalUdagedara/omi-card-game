"use client";
import PoolUI from "@/components-multiplayer/pool-ui";
import Lottie from "lottie-react";
import ProfileAnimation from "@/public/assets/lottie-animations/enter-name.json";
import UserNameInput from "@/components-multiplayer/user-name-input/user-name-input";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import wizardImage from "@/public/assets/images/wizard-character.png";

const Multiplayer = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  // const [isAnimationLoaded, setIsAnimationLoaded] = useState<boolean>(false);

  // const handleAnimationComplete = () => {
  //   setIsAnimationLoaded(true);
  // };

  return (
    <div>
      {userName ? (
        <PoolUI />
      ) : (
        <div className="h-full min-h-screen flex flex-col lg:flex-row  gap-20 lg:gap-40 justify-center items-center">
          <div className=" z-20">
            {/* {!isAnimationLoaded && (
              <div className="flex justify-center items-center  p-20">
                <div className="flex  justify-center items-center">
                  <Skeleton className="h-[220px] w-[170px] rounded-xl" />
                </div>
              </div>
            )}
            <Lottie
              onDOMLoaded={handleAnimationComplete}
              animationData={ProfileAnimation}
              loop={true}
            /> */}
            <Image
              src={wizardImage}
              width={400}
              height={400}
              quality={100}
              alt="Picture of the author"
            />
          </div>

          <UserNameInput />
        </div>
      )}
    </div>
  );
};

export default Multiplayer;
