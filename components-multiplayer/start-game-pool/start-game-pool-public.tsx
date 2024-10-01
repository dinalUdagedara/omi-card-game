"use client";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { SocketData } from "@/utils/types-multiplayer";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
  const [roomCreator, setRoomCreator] = useState<SocketData | null>(null);
  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(true);
  const router = useRouter();
  const roomdataFromDB = useQuery(api.rooms.getRoomData, { roomName: roomId });

  const hasJoinedRoom = useRef(false);
  const joinRoomDB = useMutation(api.rooms.joinRoom);

  const getRoomData = () => {
    SocketManager.getRoomData(
      roomId,

      (data: { creator: SocketData; players: SocketData[] }) => {
        setRoomData(data.players);
        setRoomCreator(data.creator);
        console.log("data.creator:", data.creator);
        console.log(
          "data.creator.username !== UnKnown",
          data.creator.username !== "UnKnown"
        );

        // Check if the creator's username is not "Unknown"
        if (data.creator.username && data.creator.username !== "Unknown") {
          // Save the room creator in local storage
          localStorage.setItem(
            `roomCreator_${roomId}`,
            JSON.stringify(data.creator.username)
          );
          console.log(
            "Room creator saved in localStorage:",
            data.creator.username
          );
        } else {
          console.log("Room creator is 'Unknown', not saving to localStorage.");
        }

        console.log("Room Data:", data);

        // Set opponent player if there are enough players
        if (data.players.length > 1) {
          setOpponentPlayer(data.players[0]);
        }

        // Update isRoomCreator based on the creator username
        const currentUserIsCreator = data.creator?.username === userName;
        setIsRoomCreator(currentUserIsCreator);

        if (data.creator.username && data.creator.username === "Unknown") {
          const storedCreator = localStorage.getItem(`roomCreator_${roomId}`);
          if (storedCreator) {
            const creatorData: string = JSON.parse(storedCreator);
            console.log("storedCreator", storedCreator);
            console.log("userName", userName);
            console.log("storedCreator === userName", creatorData === userName);
            // setRoomCreator(creatorData);
            setIsRoomCreator(creatorData === userName);
          }
        }
      }
    );
  };

  console.log("isRoomCreator : ", isRoomCreator);

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
      const roomName = roomId;
      SocketManager.joinRoom(roomId, isRoomPrivate, userName);
      console.log("Joined to the Room: ", roomId);
  
      // Only update the database if the player hasn't joined before
      
      console.log("!hasJoinedRoom.current",!hasJoinedRoom.current)
      console.log("roomdataFromDB",roomdataFromDB)
      console.log("!hasJoinedRoom.current && roomdataFromDB",!hasJoinedRoom.current && roomdataFromDB)
      if (roomdataFromDB) {
      console.log("roomdataFromDB.players",roomdataFromDB.players)
        const alreadyJoined = roomdataFromDB.players.some(
          (player: string) => player === userName
        );

        if (!alreadyJoined) {
          // Updating the database
          joinRoomDB({
            userName,
            roomName,
          });
        }
      }
  
      hasJoinedRoom.current = true;
    }
  };

  const handleStartGame = () => {
    SocketManager.emitGameStart(roomId); // Emit the event for game start
  };

  useEffect(() => {
    if(roomdataFromDB)
    // Connect to socket on mount
    if (webSocketURL) {
      SocketManager.connect(webSocketURL);
    }

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

    // Handle game start event
    SocketManager.onGameStart(() => {
      router.push(`/multiplayer/gameplay/public/${roomId}`);
    });

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, [webSocketURL, roomId, userName,roomdataFromDB]);

  return (
    <div className="flex flex-col h-full min-h-screen">
      <div className="flex  justify-center gap-20 p-20 mt-10">
        <div className="bg-blue-950 rounded-full p-20 ">{userName}</div>
        <div className="bg-blue-950  rounded-full p-20 ">
          {opponentPlayer?.username}
        </div>
      </div>
      <div className=" h-full flex justify-center items-center">
        <div className={`p-20 mt-20 ${isRoomCreator ? "flex" : " hidden"}`}>
          {/* <Button disabled={!opponentPlayer} className="h-20 w-80 rounded-2xl">
            <Link href={`/multiplayer/gameplay/public/${roomId}`}>
              Start Game
            </Link>
          </Button>
           */}

          <Button
            disabled={!opponentPlayer}
            onClick={handleStartGame} // Start game on button click
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
