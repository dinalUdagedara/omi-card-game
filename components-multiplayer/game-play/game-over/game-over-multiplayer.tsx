import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import Link from "next/link";

export const GameOverDialogMultiplayer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const gameWon = MultiplayerStateStore((state) => state.gameWon);
  const setGameWon = MultiplayerStateStore((state) => state.setGameWon);
  return (
    <>
      {gameWon ? (
        <>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-green-500 via-purple-500 to-blue-400  text-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-4">
                  🎉 Congratulations! 🎉
                </div>
                <div className="text-lg text-gray-700">You Won the Game</div>
              </div>
              <DialogFooter>
                <div className="flex justify-center items-center w-full">
                  <DialogClose asChild>
                    <Button className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-full transition duration-300">
                      <Link href={"/multiplayer"}>Back to Lobby</Link>
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-green-500 via-purple-500 to-blue-400  text-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-center">
                {/* <div className="text-2xl font-bold text-gray-900 mb-4">

          </div> */}
                <div className="text-lg text-gray-700">You Lose the Game</div>
              </div>
              <DialogFooter>
                <div className="flex justify-center items-center w-full">
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setGameWon(false);
                      }}
                      className="bg-gray-800 text-white hover:bg-gray-700 px-6 py-2 rounded-full transition duration-300"
                    >
                      <Link href={"/multiplayer"}>Back to Lobby</Link>
                    </Button>
                  </DialogClose>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};
