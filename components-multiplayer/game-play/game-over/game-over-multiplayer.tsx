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
import ParticlesComponentWinner from "@/components-multiplayer/particles/winner-particles";
import ParticlesComponentLoser from "@/components-multiplayer/particles/loser-particles";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/navigation";

interface GameOverDialogMultiplayerProps {
  roomName: string;
  userID: Id<"players">;
}

export const GameOverDialogMultiplayer: React.FC<
  GameOverDialogMultiplayerProps
> = ({ roomName, userID }) => {
  const [isOpen, setIsOpen] = useState(true);
  const gameWon = MultiplayerStateStore((state) => state.gameWon);
  const setGameWon = MultiplayerStateStore((state) => state.setGameWon);
  const removeUserFromGameState = useMutation(
    api.gameStates.removeUserFromGameState
  );
  const removeUserFromGameStateAndRoom = useMutation(
    api.gameStates.removeUserFromGameStateAndRoom
  );
  const router = useRouter();
  const handlePlayAgain = async () => {
    await removeUserFromGameState({
      roomName: roomName,
      userid: userID,
    });
    router.push(`/multiplayer/start/public/${roomName}`);
    // setIsOpen(false);
  };

  const handleQuitGame = async () => {
    await removeUserFromGameStateAndRoom({
      roomName: roomName,
      userid: userID,
    });
    router.push(`/multiplayer`);
    // setIsOpen(false);
  };

  return (
    <>
      {gameWon === true ? (
        <>
          {/* Winner Particles */}
          <ParticlesComponentWinner />

          <Dialog
            open={isOpen}
            // onOpenChange={setIsOpen}
          >
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
                  <div className="flex w-full justify-end gap-3">
                    <Button
                      onClick={handlePlayAgain}
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md h-8"
                    >
                      Play Again
                    </Button>
                    <Button
                      onClick={handleQuitGame}
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md h-8"
                    >
                      Back to Lobby
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <ParticlesComponentLoser />
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
                  <div className="flex w-full justify-end gap-3">
                    <Button
                      onClick={handlePlayAgain}
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md h-8"
                    >
                      Play Again
                    </Button>
                    <Button
                      onClick={handleQuitGame}
                      className="bg-amber-950 text-white  hover:bg-amber-800 p-5 text-md h-8"
                    >
                      Back to Lobby
                    </Button>
                  </div>
                </div>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};
