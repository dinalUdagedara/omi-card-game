"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PublicRooms from "./pool-components/public-rooms";

const PoolUI = () => {
  const noPublicRooms = useQuery(api.rooms.checkIfPublicRoomsEmpty);

  return (
    <div className="flex flex-col h-screen">
      <div className="pt-20 justify-center flex text-center">
        Available Public Rooms
      </div>

      {noPublicRooms === false ? (
        <div className="flex justify-center gap-20 items-center px-20 flex-grow h-full">
          <PublicRooms />
        </div>
      ) : (
        <div className="h-64">
          <div className="h-full w-full   items-center justify-center flex">
            No Rooms yet.. Create a One Using Below Button
          </div>
        </div>
      )}

      <div className="flex items-center justify-center flex-grow h-full">
        <Link href={"/multiplayer/create-room"}>
          <Button className="rounded-md">Create a Room</Button>
        </Link>
      </div>
    </div>
  );
};

export default PoolUI;
