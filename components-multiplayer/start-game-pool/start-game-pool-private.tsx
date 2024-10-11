"use client";
import { Button } from "@/components/ui/button";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { StartGamePoolPrivateProps } from "@/utils/types-multiplayer";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";
import waiting from "@/public/assets/lottie-animations/waiting-to-people.json";
import Lottie from "lottie-react";
import ProfileAnimation from "@/public/assets/lottie-animations/enter-name.json";
import UserNameInput from "../username-input";

const StartGamePoolPrivate = (props: StartGamePoolPrivateProps) => {
  const hasJoinedRoom = useRef(false);
  const router = useRouter();
  const roomId = props.roomId;

  const [username, setUsername] = useState<string | null>(null);

  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);

  const roomdataFromDB = useQuery(api.rooms.getRoomData, { roomName: roomId });
  const isOpponentJoinedDB = useQuery(api.rooms.isOpponentJoined, {
    roomName: roomId,
  });
  const isRoomCreatorDB = useQuery(api.rooms.isRoomCreator, {
    roomName: roomId,
    userName: userName || "",
  });
  const updateRoomStatustoJoined = useMutation(
    api.rooms.updateRoomStatustoJoined
  );
  const PlayersJoined = useQuery(api.rooms.isPlayersJoined, {
    roomName: roomId || "",
  });

  const joinRoomDB = useMutation(api.rooms.joinRoom);

  const handleStartGame = () => {
    console.log("start");
    const roomName = roomId;
    updateRoomStatustoJoined({
      roomName,
    });
    console.log("players joined", PlayersJoined);
  };

  const getUsername = () => {
    // Ensure the code only runs in the browser
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const handleEnterUserName = () => {
    if (username?.trim()) {
      setUserName(username);
      setUsername("");
    }
  };

  const handleJoinRoom = () => {
    getUsername();
    if (roomId && userName) {
      const roomName = roomId;
      // Only update the database if the player hasn't joined before
      console.log("roomdataFromDB", roomdataFromDB);
      if (roomdataFromDB) {
        const alreadyJoined = roomdataFromDB.playerUserNames.some(
          (player: string) => player === userName
        );
        if (!alreadyJoined) {
          // Updating the database
          joinRoomDB({
            userName,
            roomName,
          });
        }
        hasJoinedRoom.current = true;
      }
    }
  };

  useEffect(() => {
    // Ensure roomdataFromDB is available and the user hasn't already joined the room
    if (roomdataFromDB) {
      handleJoinRoom(); // Call handleJoinRoom once roomdataFromDB is available
      hasJoinedRoom.current = true; // Set to true to prevent future calls
    }
  }, [roomdataFromDB]);

  useEffect(() => {
    if (PlayersJoined) {
      router.push(`/multiplayer/gameplay/public/${roomId}`);
    }
  }, [PlayersJoined]);

  useEffect(() => {
    getUsername();
  }, [roomdataFromDB]);

  return (
    <div className="flex flex-col h-full min-h-screen w-full">
      {userName ? (
        <div>
          <div className="flex  justify-center gap-20 p-20 mt-10">
            {isOpponentJoinedDB && userName ? (
              <div className="flex flex-col gap- lg:gap-20 p-10">
                <div className="flex justify-center gap-10">
                  <OpponentsName userName={userName} roomName={roomId} />
                </div>
                <div className="flex flex-col lg:flex-row justify-center items-center">
                  <MyName />
                  <div
                    className={`p-20  ${isRoomCreatorDB ? "flex" : " hidden"}`}
                  >
                    <Button
                      disabled={!isOpponentJoinedDB}
                      className="h-20 w-80 rounded-2xl"
                      onClick={handleStartGame}
                    >
                      Start Private Game
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row justify-center h-full items-center bg- mt-20">
                <div className="w-1/2">
                  <Lottie animationData={waiting} loop={true} />
                </div>
                <div>
                  <MyName />
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="h-full min-h-screen flex flex-col lg:flex-row  gap-20 lg:gap-40 justify-center items-center">
          <Lottie animationData={ProfileAnimation} loop={true} />
          <UserNameInput />
        </div>
      )}
    </div>
  );
};

export default StartGamePoolPrivate;
