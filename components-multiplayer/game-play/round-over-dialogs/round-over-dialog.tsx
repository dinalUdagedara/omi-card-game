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
import Image from "next/image";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";

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

  async function decrementValues() {
    if (lostCallingTrumps && playersInRoom) {
      if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
        console.log("Decrementing lost calling");
        await decrementPenaltycards({
          decrementValue: 2,
          roomName,
          userID,
        });

        console.log("violations ", violations);
        // Check If Violation Done and decrement  in here
        if (violations && violations?.length > 0) {
          await decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
          await resetViolation({
            roomName: roomName,
          });
        }
      }
    }
    if (lostWithoutCallingTrumps) {
      if (playersInRoom) {
        if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
          console.log("Decrementing lostwithout calling", violations);
          await decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });

          // Check If Violation Done and decrement  in here
          if (violations && violations?.length > 0) {
            console.log("violations caught");
            await decrementPenaltycards({
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
        console.log("wonCallingTrumps", violations);
        await decrementPenaltycardsFromOponent({
          decrementValue: 1,
          roomName,
          userID,
        });

        // Check If Violation Done and decrement  in here
        if (violations && violations?.length > 0) {
          console.log("violations caught");
          await decrementPenaltycards({
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
        await decrementPenaltycardsFromOponent({
          decrementValue: 2,
          roomName,
          userID,
        });

        // Check If Violation Done and decrement  in here
        if (violations && violations?.length > 0) {
          console.log("violations caught", violations);
          await decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
          await resetViolation({
            roomName: roomName,
          });
        }
      }
    }
  }

  const handleClose = async () => {
    setAllFalse(false);
    if (userName === roomdataFromDB?.playerUserNames[0]) {
      await decrementValues();
      await updateTrumpSetter({
        roomName: roomName,
      });
      await removeTrumpSuit({
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
        <DialogContent className="w-[300px] sm:w-[310px] p-6 border-none rounded-3xl  shadow-2xl text-black bg-transparent">
          <Image
            className="rounded-md inv-rad-7 inv-rad"
            alt="Mountains"
            src={modeCardBackground}
            fill
            sizes="(min-width: 808px) 50vw, 100vw"
            style={{
              objectFit: "fill",
            }}
          />
          <div className="text-center">
            <Image
              className="rounded-md p-2  inv-rad-9 inv-rad "
              alt="Mountains"
              src={notificaitonBackGround}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{
                objectFit: "fill",
              }}
            />
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold tracking-wider text-center z-20">
                {message.title}
              </DialogTitle>
              <DialogDescription className="text-md mt-2 font-light text-center  z-20 text-black">
                {message.message}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-6 z-20">
              <Button
                className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md inv-rad-7 inv-rad py-2 w-full"
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
              <DialogContent className="w-[300px] sm:w-[310px] p-6 border-none rounded-3xl text-black">
                <Image
                  className="rounded-md inv-rad-7 inv-rad"
                  alt="Mountains"
                  src={modeCardBackground}
                  fill
                  sizes="(min-width: 808px) 50vw, 100vw"
                  style={{
                    objectFit: "fill",
                  }}
                />
                <div className="text-center z-20">
                  <Image
                    className="rounded-md p-2 inv-rad-9 inv-rad "
                    alt="Mountains"
                    src={notificaitonBackGround}
                    fill
                    sizes="(min-width: 808px) 50vw, 100vw"
                    style={{
                      objectFit: "fill",
                    }}
                  />
                  <DialogHeader className="z-20">
                    <DialogTitle className="text-xl font-semibold tracking-wider text-center z-20">
                      {message.title}
                    </DialogTitle>
                    <DialogDescription className="text-md mt-2 font-light text-center z-20 text-black">
                      {message.message} but Violations caught penalty cards will
                      deduct
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="mt-6">
                    <Button
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md inv-rad-7 inv-rad py-2 w-full"
                      // className="bg-white text-gray-700 hover:bg-gray-400 w-full py-2 rounded-lg font-semibold shadow-lg md:mx-8"
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
