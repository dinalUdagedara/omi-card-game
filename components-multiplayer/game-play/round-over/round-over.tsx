import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FinishStateStore } from "@/store/finish-round-state";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { RoundOverDialogMultiplayer } from "../round-over-dialogs/round-over-dialog";
import { useStore } from "@/store/state";
import { useRoundLoseSound, useRoundWonSound } from "@/utils/play-sounds";

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

  const setTrumpSetterWon = MultiplayerStateStore(
    (state) => state.setTrumpSetterWon
  );

  const setTrumpSetterLose = MultiplayerStateStore(
    (state) => state.setTrumpSetterLose
  );

  const [myTeamPoints, setmyTeamPoints] = useState<number>(0);
  const [opponentTeamPoints, setopponentTeamPoints] = useState<number>(0);

  const team1Points = useStore((state) => state.team1Points);
  const team2Points = useStore((state) => state.team2Points);
  const { playRoundWon } = useRoundWonSound();
  const { playRoundLose } = useRoundLoseSound();
  const muted = useStore((state) => state.muted);

  function getMyTeam() {
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

    if (myPoints > opponentsPoint) {
      // Round won music
      playRoundWon(muted);

      if (trumpSetter?.teamNumber === myTeam) {
        setwonCallingTrumps(true);
        if (trumpSetter?.playerId === userID) {
          setTrumpSetterWon(true);
        }
      } else {
        setwonWithoutCallingTrumps(true);
      }
    } else if (opponentsPoint > myPoints) {
      // round lose music
      playRoundLose(muted);

      if (trumpSetter?.teamNumber === myTeam) {
        setlostCallingTrumps(true);
        if (trumpSetter?.playerId === userID) {
          setTrumpSetterLose(true);
        }
      } else {
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
