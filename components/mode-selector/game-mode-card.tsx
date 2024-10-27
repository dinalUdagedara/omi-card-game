"use client";
import { Card, Button, CardHeader, CardBody } from "@nextui-org/react";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import cardHeaderCoverMultiplayer from "@/public/assets/images/multiplayer.png";
import cardHeaderCoverPractice from "@/public/assets/images/practise.png";
import cardContentCover from "@/public/assets/images/Background (1).png";
import titleCover from "@/public/assets/images/title-cover.png";
import Image from "next/image";

interface GameModeCardProps {
  title: string;
  topic: string;
  contentHeader: string;
  content: string;
  nextMessage: string;
}

const GameModeCard: React.FC<GameModeCardProps> = ({
  title,
  topic,
  contentHeader,
  content,
  nextMessage,
}) => {
  return (
    <div>
      <Button className="w-full h-full bg-inherit hover:bg-inherit">
        <Card
          radius="lg"
          className="col-span-12 sm:col-span-4 h-[275px] w-[280px] md:h-[500px] md:w-[350px] "
        >
          <CardHeader className="absolute z-10 flex-col !items-start rounded-none text-black p-2">
            <div className="w-full h-[65px]  md:h-[90px] relative">
              <Image alt="Content Cover" src={titleCover} fill />
              {/* Text Overlay */}
              <div className="absolute z-20 w-full h-full mt-3">
                <p className="uppercase font-bold md:text-xl">{title}</p>
                <h4 className="font-medium sm:text-large text-xs">{topic}</h4>
              </div>
            </div>
          </CardHeader>

          <Image
            alt="Background"
            src={modeCardBackground}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "cover",
            }}
          />

          <CardBody>
            <div className="w-full h-full flex items-center flex-col justify-between gap-2">
              <div className="h-full w-full mt-5">
                <div className=" h-[130px]  md:h-[250px] relative">
                  <Image
                    className="px-2"
                    alt="Header Cover"
                    src={
                      title === "Multiplayer Mode"
                        ? cardHeaderCoverMultiplayer
                        : cardHeaderCoverPractice
                    }
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
              <div className="flex bg-orange-900 w-full rounded-3xl shadow-md justify-between items-center p-2 -mt-4 z-20 px-4">
                <p className="text-xs sm:text-sm">{contentHeader}</p>
                <p className="hidden sm:flex text-xs sm:text-sm bg-black/20 p-2 rounded-xl">
                  {nextMessage}
                </p>
              </div>
              <div className="h-full text-black overflow-hidden flex flex-col gap-2 -mt-4  w-full">
                <div style={{ position: "relative", height: "250px" }}>
                  <Image
                    alt="Content Cover"
                    src={cardContentCover}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                  {/* Text Overlay */}
                  <div className="absolute z-20 w-full h-full flex flex-col px-5 py-5">
                    <span className="text-sm sm:text-lg font-bold">
                      {title}
                    </span>
                    <p className="flex w-full text-xs sm:text-md whitespace-normal leading-tight text-">
                      {content}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </Button>
    </div>
  );
};

export default GameModeCard;
