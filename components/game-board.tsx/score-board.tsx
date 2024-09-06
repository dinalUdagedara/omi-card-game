import { useStore } from "@/store/state";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";

const Scoreboard = () => {
  const team1Points = useStore((state) => state.team1Points);
  const team2Points = useStore((state) => state.team2Points);
  const trumpSuit = useStore((state) => state.trumpSuit);

  const roundsWonbyTeam1 = useStore((state) => state.roundsWonbyTeam1);
  const roundsWonbyTeam2 = useStore((state) => state.roundsWonbyTeam2);
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 text-white w-full m-4 p-6 rounded-xl shadow-lg  hover:scale-105  duration-300 ease-in-out">
      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="text-4xl font-bold">{team1Points}</div>
        <div className="text-sm uppercase tracking-wide">Ours</div>
        <div className="text-sm">
          Rounds Won: <span className="font-semibold">{roundsWonbyTeam1}</span>
        </div>
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
        ):(
          <div className="flex flex-row justify-between w-full items-center">
          <Skeleton className="h-14 w-14 rounded-full bg-blue-300" />
        </div>
        ) } 
    
      </div>

      <div className="flex flex-col justify-center items-center space-y-2">
        <div className="text-4xl font-bold">{team2Points}</div>
        <div className="text-sm uppercase tracking-wide">Theirs</div>
        <div className="text-sm">
          Rounds Won: <span className="font-semibold">{roundsWonbyTeam2}</span>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
