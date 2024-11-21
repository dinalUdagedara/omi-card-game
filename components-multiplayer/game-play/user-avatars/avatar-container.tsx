import Image from "next/image";
import { motion } from "framer-motion";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const UserAvatarContainer = () => {
  return (
    <div>
      <motion.div
        className=" rounded-full"
        initial={{ boxShadow: "none" }}
        transition={{
          duration: 0.8,
        }}
      >
        <Avatar className="relative w-16 h-16 lg:w-32 lg:h-32 shadow-md z-20 ">
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
        </Avatar>
      </motion.div>
    </div>
  );
};

export default UserAvatarContainer;
