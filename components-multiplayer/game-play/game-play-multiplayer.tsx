"use client";
import { Socket } from "socket.io-client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SocketManager from "@/services/web-socket-service";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { OtherDecksMobile } from "@/components/decks/mobile/other-decks-mobile";
import { Card, exampleCardSet, Player, Suit } from "@/utils/types";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreBoardMobileMultiplayer from "./score-board/score-board-mobile";
import PenaltycardsMultiplayer from "./penalty-cards/penalty-cards-multiplayer";
import GameBoardMobileMultiplayer from "./game-board/game-board-multiplayer";
import { useStore } from "@/store/state";
import { UserDeckMobileMultiplayer } from "./decks/user-deck-mobile-multiplayer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  createDeck,
  dealCards,
  setTrump,
  shuffleDeck,
} from "@/utils/multiplayer/game-logic-multiplayer";
import { Id } from "@/convex/_generated/dataModel";
import { SuitDrawerMultiplayer } from "./suit-selector/suit-drawer-multiplayer";

const GamePlayMultiplayer = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop(); // Get the last part of the URL, which is the roomId
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

  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const [roomCreatorID, setRoomCreatorID] = useState<Id<"players"> | null>(
    null
  );
  const [isGameStateCreated, setIsGameStateCreated] = useState(false);

  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomId || "",
  });
  const [opponentPlayerDB, setOpponentPlayerDB] = useState<string>();
  const [playersIDs, setPlayersIDs] = useState<string[] | null>(null); // State to store the players' IDs

  const createGameState = useMutation(api.gameStates.createGameState);

  // Query to fetch all players' IDs in the room
  const playersInRoom = useQuery(api.rooms.getAllPlayersIDInTheRoom, {
    roomName: roomId || "",
  });
  const userID = useQuery(api.gameStates.getIdByUserName, {
    userName: userName || "",
  });

  // useEffect(() => {
  //   console.log("Running in client");

  //   // Only run this when the game state is created
  //   if (isGameStateCreated) {
  //     const myCardSet = useQuery(api.gameStates.getMyCardSet, {
  //       roomName: roomId || "",
  //     });

  //     console.log("myCard Set", myCardSet);
  //   }
  // }, [isGameStateCreated, roomId]); // Re-run effect when `isGameStateCreated` changes

  const [dealtHands, setDealtHands] = useState<Player[] | null>(null);

  useEffect(() => {
    if (playersInRoom) {
      setPlayersIDs(playersInRoom); // Update state when the query returns data
      console.log("Players in the room: ", playersInRoom);
      if (isRoomCreator && userID) {
        setRoomCreatorID(userID);
      }
    }
  }, [playersInRoom]);

  const createGameInstanceDB = async () => {
    if (isRoomCreator && playersInRoom) {
      const players = playersInRoom;
      try {
        const roomName = roomId;
        const playerTurn = userID;
        const trumpSetter = userID;
        if (dealtHands) {
          // Map playersInRoom and dealtHands to match player IDs with their decks
          const playersDecks = players.map((playerId, index) => ({
            playerId,
            deck: dealtHands[index].hand,
          }));

          if (roomName && playerTurn && trumpSetter) {
            const gameStateID = await createGameState({
              roomName,
              players,
              playerTurn,
              playersDecks,
              trumpSetter,
            });
            setIsGameStateCreated(true);
            alert(`Game state created successfully with ID: ${gameStateID}`);
          }
        }
      } catch (error) {}
    }
  };

  const getUsername = () => {
    const storedUserName = localStorage.getItem("userName");
    initialSetup;
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

  function initialSetup() {
    //Creating and Shuffling the Deck
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);

    //Dividing Deck among 2 players
    const hands = dealCards(shuffledDeck, 2);

    //saving the cards of players in a state
    setDealtHands(hands);
  }

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
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);
    handleJoinRoom();
    // getRoomInfo();
    const mySocketID = SocketManager.getMySocket();
    if (mySocketID) setMySocket(mySocketID);
    setTrumpSelected(false);
    // Disconnect socket when component unmounts
    return () => {
      SocketManager.disconnect();
    };
  }, [webSocketURL, roomId, userName]);

  useEffect(() => {
    if (roomdataFromDB) {
      // Update isRoomCreator based on the creator username
      const currentUserIsCreator = roomdataFromDB.creator === userName;
      if (
        roomdataFromDB.playerUserNames.length > 1 &&
        roomdataFromDB.playerUserNames[0] === userName
      ) {
        setOpponentPlayerDB(roomdataFromDB.playerUserNames[1]);
      } else if (roomdataFromDB.players.length > 1) {
        setOpponentPlayerDB(roomdataFromDB.playerUserNames[0]);
      }
      setIsRoomCreator(currentUserIsCreator);
      initialSetup();
      createGameInstanceDB();
    }
  }, [roomdataFromDB]);

  useEffect(() => {
    // Listen for the event when a trump suit is selected
    SocketManager.onTrumpSelected((selectedTrumpSuit: Suit) => {
      console.log("Trump suit has been selected:", selectedTrumpSuit);
      setTrumpSuit(selectedTrumpSuit); // Set the received trump suit in state
      setTrumpSelected(true); // Update the state to show trump has been chosen
    });
    SocketManager.onOpponentCardSelect((opponentCard: Card) => {
      if (
        opponentCard.value !== selectedCardByUser?.value ||
        opponentCard.suit !== selectedCardByUser?.suit
      ) {
        setOpponentCard(opponentCard); // Update the opponent's selected card
      }
    });
  }, []);

  return (
    <div className="flex flex-col gap-10 h-full min-h-screen ">
      <div>
        {!isTrumpSelected &&
          isRoomCreator &&
          userID &&
          roomId &&
          isGameStateCreated && (
            <SuitDrawerMultiplayer
              userID={userID}
              roomName={roomId}
              onClose={handleCloseDrawer}
            />
          )}
      </div>

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

          <div>{opponentPlayerDB || "Waiting for opponent..."}</div>
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
