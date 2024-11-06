import * as React from "react";
import { motion } from "framer-motion";
import { useStore } from "@/store/state";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cardMultiplayer } from "@/utils/multiplayer/types-multiplayer";
import CardComponentMultiplayer from "@/components-multiplayer/cards/card-multiplayer";
import { checkIfViolationOccured } from "@/utils/multiplayer/game-logic-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useHoverSound } from "@/utils/play-sounds";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import Image from "next/image";

interface UserDeckProps {
  userID: Id<"players">;
  roomName: string;
}

export function UserDeckMobileMultiplayer({ userID, roomName }: UserDeckProps) {
  const trumpSuit = useStore((state) => state.trumpSuit);
  const isUserTurn = useStore((state) => state.isUserTurn);
  const setUserTurn = useStore((state) => state.setIsUserTurn);
  const userName = MultiplayerStateStore((state) => state.userName);
  const myCardDeck = MultiplayerStateStore((state) => state.myCardSet);
  const setMyCardDeck = MultiplayerStateStore((state) => state.setMyCardSet);
  const muted = useStore((state) => state.muted);
  const { playHoverSound } = useHoverSound();

  const [selectedCard, setSelectedCard] = useState<cardMultiplayer | null>(
    null
  );
  const [isViolation, setIsViolation] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const myCardSet = useQuery(api.gameStates.getMyCardSet, {
    playerId: userID,
    roomName: roomName,
  });

  const turnPlayerID = useQuery(api.gameLogic.getPlayerTurn, {
    roomName: roomName,
  });

  const noOfPlayingcards = useQuery(api.gameLogic.noOfPlayingCards, {
    roomName: roomName,
  });

  const selectCard = useMutation(api.gameLogic.updatePlayingCards);
  const updateViolation = useMutation(api.gameStates.updateViolationOccured);
  const updatePlayerStatus = useMutation(api.rooms.updatePlayerStatus);
  const turnsuit = useQuery(api.gameLogic.getTurnSuit, {
    roomName: roomName,
  });
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  useEffect(() => {
    if (turnPlayerID) {
      const num = noOfPlayingcards ?? 0;
      if (turnPlayerID === userID && num < 4) {
        setUserTurn(true);
      } else {
        setUserTurn(false);
      }
    }
  }, [turnPlayerID, noOfPlayingcards]);

  useEffect(() => {
    if (myCardSet) setMyCardDeck(myCardSet);
    console.log("");
  }, [myCardSet]);

  async function handleCardSelect(card: cardMultiplayer) {
    const userId = userID;
    // update this player status to "playing"
    updatePlayerStatus({
      status: "playing",
      userId: userID,
    });
    if (myCardSet && turnsuit) {
      const violationOccured = checkIfViolationOccured(
        card,
        myCardSet,
        turnsuit
      );
      if (violationOccured) {
        // A violation occurred, ask for confirmation
        setSelectedCard(card);
        setIsViolation(true);
        setOpenDialog(true); // Open the confirmation dialog
      } else {
        await selectCard({
          card,
          roomName,
          userId,
        });
      }
    } else {
      //Selecting card if there are no turn suits yet
      await selectCard({
        card,
        roomName,
        userId,
      });
    }
  }

  // Function to handle when the user confirms they want to proceed
  async function handleConfirmSelection() {
    if (selectedCard && userName && myTeam) {
      // Update the violation before proceeding
      updateViolation({
        roomName: roomName,
        teamNumber: myTeam,
        userName: userName,
        violation: "Played a Different Card from the Turn Suit",
      });

      await selectCard({
        card: selectedCard,
        roomName,
        userId: userID,
      });

      setOpenDialog(false); // Close the dialog
      setSelectedCard(null); // Reset the selected card
      setIsViolation(false); // Reset violation flag
    }
  }

  // Function to handle when the user cancels the selection
  function handleCancelSelection() {
    setOpenDialog(false); // Close the dialog
    setSelectedCard(null); // Reset the selected card
    setIsViolation(false); // Reset violation flag
  }

  return (
    <div className="h-2 w-96 flex justify-center mr-5 ">
      <div className="">
        <Dialog open={isViolation}>
          {/* <DialogTrigger className=" h-20 w-20">Open</DialogTrigger> */}
          <DialogContent className="w-[360px] lg:w-full max-w-[450px] inv-rad inv-rad-6">
            <Image
              className="inv-rad inv-rad-6"
              alt="Mountains"
              src={modeCardBackground}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{
                objectFit: "fill",
              }}
            />
            <Image
              className="p-3 inv-rad inv-rad-8"
              alt="Mountains"
              src={notificaitonBackGround}
              fill
              sizes="(min-width: 808px) 50vw, 100vw"
              style={{
                objectFit: "fill",
              }}
            />
            <DialogHeader className="z-20 text-black">
              <DialogTitle className="flex justify-center font-bold text-2xl">
                Are you sure?
              </DialogTitle>
              <DialogDescription className="flex justify-center text-black font-semibold">
                Do you Want to Select the Card {selectedCard?.value} of{" "}
                {selectedCard?.suit}
              </DialogDescription>
            </DialogHeader>
            <div className="flex w-full justify-end gap-2 z-20 px-5">
              <Button
                className="bg-amber-950 h-8 text-white  hover:bg-amber-800  text-md"
                onClick={handleConfirmSelection}
              >
                Yes
              </Button>
              <Button
                className="bg-amber-950 h-8 text-white  hover:bg-amber-800  text-md"
                onClick={handleCancelSelection}
              >
                No
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-center">
        {myCardSet?.map((card, index) => {
          const angle = (index - (myCardSet.length - 1) / 2) * 10;

          return (
            <div
              key={index}
              className="absolute"
              style={{
                transform: `rotate(${angle}deg) translateY(-110px)`,
                transformOrigin: "bottom center",
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: -200 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2,
                }}
              >
                <button
                  disabled={!trumpSuit || !isUserTurn}
                  // onMouseEnter={() => {
                  //   console.log("Mouse Entered");
                  //   // playHoverSound(muted);
                  // }}
                  onClick={() => {
                    playHoverSound(muted);
                    handleCardSelect(card);
                  }}
                  className="transform transition-transform duration-200 hover:scale-110 hover:z-10 focus:outline-none rounded-lg"
                >
                  <motion.div
                    className="rounded-lg"
                    initial={{ boxShadow: "none" }}
                    animate={{
                      boxShadow:
                        isUserTurn && trumpSuit
                          ? "0 0 12px rgba(254 , 250 ,224 ,1)" // Glowing effect
                          : "none", // No shadow when it's not user's turn
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      repeat: isUserTurn ? Infinity : 0,
                      repeatType: "reverse",
                    }}
                  >
                    <CardComponentMultiplayer card={card} />
                  </motion.div>
                </button>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* <div className="bg-white z-20">
        Violation Occured Do you Want to continue
        <div>
          <Button onClick={handleConfirmSelection}>Yes</Button>
          <Button onClick={handleConfirmSelection}>No</Button>
        </div>
      </div> */}
    </div>
  );
}
