import { RoundOverDialogMobile } from "@/components/game-board.tsx/dialogs/round-over-dialog-mobile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FinishStateStore } from "@/store/finish-round-state";
import { useQuery } from "convex/react";
import { use, useEffect } from "react";

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
  const setwonWithoutCallingTrumps = FinishStateStore(
    (state) => state.setwonWithoutCallingTrumps
  );
  const setlostCallingTrumps = FinishStateStore(
    (state) => state.setlostCallingTrumps
  );
  const setlostWithoutCallingTrumps = FinishStateStore(
    (state) => state.setlostWithoutCallingTrumps
  );
  const teamPoints = useQuery(api.gameLogic.getPlayersPoints, {
    roomName: roomName,
  });

  const trumpSetter = useQuery(api.gameLogic.getTrumpSetter, {
    roomName: roomName,
  });

  function checkRoundWinner() {
    if (teamPoints) {
      const myPoints = teamPoints.find(
        (team) => team.playerId === userID
      )?.points;
      // Find the opponent's points by selecting a player who isn't the current user
      const opponentsPoint = teamPoints.find(
        (team) => team.playerId !== userID
      )?.points;

      if (myPoints && opponentsPoint)
        if (myPoints > opponentsPoint) {
          if (trumpSetter === userID) {
            setwonCallingTrumps(true);
          } else {
            setwonWithoutCallingTrumps(true);
          }
        } else if (opponentsPoint > myPoints) {
          if (trumpSetter === userID) {
            setlostCallingTrumps(true);
          } else {
            setlostWithoutCallingTrumps(true);
          }
        } else {
          // update later tie winning logic
          if (trumpSetter === userID) {
            setwonCallingTrumps(true);
          } else {
            setwonWithoutCallingTrumps(true);
          }
        }
    }
  }

  useEffect(() => {
    if (teamPoints) checkRoundWinner();
  }, [teamPoints]);
  // funtion for referencing
  // function handleNextTurnofShuffling() {
  //   checkWinner();
  //   if (isGameOver) {
  //     console.log("Game over");
  //   } else {
  //     if (roundWinners === 1) {
  //       if (trumpSetter === 1) {
  //         // won  telling trumps
  //         setwonCallingTrumps(true);
  //         const remainingPenaltyCards = team2PenaltyCards - 1;
  //         setTeam_2_penaltyCards(remainingPenaltyCards);
  //       } else {
  //         // won without telling trumps
  //         setwonWithoutCallingTrumps(true);
  //         const remainingPenaltyCards = team2PenaltyCards - 2;
  //         setTeam_2_penaltyCards(remainingPenaltyCards);
  //       }
  //       const roundNumber = roundsWonbyTeam1 + 1;
  //       setRoundsWonbyTeam1(roundNumber);
  //     } else if (roundWinners === 2) {
  //       if (trumpSetter === 2) {
  //         // lost without telling trumps
  //         setlostWithoutCallingTrumps(true);
  //         const remainingPenaltyCards = team1PenaltyCards - 1;
  //         setTeam_1_penaltyCards(remainingPenaltyCards);
  //       } else {
  //         // lost  telling trumps
  //         setlostCallingTrumps(true);
  //         const remainingPenaltyCards = team1PenaltyCards - 2;
  //         setTeam_1_penaltyCards(remainingPenaltyCards);
  //       }

  //       const roundNumber = roundsWonbyTeam2 + 1;
  //       setRoundsWonbyTeam2(roundNumber);
  //     }
  //     setDialogOpen(true);
  //     setTurnNumber(1);
  //     const nextRoundNumber = roundNumber !== null ? roundNumber + 1 : 1;
  //     setRoundNumber(nextRoundNumber);
  //     resetTeamPoints();
  //     setStarterForRound();
  //     initailSetup();
  //   }
  // }

  return (
    <div>
      <RoundOverDialogMobile />
    </div>
  );
};

export default RoundOverMultiplayer;
