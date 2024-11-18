"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PublicRoomContainer from "./public-rooms-container";
import NoRoomsComponent from "./no-rooms-card";
import RoomsLoading from "@/components-multiplayer/pool-components/rooms-loading";
import { IoArrowBackOutline } from "react-icons/io5";
import Link from "next/link";

const PoolUI = () => {
  const publicRooms = useQuery(api.rooms.getAllActivePublicRooms);

  return (
    <div className="flex flex-col">
      <div className="flex justify-center items-center min-h-screen h-full w-full">
        <div className="absolute  top-5 left-5">
          <Link href={"/"}>
            <IoArrowBackOutline />
          </Link>
        </div>
        {/* Show loading animation while data is being fetched */}
        {publicRooms === undefined ? (
          <RoomsLoading />
        ) : publicRooms?.length > 0 ? (
          <PublicRoomContainer />
        ) : (
          <div>
            <NoRoomsComponent />
          </div>
        )}
      </div>
    </div>
  );
};

export default PoolUI;
