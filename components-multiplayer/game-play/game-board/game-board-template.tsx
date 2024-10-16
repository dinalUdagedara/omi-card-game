"use client";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/backgrounds/game-board-background.png";
// import notificaitonBackGround from "@/public/assets/images/backgrounds/game-board-background6.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface NotificationCardTemplateProps {
    children: ReactNode;
  }
  
  const NotificationCardTemplate: React.FC<NotificationCardTemplateProps> = ({ children }) => {
    
  return (
    <div className="flex justify-center items-center  h-full ">
      <div className="relative w-[200px] lg:w-[400px] lg:min-h-[430px] h-[250px] md:h-full shadow-lg">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
          className="rounded-2xl "
        />
        <div className="absolute inset-0  text-black m-2   flex  ">
          <Image
            alt="Mountains"
            src={notificaitonBackGround}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
            className="rounded-2xl "
          />
          {/* Card Header */}
          <div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationCardTemplate;
