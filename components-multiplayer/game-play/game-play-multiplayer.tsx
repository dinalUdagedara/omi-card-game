"use client";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import { SocketData } from "@/utils/types-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

const GamePlayMultiplayer = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop(); // Get the last part of the URL, which is the roomId
  const [roomSocketData, setRoomSocketData] = useState<SocketData[] | null>(
    null
  );
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const [mySocket, setMySocket] = useState<Socket | null>(null);

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
    getRoomInfo();
    const mySocketID = SocketManager.getMySocket();
    if (mySocketID) setMySocket(mySocketID);

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, []);

  const getRoomInfo = () => {
    if (roomId)
      SocketManager.getRoomData(roomId, (roomData) => {
        setRoomSocketData(roomData);
        console.log(roomData);
      });
  };

  const handleJoinRoom = () => {
    if (roomId) SocketManager.joinRoom(roomId, userName);
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        {roomSocketData && <div>opponent: {roomSocketData[0].username}</div>}

        {mySocket && roomSocketData && (
          <div>me: {roomSocketData[1].username}</div>
        )}
      </div>
    </div>
  );
};

export default GamePlayMultiplayer;
