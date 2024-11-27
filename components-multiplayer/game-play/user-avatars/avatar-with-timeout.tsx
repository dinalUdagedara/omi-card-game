"use client";
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { usePathname } from "next/navigation";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import "react-circular-progressbar/dist/styles.css";
import { useStore } from "@/store/state";
import { useMutation } from "convex/react";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

interface UserAvatarContainerWithTimeOutProps {
  userName: string | undefined;
}

const UserAvatarContainerWithTimeOut = ({
  userName,
}: UserAvatarContainerWithTimeOutProps) => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const checkPlayerStatus = useMutation(api.autoPlayingBot.checkPlayerStatus);
  const roomName = MultiplayerStateStore((state) => state.roomName);

  async function checkIfPlayerOnline() {
    if (userName && roomName) {
      const isOffline = await checkPlayerStatus({
        roomName: roomName,
        userName: userName,
      });
      if (!isOffline) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }
  }

  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const playerTurnUserName = useQuery(api.gameLogic.getPlayerTurnName, {
    roomName: roomId || "",
  });
  const noOfPlayingcards = useQuery(api.gameLogic.noOfPlayingCards, {
    roomName: roomId || "",
  });
  const trumpSuit = useStore((state) => state.trumpSuit);
  const [seconds, setSeconds] = useState(15); // Initial value set to 15 seconds
  // Reset timer whenever playerTurnUserName changes
  useEffect(() => {
    const num = noOfPlayingcards ?? 0;
    if (num < 4 && trumpSuit) {
      setSeconds(15); // Reset to 15 seconds

      const interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }
  }, [playerTurnUserName, noOfPlayingcards, trumpSuit]);

  useEffect(() => {
    if (seconds === 0) return; // Stop the timer when it reaches 0
  }, [seconds]);

  useEffect(() => {
    checkIfPlayerOnline();
  }, [userName, roomName]);

  return (
    <div>
      {isOnline ? (
        <CircularProgressbarWithChildren
          styles={{
            path: {
              stroke: "#3e2723", // Dark brown color for the progress path
              strokeLinecap: "round", // Rounded corners for a smooth finish
            },
            trail: {
              stroke: "#d7ccc8", // Light beige/cream color for the background trail
            },
          }}
          className="relative w-16 h-16 lg:w-32 lg:h-32 z-20"
          value={seconds * 6.666}
        >
          <motion.div
            className=" rounded-full"
            initial={{ boxShadow: "none" }}
            animate={{
              boxShadow: "0 0 20px rgba(255, 255, 255, 0.8)", // White glowing effect
            }}
            transition={{
              duration: 0.8,
            }}
          >
            <Avatar className="relative w-14 h-14 lg:w-28 lg:h-28 shadow-md ">
              <Image
                alt="Mountains"
                src={notificaitonBackGround}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "cover",
                }}
              />
              <AvatarImage
                className="z-20"
                src={`/assets/images/user-avatars/person8.png`}
              />
              <AvatarFallback>Dp</AvatarFallback>
            </Avatar>
          </motion.div>
        </CircularProgressbarWithChildren>
      ) : (
        <motion.div
          className="rounded-full"
          initial={{ boxShadow: "none" }}
          transition={{
            duration: 0.8,
          }}
        >
          <Avatar className="relative w-16 h-16 lg:w-32 lg:h-32 shadow-md z-20 overflow-visible ">
            {/* Background Image */}
            <Image
              className="rounded-full"
              alt="Mountains"
              src={notificaitonBackGround}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{
                objectFit: "cover",
              }}
            />

            {/* User Avatar */}
            <AvatarImage
              className="z-20"
              src={`/assets/images/user-avatars/person8.png`}
            />

            {/* Online/Offline Status Icon */}
            <div
              className={`absolute bottom-1 right-1 w-4 h-4 lg:w-6 lg:h-6 rounded-full border-2 border-white z-30 transform translate-x-1/4 translate-y-1/4 ${
                isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            />
          </Avatar>
        </motion.div>
      )}
    </div>
  );
};

export default UserAvatarContainerWithTimeOut;
