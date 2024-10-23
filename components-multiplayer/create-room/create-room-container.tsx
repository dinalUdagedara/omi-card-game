"use client";
import { FaRegCopy } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { generateRandomName } from "@/utils/types-multiplayer";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const CreateRoomContainer = () => {
  const [roomName, setRoomName] = useState<string>(generateRandomName());
  const [isRoomCreated, setIsRoomCreated] = useState<boolean>(false);
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(false);
  const [privateLinkUrl, setPrivateLinkUrl] = useState<string>(
    "Link Will Appear Here"
  );
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const createRoomsDB = useMutation(api.rooms.createRoom);
  const handleCreateRoom = () => {
    if (userName)
      createRoomsDB({
        roomName,
        isRoomPrivate,
        userName,
      });
    if (isRoomPrivate) {
      toast(`Private Room has been created. ${roomName}`);
      createPrivateRoomLink();
    } else {
      toast(`Public Room has been created. ${roomName}`);
    }

    localStorage.setItem(`roomCreator_${roomName}`, JSON.stringify(userName));

    setIsRoomCreated(true);
  };

  // Handler to change room type based on tab selection
  const handleTabChange = (value: string) => {
    setIsRoomPrivate(value === "private");
  };

  const createPrivateRoomLink = () => {
    const prvURL = `http://localhost:3000/multiplayer/start/private/${roomName}`;
    setPrivateLinkUrl(prvURL);
  };

  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);
  return (
    <div className="flex justify-center items-center  h-full min-h-screen w-full ">
      <div className="relative w-[350px] h-[550px] sm:w-[400px] sm:h-[600px] rounded-lg  shadow-lg inv-rad inv-rad-8">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0  text-black m-2 inv-rad inv-rad-8  flex ">
          <Image
            alt="Mountains"
            src={notificaitonBackGround}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
          />
          {/* Card Header */}
          <div className="flex flex-col  justify-start z-20 w-full items-center p-5">
            <div>
              <Image
                src={logoIcon}
                width={100}
                height={100}
                alt="Picture of the author"
              />
            </div>

            <div>
              <Tabs
                defaultValue="public"
                className="w-[350px]  lg:w-[400px] z-20 px-6 mt-5"
                onValueChange={handleTabChange}
              >
                <TabsList className="grid w-full px-4 grid-cols-2 bg-transparent">
                  <TabsTrigger
                    className=" text-black data-[state=active]:bg-amber-900 data-[state=active]:inv-rad-5 inv-rad font-bold text-md"
                    value="private"
                  >
                    Private
                  </TabsTrigger>
                  <TabsTrigger
                    className=" text-black data-[state=active]:bg-amber-900 data-[state=active]:inv-rad-5 inv-rad font-bold text-md"
                    value="public"
                  >
                    Public
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="private">
                  <Card className="min-h-[350px] flex flex-col justify-between bg-transparent border-0 text-black">
                    <CardHeader className="space-y-2">
                      <CardTitle className=" flex justify-center font-bold underline">
                        Create a Private Room
                      </CardTitle>
                      <CardDescription className="text-black text-md text-center font-semibold pt-3">
                        Create a Private Room, Share it With your friends and
                        Play with your friends
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-9 mt-4">
                      <div className="space-y-1 flex justify-center">
                        <Button
                          onClick={handleCreateRoom}
                          disabled={isRoomCreated}
                          className="w-52 h-9 inv-rad-5 inv-rad bg-amber-950 text-white hover:bg-amber-900"
                        >
                          Create a Private Room
                        </Button>
                      </div>
                      <div className="space-y-1 flex items-center text-white px-3">
                        <Input
                          disabled
                          type="url"
                          value={privateLinkUrl}
                          className="w-full bg-amber-900 border-0"
                        />
                        <Button
                          size={"icon"}
                          disabled={!isRoomCreated}
                          className="ml-2 bg-amber-950 hover:bg-amber-900"
                          onClick={() =>
                            navigator.clipboard.writeText(privateLinkUrl)
                          }
                        >
                          <FaRegCopy color="white" />
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        disabled={!isRoomCreated}
                        className="bg-amber-950 text-white hover:bg-amber-900"
                      >
                        <Link href={`/multiplayer/start/private/${roomName}`}>
                          Next
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="public">
                  <Card className="min-h-[350px] flex flex-col justify-between bg-transparent border-0 text-black">
                    <CardHeader className="">
                      <CardTitle className="flex justify-center font-bold underline">
                        Create a Public Room
                      </CardTitle>
                      <CardDescription className="text-black text-md text-center font-semibold pt-3">
                        Create a Public Room to Play With Complete Strangers
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1 flex justify-center -mt-2">
                        <Button
                          disabled={isRoomCreated}
                          onClick={handleCreateRoom}
                          className="w-52 h-9 inv-rad-5 inv-rad bg-amber-950 text-white hover:bg-amber-900"
                        >
                          Create a Public Room
                        </Button>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end">
                      <Button
                        disabled={!isRoomCreated}
                        className="bg-amber-950 text-white hover:bg-amber-900"
                      >
                        <Link href={`/multiplayer/start/public/${roomName}`}>
                          Next
                        </Link>{" "}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomContainer;
