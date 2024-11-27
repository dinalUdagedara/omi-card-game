import Image from "next/image";
import { motion } from "framer-motion";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MultiplayerStateStore } from "@/store/multiplayer-state";

interface AvatarProps {
  userName: string | undefined;
}

const UserAvatarContainer = ({ userName }: AvatarProps) => {
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

  useEffect(() => {
    checkIfPlayerOnline();
  }, [userName, roomName]);

  return (
    <div>
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
    </div>
  );
};

export default UserAvatarContainer;
