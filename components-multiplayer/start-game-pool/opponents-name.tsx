"use client";
import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useQuery } from "convex/react";
import Lottie from "lottie-react";
import userAnimation from "@/public/assets/lottie-animations/user.json";

type Props = {
  roomName: string;
  userName: string;
};

const OpponentsName = (props: Props) => {
  const roomName = props.roomName;
  const userName = props.userName;

  // const opoonentsName = useQuery(api.rooms.getOpponentsName, {
  //   roomName: roomName,
  //   userName: userName,
  // });

  const otherUsers = useQuery(api.rooms.getAllPlayersUsernamesInRoom, {
    roomName: roomName,
    userName: userName,
  });
  console.log("other users", otherUsers);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-28 justify-items-center max-w-md mx-auto">
        {otherUsers?.map((user) => (
          <div
            key={user}
            className="flex flex-col justify-center items-center bg-muted/40 w-32 h-32 lg:h-40 lg:w-40 rounded-full px-6 py-3 text-center gap-2"
          >
            <div>
              <Lottie animationData={userAnimation} loop={false} />
            </div>
            <span className="font-semibold font-sans">{user}</span>
          </div>
        ))}
      </div>

      {/* <div className="bg-blue-950 rounded-full p-20 ">{opoonentsName}</div> */}
    </>
  );
};

export default OpponentsName;
