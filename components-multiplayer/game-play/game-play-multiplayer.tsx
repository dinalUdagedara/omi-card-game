"use client";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import { SocketData } from "@/utils/types-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { OtherDecksMobile } from "@/components/decks/mobile/other-decks-mobile";
import { Card, exampleCardSet, Suit } from "@/utils/types";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreBoardMobileMultiplayer from "./score-board/score-board-mobile";
import PenaltycardsMultiplayer from "./penalty-cards/penalty-cards-multiplayer";
import GameBoardMobileMultiplayer from "./game-board/game-board-multiplayer";
import { useStore } from "@/store/state";
import { SuitDrawerMobile } from "@/components/drawer/mobile/trump-suit-selector-mobile";
import { createDeck, dealCards, setTrump, shuffleDeck } from "@/utils/game-logic";
import { UserDeckMobileMultiplayer } from "./decks/user-deck-mobile-multiplayer";


import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { mutation } from "@/convex/_generated/server";

const GamePlayMultiplayer = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop(); // Get the last part of the URL, which is the roomId
  const [roomSocketData, setRoomSocketData] = useState<SocketData[] | null>(
    null
  );
  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const [mySocket, setMySocket] = useState<Socket | null>(null);
  const [isRoomPrivate, setIsRoomPrivate] = useState<boolean>(false);
  const isTrumpSelected = useStore((state) => state.trumpSelected);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);
  const trumpSuit = useStore((state) => state.trumpSuit);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setOpponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );

  const setSelectedCardByUser = useStore(
    (state) => state.setSelectedCardByUser
  );
  const selectedCardByUser = useStore((state) => state.selectedCardByUser);

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;
  const tasks = useQuery(api.tasks.get);
  const taskList = useMutation(api.functions.createTask)  


  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    handleJoinRoom();
    getRoomInfo();
    const mySocketID = SocketManager.getMySocket();
    if (mySocketID) setMySocket(mySocketID);
    setTrumpSelected(false);

    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, [webSocketURL, roomId, userName]);

  const getRoomInfo = () => {
    if (roomId)
      SocketManager.getRoomData(roomId, (roomData) => {
        setRoomSocketData(roomData.players);
        console.log("roomData", roomData);
      });
  };

  const getUsername = () => {
    // Ensure the code only runs in the browser

    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const handleJoinRoom = () => {
    console.log("roomId: ", roomId);

    getUsername();
    if (roomId && userName) {
      SocketManager.joinRoom(roomId, isRoomPrivate, userName);
      console.log("Joined to the Room : ", roomId);
    }
  };

  function handleSuitChange(suit: string | null) {
    setTrumpSuit(suit as Suit);
    setTrump(suit as Suit);
  }

  function handleCloseDrawer() {
    if (roomId) SocketManager.emitTrump(trumpSuit, roomId);
    handleSuitChange(trumpSuit);
    setTrumpSelected(true);
  }

  function restartGame(): void {
    throw new Error("Function not implemented.");
  }

  function handleSelectOtherHands(): void {
    throw new Error("Function not implemented.");
  }

  function handleNextTurn(): void {
    throw new Error("Function not implemented.");
  }

  function handleNextTurnofShuffling(): void {
    throw new Error("Function not implemented.");
  }

  function handleCardSelectDeck(selectedCard: Card): void {
    console.log("selected card", selectedCard);
    setSelectedCardByUser(selectedCard);

    if (roomId) SocketManager.emitSelectedCard(selectedCard, roomId);
  }

  useEffect(() => {
    // Listen for the event when a trump suit is selected
    SocketManager.onTrumpSelected((selectedTrumpSuit: Suit) => {
      console.log("Trump suit has been selected:", selectedTrumpSuit);
      setTrumpSuit(selectedTrumpSuit); // Set the received trump suit in state
      setTrumpSelected(true); // Update the state to show trump has been chosen
    });
    SocketManager.onOpponentCardSelect((opponentCard: Card) => {
      if (opponentCard.value !== selectedCardByUser?.value || opponentCard.suit !== selectedCardByUser?.suit) {
        setOpponentCard(opponentCard); // Update the opponent's selected card
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full min-h-screen ">
      {exampleCardSet ? (
        <div>
          {!isTrumpSelected && (
            <SuitDrawerMobile
              userHand={exampleCardSet}
              onClose={handleCloseDrawer}
            />
          )}
        </div>
      ) : null}
      <div>
        <ScoreBoardMobileMultiplayer />
      </div>
      <div>
        <PenaltycardsMultiplayer />
      </div>
      <div className=" flex justify-center ">
        <div className=" flex  gap-4 justify-center items-center ">
          <div className="">
            <OtherDecksMobile userHand={exampleCardSet} />
          </div>

          <motion.div
            className=" rounded-full"
            initial={{ boxShadow: "none" }}
            // animate={{
            //   boxShadow:
            //     lastWinner === 2
            //       ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
            //       : "none", // No shadow when it's not players's turn
            // }}
            transition={{
              duration: 0.8,
            }}
          >
            <Avatar className="w-14 h-14 shadow-md rounded-full">
              <AvatarImage src={`/assets/player3.png`} />
            </Avatar>
          </motion.div>
          {roomSocketData && roomSocketData.length > 0 && (
            <div>
              {roomSocketData[0]?.username || "Waiting for opponent..."}
            </div>
          )}
        </div>
      </div>

      <div className=" flex justify-center items-center">
        <div
          className="h-full  max-h-80 flex max-w-20  min-w-60 min-h-80 justify-center items-center rounded-3xl  p-4 shadow-lg bg-opacity-75 bg-white"
          style={{
            backgroundImage: `url('/assets/background.png')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="w-full h-full justify-center  items-center  ">
            <GameBoardMobileMultiplayer
              onRestart={restartGame}
              onStart={handleSelectOtherHands}
              onNextStart={handleNextTurn}
              onShuffleAgain={handleNextTurnofShuffling}
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 rounded-t-full relative mt-20 ">
        <div className="flex w-full justify-center items-center">
          <div className="">
            {exampleCardSet ? (
              <div className="relative w-full ">
                <div className="">
                  <UserDeckMobileMultiplayer
                    userHand={exampleCardSet}
                    onCardSelect={handleCardSelectDeck}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-center w-full items-center mt-14">
                <Skeleton className="h-[125px] w-[300px] rounded-t-full rounded-b-md bg-slate-600" />
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full justify-center mt-5 pr-6 ">
          <motion.div
            className=" rounded-full"
            initial={{ boxShadow: "none" }}
            // animate={{
            //   boxShadow:
            //     lastWinner === 0
            //       ? "0 0 30px rgba(0, 255, 0, 1)" // Green glowing effect
            //       : "none", // No shadow when it's not user's turn
            // }}
            transition={{
              duration: 0.8,
            }}
          >
            <Avatar className="w-16 h-16 ">
              <AvatarImage src={`/assets/user.jpg`} />
              <AvatarFallback>
                <Skeleton className="h-40 w-40 rounded-full bg-slate-600" />
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayMultiplayer;
