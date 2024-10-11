"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PublicRooms from "./pool-components/public-rooms";
import Lottie from "lottie-react";
import personWaiting from "@/public/assets/lottie-animations/waiting.json";

const PoolUI = () => {
  const publicRooms = useQuery(api.rooms.getAllActivePublicRooms);

  return (
    <div className="flex flex-col h-screen font-sans">
      <div className="p-5 pt-16">
        {publicRooms && publicRooms?.length > 0 ? (
          <div className="flex flex-col justify-center gap-20 items-center px-20 flex-grow h-full">
            <div className="pt-20 justify-center flex text-center font-sans font-semibold text-lg">
              Available Public Rooms
            </div>
            <PublicRooms />
          </div>
        ) : (
          <div className="">
            <div className="h-full w-full  items-center justify-between font-semibold flex flex-col ">
              <Lottie animationData={personWaiting} loop={true} />
              <div className="flex justify-center flex-col items-center ">
                <p>No Rooms Yet</p>
                <p>Create one using button below</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center flex-grow ">
        <Link href={"/multiplayer/create-room"}>
          <Button className="rounded-md">Create a Room</Button>
        </Link>
      </div>
    </div>
  );
};

export default PoolUI;
