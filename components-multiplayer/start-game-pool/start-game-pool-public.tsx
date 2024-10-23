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

type Props = {
  roomId: string;
};

const StartGamePoolPublicNew = (props: Props) => {
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
      <div className=" relative w-[400px] md:w-[1000px] min-h-[680px] h-full rounded-lg  shadow-lg inv-rad inv-rad-8 ">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0  text-black m-2 inv-rad inv-rad-8  flex ">
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
                alt="Picture of the Icon"
              />
            </div>

            <div className="mt-5 flex flex-col justify-center items-center w-full">
              <div>
                <h1 className="text-3xl font-bold underline">Waiting Room</h1>
              </div>
              <div>
                {isOpponentJoinedDB && userName ? (
                  <div>
                    {!isAllJoined && (
                      <div className="pt-2 text-center text-lg">
                        "We're just waiting for all players to join! Hang
                        tight."
                      </div>
                    )}

                    <div className="flex justify-center">
                      <OpponentsName userName={userName} roomName={roomId} />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center items-center pt-4 gap-4">
                      <MyName />
                      <div
                        className={`${isRoomCreatorDB ? "flex" : " hidden"}`}
                      >
                        <Button
                          disabled={!isAllJoined}
                          onClick={handleStartGame}
                          className=" h-16 w-72 sm:h-20 sm:w-80 inv-rad-10 inv-rad bg-amber-950 text-white hover:bg-amber-900 text-lg"
                        >
                          Start Game
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center h-full items-center">
                    <div className="pt-6 text-center text-lg">
                      {/* // ? "We're just waiting for all players to join! Hang tight." */}
                      "No players have joined yet. Waiting for others to
                      join..."
                    </div>
                    <div>
                      <MyName />
                    </div>
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

export default StartGamePoolPublicNew;
