"use client";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NotificationCard = () => {
  return (
    <div className="flex justify-center items-center  h-full ">
      <div className="relative w-[400px] h-[600px]  p- rounded-lg  shadow-lg inv-rad inv-rad-8 ">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0  text-black m-2 inv-rad inv-rad-8  flex  border-2">
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
            <div className="mt-10">
              <p className="">Create one Using the button Below</p>
            </div>

            <div className="mt-20">
              <Link href={"/multiplayer/create-room"}>
                <Button className="bg-amber-950 text-white rounded-2xl hover:bg-amber-800 p-5 text-md">
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
