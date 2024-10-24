"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import NotificationCard from "./pool-components/no-rooms-card";
import PublicRoomContainer from "./pool-components/public-rooms-container";
import RoomsLoading from "@/components-multiplayer/pool-components/rooms-loading";

const PoolUI = () => {
  const publicRooms = useQuery(api.rooms.getAllActivePublicRooms);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center min-h-screen h-full w-full">
        {/* Show loading animation while data is being fetched */}
        {publicRooms === undefined ? (
          <RoomsLoading />
        ) : publicRooms?.length > 0 ? (
          <PublicRoomContainer />
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
