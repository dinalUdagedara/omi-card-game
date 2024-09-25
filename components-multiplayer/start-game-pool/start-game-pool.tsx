"use client";
import { Button } from "@/components/ui/button";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { SocketData } from "@/utils/types-multiplayer";
import Link from "next/link";
import { useEffect, useState } from "react";

type Props = {
  roomId: string;
};

const StartGamePool = (props: Props) => {
  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer, setOpponentPlayer] = useState<SocketData | null>(null);
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const roomId = props.roomId;

  const getRoomData = () => {
    console.log("Getting Room Data", roomId);
    SocketManager.getRoomData(roomId, (data: SocketData[]) => {
      setRoomData(data);
      console.log("Room Data:", data);
      if (data.length > 1) {
        setOpponentPlayer(data[0]);
      }
    });
  };

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);
  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    handleJoinRoom();
    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, []);

  const handleJoinRoom = () => {
    if (roomId) SocketManager.joinRoom(roomId, userName);
  };

  useEffect(() => {
    getRoomData();
  }, []);

  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex  justify-center gap-20 p-20 mt-10">
        <div className="bg-blue-950 rounded-full p-20 ">{userName}</div>
        <div className="bg-blue-950  rounded-full p-20 ">
          {opponentPlayer?.username}
        </div>
      </div>
      <div className=" h-full flex justify-center items-center">
        <div className="p-20 mt-20 ">
          <Button disabled={!opponentPlayer} className="h-20 w-80 rounded-2xl">
            <Link href={`/multiplayer/gameplay/${roomId}`}>Start Game</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartGamePool;
