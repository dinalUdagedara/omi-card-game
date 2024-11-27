"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import user4Avatar from "@/public/assets/images/user-avatars/person8.png";

type Props = {
  roomName: string;
  userName: string;
};

const OpponentsName = (props: Props) => {
  const roomName = props.roomName;
  const userName = props.userName;
  const otherUsers = useQuery(api.rooms.getAllPlayersUsernamesInRoom, {
    roomName: roomName,
    userName: userName,
  });

  return (
    <>
      <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 gap-2 lg:gap-28 justify-items-center max-w-md mx-auto pt-4">
        {otherUsers?.map((user) => (
          <div
            key={user}
            className="flex flex-col justify-center items-center w-32 h-32  rounded-full  text-center gap-"
          >
            <div>
              <Image
                src={user4Avatar}
                alt="Picture of the author"
                width={400}
                height={400}
              />
            </div>
            <span className="font-semibold ">{user}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default OpponentsName;
