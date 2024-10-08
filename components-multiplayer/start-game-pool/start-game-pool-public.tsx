"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";

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
    // Ensure roomdataFromDB is available and the user hasn't already joined the room
    if (roomdataFromDB && !hasJoinedRoom.current) {
      handleJoinRoom(); // Call handleJoinRoom once roomdataFromDB is available
      hasJoinedRoom.current = true; // Set to true to prevent future calls
    }
  }, [roomdataFromDB]); 


  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex  justify-center gap-20 p-20 mt-10">
        {isOpponentJoinedDB && userName ? (
          <>
            <MyName />
            <OpponentsName userName={userName} roomName={roomId} />
          </>
        ) : (
          <>
            <MyName />
          </>
        )}
      </div>
      <div className=" h-full flex justify-center items-center">
        <div className={`p-20 mt-20 ${isRoomCreatorDB ? "flex" : " hidden"}`}>
          <Button
            disabled={!isOpponentJoinedDB}
            onClick={handleStartGame}
            className="h-20 w-80 rounded-2xl"
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StartGamePoolPublic;
