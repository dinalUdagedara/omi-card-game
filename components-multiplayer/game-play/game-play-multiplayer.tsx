"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { allPlayersWaiting } from "@/convex/rooms";

const GamePlayMultiplayer = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();

  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const [roomCreatorID, setRoomCreatorID] = useState<Id<"players"> | null>(
    null
  );
  const [isRoomActive, setRoomActive] = useState(false);
  const [opponentPlayerDB, setOpponentPlayerDB] = useState<string>();
  const [playersIDs, setPlayersIDs] = useState<string[] | null>(null);
  const [dealtHands, setDealtHands] = useState<Player[] | null>(null);

  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
  const isTrumpSelected = useStore((state) => state.trumpSelected);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);
  const trumpSuit = useStore((state) => state.trumpSuit);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);
  const setOpponentCard = MultiplayerStateStore(
    (state) => state.setOpponentCard
  );
  const winningCard = MultiplayerStateStore((state) => state.winningCard);
  const setWinningCard = MultiplayerStateStore((state) => state.setWinningCard);
  const setMyCard = MultiplayerStateStore((state) => state.setMyCard);
  const setTeammateCard = MultiplayerStateStore(
    (state) => state.setTeammateCard
  );
  const setOpponent1Card = MultiplayerStateStore(
    (state) => state.setOpponent1Card
  );
  const setOpponent2Card = MultiplayerStateStore(
    (state) => state.setOpponent2Card
  );
  const newRound = MultiplayerStateStore((state) => state.newRound);
  const setNewRound = MultiplayerStateStore((state) => state.setNewRound);
  const trumpSetter = MultiplayerStateStore((state) => state.trumpSetter);

  const setteamMemberID = MultiplayerStateStore(
    (state) => state.setteamMemberID
  );
  const setopponent_1_ID = MultiplayerStateStore(
    (state) => state.setopponent_1_ID
  );
  const setopponent_2_ID = MultiplayerStateStore(
    (state) => state.setopponent_2_ID
  );

  const createGameState = useMutation(api.gameStates.createGameState);
  const updateGameStateAfterRound = useMutation(
    api.gameStates.updateGameStateAfterRound
  );
  const resetStatesinDB = useMutation(api.gameLogic.resetStates);
  const resetTeamPoints = useMutation(api.gameLogic.resetTeamPoints);

  const updateTrump = useMutation(api.gameLogic.updateTrumpSuit);
  const updatePlayerStatus = useMutation(api.rooms.updatePlayerStatus);

  // Query to fetch all players' IDs in the room
  const playersInRoom = useQuery(api.rooms.getAllPlayersIDInTheRoom, {
    roomName: roomId || "",
  });
  const userID = useQuery(api.gameStates.getIdByUserName, {
    userName: userName || "",
  });
  const roomStatus = useQuery(api.gameStates.checkRoomStatus, {
    roomName: roomId || "",
  });
  const roomdataFromDB = useQuery(api.rooms.getRoomData, {
    roomName: roomId || "",
  });

  const isAllWaiting = useQuery(api.rooms.allPlayersWaiting, {
    roomId: roomId || "",
  });

  const isAllPlaying = useQuery(api.rooms.allPlayersPlaying, {
    roomId: roomId || "",
  });

  const updateTrumpSetter = useMutation(api.rooms.updateCreator);
  const removeTrumpSuit = useMutation(api.gameLogic.removeTrumpSuit);

  const [teamMember, setTeamMember] = useState<string>();
  const [opponent_1, setOpponent_1] = useState<string>();
  const [opponent_2, setOpponent_2] = useState<string>();

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
            console.log("Creating gameState");
            await createGameState({
              roomName,
              players,
              playerTurn,
              playersDecks,
              trumpSetter,
            });
          }
        }
      } catch (error) {}
    }
    // if (userID && isAllWaiting)
    //   // update this player status to "playing"
    //   updatePlayerStatus({
    //     status: "playing",
    //     userId: userID,
    //   });
  };

  const getUsername = () => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  };

  const handleJoinRoom = () => {
    getUsername();
  };

  function initialSetup() {
    //Creating and Shuffling the Deck
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);

    //Dividing Deck among 2 players
    const hands = dealCards(shuffledDeck, 4);

    //saving the cards of players in a state
    setDealtHands(hands);
  }

  function handleSuitChange(suit: string | null) {
    setTrumpSuit(suit as Suit);
    setTrump(suit as Suit);
  }

  function handleCloseDrawer() {
    if (roomId) handleSuitChange(trumpSuit);
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

  useEffect(() => {
    if (playersInRoom) {
      setPlayersIDs(playersInRoom);
      if (isRoomCreator && userID) {
        setRoomCreatorID(userID);
      }
    }
  }, [playersInRoom]);
  setTrumpSelected(false);
  useEffect(() => {
    if (roomStatus) {
      console.log("roomStatus", roomStatus);
      if (roomStatus === "started") {
        setRoomActive(true);
      } else {
        setRoomActive(false);
      }
    }
  }, [roomStatus]);

  //resetting States
  useEffect(() => {
    if (winningCard)
      setTimeout(() => {
        const roomName = roomId;
        if (roomName)
          resetStatesinDB({
            roomName,
          });
        setWinningCard(null);
        setMyCard(null);
        setTeammateCard(null);
        setOpponent1Card(null);
        setOpponent2Card(null);
        setOpponentCard(null);
      }, 3000);
  }, [winningCard]);

  useEffect(() => {
    handleJoinRoom();
  }, [roomId, userName]);

  async function resetAfterRound() {
    console.log("reset afer Round");
    //update the trumpsetter in here
    if (roomId) {
      //make score board zero for teams
      resetTeamPoints({
        roomName: roomId,
      });

      if (roomdataFromDB) {
        initialSetup();
        updateGameInstanceDB();
      }
    }
  }

  function changeTrumptoNull() {
    setTrumpSuit(null);
    const trumpSuit = null;
    const roomName = roomId;
    if (trumpSuit && roomName) {
      updateTrump({
        roomName,
        trumpSuit,
      });
    }
  }

  const updateGameInstanceDB = async () => {
    console.log("updateGameInstanceDB");
    if (isRoomCreator && playersInRoom) {
      const players = playersInRoom;
      try {
        if (dealtHands && userID) {
          // Map playersInRoom and dealtHands to match player IDs with their decks
          const playersDecks = players.map((playerId, index) => ({
            playerId,
            deck: dealtHands[index].hand,
          }));
          const roomName = roomId;
          if (roomName) {
            await updateGameStateAfterRound({
              roomName,
              playersDecks,
            });
          }

          changeTrumptoNull();
        }

        setNewRound(false);
      } catch (error) {
        console.log("error", error);
      }
    }
    // if (userID)
    //   // update players status to "playing" in here
    //   updatePlayerStatus({
    //     status: "playing",
    //     userId: userID,
    //   });
  };

  useEffect(() => {
    //run if this is a  new Round and all the players are "waiting" only
    console.log("isallwaiting", isAllWaiting);
    console.log("isAllPlaying", isAllPlaying);
    if (newRound && isAllWaiting) {
      resetAfterRound();
      console.log("New Round");
    }
  }, [newRound, isAllWaiting, isAllPlaying]);

  useEffect(() => {
    if (roomdataFromDB) {
      // Update isRoomCreator based on the creator username
      const currentUserIsCreator = roomdataFromDB.creator === userName;
      if (roomdataFromDB.playerUserNames.length > 3) {
        if (roomdataFromDB.playerUserNames[0] === userName) {
          setTeamMember(roomdataFromDB.playerUserNames[2]);
          setteamMemberID(roomdataFromDB.players[2]);

          setOpponent_1(roomdataFromDB.playerUserNames[1]);
          setopponent_1_ID(roomdataFromDB.players[1]);

          setOpponent_2(roomdataFromDB.playerUserNames[3]);
          setopponent_2_ID(roomdataFromDB.players[3]);
        } else if (roomdataFromDB.playerUserNames[1] === userName) {
          setTeamMember(roomdataFromDB.playerUserNames[3]);
          setteamMemberID(roomdataFromDB.players[3]);

          setOpponent_1(roomdataFromDB.playerUserNames[2]);
          setopponent_1_ID(roomdataFromDB.players[2]);

          setOpponent_2(roomdataFromDB.playerUserNames[0]);
          setopponent_2_ID(roomdataFromDB.players[0]);
        } else if (roomdataFromDB.playerUserNames[2] === userName) {
          setTeamMember(roomdataFromDB.playerUserNames[0]);
          setteamMemberID(roomdataFromDB.players[0]);

          setOpponent_1(roomdataFromDB.playerUserNames[3]);
          setopponent_1_ID(roomdataFromDB.players[3]);

          setOpponent_2(roomdataFromDB.playerUserNames[1]);
          setopponent_2_ID(roomdataFromDB.players[1]);
        } else if (roomdataFromDB.playerUserNames[3] === userName) {
          setTeamMember(roomdataFromDB.playerUserNames[1]);
          setteamMemberID(roomdataFromDB.players[1]);

          setOpponent_1(roomdataFromDB.playerUserNames[0]);
          setopponent_1_ID(roomdataFromDB.players[0]);

          setOpponent_2(roomdataFromDB.playerUserNames[2]);
          setopponent_2_ID(roomdataFromDB.players[2]);
        }
      }

      setIsRoomCreator(currentUserIsCreator);
      initialSetup();
      createGameInstanceDB();
    }
  }, [roomdataFromDB, trumpSetter]);

  useEffect(() => {
    if (isRoomCreator) createGameInstanceDB();
  }, [isRoomCreator]);

  return (
    <div className="flex flex-col h-full min-h-screen justify-between">
      {
        // !isTrumpSelected &&
        !trumpSuit && isRoomCreator && userID && roomId && isRoomActive && (
          <SuitDrawerMultiplayer
            userID={userID}
            roomName={roomId}
            onClose={handleCloseDrawer}
          />
        )
      }

      {roomId && isRoomActive && userID && (
        <div>
          <div>
            <ScoreBoardMobileMultiplayer userID={userID} roomName={roomId} />
          </div>
          <div>
            <PenaltycardsMultiplayer userID={userID} roomName={roomId} />
          </div>
        </div>
      )}

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

          <div>{teamMember || "Waiting for opponent..."}</div>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <div className="flex justify-center items-center">
          <div className="flex flex-col justify-center items-center  min-w-[70px]">
            <motion.div
              className=" rounded-full"
              initial={{ boxShadow: "none" }}
              // animate={{
              //   boxShadow:
              //     lastWinner === 3
              //       ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
              //       : "none", // No shadow when it's not players's turn
              // }}
              transition={{
                duration: 0.8,
              }}
            >
              <div>{opponent_2 || "Waiting for opponent..."}</div>
              <Avatar className="w-14 h-14 shadow-md">
                <AvatarImage src={`/assets/player4.png`} />
                <AvatarFallback>Dp</AvatarFallback>
              </Avatar>
            </motion.div>

            <OtherDecksMobile userHand={exampleCardSet} />
          </div>
        </div>{" "}
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
              {roomId && userID && isRoomActive && (
                <GameBoardMobileMultiplayer
                  onRestart={restartGame}
                  onStart={handleSelectOtherHands}
                  onNextStart={handleNextTurn}
                  onShuffleAgain={handleNextTurnofShuffling}
                  onTrumpSelected={handleCloseDrawer}
                  roomName={roomId}
                  userID={userID}
                />
              )}
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center   ">
          <div className="">
            <div className="flex flex-col justify-center items-center  min-w-[70px]">
              <OtherDecksMobile userHand={exampleCardSet} />

              <motion.div
                className=" rounded-full"
                initial={{ boxShadow: "none" }}
                // animate={{
                //   boxShadow:
                //     lastWinner === 1
                //       ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
                //       : "none", // No shadow when it's not players's turn
                // }}
                transition={{
                  duration: 0.8,
                }}
              >
                <Avatar className="w-14 h-14 shadow-md">
                  <AvatarImage src={`/assets/player2.png`} />
                  <AvatarFallback>Dp</AvatarFallback>
                </Avatar>
                <div>{opponent_1 || "Waiting for opponent..."}</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-400 via-purple-500 to-blue-500 rounded-t-full relative mt-20 ">
        <div className="flex w-full justify-center items-center">
          <div className="">
            {roomId && userID && isRoomActive ? (
              <div className="relative w-full ">
                <div className="">
                  <UserDeckMobileMultiplayer
                    userID={userID}
                    roomName={roomId}
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
