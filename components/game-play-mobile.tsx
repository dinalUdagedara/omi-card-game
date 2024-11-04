"use client";
import {
  checkWinnerForTurn,
  createDeck,
  dealCards,
  determineTrickWinner,
  getLastWinner,
  setTrump,
  setTurnSuit,
  shuffleDeck,
  setLastWinner,
  checkTurnSuitCards,
  getPlayerXP,
} from "@/utils/game-logic";
import { Card, Suit, suits } from "@/utils/types";
import { useState, useEffect } from "react";
import { chooseCard, chooseCardWithoutTurnSuit } from "@/utils/game-play";
import { toast } from "sonner";
import { useStore } from "@/store/state";
import { CardStore } from "@/store/player-card-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreBoardMobile from "./game-board.tsx/score-board/score-board-mobile";
import { OtherDecksMobile } from "./decks/mobile/other-decks-mobile";
import GameBoardMobile from "./game-board.tsx/game-board/game-board-mobile";
import { UserDeckMobile } from "./decks/user-deck-mobile";
import Penaltycards from "./game-board.tsx/penalty-cards/penalty-cards-mobile";
import { RoundOverDialogMobile } from "./game-board.tsx/dialogs/round-over-dialog-mobile";
import { FinishStateStore } from "@/store/finish-round-state";
import { motion } from "framer-motion";
import Image from "next/image";
import modeCardBackground from "@/public/assets/images/mode-card-background.png";
import notificaitonBackGround from "@/public/assets/images/cover-notification.png";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile breakpoint
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobile;
}

const GamePlayMobile = () => {
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
  const gameWinner = useStore((state) => state.gameWinner);

  const isGameOver = useStore((state) => state.isGameOver);
  const setIsGameOver = useStore((state) => state.setIsGameOver);

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
  const setRoundOver = FinishStateStore((state) => state.setRoundOver);
  const isRoundOver = FinishStateStore((state) => state.isRoundOver);

  const playerXp = getPlayerXP();

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

    if (selectedCard && !generatedCards) {
      setTurnSuit(selectedCard.suit);
      setturnSuit(selectedCard.suit);
    }
  }

  function handleSubmit() {
    if (turnSuit && selectedCardByUser)
      checkTurnSuitCards(selectedCardByUser, dealtHands[0].hand, turnSuit);
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
      setIsGameOver(true);
    }
    if (team2PenaltyCards === 0) {
      toast("Congratulations Your Team wons the Game");
      setIsGameOver(true);
    }
  }

  function handleAutomaticSubmit() {
    if (!isSubmitted && isCardsGenerated && selectedCardByUser) {
      setTimeout(() => {
        handleSubmit();
      }, 2000);
    }
  }

  function handleAutomaticNextRound() {
    if (isSubmitted) {
      setTimeout(() => {
        handleNextTurn();
      }, 2000);
    }
  }

  function restartGame() {
    // Reset the points for both teams
    resetTeamPoints();
    setRoundsWonbyTeam1(0);
    setTeam_1_penaltyCards(10);
    setTeam_2_penaltyCards(10);
    setRoundsWonbyTeam2(0);

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

  useEffect(() => {
    if (isMobile)
      if (turnSuit || lastWinner !== null) {
        handleSelectOtherHands();
      }
  }, [turnNumber]);

  useEffect(() => {
    if (isMobile) initailSetup();
  }, []);

  useEffect(() => {
    if (isMobile) console.log("generated cards", generatedCards);
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
    if (isMobile)
      if (cardSet.length > 2) {
        handleAutomaticSubmit();
      }
  }, [isCardsGenerated, isSubmitted, selectedCardByUser, cardSet]);

  useEffect(() => {
    if (isMobile)
      if (isSubmitted) {
        handleAutomaticNextRound();
      }
  }, [isSubmitted]);

  useEffect(() => {
    if (isMobile) checkWinner();
  }, [roundsWonbyTeam1, roundsWonbyTeam2]);

  useEffect(() => {
    if (isMobile)
      if (turnSuit && cardSet.length < 2) {
        handleSelectOtherHands();
      }
  }, [turnSuit, isCardsGenerated]);

  useEffect(() => {
    if (isMobile)
      if (isRoundOver) {
        handleNextTurnofShuffling();
      }
  }, [isSubmitted]);

  useEffect(() => {
    checkWinner();
  }, [team1PenaltyCards, team2PenaltyCards, gameWinner]);

  return (
    <div className="w-full h-full min-h-screen flex flex-col z-20 ">
      {/* Dialog after a Round  */}

      {isDialogOpen && (
        <div className=" ">
          <RoundOverDialogMobile />
        </div>
      )}

      <div>
        <div>
          {/* player Xp : {playerXp} */}
          <ScoreBoardMobile />
        </div>
        <div>
          <Penaltycards />
        </div>
      </div>

      <div className="w-full flex justify-center min-h-24 mt-5">
        {dealtHands.length > 0 && dealtHands[2]?.hand ? (
          <div className="flex flex-row justify-center items-center">
            <OtherDecksMobile userHand={dealtHands[2].hand} />

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
              <Avatar className="relative w-16 h-16 lg:w-20 lg:h-20 shadow-md ">
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
          </div>
        ) : (
          <div className="flex flex-row justify-center w-full items-center gap-5">
            <Skeleton className="h-[65px] w-[60px] rounded-xl bg-slate-600 " />
            <Skeleton className="h-14 w-14 rounded-full bg-slate-600 " />
          </div>
        )}
      </div>

      <div className="w-full h-full  flex justify-between mt-5 ">
        <div className="flex justify-center items-center">
          {dealtHands.length > 0 && dealtHands[3]?.hand ? (
            <div className="flex flex-col justify-center items-center  min-w-[70px]">
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
                <Avatar className="relative w-16 h-16 lg:w-20 lg:h-20 shadow-md ">
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
              <OtherDecksMobile userHand={dealtHands[3].hand} />
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-6 items-center mx-1 ">
              <Skeleton className="h-14 w-14 rounded-full bg-slate-600 " />
              <Skeleton className="h-[65px] w-[60px] rounded-xl bg-slate-600 " />
            </div>
          )}
        </div>

        <div>
          <div
            className="h-full  max-h-80 flex max-w-20  min-w-60 min-h-80 justify-center items-center rounded-3xl  p-4 shadow-lg bg-opacity-75 border-8 border-black z-20"
            style={{
              backgroundImage: `url('/assets/background.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full justify-center  items-center  z-20">
              <GameBoardMobile
                onRestart={restartGame}
                onStart={handleSelectOtherHands}
                onNextStart={handleNextTurn}
                onShuffleAgain={handleNextTurnofShuffling}
              />
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center   ">
          <div className="">
            {dealtHands.length > 0 && dealtHands[1]?.hand ? (
              <div className="flex flex-col justify-center items-center  min-w-[70px]">
                <OtherDecksMobile userHand={dealtHands[1].hand} />

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
                  <Avatar className="relative w-16 h-16 lg:w-20 lg:h-20 shadow-md ">
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
              </div>
            ) : (
              <div className=" w-full flex flex-col justify-center gap-6 items-center  mx-1">
                <Skeleton className="h-[65px] w-[60px] rounded-xl bg-slate-600 " />
                <Skeleton className="h-14 w-14 rounded-full bg-slate-600 " />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-auto relative min-mt-28">
        <div className="bg-gradient-to-b from-black via-amber-950 to-amber-900 rounded-t-full relative mt-20">
          <div className="flex w-full justify-center items-center">
            <div className="">
              {dealtHands.length > 0 && dealtHands[0]?.hand ? (
                <div className="relative w-full ">
                  <div className="">
                    <UserDeckMobile
                      userHand={dealtHands[0].hand}
                      onCardSelect={handleCardSelectDeck}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-center w-full items-center mt-14">
                  <Skeleton className="h-[85px] w-[300px] rounded-t-full rounded-b-md bg-slate-600" />
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
              <Avatar className="w-24 h-24">
                <AvatarImage src={`/assets/user-avatars/player1.png`} />
                <AvatarFallback>
                  <Skeleton className="h-40 w-40 rounded-full bg-slate-600" />
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePlayMobile;
