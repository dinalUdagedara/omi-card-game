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
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import Image from "next/image";
import ParticlesComponentExample from "@/components-multiplayer/particles/winner-particles";

export const GameOverDialogMultiplayer = () => {
  const [isOpen, setIsOpen] = useState(true);
  const gameWon = MultiplayerStateStore((state) => state.gameWon);
  const setGameWon = MultiplayerStateStore((state) => state.setGameWon);
  return (
    <>
      {gameWon === true ? (
        <>
          {/* Winner Particles */}
          <ParticlesComponentExample />
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className=" w-[350px] lg:w-full px-10 inv-rad inv-rad-6">
              <Image
                className="inv-rad inv-rad-6"
                alt="BorderImage"
                src={modeCardBackground}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "fill",
                }}
              />

              <Image
                className="p-3 inv-rad inv-rad-9"
                alt="BgImage"
                src={notificaitonBackGround}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "fill",
                }}
              />

              <div className="text-center z-20">
                <div className="text-2xl font-bold text-gray-900 mb-4 z-20 underline underline-offset-2">
                  Congratulations!
                </div>
                <div className="text-lg text-gray-700 z-20">
                  Your Team Won the Game
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-center items-center w-full z-20">
                  <DialogClose asChild>
                    <Button className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md">
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
            <DialogContent className=" w-[350px] lg:w-full px-10 inv-rad inv-rad-6">
              <Image
                className="inv-rad inv-rad-6"
                alt="BorderImage"
                src={modeCardBackground}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "fill",
                }}
              />

              <Image
                className="p-3  inv-rad inv-rad-9"
                alt="BgImage"
                src={notificaitonBackGround}
                fill
                sizes="(min-width: 808px) 50vw, 100vw"
                style={{
                  objectFit: "fill",
                }}
              />
              <div className="text-center z-20">
                <div className="text-2xl font-bold text-gray-900 mb-4 underline underline-offset-2">
                  Game Over
                </div>
                <div className="text-lg text-gray-700  z-20">
                  You Team Lose the Game
                </div>
              </div>
              <DialogFooter>
                <div className="flex justify-center items-center w-full  z-20">
                  <DialogClose asChild>
                    <Button
                      onClick={() => {
                        setGameWon(false);
                      }}
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md"
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
