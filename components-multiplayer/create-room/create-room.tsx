"use client";
import { Button } from "@/components/ui/button";
import { FaRegCopy } from "react-icons/fa6";
import SocketManager from "@/services/web-socket-service";
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
import Link from "next/link";
import { generateRandomName } from "@/utils/types-multiplayer";

const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

const CreateRoomComponent = () => {
  const [roomName, setRoomName] = useState<string>(generateRandomName());
  const [isRoomCreated, setIsRoomCreated] = useState<boolean>(false);

  const handleCreatePublicRoom = () => {
    SocketManager.joinRoom(roomName, userName);
    toast(`Public Room has been created. ${roomName}`);
    setIsRoomCreated(true);
  };

  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);

  useEffect(() => {
    // Ensure the code only runs in the browser
    if (typeof window !== "undefined") {
      const storedUserName = localStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    }
  }, []);

  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, []);
  return (
    <div className="flex justify-center items-center h-full min-h-[700px] ">
      <Tabs defaultValue="private" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="private">Private</TabsTrigger>
          <TabsTrigger value="public">Public</TabsTrigger>
        </TabsList>
        <TabsContent value="private">
          <Card className="min-h-[350px] flex flex-col justify-between ">
            <CardHeader className="space-y-2">
              <CardTitle>Create a Private Room</CardTitle>
              <CardDescription>
                Create a Private Room, Share it With your friends and Play with
                your friends
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-9 mt-4">
              <div className="space-y-1 flex justify-center">
                <Button disabled={isRoomCreated} className="w-52 h-8">
                  Create a Private Room
                </Button>
              </div>
              <div className="space-y-1 flex items-center">
                <Input
                  disabled
                  type="url"
                  value="http://localhost:3000/multiplayer/create-room"
                  className="w-full"
                />
                <Button
                  size={"icon"}
                  className="ml-2"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      "http://localhost:3000/multiplayer/create-room"
                    )
                  }
                >
                  <FaRegCopy />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Next</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="public">
          <Card className="min-h-[300px] flex flex-col justify-between ">
            <CardHeader>
              <CardTitle>Create a Public Room</CardTitle>
              <CardDescription>
                Create a Public Room Play With Complete Strangers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1 flex justify-center">
                <Button
                  disabled={isRoomCreated}
                  onClick={handleCreatePublicRoom}
                  className="w-52 h-8"
                >
                  Create a Public Room
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Link href={`/multiplayer/start/${roomName}`}>
                <Button>Next</Button>
              </Link>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CreateRoomComponent;
