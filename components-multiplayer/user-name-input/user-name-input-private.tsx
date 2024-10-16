"use client";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import cardHeaderCoverMultiplayer from "@/public/assets/images/cover.png";
import cardContentCover from "@/public/assets/images/Background (1).png";
import titleCover from "@/public/assets/images/title-cover.png";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useState } from "react";
const UserNameInputPrivate = () => {
  const [username, setUsername] = useState<string | null>(null);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);

  function handleSelectUserName() {
    console.log("enter username", username);
    if (username) {
      setUserName(username);
      localStorage.setItem("userName", username);
    }
  }
  return (
    <div>
      <div>
        <div className="w-full h-full bg-inherit hover:bg-inherit mt-10">
          <Card
            isFooterBlurred
            radius="lg"
            className="col-span-12 sm:col-span-4 md:h-[300px] md:w-[350px] min-w-[300px]"
          >
            <CardHeader className="absolute z-10 flex-col !items-start rounded-none text-black">
              <div
                className="w-full"
                style={{ position: "relative", height: "90px" }}
              >
                <Image alt="Content Cover" src={titleCover} fill />
                {/* Text Overlay */}
                <div className="absolute z-20 w-full h-full mt-3 px-3">
                  <p className="uppercase font-bold text-xl">Enter Your Name</p>
                  <h4 className="font-medium text-large">
                    choose a name to display other users
                  </h4>
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
                  <div style={{ position: "relative", height: "150px" }}>
                    <Image
                      className="px-2"
                      alt="Header Cover"
                      src={cardHeaderCoverMultiplayer}
                      fill
                      sizes="(min-width: 808px) 50vw, 100vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>

                <div className="h-full text-black overflow-hidden flex flex-col gap-2 -mt-6 w-full">
                  <div style={{ position: "relative", height: "200px" }}>
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
                      <div className="flex flex-col w-full max-w-sm items-center h-full justify-between">
                        <Input
                          onChange={(e) => {
                            setUsername(e.target.value);
                          }}
                          type="text"
                          placeholder="Enter a User Name"
                          className="bg-inherit border-0 h-20 text-2xl text-center focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Button
                          className="bg-amber-950 text-white rounded-2xl hover:bg-amber-800 p-5 text-md"
                          onClick={handleSelectUserName}
                          disabled={!username}
                          type="submit"
                        >
                          Enter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserNameInputPrivate;
