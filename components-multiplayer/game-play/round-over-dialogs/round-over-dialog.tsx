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
  const setTrumpSetter = MultiplayerStateStore((state) => state.setTrumpSetter);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const trumpSetter = useQuery(api.gameLogic.getTrumpSetter, {
    roomName: roomName,
  });

  const roomCreator = useQuery(api.rooms.getRoomCreator, {
    roomName: roomName,
  });
  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomName || "",
  });

  const updateTrumpSetter = useMutation(api.rooms.updateCreator);
  const removeTrumpSuit = useMutation(api.gameLogic.removeTrumpSuit);

  const setAllFalse = FinishStateStore((state) => state.setAllFalse);

  useEffect(() => {
    console.log("trump setter", trumpSetter);
    if (trumpSetter) {
      setTrumpSetter(trumpSetter);
    }
  }, [trumpSetter]);

  const handleClose = () => {
    setAllFalse(false);
    if (userName === roomdataFromDB?.playerUserNames[0]) {
      updateTrumpSetter({
        roomName: roomName,
      });
      removeTrumpSuit({
        roomName:roomName
      })
      setTrumpSuit(null)
    }else{
      // removeTRumpsetter from here
    }
    setDialogOpen(false);
    setRoundOver(false);
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
    </div>
  );
}
