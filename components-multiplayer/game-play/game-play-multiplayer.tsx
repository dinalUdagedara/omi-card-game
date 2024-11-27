"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { Card, exampleCardSet, Player, Suit } from "@/utils/practise/types";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import PenaltycardsMultiplayer from "./penalty-cards/score-and-penalty-card-component";
import GameBoardMobileMultiplayer from "./game-board/game-board-multiplayer";
import { useStore } from "@/store/state";
import { UserDeckMobileMultiplayer } from "./decks/user-deck-multiplayer";
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
import NoticeCardTemplate from "./game-board/game-board-template";
import NameCardTemplate from "./name-card/name-card-template";
import { OtherDecksMultiplayer } from "../cards/other-card-deck-multiplayer";
import UserAvatarContainerWithTimeOut from "./user-avatars/avatar-with-timeout";
import UserAvatarContainer from "./user-avatars/avatar-container";

const GamePlayMultiplayer = () => {
  const pathname = usePathname();
  const roomId = pathname.split("/").pop();

  const [isRoomCreator, setIsRoomCreator] = useState<boolean>(false);
  const [roomCreatorID, setRoomCreatorID] = useState<Id<"players"> | null>(
    null
  );
  const [isRoomActive, setRoomActive] = useState(false);
  const [playersIDs, setPlayersIDs] = useState<string[] | null>(null);
  const [dealtHands, setDealtHands] = useState<Player[] | null>(null);

  const [teamMember, setTeamMember] = useState<string>();
  const [opponent_1, setOpponent_1] = useState<string>();
  const [opponent_2, setOpponent_2] = useState<string>();

  const userName = MultiplayerStateStore((state) => state.userName);
  const setUserName = MultiplayerStateStore((state) => state.setUsername);
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
  const myCardDeck = MultiplayerStateStore((state) => state.myCardSet);
  const setRoomName = MultiplayerStateStore((state) => state.setRoomName);

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

  const playerTurnUserName = useQuery(api.gameLogic.getPlayerTurnName, {
    roomName: roomId || "",
  });

  const isGameOver = useQuery(api.gameStates.isGameOver, {
    roomName: roomId || "",
    userid: userID || null,
  });

  const turnPlayerID = useQuery(api.gameLogic.getPlayerTurn, {
    roomName: roomId || "",
  });

  const updatePlayerHeartbeat = useMutation(
    api.autoPlayingBot.updatePlayersHeartBeat
  );

  const handleDisconnectedPlayers = useMutation(
    api.autoPlayingBot.handleDisconnectedPlayers
  );
  const rejoinPlayers = useMutation(api.autoPlayingBot.rejoinPlayers);
  const handleCardSelectForDisconnectedPlayer = useMutation(
    api.autoPlayingBot.handleCardSelectForDisconnectedPlayer
  );

  const offlinePlayers = useQuery(api.autoPlayingBot.offlinePlayers, {
    roomName: roomId || "",
  });

  const disconnectedPlayers = useQuery(api.autoPlayingBot.disconnectedPlayers, {
    roomName: roomId || "",
  });

  const isRoomCreatorOffline = useQuery(
    api.internalFunctions.isRoomCreatorOffline,
    {
      roomName: roomId || "",
    }
  );
  const playingCards = useQuery(api.gameLogic.getPlayingCards, {
    roomName: roomId || "",
  });
  const resettingAfterRoundBot = useMutation(
    api.autoPlayingBot.resettingAfterRoundBot
  );
  const checkPlayerStatus = useMutation(api.autoPlayingBot.checkPlayerStatus);

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
    console.log("Initial setup", isRoomCreator);
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

  async function playDisconnectedPlayersCard() {
    // Check if it's the turn of a disconnected player
    const disconnectedPlayerTurn = disconnectedPlayers?.some((player) => {
      return player.playerId === turnPlayerID;
    });

    if (disconnectedPlayerTurn) {
      console.log(
        `Player with ID ${turnPlayerID} is disconnected. Automating their card play.`
      );

      //Playing the disconnected player's card only by a signle player to avoid multiple card selection
      if (roomId && turnPlayerID) {
        const players = roomdataFromDB?.playerUserNames || [];

        const isPlayer1Offline = await checkPlayerStatus({
          roomName: roomId,
          userName: players[0],
        });
        const isPlayer2Offline = await checkPlayerStatus({
          roomName: roomId,
          userName: players[1],
        });
        const isPlayer3Offline = await checkPlayerStatus({
          roomName: roomId,
          userName: players[2],
        });
        const isPlayer4Offline = await checkPlayerStatus({
          roomName: roomId,
          userName: players[3],
        });

        if (!isPlayer1Offline) {
          if (players[0] === userName) {
            console.log(`Player ${players[0]} is Triggering.`);
            // Trigger the card select function for the player whose turn it is
            handleCardSelectForDisconnectedPlayer({
              roomName: roomId,
              userId: turnPlayerID,
            });
          }
        } else if (!isPlayer2Offline) {
          if (players[1] === userName) {
            console.log(`Player ${players[1]} is Triggering.`);
            // Trigger the card select function for the player whose turn it is
            handleCardSelectForDisconnectedPlayer({
              roomName: roomId,
              userId: turnPlayerID,
            });
          }
        } else if (!isPlayer3Offline) {
          if (players[2] === userName) {
            console.log(`Player ${players[2]} is Triggering.`);
            // Trigger the card select function for the player whose turn it is
            handleCardSelectForDisconnectedPlayer({
              roomName: roomId,
              userId: turnPlayerID,
            });
          }
        } else if (!isPlayer4Offline) {
          if (players[3] === userName) {
            console.log(`Player ${players[3]} is Triggering.`);
            // Trigger the card select function for the player whose turn it is
            handleCardSelectForDisconnectedPlayer({
              roomName: roomId,
              userId: turnPlayerID,
            });
          }
        }
      }
    } else {
      console.log(
        `Player with ID ${turnPlayerID} is connected. Waiting for their action.`
      );
    }
  }
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
  // Function to send the ping every 10 seconds
  function startHeartbeat() {
    const intervalId = setInterval(async () => {
      try {
        const roomName = roomId;
        if (userID && roomName) {
          // updating the heartbeat
          await updatePlayerHeartbeat({ userID, roomName });
          // await rejoinPlayers({ roomName });
        }
      } catch (error) {
        console.error("Failed to update heartbeat:", error);
      }
    }, 5000); // Every 5 seconds

    return intervalId;
  }

  async function SetOfflinePlayers() {
    const roomName = roomId;
    if (roomName) {
      //handling disconnected Players
      await handleDisconnectedPlayers({ roomName: roomName });
    }
  }

  const updateGameInstanceDB = async () => {
    //if room creator is offline run resetafterRoundBot
    if (
      isRoomCreatorOffline === true &&
      playersInRoom &&
      userID === playersInRoom[0]
    ) {
      if (roomId && userID) {
        resettingAfterRoundBot({ roomName: roomId }); // you need to pass the disconnected user's userID not the player[0]
      }
    }

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
        }
      } catch (error) {
        console.log("error", error);
      }
    }
    setNewRound(false);
  };

  async function rejoiningPlayers() {
    if (roomId) {
      await rejoinPlayers({ roomName: roomId });
    }
  }

  //checking if the player with the turn is disconnected
  useEffect(() => {
    if (
      turnPlayerID &&
      disconnectedPlayers &&
      disconnectedPlayers?.length > 0
    ) {
      if (playingCards && playingCards?.length < 4) {
        // change need to be done here when round ends and disconnedted player have the turn he will automatically play a card
        playDisconnectedPlayersCard();
      }
    }
  }, [
    turnPlayerID,
    disconnectedPlayers,
    playingCards,
    offlinePlayers,
    trumpSuit,
  ]);

  useEffect(() => {
    if (playersInRoom) {
      setPlayersIDs(playersInRoom);
      if (isRoomCreator && userID) {
        setRoomCreatorID(userID);
      }
      if (roomId) setRoomName(roomId);
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

  useEffect(() => {
    //run if this is a  new Round and all the players are "waiting" only
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
  }, [roomdataFromDB]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (userID && roomId) {
      // Start the heartbeat when the userID and roomId are available
      intervalId = startHeartbeat();
    }
    return () => {
      // Cleanup function to clear the interval when the component unmounts
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [userID, roomId]);

  useEffect(() => {
    console.log("offline players", offlinePlayers);
    if (offlinePlayers && offlinePlayers.length > 0 && isAllPlaying) {
      SetOfflinePlayers();
    }
  }, [offlinePlayers]);

  useEffect(() => {
    if (isAllPlaying) {
      rejoiningPlayers();
    }
  }, [offlinePlayers]);

  return (
    <div className="flex flex-col h-full min-h-screen justify-between w-full">
      {!isGameOver &&
        !trumpSuit &&
        isRoomCreator &&
        userID &&
        roomId &&
        isRoomActive && (
          <SuitDrawerMultiplayer
            userID={userID}
            roomName={roomId}
            onClose={handleCloseDrawer}
          />
        )}

      {roomId && isRoomActive && userID ? (
        <div className="flex justify-center items-center flex-col">
          <div className="w-full">
            <PenaltycardsMultiplayer userID={userID} roomName={roomId} />
          </div>
        </div>
      ) : (
        <div className="w-full my-2 flex justify-center">
          <Skeleton className="min-h-[90px] min-w-[330px] lg:w-[470px] lg:h-[100px]  inv-rad inv-rad-12" />
        </div>
      )}

      <div className="lg:mt-3">
        <div className="flex justify-center z-20">
          <div className=" flex  gap-4 justify-center items-center mb-4 ">
            <div className="">
              <OtherDecksMultiplayer userHand={myCardDeck ?? exampleCardSet} />
            </div>
            {playerTurnUserName === teamMember ? (
              <UserAvatarContainerWithTimeOut userName={teamMember} />
            ) : (
              <UserAvatarContainer userName={teamMember} />
            )}
            ;
            <div className="text-center ">
              <NameCardTemplate>{teamMember || "Waiting.."}</NameCardTemplate>
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4 bg-white z-20 ">
          <div className="flex justify-center items-center z-20 ">
            <div className="flex flex-col justify-center items-center  min-w-[70px]">
              <div className="text-center py-2">
                <NameCardTemplate>{opponent_2 || "Waiting.."}</NameCardTemplate>
              </div>
              {playerTurnUserName === opponent_2 ? (
                <UserAvatarContainerWithTimeOut userName={opponent_2} />
              ) : (
                <UserAvatarContainer userName={opponent_2} />
              )}
              <OtherDecksMultiplayer userHand={myCardDeck ?? exampleCardSet} />
            </div>
          </div>
          <div className=" flex justify-center items-center  ">
            <NoticeCardTemplate>
              <div className="w-full h-full justify-center  items-center z-20 min-w-[175px]  lg:w-[550px] lg:min-h-[350px]  md:h-full ">
                {roomId && userID && isRoomActive && (
                  <GameBoardMobileMultiplayer
                    onTrumpSelected={handleCloseDrawer}
                    roomName={roomId}
                    userID={userID}
                  />
                )}
              </div>
            </NoticeCardTemplate>
          </div>
          <div className=" flex justify-center items-center  z-20 ">
            <div className="">
              <div className="flex flex-col justify-center items-center  min-w-[70px]">
                <OtherDecksMultiplayer
                  userHand={myCardDeck ?? exampleCardSet}
                />

                {playerTurnUserName === opponent_1 ? (
                  <UserAvatarContainerWithTimeOut userName={opponent_1} />
                ) : (
                  <UserAvatarContainer userName={opponent_1} />
                )}

                <div className="text-center py-2">
                  <NameCardTemplate>
                    {opponent_1 || "Waiting.."}
                  </NameCardTemplate>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-black via-amber-950 to-amber-900  relative mt-20  rounded-t-full">
        <div className="flex w-full justify-center items-center">
          <div className="">
            {roomId && userID && isRoomActive && (
              <div className="relative w-full ">
                <div className="">
                  <UserDeckMobileMultiplayer
                    userID={userID}
                    roomName={roomId}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full justify-center mt-5 pr-6 ">
          <motion.div
            className=" rounded-full"
            initial={{ boxShadow: "none" }}
            transition={{
              duration: 0.8,
            }}
          >
            <Avatar className="w-40 h-40 ">
              <AvatarImage src={`/assets/user-avatars/player1.png`} />
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
