"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import Link from "next/link";
import { SocketData } from "@/utils/types-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import PublicRooms from "./pool-components/public-rooms";

const PoolUI = () => {
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);
  const userName = MultiplayerStateStore((state) => state.userName);
  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  const noPublicRooms = useQuery(api.rooms.checkIfPublicRoomsEmpty);

  // useEffect(() => {
  //   // Connect to the socket on mount
  //   // if (webSocketURL) SocketManager.connect(webSocketURL);

  //   // Fetch available rooms when component mounts
  //   getAvailableCustomRooms();

  //   // Listen for player-joined or room-created events
  //   SocketManager.onRoomCreated((newRoomData: string[]) => {
  //     // Update the available rooms with the new room data
  //     if (newRoomData) {
  //       setAvailableRooms(newRoomData);
  //     }
  //   });

  //   // // Disconnect socket when component unmounts
  //   // return () => {
  //   //   SocketManager.disconnect();
  //   // };
  // }, [webSocketURL, userName]);

  // // Fetch available custom rooms and update the state
  // const getAvailableCustomRooms = () => {
  //   SocketManager.getAllPublicRooms((rooms: string[]) => {
  //     setAvailableRooms(rooms);
  //   });
  // };

  return (
    <div className="flex flex-col h-screen">
      <div className="pt-20 justify-center flex text-center">
        Available Public Rooms
      </div>

      {noPublicRooms === false ? (
        <div className="flex justify-center gap-20 items-center px-20 flex-grow h-full">
          <PublicRooms />
          {/* {availableRooms.map((room, index) => (
            <div key={index} className="h-40 w-40">
              <Link href={`/multiplayer/start/public/${room}`}>
                <Button className="h-full w-full rounded-2xl">{room}</Button>
              </Link>
            </div>
          ))} */}
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
          {/* <Button onClick={getAvailableCustomRooms} className="rounded-md"> */}
          <Button className="rounded-md">Create a Room</Button>
        </Link>
      </div>
    </div>
  );
};

export default PoolUI;
