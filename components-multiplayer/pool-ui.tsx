"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import Link from "next/link";

const PoolUI = () => {
  const [availableRooms, setAvailableRooms] = useState<string[]>([]);

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL
  
  useEffect(() => {
    // Connect to the socket on mount
    if(webSocketURL)
    // Connect to socket on mount
    SocketManager.connect(webSocketURL);
    // Fetch available rooms when component mounts
    getAvailableCustomRooms();

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, []);

  // Fetch available custom rooms and update the state
  const getAvailableCustomRooms = () => {
    SocketManager.getAllCustomRooms((rooms: string[]) => {
      setAvailableRooms(rooms);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="pt-20 justify-center flex text-center">
        Available Rooms
      </div>

      {availableRooms?.length > 0 ? (
        <div className="flex justify-center gap-20 items-center px-20 flex-grow h-full">
          {availableRooms.map((room, index) => (
            <div key={index} className="h-40 w-40">
              <Link href={`/multiplayer/start/${room}`}>
                <Button className="h-full w-full rounded-2xl">{room}</Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-64">
          <div className="h-full w-full   items-center justify-center flex">
            Rooms Will Appear Here
          </div>
        </div>
      )}

      <div className="flex items-center justify-center flex-grow h-full">
        <Button onClick={getAvailableCustomRooms} className="rounded-md">
          Create a Room
        </Button>
      </div>
    </div>
  );
};

export default PoolUI;
