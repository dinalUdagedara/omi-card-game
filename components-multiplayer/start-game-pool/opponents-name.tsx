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

  const opoonentsName = useQuery(api.rooms.getOpponentsName, {
    roomName: roomName,
    userName: userName,
  });

  return (
    <>
      <div className="bg-blue-950 rounded-full p-20 ">{opoonentsName}</div>
    </>
  );
};

export default OpponentsName;
