"use client";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import person from "@/public/assets/lottie-animations/person.json";
import Image from "next/image";
import user1Avatar from "@/public/assets/images/user-avatars/person1.png";

const MyName = () => {
  const userName = MultiplayerStateStore((state) => state.userName);
  return (
    <>
      <div className="rounded-full items-center justify-center flex flex-col h-60 w-60">
        <div>
          {/* <Lottie animationData={person} loop={true} /> */}
          <Image
            src={user1Avatar}
            alt="Picture of the author"
            width={500}
            height={500}
          />
        </div>
        <span className="font-bold text-lg">{userName}</span>
      </div>
    </>
  );
};
person;

export default MyName;
