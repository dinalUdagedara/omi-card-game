import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { roundFinishMessages } from "@/utils/types";
import { FinishStateStore } from "@/store/finish-round-state";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStore } from "@/store/state";

interface RoundOverDialogMobileProps {
  userID: Id<"players">;
  roomName: string;
}

export function RoundOverDialogMultiplayer({
  userID,
  roomName,
}: RoundOverDialogMobileProps) {
  const [isOpen, setIsOpen] = useState(true);

  const wonWithoutCallingTrumps = FinishStateStore(
    (state) => state.wonWithoutCallingTrumps
  );
  const wonCallingTrumps = FinishStateStore((state) => state.wonCallingTrumps);

  const userName = MultiplayerStateStore((state) => state.userName);

  const lostCallingTrumps = FinishStateStore(
    (state) => state.lostCallingTrumps
  );
  const lostWithoutCallingTrumps = FinishStateStore(
    (state) => state.lostWithoutCallingTrumps
  );
  const gameTied = FinishStateStore((state) => state.gameTied);
  const isDialogOpen = FinishStateStore((state) => state.isDialogOpen);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const setRoundOver = MultiplayerStateStore((state) => state.setRoundOver);
  const setNewRound = MultiplayerStateStore((state) => state.setNewRound);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomName || "",
  });

  const decrementPenaltycards = useMutation(
    api.gameLogic.decrementPenaltyCards
  );

  const decrementPenaltycardsFromOponent = useMutation(
    api.gameLogic.decrementFromOpponents
  );

  const playersInRoom = useQuery(api.rooms.getAllPlayersIDInTheRoom, {
    roomName: roomName || "",
  });
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  const violations = useQuery(api.gameStates.getViolations, {
    roomName: roomName || "",
    teamNumber: myTeam || 0,
  });

  const updateTrumpSetter = useMutation(api.rooms.updateCreator);
  const removeTrumpSuit = useMutation(api.gameLogic.removeTrumpSuit);
  const updatePlayerStatus = useMutation(api.rooms.updatePlayerStatus);
  const resetViolation = useMutation(api.gameStates.resetViolations);

  const setAllFalse = FinishStateStore((state) => state.setAllFalse);

  function decrementValues() {
    if (lostCallingTrumps && playersInRoom) {
      if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
        console.log("Decrementing lost calling");
        decrementPenaltycards({
          decrementValue: 2,
          roomName,
          userID,
        });

        // Check If Violation Done and decrement  in here
        if (violations) {
          console.log("violations caught");
          decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
          resetViolation({
            roomName: roomName,
          });
        }
      }
    }
    if (lostWithoutCallingTrumps) {
      if (playersInRoom) {
        if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
          console.log("Decrementing lostwithout calling");
          decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });

          // Check If Violation Done and decrement  in here
          if (violations) {
            console.log("violations caught");
            decrementPenaltycards({
              decrementValue: 1,
              roomName,
              userID,
            });
            resetViolation({
              roomName: roomName,
            });
          }
        }
      }
    }

    if (wonCallingTrumps && playersInRoom) {
      if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
        console.log("Decrementing lost calling");
        decrementPenaltycardsFromOponent({
          decrementValue: 1,
          roomName,
          userID,
        });

        // Check If Violation Done and decrement  in here
        if (violations) {
          console.log("violations caught");
          decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
          resetViolation({
            roomName: roomName,
          });
        }
      }
    }
    if (wonWithoutCallingTrumps) {
      if (playersInRoom) {
        console.log("Decrementing lostwithout calling");
        decrementPenaltycardsFromOponent({
          decrementValue: 2,
          roomName,
          userID,
        });

        // Check If Violation Done and decrement  in here
        if (violations) {
          console.log("violations caught");
          decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
          resetViolation({
            roomName: roomName,
          });
        }
      }
    }
  }

  const handleClose = () => {
    setAllFalse(false);
    if (userName === roomdataFromDB?.playerUserNames[0]) {
      decrementValues();
      updateTrumpSetter({
        roomName: roomName,
      });
      removeTrumpSuit({
        roomName: roomName,
      });
      setTrumpSuit(null);
    }
    setDialogOpen(false);
    setRoundOver(false);

    //set the player status to "waiting"
    updatePlayerStatus({
      status: "waiting",
      userId: userID,
    });

    // this triggers a new round
    setNewRound(true);
  };

  let message = { title: "", message: "" };

  if (wonWithoutCallingTrumps) {
    message = roundFinishMessages.find((msg) => msg.value === 1) || message;
  } else if (wonCallingTrumps) {
    message = roundFinishMessages.find((msg) => msg.value === 2) || message;
  } else if (lostWithoutCallingTrumps) {
    message = roundFinishMessages.find((msg) => msg.value === 3) || message;
  } else if (lostCallingTrumps) {
    message = roundFinishMessages.find((msg) => msg.value === 4) || message;
  } else if (gameTied) {
    message = roundFinishMessages.find((msg) => msg.value === 5) || message;
  }

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[300px] sm:w-[310px] p-6 border-none rounded-3xl bg-gradient-to-r from-gray-700 to-gray-900 shadow-2xl text-white">
          <div className="text-center">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-wider text-center">
                {message.title}
              </DialogTitle>
              <DialogDescription className="text-md mt-2 font-light text-center">
                {message.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6">
              <Button
                className="bg-white text-gray-700 hover:bg-gray-400 w-full py-2 rounded-lg font-semibold shadow-lg md:mx-8"
                type="button"
                onClick={handleClose}
              >
                Ok
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {violations && (
        <>
          {violations?.length > 0 && (
            <Dialog open={isDialogOpen} onOpenChange={setIsOpen}>
              <DialogContent className="w-[300px] sm:w-[310px] p-6 border-none rounded-3xl bg-gradient-to-r from-gray-700 to-gray-900 shadow-2xl text-white">
                <div className="text-center">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold tracking-wider text-center">
                      {message.title}
                    </DialogTitle>
                    <DialogDescription className="text-md mt-2 font-light text-center">
                      {message.message} but Violations caught penalty cards will
                      deduct
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6">
                    <Button
                      className="bg-white text-gray-700 hover:bg-gray-400 w-full py-2 rounded-lg font-semibold shadow-lg md:mx-8"
                      type="button"
                      onClick={handleClose}
                    >
                      Ok
                    </Button>
                  </DialogFooter>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </>
      )}
    </div>
  );
}
