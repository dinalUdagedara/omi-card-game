import { useStore } from "@/store/state";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import Image from "next/image";
import { Skeleton } from "../../ui/skeleton";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";

const Scoreboard = () => {
  const team1Points = useStore((state) => state.team1Points);
  const team2Points = useStore((state) => state.team2Points);
  const trumpSuit = useStore((state) => state.trumpSuit);

  const roundsWonbyTeam1 = useStore((state) => state.roundsWonbyTeam1);
  const roundsWonbyTeam2 = useStore((state) => state.roundsWonbyTeam2);
  const team1PenaltyCards = useStore((state) => state.team_1_penaltyCards);
  const team2PenaltyCards = useStore((state) => state.team_2_penaltyCards);
  return (
    <div className="flex flex-col justify-center items-center  h-full ">
      <div className="relative min-h-[90px] min-w-[330px] lg:w-[510px] lg:h-[120px]  rounded-lg  shadow-lg inv-rad inv-rad-16">
        <Image
          alt="Mountains"
          src={modeCardBackground}
          fill
          sizes="(min-width: 808px) 50vw, 100vw"
          style={{
            objectFit: "fill",
          }}
        />
        <div className="absolute inset-0 text-black m-2 inv-rad inv-rad-16  flex ">
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
          <div className="flex   justify-center z-20 w-full items-center gap-5 p-5">
            {/* <div className="z-20 flex  justify-center gap-10 items-center bg-gradient-to-t from-amber-800 via-amber-900 to-amber-950 text-white w-[450px] py-3 rounded-b-full shadow-lg  hover:scale-105  duration-300 ease-in-out"> */}
            <div className="z-20 flex flex-col justify-center items-center space-y-2">
              <div className="text-4xl font-bold">{team1Points}</div>
              <div className="text-sm uppercase tracking-wide">Ours</div>
            </div>

            <div>
              {trumpSuit ? (
                <Avatar className=" w-16 h-16 p bg-white rounded-full shadow-lg  border-indigo-300">
                  <AvatarImage
                    src={`/assets/suits/${trumpSuit}.png`}
                    className="rounded-full p-2"
                  />
                  <AvatarFallback className="text-lg font-semibold">
                    Trump
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex flex-row justify-between w-full items-center z-20">
                  <Skeleton className="h-14 w-14 rounded-full bg-blue-300" />
                </div>
              )}
            </div>
            <div className="z-20 flex flex-col justify-center items-center space-y-2">
              <div className="text-4xl font-bold">{team2Points}</div>
              <div className="text-sm uppercase tracking-wide">Theirs</div>
            </div>
            {/* </div>{" "} */}
          </div>
        </div>
      </div>
      <div className="flex w-full px-12">
        <div className="w-full">
          <PenaltyDeckMobile penaltyCardNumber={team1PenaltyCards} />
        </div>
        <div className="w-full">
          <PenaltyDeckMobile penaltyCardNumber={team2PenaltyCards} />
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
