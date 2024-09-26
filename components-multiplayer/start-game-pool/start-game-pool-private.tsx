"use client";
import { Button } from "@/components/ui/button";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { SocketData, StartGamePoolPrivateProps } from "@/utils/types-multiplayer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";


const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const StartGamePoolPrivate = (props: StartGamePoolPrivateProps) => {
  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer, setOpponentPlayer] = useState<SocketData | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
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

  const handleEnterUserName = () => {
    if (username?.trim()) {
      setUserName(username);
      setUsername("");
    }
  };

  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    getUsername();

    handleJoinRoom();
    getRoomData();
    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, [webSocketURL, roomId, userName]);

  return (
    <div className="flex flex-col h-full min-h-screen">
      {userName ? (
        <div>
          <div className="flex  justify-center gap-20 p-20 mt-10">
            <div className="bg-muted/100 rounded-full p-20 ">{userName}</div>
            <div className="bg-muted/100  rounded-full p-20 ">
              {opponentPlayer?.username}
            </div>
          </div>
          <div className=" h-full flex justify-center items-center">
            <div className="p-20 mt-20 ">
              <Button
                disabled={!opponentPlayer}
                className="h-20 w-80 rounded-2xl"
              >
                <Link href={`/multiplayer/gameplay/public/${roomId}`}>
                  Start Private Game
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="text"
            placeholder="Enter Your Name"
            value={username || ""}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Button
            onClick={() => {
              handleEnterUserName();
            }}
          >
            Enter
          </Button>
        </div>
      )}
    </div>
  );
};

export default StartGamePoolPrivate;
