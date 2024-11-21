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
import 'react-circular-progressbar/dist/styles.css';

const UserAvatarContainerWithTimeOut = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();
  const playerTurnUserName = useQuery(api.gameLogic.getPlayerTurnName, {
    roomName: roomId || "",
  });
  const [seconds, setSeconds] = useState(15); // Initial value set to 10 seconds
  // Reset timer whenever playerTurnUserName changes
  useEffect(() => {
    setSeconds(15); // Reset to 15 seconds

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // Cleanup the interval on component unmount
  }, [playerTurnUserName]); // Trigger when playerTurnUserName changes

  useEffect(() => {
    if (seconds === 0) return; // Stop the timer when it reaches 0
  }, [seconds]);

  return (
    <div>
      <CircularProgressbarWithChildren
        className="relative w-16 h-16 lg:w-32 lg:h-32 z-20"
        value={seconds * 6}
      >
        <motion.div
          className=" rounded-full"
          initial={{ boxShadow: "none" }}
          animate={{
            boxShadow:
              //   playerTurnUserName === opponent_2
              //     ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
              //     : "none", // No shadow when it's not players's turn
              "0 0 16px rgba(0, 255, 0, 0.8)", // Green glowing effect
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
    </div>
  );
};

export default UserAvatarContainerWithTimeOut;
