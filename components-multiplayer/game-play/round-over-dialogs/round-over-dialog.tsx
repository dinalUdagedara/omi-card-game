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
import { roundFinishMessages } from "@/utils/practise/types";
import { FinishStateStore } from "@/store/finish-round-state";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStore } from "@/store/state";
import Image from "next/image";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import { useHoverSound, useClickSound } from "@/utils/play-sounds";

interface RoundOverDialogMobileProps {
  userID: Id<"players">;
  roomName: string;
  status: string | null;
}

export function RoundOverDialogMultiplayer({
  userID,
  roomName,
  status,
}: RoundOverDialogMobileProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
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
  const setAllFalse = FinishStateStore((state) => state.setAllFalse);
  const gameTied = FinishStateStore((state) => state.gameTied);
  const isDialogOpen = FinishStateStore((state) => state.isDialogOpen);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const setRoundOver = MultiplayerStateStore((state) => state.setRoundOver);
  const setNewRound = MultiplayerStateStore((state) => state.setNewRound);
  const userName = MultiplayerStateStore((state) => state.userName);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const muted = useStore((state) => state.muted);

  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomName || "",
  });

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
  const offlinePlayers = useQuery(api.autoPlayingBot.offlinePlayers, {
    roomName: roomName || "",
  });

  const updateTrumpSetter = useMutation(api.rooms.updateCreator);
  const removeTrumpSuit = useMutation(api.gameLogic.removeTrumpSuit);
  const updatePlayerStatus = useMutation(api.rooms.updatePlayerStatus);
  const resetViolation = useMutation(api.gameStates.resetViolations);
  const decrementPenaltycards = useMutation(
    api.gameLogic.decrementPenaltyCards
  );
  const decrementPenaltycardsFromOponent = useMutation(
    api.gameLogic.decrementFromOpponents
  );
  const checkPlayerStatus = useMutation(api.autoPlayingBot.checkPlayerStatus);

  const { playHoverSound } = useHoverSound();
  const { playClickButton } = useClickSound();

  //reducing penalty cards if violations detetcted
  const deductPenaltyForViolation = async () => {
    console.log("Deductiong for violation");
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
  };

  //decrementing penlaty cards from the losed teams
  async function decrementValues() {
    deductPenaltyForViolation();
    if (status === "lostCallingTrumps" && playersInRoom) {
      if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
        console.log("Decrementing lost calling");
        await decrementPenaltycards({
          decrementValue: 2,
          roomName,
          userID,
        });
      }
    }
    if (status === "lostWithoutCallingTrumps") {
      if (playersInRoom) {
        if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
          console.log("Decrementing lostwithout calling", violations);
          await decrementPenaltycards({
            decrementValue: 1,
            roomName,
            userID,
          });
        }
      }
    }

    if (status === "wonCallingTrumps" && playersInRoom) {
      if (userID === playersInRoom[0] || userID === playersInRoom[1]) {
        console.log("wonCallingTrumps", violations);
        await decrementPenaltycardsFromOponent({
          decrementValue: 1,
          roomName,
          userID,
        });
      }
    }
    if (status === "wonWithoutCallingTrumps") {
      if (playersInRoom) {
        console.log("Decrementing lostwithout calling");
        await decrementPenaltycardsFromOponent({
          decrementValue: 2,
          roomName,
          userID,
        });
      }
    }
  }

  //removing trump suit from the database
  const removeTrump = async () => {
    console.log("removing trump");
    await removeTrumpSuit({
      roomName: roomName,
    });
  };

  const handlingRoundOverReset = async () => {
    await decrementValues();
    await updateTrumpSetter({
      roomName: roomName,
    });
    if (offlinePlayers && offlinePlayers.length > 0) {
      //update the offline players status to "waiting"
      offlinePlayers.map((player) => {
        updatePlayerStatus({
          status: "waiting",
          userId: player._id,
        });
      });
    }
  };

  //handling the round end and setting up a new round
  const handleClose = async () => {
    playClickButton(muted);
    setAllFalse(false);
    await removeTrump();
    setTrumpSuit(null);

    //Logic to handlingRoundOverReset only from a one connected player

    const players = roomdataFromDB?.playerUserNames || [];
    const isPlayer1Offline = await checkPlayerStatus({
      roomName: roomName,
      userName: players[0],
    });
    const isPlayer2Offline = await checkPlayerStatus({
      roomName: roomName,
      userName: players[1],
    });
    const isPlayer3Offline = await checkPlayerStatus({
      roomName: roomName,
      userName: players[2],
    });
    const isPlayer4Offline = await checkPlayerStatus({
      roomName: roomName,
      userName: players[3],
    });

    if (!isPlayer1Offline) {
      if (players[0] === userName) {
        console.log(`Player ${players[0]} is handlingRoundOverReset.`);
        await handlingRoundOverReset();
      }
    } else if (!isPlayer2Offline) {
      if (players[1] === userName) {
        console.log(`Player ${players[1]} is handlingRoundOverReset.`);
        await handlingRoundOverReset();
      }
    } else if (!isPlayer3Offline) {
      if (players[2] === userName) {
        console.log(`Player ${players[2]} is handlingRoundOverReset.`);
        await handlingRoundOverReset();
      }
    } else if (!isPlayer4Offline) {
      if (players[3] === userName) {
        console.log(`Player ${players[3]} is handlingRoundOverReset.`);
        await handlingRoundOverReset();
      }
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

  //choosing the message to display in the dialog according to the status of the team after a round
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

  // Automatically close dialog after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isDialogOpen) {
        handleClose();
      }
    }, 10000);

    return () => clearTimeout(timer); // Clear the timer when component unmounts or if dialog is closed manually
  }, [isDialogOpen]);

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
                onMouseEnter={() => {
                  playHoverSound(muted);
                }}
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
                      onMouseEnter={() => {
                        playHoverSound(muted);
                      }}
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
