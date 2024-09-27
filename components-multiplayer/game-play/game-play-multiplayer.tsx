"use client";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import { SocketData } from "@/utils/types-multiplayer";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { OtherDecksMobile } from "@/components/decks/mobile/other-decks-mobile";
import { exampleCardSet } from "@/utils/types";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { UserDeckMobile } from "@/components/decks/user-deck-mobile";
import ScoreBoardMobileMultiplayer from "./score-board/score-board-mobile";
import PenaltycardsMultiplayer from "./penalty-cards/penalty-cards-multiplayer";
import GameBoardMobileMultiplayer from "./game-board/game-board-multiplayer";

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

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  useEffect(() => {
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    handleJoinRoom();
    getRoomInfo();
    const mySocketID = SocketManager.getMySocket();
    if (mySocketID) setMySocket(mySocketID);

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

  function handleCardSelectDeck(cardIndex: number): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="flex flex-col gap-10 h-full min-h-screen ">
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
                  <UserDeckMobile
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
