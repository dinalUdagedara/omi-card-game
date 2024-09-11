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
  const isDialogOpen = FinishStateStore((state) => state.isDialogOpen);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);

  const setAllFalse = FinishStateStore((state) => state.setAllFalse);
  const handleClosee = () => {
    setAllFalse(false);
    setDialogOpen(false);
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
  }

  return (
    <div className="">
      <Dialog open={isDialogOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[240px] rounded-3xl ">
          <DialogHeader>
            <DialogTitle>{message.title}</DialogTitle>
            <DialogDescription>{message.message}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <div className=" flex justify-center w-full">
              <Button className="w-20" type="button" onClick={handleClosee}>
                Ok
              </Button>{" "}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
