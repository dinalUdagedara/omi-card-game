"use client";
import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import MyName from "./my-name";
import OpponentsName from "./opponents-name";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserNameInputPrivate from "../user-name-input/user-name-input-private";

type Props = {
  roomId: string;
};

const StartGamePoolPrivateNew = (props: Props) => {
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

  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);
  return (
    <div className="flex justify-center w-full items-center min-h-screen">
      <div className=" relative w-[1000px] min-h-[650px] h-full rounded-lg  shadow-lg inv-rad inv-rad-8">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0  text-black m-2 inv-rad inv-rad-8  flex  border-2">
          <Image
            alt="Mountains"
            src={notificaitonBackGround}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
          />
          {/* Card Header */}
          <div className="flex flex-col  justify-start z-20 w-full items-center p-5">
            <div>
              <Image
                src={logoIcon}
                width={100}
                height={100}
                alt="Picture of the author"
              />
            </div>

            <div className="mt-5 flex flex-col justify-center items-center w-full">
              <div>
                <h1 className="text-3xl font-bold underline">Waiting Room</h1>
              </div>
              <div>
                {userName ? (
                  <div>
                    <div className="flex  justify-cente">
                      {isOpponentJoinedDB && userName ? (
                        <div className="flex flex-col lg:gap-5 p-5">
                          <div className="flex justify-center gap-10">
                            <OpponentsName
                              userName={userName}
                              roomName={roomId}
                            />
                          </div>
                          <div className="flex flex-col lg:flex-row justify-center items-center">
                            <MyName />
                            <div
                              className={`p-20  ${isRoomCreatorDB ? "flex" : " hidden"}`}
                            >
                              <Button
                                disabled={!isAllJoined}
                                className="h-20 w-80 rounded-2xl"
                                onClick={handleStartGame}
                              >
                                Start Private Game
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col lg:flex-row justify-center h-full items-center ">
                          <div>
                            <MyName />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col lg:flex-row  gap-20 lg:gap-40 justify-center items-center">
                    <UserNameInputPrivate />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartGamePoolPrivateNew;
