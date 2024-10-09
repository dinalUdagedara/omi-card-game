import { RoundOverDialogMobile } from "@/components/game-board.tsx/dialogs/round-over-dialog-mobile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FinishStateStore } from "@/store/finish-round-state";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { use, useEffect, useState } from "react";
import { RoundOverDialogMultiplayer } from "../round-over-dialogs/round-over-dialog";
import { useStore } from "@/store/state";

interface RoundOverMultiplayerProps {
  userID: Id<"players">;
  roomName: string;
}
const RoundOverMultiplayer: React.FC<RoundOverMultiplayerProps> = ({
  userID,
  roomName,
}) => {
  const setwonCallingTrumps = FinishStateStore(
    (state) => state.setwonCallingTrumps
  );
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const setwonWithoutCallingTrumps = FinishStateStore(
    (state) => state.setwonWithoutCallingTrumps
  );
  const setlostCallingTrumps = FinishStateStore(
    (state) => state.setlostCallingTrumps
  );
  const setlostWithoutCallingTrumps = FinishStateStore(
    (state) => state.setlostWithoutCallingTrumps
  );
  const setgameTied = FinishStateStore((state) => state.setGameTied);
  const teamPoints = useQuery(api.gameLogic.getTeamPoints, {
    roomName: roomName,
  });
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  const trumpSetter = useQuery(api.gameLogic.getTrumpSetter, {
    roomName: roomName,
  });

  const incrementPenaltyCards = useMutation(
    api.gameLogic.incrementPenaltyCards
  );

  const decrementPenaltycards = useMutation(
    api.gameLogic.decrementPenaltyCards
  );

  const [myTeamPoints, setmyTeamPoints] = useState<number>(0);
  const [opponentTeamPoints, setopponentTeamPoints] = useState<number>(0);

  const team1Points = useStore((state) => state.team1Points);
  const team2Points = useStore((state) => state.team2Points);

  const wonWithoutCallingTrumps = FinishStateStore(
    (state) => state.wonWithoutCallingTrumps
  );
  const wonCallingTrumps = FinishStateStore((state) => state.wonCallingTrumps);

  const lostCallingTrumps = FinishStateStore(
    (state) => state.lostCallingTrumps
  );
  const lostWithoutCallingTrumps = FinishStateStore(
    (state) => state.lostWithoutCallingTrumps
  );

  function getMyTeam() {
    // console.log("teamPoints", teamPoints);
    // console.log("myteeam", myTeam);
    // console.log("myTeam === 1", myTeam === 1);
    // console.log("team2Points", team2Points);
    // console.log("team1Points", team1Points);

    const myTeamPoints = team1Points;
    // console.log("myteampoints", myTeamPoints);
    const opponentTeamPoints = team2Points;
    setmyTeamPoints(myTeamPoints ?? null);
    setopponentTeamPoints(opponentTeamPoints ?? null);
  }

  async function checkRoundWinner() {
    getMyTeam();

    const myPoints = myTeamPoints;
    // Find the opponent's points by selecting a player who isn't the current user
    const opponentsPoint = opponentTeamPoints;

    // console.log("myPoints", myPoints);
    // console.log("opponentsPoint", opponentsPoint);
    // console.log("roomName", roomName);
    // console.log("trumpSetter", trumpSetter);
    // console.log("myTeamPoints", myTeamPoints);
    // console.log("opponentTeamPoints", opponentTeamPoints);

    if (myPoints > opponentsPoint) {
      if (trumpSetter === userID) {
        setwonCallingTrumps(true);
      } else {
        setwonWithoutCallingTrumps(true);
      }
    } else if (opponentsPoint > myPoints) {
      if (trumpSetter === userID) {
        decrementPenaltycards({
          decrementvalue: 2,
          roomName,
          userID,
        });
        setlostCallingTrumps(true);
      } else {
        decrementPenaltycards({
          decrementvalue: 1,
          roomName,
          userID,
        });
        setlostWithoutCallingTrumps(true);
      }
    } else {
      setgameTied(true);
    }
  }

  useEffect(() => {
    getMyTeam(); // Fetch team data when the component mounts or updates

    if (trumpSetter) {
      checkRoundWinner();
      setDialogOpen(true);
    }
  }, [myTeam, teamPoints, trumpSetter]);

  useEffect(() => {
    // console.log("myTeamPoints", myTeamPoints);
    // console.log("opponentTeamPoints", opponentTeamPoints);
    // console.log("trumpSetter", trumpSetter);
    if (myTeamPoints && opponentTeamPoints && trumpSetter) {
      checkRoundWinner();
      setDialogOpen(true);
    }
  }, [myTeamPoints, opponentTeamPoints, trumpSetter, myTeam]);

  return (
    <div>
      <RoundOverDialogMultiplayer roomName={roomName} userID={userID} />
    </div>
  );
};

export default RoundOverMultiplayer;
