import { ReactNode } from "react";
import Image from "next/image";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";

interface NameCardTemplateProps {
  children: ReactNode;
}

const NameCardTemplate: React.FC<NameCardTemplateProps> = ({ children }) => {
  return (
    <>
      {" "}
      <div className="flex justify-center items-center  h-full ">
        <div className="relative h-[80px] w-[50px] lg:w-[100px] lg:h-[40px]  rounded-lg  shadow-lg ">
          <Image
            className="rounded-md"
            alt="Mountains"
            src={modeCardBackground}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
          />
          <div className="absolute inset-0 text-black m-2  flex   ">
            <Image
              className="rounded-md"
              alt="Mountains"
              src={notificaitonBackGround}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{
                objectFit: "fill",
              }}
            />
            <div className="z-20 flex items-center justify-center w-full font-semibold">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NameCardTemplate;
