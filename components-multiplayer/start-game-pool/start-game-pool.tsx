"use client";
import { Button } from "@/components/ui/button";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { SocketData } from "@/utils/types-multiplayer";
import { useEffect, useState } from "react";

type Props = {
  roomId: string;
};

const StartGamePool = (props: Props) => {
  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer,setOpponentPlayer] = useState<SocketData | null>(null);
  const userName = MultiplayerStateStore((state) => state.userName);
  const getRoomData = () => {
    console.log("Getting Room Data", props.roomId);
    SocketManager.getRoomData(props.roomId, (data: SocketData[]) => {
      setRoomData(data);
      console.log("Room Data:", data);
      setOpponentPlayer(data[0])
    });
  };

  useEffect(() => {
    // Connect to the socket on mount
    SocketManager.connect("http://localhost:8080");

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, []);

  useEffect(() => {
    getRoomData();
  }, []);

  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex  justify-center gap-20 p-20 mt-10">
        <div className="bg-slate-300 rounded-full p-20 ">{userName}</div>
        <div className="bg-slate-300 rounded-full p-20 ">{opponentPlayer?.username}</div>
      </div>
      <div className=" h-full flex justify-center items-center">
        <div className="p-20 mt-20 ">
          <Button className="h-20 w-80 rounded-2xl">Start Game</Button>
        </div>
      </div>
    </div>
  );
};

export default StartGamePool;
