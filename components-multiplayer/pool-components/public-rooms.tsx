import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

const PublicRooms = () => {
  const availableRooms = useQuery(api.rooms.getAllActivePublicRooms);

  return (
    <div className="flex gap-5">
      {availableRooms?.map((room, index) => (
        <div key={index} className="h-40 w-40">
          <Link href={`/multiplayer/start/public/${room.roomName}`}>
            <Button className="h-full w-full rounded-2xl">{room.roomName}</Button>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default PublicRooms;
