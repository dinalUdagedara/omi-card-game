"use client";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useHoverSound, useClickSound } from "@/utils/play-sounds";
import { useStore } from "@/store/state";

const NotificationCard = () => {
  const muted = useStore((state) => state.muted);
  const { playHoverSound } = useHoverSound();
  const { playClickButton } = useClickSound();

  return (
    <div className="flex justify-center items-center  h-full ">
      <div className="relative w-[350px] h-[350px] sm:w-[400px] sm:h-[400px]   rounded-lg  shadow-lg inv-rad inv-rad-8 ">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0 text-black m-2 inv-rad inv-rad-8  flex ">
          <Image
            alt="Mountains"
            src={notificaitonBackGround}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
          />
          {/* Card Header */}
          <div className="flex flex-col  justify-start z-20 w-full items-center p-5">
            <div>
              <Image
                src={logoIcon}
                width={100}
                height={100}
                alt="Picture of the author"
              />
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold">No Rooms Yet ...</h1>
            </div>
            <div className="mt-5">
              <p className="">Create one Using the button Below</p>
            </div>

            <div className="mt-8">
              <Link
                href={"/multiplayer/create-room"}
                onClick={() => {
                  playClickButton(muted); //Playing Clicking Sound Effect
                }}
              >
                <Button
                  onMouseEnter={() => {
                    playHoverSound(muted);
                  }}
                  className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md"
                >
                  Create a Room
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
