"use client";
import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useQuery } from "convex/react";

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
    userName:userName
  });
  console.log("other users", otherUsers);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-16 justify-items-center max-w-md mx-auto">
        {otherUsers?.map((user) => (
          <div
            key={user}
            className="flex justify-center items-center bg-blue-950 text-white h-40 w-40 rounded-full px-6 py-3 text-center shadow-lg"
          >
            {user}
          </div>
        ))}
      </div>

      {/* <div className="bg-blue-950 rounded-full p-20 ">{opoonentsName}</div> */}
    </>
  );
};

export default OpponentsName;
