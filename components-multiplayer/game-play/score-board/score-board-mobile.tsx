import { useStore } from "@/store/state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useEffect } from "react";
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
  const teamPoints = useQuery(api.gameLogic.getTeamPoints, {
    roomName: roomName,
  });
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  function setPoints() {
    console.log("myteam", myTeam);
    if (myTeam === 1) {
      const myTeamPoints = teamPoints?.team1;
      const opponentTeamPoints = teamPoints?.team2;
      setTeam1Points(myTeamPoints ?? 0);
      setTeam2Points(opponentTeamPoints ?? 0);
    }
    if (myTeam === 2) {
      const myTeamPoints = teamPoints?.team2;
      const opponentTeamPoints = teamPoints?.team1;
      setTeam1Points(myTeamPoints ?? 0);
      setTeam2Points(opponentTeamPoints ?? 0);
    }
  }

  useEffect(() => {
    console.log("teamPoints", teamPoints);
    if (teamPoints) {
      setPoints();
    }
  }, [teamPoints, trumpSuit]);

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
