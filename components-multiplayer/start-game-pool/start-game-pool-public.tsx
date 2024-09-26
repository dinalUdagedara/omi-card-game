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
const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const StartGamePoolPublic = (props: Props) => {
  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer, setOpponentPlayer] = useState<SocketData | null>(null);
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const [roomName, setRoomName] = useState<string | null>(null);
  const roomId = props.roomId;
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(false);

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
      SocketManager.joinRoom(roomId, isRoomPrivate, userName);
      console.log("Joined to the Room : ", roomId);
    }
  };

  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    getUsername();

    handleJoinRoom();
    getRoomData();

    // Listen for player-joined events
    SocketManager.onPlayerJoined((newRoomData: SocketData[]) => {
      setRoomData(newRoomData);
      if (newRoomData.length > 1) {
        setOpponentPlayer(newRoomData[1]); // Update opponent player
      }
    });

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, [webSocketURL, roomId, userName]);

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
            <Link href={`/multiplayer/gameplay/public/${roomId}`}>
              Start Game
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartGamePoolPublic;
