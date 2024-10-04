import { useStore } from "@/store/state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import MyScore from "./my-score";
import OpponentScore from "./opponent-score";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
interface ScoreBoardMobileMultiplayerProps {
  userID: Id<"players">;
  roomName: string;
}

const ScoreBoardMobileMultiplayer = ({
  userID,
  roomName,
}: ScoreBoardMobileMultiplayerProps) => {
  const team1Points = useStore((state) => state.team1Points);
  const team2Points = useStore((state) => state.team2Points);
  const setTeam1Points = useStore((state) => state.setTeam1Points);
  const setTeam2Points = useStore((state) => state.setTeam2Points);
  const trumpSuit = useStore((state) => state.trumpSuit);
  const gamePoints = useQuery(api.gameLogic.getPlayersPoints, {
    roomName: roomName,
  });

  if (gamePoints) {
    const myPoints = gamePoints.find(
      (team) => team.playerId === userID
    )?.points;
    if (myPoints) {
      setTeam1Points(myPoints);
    }

    // Find the opponent's points by selecting a player who isn't the current user
    const opponentsPoint = gamePoints.find(
      (team) => team.playerId !== userID
    )?.points;

    if (opponentsPoint) {
      setTeam2Points(opponentsPoint);
    }
  }

  return (
    <div className="flex justify-center gap-10 items-center bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 text-white w-full py-3 rounded-b-full shadow-lg  hover:scale-105  duration-300 ease-in-out">
      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="text-4xl font-bold">{team1Points}</div>
        <div className="text-sm uppercase tracking-wide">Ours</div>
      </div>

      <div>
        {trumpSuit ? (
          <Avatar className="w-16 h-16 p-2 bg-white rounded-full shadow-lg border-2 border-indigo-300">
            <AvatarImage
              src={`/assets/suits/${trumpSuit}.png`}
              className="rounded-full"
            />
            <AvatarFallback className="text-lg font-semibold">
              Trump
            </AvatarFallback>
          </Avatar>
        ) : (
          <div className="flex flex-row justify-between w-full items-center">
            <Skeleton className="h-14 w-14 rounded-full bg-blue-300" />
          </div>
        )}
      </div>
      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="text-4xl font-bold">{team2Points}</div>
        <div className="text-sm uppercase tracking-wide">Theirs</div>
      </div>
    </div>
  );
};

export default ScoreBoardMobileMultiplayer;
