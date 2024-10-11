"use client";
import { Card, CardFooter, Button } from "@nextui-org/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";
import Image from "next/image";
import room1 from "@/public/assets/images/rooms/room1.png";
import room2 from "@/public/assets/images/rooms/room2.png";
import room3 from "@/public/assets/images/rooms/room3.png";
import room4 from "@/public/assets/images/rooms/room4.png";

const PublicRooms = () => {
  const availableRooms = useQuery(api.rooms.getAllActivePublicRooms);

  // Array of images
  const roomImages = [room1, room2, room3, room4];

  return (
    <div className="flex flex-col md:flex-row gap-5">
      {availableRooms?.map((room, index) => {
        // Get a random image from the array
        const randomImage = roomImages[index % roomImages.length];

        return (
          <div key={index}>
            <Link href={`/multiplayer/start/public/${room.roomName}`}>
              <Button className="w-full h-full bg-inherit hover:bg-inherit">
                <Card
                  isFooterBlurred
                  radius="lg"
                  className="border-none hover:scale-105"
                >
                  <Image
                    className="max-h-72"
                    src={randomImage}
                    alt="Room preview"
                    width={300}
                    height={300}
                    blurDataURL="data:..."
                    placeholder="blur"
                  />
                  <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                    <p className="text-sm text-white/80">{room.roomName}</p>
                    <p className="text-tiny text-white bg-black/20">Join</p>
                  </CardFooter>
                </Card>
              </Button>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PublicRooms;
