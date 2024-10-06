"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { SocketData } from "@/utils/types-multiplayer";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";

type Props = {
  roomId: string;
};
const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const StartGamePoolPublic = (props: Props) => {
  const router = useRouter();
  const hasJoinedRoom = useRef(false);

  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer, setOpponentPlayer] = useState<SocketData | null>(null);
  const [roomName, setRoomName] = useState<string | null>(null);
  const roomId = props.roomId;
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(false);
  const [roomCreator, setRoomCreator] = useState<SocketData | null>(null);
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(true);

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
      // SocketManager.joinRoom(roomId, isRoomPrivate, userName);
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

    // SocketManager.emitGameStart(roomId); // Emit the event for game start
  };

  useEffect(() => {
    // Ensure roomdataFromDB is available and the user hasn't already joined the room
    if (roomdataFromDB && !hasJoinedRoom.current) {
      handleJoinRoom(); // Call handleJoinRoom once roomdataFromDB is available
      hasJoinedRoom.current = true; // Set to true to prevent future calls
    }
  }, [roomdataFromDB]); // Add roomdataFromDB as a dependency

  // const getRoomData = () => {
  //   SocketManager.getRoomData(
  //     roomId,

  //     (data: { creator: SocketData; players: SocketData[] }) => {
  //       setRoomData(data.players);
  //       setRoomCreator(data.creator);
  //       // Check if the creator's username is not "Unknown"
  //       if (data.creator.username && data.creator.username !== "Unknown") {
  //         // Save the room creator in local storage
  //         localStorage.setItem(
  //           `roomCreator_${roomId}`,
  //           JSON.stringify(data.creator.username)
  //         );
  //         console.log(
  //           "Room creator saved in localStorage:",
  //           data.creator.username
  //         );
  //       } else {
  //         console.log("Room creator is 'Unknown', not saving to localStorage.");
  //       }

  //       // Set opponent player if there are enough players
  //       if (data.players.length > 1) {
  //         setOpponentPlayer(data.players[0]);
  //       }

  //       // Update isRoomCreator based on the creator username
  //       const currentUserIsCreator = data.creator?.username === userName;
  //       setIsRoomCreator(currentUserIsCreator);

  //       if (data.creator.username && data.creator.username === "Unknown") {
  //         const storedCreator = localStorage.getItem(`roomCreator_${roomId}`);
  //         if (storedCreator) {
  //           const creatorData: string = JSON.parse(storedCreator);
  //           // setRoomCreator(creatorData);
  //           setIsRoomCreator(creatorData === userName);
  //         }
  //       }
  //     }
  //   );
  // };

  // useEffect(() => {
  //   if (webSocketURL) {
  //     // Connect to socket on mount
  //     SocketManager.connect(webSocketURL);
  //   }

  //   getUsername();
  //   handleJoinRoom();
  //   getRoomData();

  //   // Listen for player-joined events
  //   SocketManager.onPlayerJoined((newRoomData: SocketData[]) => {
  //     setRoomData(newRoomData);
  //     if (newRoomData.length > 1) {
  //       setOpponentPlayer(newRoomData[1]); // Update opponent player
  //     }
  //   });

  //   // Handle game start event
  //   SocketManager.onGameStart(() => {
  //     router.push(`/multiplayer/gameplay/public/${roomId}`);
  //   });

  //   // Disconnect socket when component unmounts
  //   return () => {
  //     SocketManager.disconnect();
  //   };
  // }, [webSocketURL, roomId, userName]);

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
