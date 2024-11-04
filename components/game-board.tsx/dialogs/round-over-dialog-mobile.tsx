import { useState } from "react";
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
import Image from "next/image";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";

export function RoundOverDialogMobile() {
  const [isOpen, setIsOpen] = useState(true);

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
  const gameTied = FinishStateStore((state) => state.gameTied);
  const isDialogOpen = FinishStateStore((state) => state.isDialogOpen);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const setRoundOverPractise = FinishStateStore((state) => state.setRoundOver);
  const setRoundOver = MultiplayerStateStore((state) => state.setRoundOver);
  const setNewRound = MultiplayerStateStore((state) => state.setNewRound);

  const setAllFalse = FinishStateStore((state) => state.setAllFalse);
  const handleClose = () => {
    setRoundOver(false);
    setAllFalse(false);
    setDialogOpen(false);
    setRoundOverPractise(false);
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
                // onMouseEnter={() => {
                //   playHoverSound(muted);
                // }}
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
