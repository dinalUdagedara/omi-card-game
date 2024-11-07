"use client";
import { Card, CardFooter } from "@nextui-org/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import logoIcon from "@/public/assets/images/logo-icon.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import room1 from "@/public/assets/images/rooms/room1.png";
import room2 from "@/public/assets/images/rooms/room2.png";
import room3 from "@/public/assets/images/rooms/room3.png";
import room4 from "@/public/assets/images/rooms/room4.png";
import { useHoverSound, useClickSound } from "@/utils/play-sounds";
import { useStore } from "@/store/state";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const PublicRoomContainer = () => {
  const availableRooms = useQuery(api.rooms.getAllActivePublicRooms);
  const muted = useStore((state) => state.muted);
  const { playHoverSound } = useHoverSound();
  const { playClickButton } = useClickSound();
  // Array of images
  const roomImages = [room1, room2, room3, room4];
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const createRoom = () => {
    setLoading(true);
    playClickButton(muted);
    router.push(`/multiplayer/create-room`);
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
    <div className="relative w-[350px] min-h-[550px] sm:w-[400px] sm:h-[600px] sm:min-w-[400px] sm:min-h-[600px] h-full rounded-lg  shadow-lg inv-rad inv-rad-8">
      <Image
        alt="Mountains"
        src={modeCardBackground}
        fill
        sizes="(min-width: 808px) 50vw, 100vw"
        style={{
          objectFit: "fill",
        }}
      />
      <div className="absolute inset-0  text-black m-2 inv-rad inv-rad-8  flex  ">
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

          <div className="mt-5 flex flex-col justify-center items-center w-full">
            <div>
              <h1 className="text-3xl font-bold underline">Available Rooms</h1>
            </div>
            <ScrollArea className="h-72">
              <div className="grid grid-cols-2 gap-5 ">
                {availableRooms?.map((room, index) => {
                  // Get a random image from the array
                  const randomImage = roomImages[index % roomImages.length];

                  return (
                    <div key={index} className="flex flex-col mt-3">
                      <Link
                        onClick={() => {
                          playClickButton(muted);
                        }}
                        href={`/multiplayer/start/public/${room.roomName}`}
                      >
                        <Button className="w-full h-full bg-inherit hover:bg-inherit">
                          <Card
                            isFooterBlurred
                            radius="lg"
                            className="border-none hover:scale-105 w-[150px] h-[150px] rounded"
                          >
                            <Image
                              className="max-h-72"
                              src={randomImage}
                              alt="Room preview"
                              width={200}
                              height={200}
                              blurDataURL="data:..."
                              placeholder="blur"
                            />

                            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                              <p className="text-sm text-white/80">
                                {room.roomName}
                              </p>
                              <p className="text-tiny text-white bg-black/20">
                                Join
                              </p>
                            </CardFooter>
                          </Card>
                        </Button>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <div className="flex items-center justify-center flex-grow  z-20">
            <Button
              onMouseEnter={() => {
                playHoverSound(muted);
              }}
              onClick={createRoom}
              disabled={loading}
              className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md"
            >
              {loading ? (
                <div className="flex gap-2">
                  <Loader2 className="animate-spin" />
                  Please Wait..
                </div>
              ) : (
                "Create a Room"
              )}
            </Button>
            {/* </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicRoomContainer;
