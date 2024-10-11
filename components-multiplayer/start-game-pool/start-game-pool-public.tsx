"use client";

import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";
import { Button } from "@nextui-org/react";
import Lottie from "lottie-react";
import waiting from "@/public/assets/lottie-animations/waiting-to-people.json";

type Props = {
  roomId: string;
};

const StartGamePoolPublic = (props: Props) => {
  const router = useRouter();
  const hasJoinedRoom = useRef(false);
  const roomId = props.roomId;

  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);

  const updateRoomStatustoJoined = useMutation(
    api.rooms.updateRoomStatustoJoined
  );
  const joinRoomDB = useMutation(api.rooms.joinRoom);

  const isOpponentJoinedDB = useQuery(api.rooms.isOpponentJoined, {
    roomName: roomId,
  });

  const isAllJoined = useQuery(api.rooms.isAllJoined, {
    roomName: roomId,
  });
  const roomdataFromDB = useQuery(api.rooms.getRoomData, { roomName: roomId });
  const isRoomCreatorDB = useQuery(api.rooms.isRoomCreator, {
    roomName: roomId,
    userName: userName || "",
  });

  const PlayersJoined = useQuery(api.rooms.isPlayersJoined, {
    roomName: roomId || "",
  });
  useEffect(() => {
    if (PlayersJoined) {
      router.push(`/multiplayer/gameplay/public/${roomId}`);
    }
  }, [PlayersJoined]);

  const getUsername = () => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const handleJoinRoom = async () => {
    await getUsername();
    console.log("handleJoin Room: username", userName);
    console.log("handleJoin Room: roomid", roomId);
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
          const playerID = await joinRoomDB({
            userName,
            roomName,
          });
          console.log("PlayerID", playerID);
        }
        hasJoinedRoom.current = true;
      }
    }
  };

  const handleStartGame = () => {
    console.log("start");
    const roomName = roomId;
    updateRoomStatustoJoined({
      roomName,
    });
    console.log("players joined", PlayersJoined);
  };

  useEffect(() => {
    console.log("Room Data", roomdataFromDB && !hasJoinedRoom.current);
    // Ensure roomdataFromDB is available and the user hasn't already joined the room
    if (roomdataFromDB && !hasJoinedRoom.current && userName) {
      handleJoinRoom();
      hasJoinedRoom.current = true; // Set to true to prevent future calls
    }
  }, [roomdataFromDB, userName]);

  useEffect(() => {
    getUsername();
  }, [roomdataFromDB]);
  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className=" justify-center items-center">
        {isOpponentJoinedDB && userName ? (
          <div className="flex flex-col gap- lg:gap-20 p-10">
            <div className="flex justify-center gap-10">
              <OpponentsName userName={userName} roomName={roomId} />
            </div>
            <div className="flex justify-center items-center">
              <MyName />
              <div className={`p-20  ${isRoomCreatorDB ? "flex" : " hidden"}`}>
                <Button
                  disabled={!isAllJoined}
                  onClick={handleStartGame}
                  className="h-20 w-80 rounded-2xl"
                >
                  Start Game
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row justify-center h-full min-h-screen items-center">
            <div className="w-1/2">
              <Lottie animationData={waiting} loop={false} />
            </div>
            <div>
              <MyName />
            </div>
          </div>
        )}
      </div>
      {/* <div className=" h-full flex justify-center items-center">
        <div className={`p-20 mt-20 ${isRoomCreatorDB ? "flex" : " hidden"}`}>
          <Button
            disabled={!isAllJoined}
            onClick={handleStartGame}
            className="h-20 w-80 rounded-2xl"
          >
            Start Game
          </Button>
        </div>
      </div> */}
    </div>
  );
};

export default StartGamePoolPublic;
