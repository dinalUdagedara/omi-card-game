"use client";
import {
  checkWinnerForTurn,
  createDeck,
  dealCards,
  determineTrickWinner,
  getTrump,
  getTurnSuit,
  getLastWinner,
  setTrump,
  setTurnSuit,
  shuffleDeck,
  setLastWinner,
} from "@/utils/practise/game-logic";
import { Player, Card, Suit, suits } from "@/utils/practise/types";
import { useState, useEffect } from "react";
import { chooseCard, chooseCardWithoutTurnSuit } from "@/utils/practise/game-play";
import { toast } from "sonner";
import { SuitDrawer } from "../drawer/trump-suit-selector";
import { useStore } from "@/store/state";
import { OtherDecks } from "../decks/other-decks";
import GameBoard from "../game-board.tsx/game-board/game-board";
import { CardStore } from "@/store/player-card-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDeckStraight } from "../decks/user-deck-straight";
import Scoreboard from "../game-board.tsx/score-board/score-board";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "../ui/button";
import { useIsMobile } from "./game-play-mobile";
import { PenaltyDeckMobile } from "../decks/penalty-decks/penalty-decks";
import { SuitDrawerMobile } from "../drawer/mobile/trump-suit-selector-mobile";
import { FinishStateStore } from "@/store/finish-round-state";
import { RoundOverDialogMobile } from "../game-board.tsx/dialogs/round-over-dialog-mobile";
import { motion } from "framer-motion";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";
import { useCollectingCardSound } from "@/utils/play-sounds";
import NameCardTemplate from "@/components-multiplayer/game-play/name-card/name-card-template";

export default function Board() {
  const isMobile = useIsMobile();
  const [turnSuit, setturnSuit] = useState<Suit | null>(null);
  const cardSet = useStore((state) => state.cardSet);
  const setCardSet = useStore((state) => state.setCardSet);

  const generatedCards = useStore((state) => state.generatedCards);
  const setGeneratedCards = useStore((state) => state.setGeneratedCards);

  const lastWinner = useStore((state) => state.lastWinner);
  const SetLastWinner = useStore((state) => state.setLastWinner);

  const dealtHands = useStore((state) => state.dealtHands);
  const setDealtHands = useStore((state) => state.setDealtHands);

  const turnNumber = useStore((state) => state.turnNumber);
  const setTurnNumber = useStore((state) => state.setTurnNumber);

  const trumpSuit = useStore((state) => state.trumpSuit);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const setSelectedCardByUser = useStore(
    (state) => state.setSelectedCardByUser
  );

  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const setIsCardsGenerated = useStore((state) => state.setIsCardsGenerated);

  const isSubmitted = useStore((state) => state.isSubmitted);
  const setIsSubmitted = useStore((state) => state.setIsSubmitted);

  const isTrumpSelected = useStore((state) => state.trumpSelected);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);

  const setPlayer_1_card = CardStore((state) => state.setPlayer_1_card);
  const setPlayer_2_card = CardStore((state) => state.setPlayer_2_card);
  const setPlayer_3_card = CardStore((state) => state.setPlayer_3_card);
  const setPlayer_4_card = CardStore((state) => state.setPlayer_4_card);

  const team1Points = useStore((state) => state.team1Points);
  const setTeam1Points = useStore((state) => state.setTeam1Points);

  const team2Points = useStore((state) => state.team2Points);
  const setTeam2Points = useStore((state) => state.setTeam2Points);

  const roundsWonbyTeam1 = useStore((state) => state.roundsWonbyTeam1);
  const setRoundsWonbyTeam1 = useStore((state) => state.setRoundsWonbyTeam1);

  const roundsWonbyTeam2 = useStore((state) => state.roundsWonbyTeam2);
  const setRoundsWonbyTeam2 = useStore((state) => state.setRoundsWonbyTeam2);

  const winningCard = useStore((state) => state.winningCard);
  const setWinningCard = useStore((state) => state.setWinningCard);

  const thisRoundWinner = useStore((state) => state.thisRoundWinner);
  const setThisRoundWinner = useStore((state) => state.setThisRoundWinner);

  const roundWinners = useStore((state) => state.roundWinners);
  const setRoundWinners = useStore((state) => state.setRoundWinners);

  const isGameOver = useStore((state) => state.isGameOver);
  const setIsGameOver = useStore((state) => state.setIsGameOver);

  const gameWinner = useStore((state) => state.gameWinner);
  const setGameWinner = useStore((state) => state.setGameWinner);

  const roundNumber = useStore((state) => state.roundNumber);
  const setRoundNumber = useStore((state) => state.setRoundNumber);

  const team1PenaltyCards = useStore((state) => state.team_1_penaltyCards);
  const setTeam_1_penaltyCards = useStore(
    (state) => state.setTeam_1_penaltyCards
  );

  const team2PenaltyCards = useStore((state) => state.team_2_penaltyCards);
  const setTeam_2_penaltyCards = useStore(
    (state) => state.setTeam_2_penaltyCards
  );
  const trumpSetter = useStore((state) => state.trumpSetter);
  const setTrumpSetter = useStore((state) => state.setTrumpSetter);
  const isUserTurn = useStore((state) => state.isUserTurn);
  const setIsUserTurn = useStore((state) => state.setIsUserTurn);
  const setRoundOver = FinishStateStore((state) => state.setRoundOver);
  const isRoundOver = FinishStateStore((state) => state.isRoundOver);

  const setwonCallingTrumps = FinishStateStore(
    (state) => state.setwonCallingTrumps
  );
  const setwonWithoutCallingTrumps = FinishStateStore(
    (state) => state.setwonWithoutCallingTrumps
  );
  const setlostCallingTrumps = FinishStateStore(
    (state) => state.setlostCallingTrumps
  );
  const setlostWithoutCallingTrumps = FinishStateStore(
    (state) => state.setlostWithoutCallingTrumps
  );
  const isDialogOpen = FinishStateStore((state) => state.isDialogOpen);
  const setDialogOpen = FinishStateStore((state) => state.setDialogOpen);
  const { playCollectCards } = useCollectingCardSound();
  const muted = useStore((state) => state.muted);

  function initailSetup() {
    //Creating and Shuffling the Deck
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);

    //Dividing Deck among 4 players
    const hands = dealCards(shuffledDeck, 4);

    //saving the cards of players in a state
    setDealtHands(hands);
  }

  function handleCardSelectDeck(cardIndex: number) {
    setIsUserTurn(false);
    const player1Hand = dealtHands[0].hand;
    const selectedCard = player1Hand[cardIndex];

    const updatedCardSet = [selectedCard, ...useStore.getState().cardSet];

    setCardSet(updatedCardSet);

    // Remove the selected card from the hand
    dealtHands[0].hand = dealtHands[0].hand.filter(
      (card) => card !== selectedCard
    );
    setSelectedCardByUser(selectedCard);

    if (selectedCard) {
      setTurnSuit(selectedCard.suit);
      setturnSuit(selectedCard.suit);
    }
  }

  function handleSubmit() {
    setIsSubmitted(true);
    selectWinningCard();
  }

  function handleSelectOtherHands() {
    if (turnSuit) {
      //if there is a turnsuit selected this will choose other cards with the seletced suit
      selectOtherhandsWithTurnSuit(turnSuit);
    } else {
      //if there is no turnsuit this function will select a turn suit from lastwinner and do the rest
      setTrumpSelected(false);
      setIsCardsGenerated(true);
      if (lastWinner === 1) {
        const chosenCard: Card = chooseCardWithoutTurnSuit(dealtHands[1].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 1);
        console.log("chosen card without the turnsuit", chosenCard);
      } else if (lastWinner === 2) {
        const chosenCard: Card = chooseCardWithoutTurnSuit(dealtHands[2].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 2);
        console.log("chosen card without the turnsuit", chosenCard);
      } else if (lastWinner === 3) {
        const chosenCard: Card = chooseCardWithoutTurnSuit(dealtHands[3].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 3);
        console.log("chosen card without the turnsuit", chosenCard);
      }
    }

    if (selectedCardByUser) {
      setIsUserTurn(false);
    } else {
      setIsUserTurn(true);
    }

    console.log("turnSuit", turnSuit);
  }

  function selectOtherhandsWithTurnSuit(turnSuit: Suit) {
    let selectedCardsByEachPlayer: Card[] = [];

    // Iterate through dealtHands starting from the second hand (index 1)
    const selectedCards = dealtHands.slice(1).map((hand, index) => {
      const chosenCard: Card = chooseCard(hand.hand, turnSuit);

      selectedCardsByEachPlayer[index] = chosenCard;
      console.log("Selected Cards by player", selectedCardsByEachPlayer);
      setGeneratedCards(selectedCardsByEachPlayer);

      // Remove the chosen card from the hand
      hand.hand = hand.hand.filter((card) => card !== chosenCard);

      return chosenCard;
    });

    // setCardSet((prevCardSet) => [...prevCardSet, ...selectedCards]);

    const updatedCardSet = [...cardSet, ...selectedCards];

    setCardSet(updatedCardSet);

    console.log("Selected Cards for turn:", selectedCards);

    setTrumpSelected(false);
    setIsCardsGenerated(true);
  }

  function selectOtherHandsWithoutTurnSuit(
    selectedCard: Card,
    turnOwnerindex: number
  ) {
    console.log("selectedCard", selectedCard);
    console.log("turnOwnerindex", turnOwnerindex);

    let selectedCardsByEachPlayer: Card[] = [];
    // Iterate through dealtHands starting from the second hand (index 1)
    const selectedCards = dealtHands.slice(1).map((hand, index) => {
      const chosenCard: Card = chooseCard(hand.hand, selectedCard.suit);
      selectedCardsByEachPlayer[turnOwnerindex - 1] = selectedCard;
      console.log("selectedCardsByEachPlayer", selectedCardsByEachPlayer);
      selectedCardsByEachPlayer[index] = chosenCard;
      console.log("selectedCardsByEachPlayer", selectedCardsByEachPlayer);
      setGeneratedCards(selectedCardsByEachPlayer);

      console.log("hand.hand", hand.hand);
      // Remove the chosen card from the hand
      hand.hand = hand.hand.filter((card) => card !== chosenCard);

      console.log("hand.hand", hand.hand);

      return chosenCard;
    });
    setTrumpSelected(false);
    setIsCardsGenerated(true);
    console.log("cardset", cardSet);
    // Update the cardSet state by adding the selected cards
    setCardSet([...cardSet, ...selectedCards]);
  }
  function handleNextTurn() {
    // finish this turn and move to next turn if all hands are over

    if (dealtHands[0].hand.length < 1) {
      console.log("hands are over");

      if (team1Points > team2Points) {
        setRoundWinners(1);
        toast("This Round is Won by Team 1 ");
        setRoundOver(true);
      } else {
        setRoundWinners(2);
        toast("This Round is Won by Team 2 ");
        setRoundOver(true);
      }
      resetStates();
    } else {
      const TurnNumber = turnNumber + 1;
      setTurnNumber(TurnNumber);
      resetStates();
    }
  }

  function handleNextTurnofShuffling() {
    checkWinner();
    if (isGameOver) {
      console.log("Game over");
    } else {
      if (roundWinners === 1) {
        if (trumpSetter === 1) {
          // won  telling trumps
          setwonCallingTrumps(true);
          const remainingPenaltyCards = team2PenaltyCards - 1;
          setTeam_2_penaltyCards(remainingPenaltyCards);
        } else {
          // won without telling trumps
          setwonWithoutCallingTrumps(true);
          const remainingPenaltyCards = team2PenaltyCards - 2;
          setTeam_2_penaltyCards(remainingPenaltyCards);
        }
        const roundNumber = roundsWonbyTeam1 + 1;
        setRoundsWonbyTeam1(roundNumber);
      } else if (roundWinners === 2) {
        if (trumpSetter === 2) {
          // lost without telling trumps
          setlostWithoutCallingTrumps(true);
          const remainingPenaltyCards = team1PenaltyCards - 1;
          setTeam_1_penaltyCards(remainingPenaltyCards);
        } else {
          // lost  telling trumps
          setlostCallingTrumps(true);
          const remainingPenaltyCards = team1PenaltyCards - 2;
          setTeam_1_penaltyCards(remainingPenaltyCards);
        }

        const roundNumber = roundsWonbyTeam2 + 1;
        setRoundsWonbyTeam2(roundNumber);
      }
      setDialogOpen(true);
      setTurnNumber(1);
      const nextRoundNumber = roundNumber !== null ? roundNumber + 1 : 1;
      setRoundNumber(nextRoundNumber);
      resetTeamPoints();
      setStarterForRound();
      initailSetup();
    }
  }

  function setRandomSuit() {
    const randomIndex = Math.floor(Math.random() * suits.length);
    handleSuitChange(suits[randomIndex]);
  }

  function resetStates() {
    setWinningCard(null);
    setCardSet([]);
    setSelectedCardByUser(null);
    setturnSuit(null);
    setTurnSuit(null);
    setGeneratedCards(null);
    setWinner();
    checkWinner();
    getLastWinnerNumber();
    setIsCardsGenerated(false);
    setIsSubmitted(false);
    setTrumpSelected(false);
    resetCards();
  }

  function setStarterForRound() {
    const playerCycle = [1, 2, 3, 0]; // player
    const trumpSetterCycle = [2, 1]; // Alternating between team 2 and team 1
    const playerIndex = (roundNumber - 1) % 4; // Cycles through the players
    const trumpSetterIndex = (roundNumber - 1) % 2; // Alternates between trump setters
    const starterPlayer = playerCycle[playerIndex];
    const trumpSetterNumber = trumpSetterCycle[trumpSetterIndex];

    setTrumpSetter(trumpSetterNumber);
    handleLastWinner(starterPlayer);
    setRandomSuit();
  }

  function resetTeamPoints() {
    setTeam1Points(0);
    setTeam2Points(0);
    setRoundWinners(null);
    setTrumpSuit(null);
    setTrump(null);
  }

  function resetCards() {
    setPlayer_1_card(null);
    setPlayer_2_card(null);
    setPlayer_3_card(null);
    setPlayer_4_card(null);
  }
  function handleLastWinner(index: number) {
    setLastWinner(index);
    SetLastWinner(index);
  }

  function getLastWinnerNumber() {
    const lastWinner = getLastWinner();
    if (lastWinner) handleLastWinner(lastWinner);
    // SetLastWinner(lastWinner);
  }

  function selectWinningCard() {
    if (cardSet.length > 0) {
      const winningCard: Card = determineTrickWinner(cardSet);
      setWinningCard(winningCard);
      playCollectCards(muted);
      console.log("Winning Card:", winningCard);
    }
  }

  function setWinner() {
    if (selectedCardByUser && generatedCards && winningCard) {
      const winner = checkWinnerForTurn(
        selectedCardByUser,
        generatedCards,
        winningCard
      );
      // Update the points after determining the winner
      updateTeamPoints(winner);
      setThisRoundWinner(winner);
      // setLastWinner(winner);
      handleLastWinner(winner);
    }
  }

  function updateTeamPoints(winner: number) {
    if (winner === 0 || winner === 2) {
      const newPoints = team1Points + 1;
      setTeam1Points(newPoints);
    } else if (winner === 1 || winner === 3) {
      const newPoints = team2Points + 1;
      setTeam2Points(newPoints);
    }
  }

  function handleSuitChange(suit: string | null) {
    setTrumpSuit(suit as Suit);
    setTrump(suit as Suit);
  }

  function checkWinner() {
    if (team1PenaltyCards === 0) {
      toast("Your Team lost");
      setGameWinner(2);
      setIsGameOver(true);
    }
    if (team2PenaltyCards === 0) {
      toast("Congratulations Your Team wons the Game");
      setGameWinner(1);
      setIsGameOver(true);
    }

    // if (roundsWonbyTeam1) {
    //   if (roundsWonbyTeam1 >= 4) {
    //     toast("Congratulations Your Team wons the Game");
    //     setIsGameOver(true);
    //   }
    // }
    // if (roundsWonbyTeam2) {
    //   if (roundsWonbyTeam2 >= 4) {
    //     toast("Your Team lost");
    //     setIsGameOver(true);
    //   }
    // }
  }

  function handleCloseDrawer() {
    handleSuitChange(trumpSuit);
    setTrumpSelected(true);
  }

  function handleAutomaticSubmit() {
    if (!isSubmitted && isCardsGenerated && selectedCardByUser) {
      setTimeout(() => {
        handleSubmit();
      }, 3000);
    }
  }

  function handleAutomaticNextRound() {
    if (isSubmitted) {
      setTimeout(() => {
        handleNextTurn();
      }, 3000);
    }
  }

  function restartGame() {
    // Reset the points for both teams
    resetTeamPoints();
    setRoundsWonbyTeam1(0);
    setRoundsWonbyTeam2(0);
    setTeam_1_penaltyCards(10);
    setTeam_2_penaltyCards(10);

    // Set round and turn numbers back to the first round and turn
    setRoundNumber(1);
    setTurnNumber(1);

    // Reinitialize game states
    resetCards();
    resetStates();

    // Shuffle and deal cards again
    initailSetup();

    // Reset game over state
    setIsGameOver(false);

    // Ensure last winner starts from the beginning
    SetLastWinner(0);
    handleLastWinner(0);

    toast("Game has been restarted! Let's play again.");
  }

  // uncomment these use effect to work
  // // Automatically run handleSelectOtherHands (play button) when  or lastWinner changes
  useEffect(() => {
    if (!isMobile)
      if (turnSuit || lastWinner !== null) {
        handleSelectOtherHands();
      }
  }, [turnNumber]);

  useEffect(() => {
    if (!isMobile) initailSetup();
  }, []);

  useEffect(() => {
    if (!isMobile) console.log("generated cards", generatedCards);
    if (generatedCards)
      if (lastWinner === 1) {
        setTurnSuit(generatedCards[0].suit);
        setturnSuit(generatedCards[0].suit);
        setPlayer_2_card(generatedCards[0]);
        setPlayer_3_card(generatedCards[1]);
        setPlayer_4_card(generatedCards[2]);
      } else if (lastWinner === 2) {
        setTurnSuit(generatedCards[1].suit);
        setturnSuit(generatedCards[1].suit);
        setPlayer_3_card(generatedCards[1]);
        setPlayer_4_card(generatedCards[2]);
      } else if (lastWinner === 3) {
        setTurnSuit(generatedCards[2].suit);
        setturnSuit(generatedCards[2].suit);
        setPlayer_4_card(generatedCards[2]);
      } else if (lastWinner === 0 && selectedCardByUser) {
        setTurnSuit(selectedCardByUser.suit);
        setturnSuit(selectedCardByUser.suit);
      }
    if (selectedCardByUser && generatedCards) {
      setPlayer_1_card(selectedCardByUser);
      setPlayer_2_card(generatedCards[0]);
      setPlayer_3_card(generatedCards[1]);
      setPlayer_4_card(generatedCards[2]);
    }
  }, [generatedCards, selectedCardByUser]);

  useEffect(() => {
    if (!isMobile)
      if (cardSet.length > 2) {
        handleAutomaticSubmit();
      }
  }, [isCardsGenerated, isSubmitted, selectedCardByUser, cardSet]);

  useEffect(() => {
    if (!isMobile)
      if (isSubmitted) {
        handleAutomaticNextRound();
      }
  }, [isSubmitted]);

  useEffect(() => {
    if (!isMobile) checkWinner();
  }, [roundsWonbyTeam1, roundsWonbyTeam2]);

  useEffect(() => {
    if (!isMobile)
      if (turnSuit && cardSet.length < 2) {
        handleSelectOtherHands();
      }
  }, [turnSuit, isCardsGenerated]);

  useEffect(() => {
    if (!isMobile)
      if (isRoundOver) {
        handleNextTurnofShuffling();
      }
  }, [isSubmitted]);

  useEffect(() => {
    if (!isMobile) checkWinner();
  }, [team1PenaltyCards, team2PenaltyCards, gameWinner]);
  return (
    <div className="hidden  w-full h-screen sm:flex flex-col ">
      {/* Dialog after a Round  */}

      {isDialogOpen && (
        <div className=" ">
          <RoundOverDialogMobile />
        </div>
      )}

      <div className="flex flex-col  h-full w-full shadow-lg  p-4">
        {/* All the other things */}
        <div className="flex justify-end gap-4">
          {/* Player 3 and scoreboard */}
          <div className="relative col-span-3 flex items-center  justify-center gap-4 w-1/3 p-4  shadow-md z-20 ">
            {dealtHands.length > 0 && dealtHands[2]?.hand ? (
              <div className="flex flex-row justify-center items-center z-20">
                <OtherDecks userHand={dealtHands[2].hand} />

                <motion.div
                  className=" rounded-full"
                  initial={{ boxShadow: "none" }}
                  animate={{
                    boxShadow:
                      lastWinner === 2
                        ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
                        : "none", // No shadow when it's not players's turn
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                >
                  <Avatar className="relative w-16 h-16 lg:w-24 lg:h-24 shadow-md ">
                    <Image
                      alt="Mountains"
                      src={notificaitonBackGround}
                      fill
                      sizes="(min-width: 808px) 50vw, 100vw"
                      style={{
                        objectFit: "cover", // cover, contain, none
                      }}
                    />
                    <AvatarImage
                      className="z-20"
                      src={`/assets/images/user-avatars/person8.png`}
                    />
                    <AvatarFallback>Dp</AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="text-center py-2 w-full">
                  <NameCardTemplate>Player 3</NameCardTemplate>
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-between w-full ml-10 mr-5 items-center">
                <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-600 my-8" />
                <Skeleton className="h-14 w-14 rounded-full bg-slate-600 mr-10" />
              </div>
            )}
          </div>
          {/* Scoreboard */}
          <div className="flex flex-col w-1/3 ">
            <div className="flex justify-center items-center w-full h-full">
              <Scoreboard />
            </div>
            {/* <div className="flex flex-row justify-between w-full gap">
              <div className="w-full">
                <PenaltyDeckMobile penaltyCardNumber={team1PenaltyCards} />
              </div>
              <div className="w-full">
                <PenaltyDeckMobile penaltyCardNumber={team2PenaltyCards} />
              </div>
            </div> */}
          </div>
        </div>

        {/* Players 4, Game Board, Player 2 */}
        <div className="flex justify-between gap-4 h-full w-full mt-4">
          {/* Player 4 */}
          <div className=" col-span-3 flex items-center justify-center gap-4 w-1/4 p-4 shadow-md z-20 my-10 ">
            {dealtHands.length > 0 && dealtHands[3]?.hand ? (
              <div className="flex flex-col justify-center items-center z-20 w-full">
                <motion.div
                  className=" rounded-full"
                  initial={{ boxShadow: "none" }}
                  animate={{
                    boxShadow:
                      lastWinner === 3
                        ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
                        : "none", // No shadow when it's not players's turn
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                >
                  <div className="text-center py-2 w-full">
                    <NameCardTemplate>Player 4</NameCardTemplate>
                  </div>
                  <div className="w-full flex justify-center">
                    <Avatar className="relative w-16 h-16 lg:w-24 lg:h-24 shadow-md z-20">
                      <Image
                        alt="Mountains"
                        src={notificaitonBackGround}
                        fill
                        sizes="(min-width: 808px) 50vw, 100vw"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      <AvatarImage
                        className="z-20"
                        src={`/assets/images/user-avatars/person8.png`}
                      />
                      <AvatarFallback>Dp</AvatarFallback>
                    </Avatar>
                  </div>
                </motion.div>

                <OtherDecks userHand={dealtHands[3].hand} />
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-6 items-center ">
                <Skeleton className="h-[125px] w-[180px] rounded-xl bg-slate-600" />
                <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
              </div>
            )}
          </div>

          {/* Game Board */}

          <div
            className="flex w-full justify-center items-center  m-4 p-6 shadow-lg bg-black rounded-2xl bg-opacity-75 min-h-[350px] z-20 border-8 border-black"
            style={{
              backgroundImage: `url('/assets/background.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full justify-center items-center z-20">
              {/* <Button onClick={handleInitialStart}>Start</Button> */}
              <GameBoard
                onRestart={restartGame}
                onStart={handleSelectOtherHands}
                onNextStart={handleNextTurn}
                onShuffleAgain={handleNextTurnofShuffling}
              />
            </div>
          </div>

          {/* Player 2 */}
          <div className="relative col-span-3 flex items-center justify-center gap-4 w-1/4 p-4 shadow-md z-20 my-10">
            {dealtHands.length > 0 && dealtHands[1]?.hand ? (
              <div className="flex flex-col justify-center items-center z-20">
                <OtherDecks userHand={dealtHands[1].hand} />
                <motion.div
                  className=" rounded-full"
                  initial={{ boxShadow: "none" }}
                  animate={{
                    boxShadow:
                      lastWinner === 1
                        ? "0 0 16px rgba(0, 255, 0, 0.8)" // Green glowing effect
                        : "none", // No shadow when it's not players's turn
                  }}
                  transition={{
                    duration: 0.8,
                  }}
                >
                  <Avatar className="relative w-16 h-16 lg:w-24 lg:h-24 shadow-md ">
                    <Image
                      alt="Mountains"
                      src={notificaitonBackGround}
                      fill
                      sizes="(min-width: 808px) 50vw, 100vw"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    <AvatarImage
                      className="z-20"
                      src={`/assets/images/user-avatars/person8.png`}
                    />
                    <AvatarFallback>Dp</AvatarFallback>
                  </Avatar>
                </motion.div>

                <div className="text-center py-2">
                  <NameCardTemplate>Player 2</NameCardTemplate>
                </div>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-6 items-center ">
                <Skeleton className="h-[125px] w-[180px] rounded-xl bg-slate-600" />
                <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-1/3 w-full justify-between bg-gradient-to-b from-black via-amber-950 to-amber-900 rounded-t-3xl shadow-lg z-20">
        {/* User hand Flex */}
        <div className="w-full flex justify-center items-center">
          <div>
            {dealtHands.length > 0 && dealtHands[0]?.hand ? (
              <UserDeckStraight
                userHand={dealtHands[0].hand}
                onCardSelect={handleCardSelectDeck}
              />
            ) : (
              <div className="flex flex-row justify-between w-full ml-10 mr-5 items-center">
                <Skeleton className="h-[125px] w-[550px] rounded-xl bg-slate-600" />
              </div>
            )}
          </div>

          {lastWinner === 0 && dealtHands[0]?.hand.length > 7 ? (
            <div>
              {!isTrumpSelected &&
                !isRoundOver &&
                (isMobile ? (
                  <SuitDrawerMobile
                    userHand={dealtHands[0].hand}
                    onClose={handleCloseDrawer}
                  />
                ) : (
                  <SuitDrawer
                    userHand={dealtHands[0].hand}
                    onClose={handleCloseDrawer}
                  />
                ))}
            </div>
          ) : null}
        </div>

        {/* Middle Section */}
        <div className="flex w-2/4 m-5 ">
          <div className="flex flex-col gap-2 justify-center items-center p-5 mt-10">
            <div>
              {turnSuit ? (
                <Avatar className="w-14 h-14 bg-white shadow-md">
                  <AvatarImage
                    className="p-2"
                    src={`/assets/suits/${turnSuit}.png`}
                  />
                  <AvatarFallback>
                    <Image
                      src={`/assets/suits/all-suits.png`}
                      alt="Fallback Suit"
                      width={60}
                      height={60}
                    />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex flex-row justify-between w-full items-center">
                  <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
                </div>
              )}
            </div>
            <div className="font-bold text-gray-300 tracking-wide mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600  z-20">
                This Round
              </span>
            </div>
          </div>

          {/* Player Avatar */}
          <div className="flex justify-start items-start p-5">
            <motion.div
              className=" rounded-full"
              initial={{ boxShadow: "none" }}
              transition={{
                duration: 0.8,
              }}
            >
              <Avatar className="w-24 h-24">
                <AvatarImage src={`/assets/user-avatars/player1.png`} />
                <AvatarFallback>
                  <Skeleton className="h-40 w-40 rounded-full bg-slate-600" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>

          {/* Trump Suit Section */}

          <div className="flex gap-2 flex-col justify-center items-center p-5 mt-10">
            <div>
              {trumpSuit ? (
                <Avatar className="w-14 h-14 bg-white shadow-md">
                  <AvatarImage
                    className="p-2"
                    src={`/assets/suits/${trumpSuit}.png`}
                  />
                  <AvatarFallback>
                    <Image
                      src={`/assets/suits/all-suits.png`}
                      alt="Fallback Suit"
                      width={60}
                      height={60}
                    />
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex flex-row justify-between w-full items-center">
                  <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
                </div>
              )}
            </div>
            <div className="font-bold text-gray-300 tracking-wide mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
                Trumps
              </span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/4 mr-5">
          <div>
            {isGameOver ? (
              <> Game Over </>
            ) : (
              <div className="w-full flex flex-col justify-center items-center">
                {/*         
                <div className="m-10">
                  <Button
                    onClick={handleSelectOtherHands}
                    type="submit"
                    disabled={isCardsGenerated}
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Start
                  </Button>
                </div>
                <div className="flex justify-center gap-10">
                  <Button
                    disabled={
                      isSubmitted || !isCardsGenerated || !selectedCardByUser
                    }
                    onClick={handleSubmit}
                    type="submit"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    See Winner
                  </Button>
                  <Button
                    disabled={!isSubmitted}
                    onClick={handleNextTurn}
                    type="submit"
                    className="bg-gray-700 text-white hover:bg-gray-600"
                  >
                    Next Round
                  </Button>
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
