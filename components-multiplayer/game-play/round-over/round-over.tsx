import { RoundOverDialogMobile } from "@/components/game-board.tsx/dialogs/round-over-dialog-mobile";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FinishStateStore } from "@/store/finish-round-state";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
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
  const setgameTied = FinishStateStore(
    (state) => state.setGameTied
  );
  const teamPoints = useQuery(api.gameLogic.getPlayersPoints, {
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

  function checkRoundWinner() {
    if (teamPoints) {
      console.log("points", teamPoints);
      const myPoints =
        teamPoints.find((team) => team.playerId === userID)?.points ?? 0;
      // Find the opponent's points by selecting a player who isn't the current user
      const opponentsPoint =
        teamPoints.find((team) => team.playerId !== userID)?.points ?? 0;

      console.log("myPoints", myPoints);
      console.log("opponentsPoint", opponentsPoint);
      console.log("roomName", roomName);
      console.log("trumpSetter", trumpSetter);
      console.log("userID", userID);

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
        // update later tie winning logic
        setgameTied(true);
      }
    }
  }

  useEffect(() => {
    if (teamPoints && trumpSetter) {
      checkRoundWinner();
      setDialogOpen(true);
    }
  }, [teamPoints, trumpSetter]);

  return (
    <div>
      <RoundOverDialogMobile />
    </div>
  );
};

export default RoundOverMultiplayer;
