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
  const [isRoomPrivate,setIsRoomPrivate] = useState<boolean>(false)

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;


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
  }, [webSocketURL, roomId, userName]);

  const getRoomInfo = () => {
    if (roomId)
      SocketManager.getRoomData(roomId, (roomData) => {
        setRoomSocketData(roomData);
        console.log(roomData);
      });
  };


  
  const getUsername = () => {
    // Ensure the code only runs in the browser

      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }

  };


  const handleJoinRoom = () => {
    console.log("roomId: ", roomId);

    getUsername();
    console.log("UserName: ", userName);
    if (roomId && userName) {
      SocketManager.joinRoom(roomId,isRoomPrivate, userName);
      console.log("Joined to the Room : ", roomId);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        {roomSocketData && roomSocketData.length > 0 && (
          <div>
            opponent: {roomSocketData[0]?.username || "Waiting for opponent..."}
          </div>
        )}

        {mySocket && roomSocketData && roomSocketData.length > 1 && (
          <div>
            me: {roomSocketData[1]?.username || "Waiting for player..."}
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePlayMultiplayer;
