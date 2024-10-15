"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PublicRooms from "./pool-components/public-rooms";
import Lottie from "lottie-react";
import personWaiting from "@/public/assets/lottie-animations/waiting.json";
import NotificationCard from "./pool-components/notification-card";

const PoolUI = () => {
  const publicRooms = useQuery(api.rooms.getAllActivePublicRooms);

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="flex justify-center items-center min-h-screen w-full p-5 pt-16 z-20">
        {publicRooms && publicRooms?.length > 0 ? (
          <div className="flex flex-col justify-center gap-20 items-center px-20 flex-grow h-full">
            <div className="pt-20 justify-center flex text-center  font-semibold text-lg">
              Available Public Rooms
            </div>
            <PublicRooms />

            <div className="flex items-center justify-center flex-grow  z-20">
              <Link href={"/multiplayer/create-room"}>
                <Button className="rounded-md">Create a Room</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div>
            <NotificationCard />
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolUI;
