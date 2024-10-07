"use client";
import { Button } from "@/components/ui/button";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import {
  SocketData,
  StartGamePoolPrivateProps,
} from "@/utils/types-multiplayer";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";

const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
type Props = {
  roomId: string;
};

const StartGamePoolPrivate = (props: StartGamePoolPrivateProps) => {
  const hasJoinedRoom = useRef(false);
  const router = useRouter();
  const roomId = props.roomId;

  const [roomData, setRoomData] = useState<SocketData[]>([]);
  const [opponentPlayer, setOpponentPlayer] = useState<SocketData | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(false);
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(true);
  const [roomCreator, setRoomCreator] = useState<SocketData | null>(null);

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

    // SocketManager.emitGameStart(roomId); // Emit the event for game start
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
      // SocketManager.joinRoom(roomId, isRoomPrivate, userName);
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
  }, [roomdataFromDB]); // Add roomdataFromDB as a dependency

  useEffect(() => {
    if (PlayersJoined) {
      router.push(`/multiplayer/gameplay/public/${roomId}`);
    }
  }, [PlayersJoined]);

  // const getRoomData = () => {
  //   SocketManager.getRoomData(
  //     roomId,

  //     (data: { creator: SocketData; players: SocketData[] }) => {
  //       setRoomData(data.players);
  //       setRoomCreator(data.creator);
  //       console.log("data.creator:", data.creator);
  //       console.log(
  //         "data.creator.username !== UnKnown",
  //         data.creator.username !== "UnKnown"
  //       );

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

  //       console.log("Room Data:", data);

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
  //           console.log("storedCreator", storedCreator);
  //           console.log("userName", userName);
  //           console.log("storedCreator === userName", creatorData === userName);
  //           // setRoomCreator(creatorData);
  //           setIsRoomCreator(creatorData === userName);
  //         }
  //       }
  //     }
  //   );
  // };

  // const handleJoinRoom = () => {
  //   console.log("roomId: ", roomId);

  //   getUsername();
  //   console.log("UserName: ", userName);
  //   if (roomId && userName) {
  //     SocketManager.joinRoom(roomId, isRoomPrivate, userName);
  //     console.log("Joined to the Room : ", roomId);
  //   }
  // };

  // useEffect(() => {
  //   if (webSocketURL)
  //     // Connect to socket on mount
  //     SocketManager.connect(webSocketURL);
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
      {userName ? (
        <div>
          <div className="flex  justify-center gap-20 p-20 mt-10">
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
          </div>
          <div className=" h-full flex justify-center items-center">
            <div
              className={`p-20 mt-20 ${isRoomCreatorDB ? "flex" : " hidden"}`}
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
