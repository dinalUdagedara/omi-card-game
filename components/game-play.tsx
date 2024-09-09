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
} from "@/utils/game-logic";
import { Player, Card, Suit, suits } from "@/utils/types";
import { useState, useEffect } from "react";
import { chooseCard, chooseCardWithoutTurnSuit } from "@/utils/game-play";
import { toast } from "sonner";
import { SuitDrawer } from "./drawer/trump-suit-selector";
import { useStore } from "@/store/state";
import { UserDeck } from "./decks/user-deck";
import { OtherDecks } from "./decks/other-decks";
import GameBoard from "./game-board.tsx/game-board";
import { CardStore } from "@/store/player-card-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserDeckStraight } from "./decks/user-deck-straight";
import Scoreboard from "./game-board.tsx/score-board";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";

export default function Board() {
  const [cardSet, setCardSet] = useState<Card[]>([]);
  const [turnSuit, setturnSuit] = useState<Suit | null>(null);
  const [maxCards, setMaxCards] = useState<number>();
  const [generatedCards, setGeneratedCards] = useState<Card[] | null>(null);
  const [lastWinner, SetLastWinner] = useState<number | null>(0);
  const [dealtHands, setDealtHands] = useState<Player[]>([]);
  const [roundNumber, setRoundNumber] = useState<number>(1);

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

  function initailSetup() {
    //Creating and Shuffling the Deck
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);

    //Dividing Deck among 4 players
    const hands = dealCards(shuffledDeck, 4);

    //saving the cards of players in a state
    setDealtHands(hands);

    setMaxCards(hands[0].hand.length);
  }

  function handleCardSelectDeck(cardIndex: number) {
    const player1Hand = dealtHands[0].hand;
    const selectedCard = player1Hand[cardIndex];

    setCardSet((prevCardSet) => [...prevCardSet, selectedCard]);

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

  useEffect(() => {
    if (turnSuit && cardSet.length < 2) {
      handleSelectOtherHands();
    }
  }, [turnSuit]);

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

    setCardSet((prevCardSet) => [...prevCardSet, ...selectedCards]);
    console.log("Selected Cards for turn:", selectedCards);

    setTrumpSelected(false);
    setIsCardsGenerated(true);
  }

  useEffect(() => {
    if (cardSet.length > 2) {
      console.log("cardSet updated:", cardSet);
    }
  }, [cardSet]);

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
  function handleNextRound() {
    // finish this round and move to next round if all hands are over

    if (dealtHands[0].hand.length < 1) {
      console.log("hands are over");

      if (team1Points > team2Points) {
        setRoundWinners(1);
        toast("This Round is Won by Team 1 ");
      } else {
        setRoundWinners(2);
        toast("This Round is Won by Team 2 ");
      }
      resetStates();
    } else {
      // Collect all remaining cards from players' hands
      let remainingCards: Card[] = [];
      // dealtHands.forEach((player) => {
      //   remainingCards = [...remainingCards, ...player.hand];
      // });
      // console.log("remaining cards: ", remainingCards);

      // // Shuffle the remaining cards
      // const shuffledDeck = shuffleDeck(remainingCards);

      // // Deal the shuffled cards among the players
      // const hands = dealCards(shuffledDeck, 4);

      // // Update the state with the new hands
      // setDealtHands(hands);
      // setMaxCards(hands[0].hand.length);
      resetStates();
    }
  }

  function handleNextRoundofShuffling() {
    checkWinner();
    if (isGameOver) {
      console.log("Game over");
    } else {
      if (roundWinners === 1) {
        const roundNumber = roundsWonbyTeam1 + 1;
        setRoundsWonbyTeam1(roundNumber);
      } else if (roundWinners === 2) {
        const roundNumber = roundsWonbyTeam2 + 1;
        setRoundsWonbyTeam2(roundNumber);
      }
      setRoundNumber((prevRound) => (prevRound !== null ? prevRound + 1 : 1));
      resetTeamPoints();
      setStarterForRound();
      initailSetup();
    }
  }

  function setFinalWinner() {
    checkWinner();
    console.log("final Winner Running ");
    if (isGameOver) {
      console.log("Game over");
    } else {
      //Changed value here
      if (roundWinners === 4) {
        const roundNumber = roundsWonbyTeam1 + 1;
        setRoundsWonbyTeam1(roundNumber);
      } else if (roundWinners === 4) {
        const roundNumber = roundsWonbyTeam2 + 1;
        setRoundsWonbyTeam2(roundNumber);
      }
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
    switch (roundNumber) {
      case 1:
        handleLastWinner(1);
        setRandomSuit();
        break;
      case 2:
        handleLastWinner(2);
        setRandomSuit();
        break;
      case 3:
        handleLastWinner(3);
        setRandomSuit();
        break;
      case 4:
        handleLastWinner(0);
        setRandomSuit();
        break;
      case 5:
        handleLastWinner(1);
        setRandomSuit();
        break;
      case 6:
        handleLastWinner(2);
        setRandomSuit();
        break;
      case 7:
        handleLastWinner(3);
        setRandomSuit();
        break;
      case 8:
        handleLastWinner(0);
        setRandomSuit();
        break;
      case 9:
        handleLastWinner(1);
        setRandomSuit();
        break;
    }
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
    if (roundsWonbyTeam1) {
      if (roundsWonbyTeam1 >= 4) {
        toast("Congratulations Your Team wons the Game");
        setIsGameOver(true);
      }
    }
    if (roundsWonbyTeam2) {
      if (roundsWonbyTeam2 >= 4) {
        toast("Your Team lost");
        setIsGameOver(true);
      }
    }
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
        handleNextRound();
      }, 3000);
    }
  }

  useEffect(() => {
    initailSetup();
  }, []);

  useEffect(() => {
    console.log("generated cards", generatedCards);
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
    if (cardSet.length > 2) {
      handleAutomaticSubmit();
    }
  }, [isCardsGenerated, isSubmitted, selectedCardByUser, cardSet]);

  useEffect(() => {
    if (isSubmitted) {
      handleAutomaticNextRound();
    }
  }, [isSubmitted]);

  // useEffect(() => {
  //   setFinalWinner();
  //   checkWinner();
  // }, [isSubmitted]);

  return (
    <div className="w-full h-screen flex flex-col ">
      <div className="flex flex-col bg-gradient-to-br from-slate-500 via-gray-600 to-slate-700 h-full w-full shadow-lg  p-4">
        {/* All the other things */}
        <div className="flex justify-end gap-4">
          {/* Player 3 and scoreboard */}
          <div className="col-span-3 flex items-center justify-center gap-4 w-1/3 p-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 shadow-md">
            {dealtHands.length > 0 && dealtHands[2]?.hand ? (
              <div className="flex flex-row justify-center items-center">
                <OtherDecks userHand={dealtHands[2].hand} />
                <Avatar className="w-14 h-14 shadow-md">
                  <AvatarImage src={`/assets/player3.png`} />
                  <AvatarFallback>Dp</AvatarFallback>
                </Avatar>
                <div className="font-bold text-gray-100 tracking-wide m-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
                    Player 3
                  </span>
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
          <div className="w-1/3">
            <div className="flex justify-center items-center w-full h-full">
              <Scoreboard />
            </div>
          </div>
        </div>

        {/* Players 4, Game Board, Player 2 */}
        <div className="flex justify-between gap-4 h-full w-full mt-4">
          {/* Player 4 */}
          <div className="col-span-3 flex items-center justify-center gap-4 w-1/4 p-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 shadow-md">
            {dealtHands.length > 0 && dealtHands[3]?.hand ? (
              <div className="flex flex-col justify-center items-center">
                <OtherDecks userHand={dealtHands[3].hand} />
                <Avatar className="w-14 h-14 shadow-md">
                  <AvatarImage src={`/assets/player4.png`} />
                  <AvatarFallback>Dp</AvatarFallback>
                </Avatar>
                <div className="font-bold text-gray-100 tracking-wide m-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
                    Player 4
                  </span>
                </div>
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
            className="flex w-full justify-center items-center rounded-3xl m-4 p-6 shadow-lg bg-opacity-75"
            style={{
              backgroundImage: `url('/assets/background.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full justify-center items-center">
              {/* <Button onClick={handleInitialStart}>Start</Button> */}
              <GameBoard
                onStart={handleSelectOtherHands}
                onNextStart={handleNextRound}
                onShuffleAgain={handleNextRoundofShuffling}
              />
            </div>
          </div>

          {/* Player 2 */}
          <div className="col-span-3 flex items-center justify-center gap-4 w-1/4 p-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 shadow-md">
            {dealtHands.length > 0 && dealtHands[1]?.hand ? (
              <div className="flex flex-col justify-center items-center ">
                <OtherDecks userHand={dealtHands[1].hand} />
                <Avatar className="w-14 h-14 shadow-md">
                  <AvatarImage src={`/assets/player2.png`} />
                  <AvatarFallback>Dp</AvatarFallback>
                </Avatar>
                <div className="font-bold text-gray-100 tracking-wide m-2">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500">
                    Player 2
                  </span>
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

      <div className="flex h-1/3 w-full justify-between bg-gradient-to-br from-slate-800 via-gray-800 to-slate-600 shadow-lg">
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
              {!isTrumpSelected && (
                <SuitDrawer
                  userHand={dealtHands[0].hand}
                  onClose={handleCloseDrawer}
                />
              )}
            </div>
          ) : null}
        </div>

        {/* Middle Section */}
        <div className="flex w-2/4 m-5">
          <div className="flex flex-col gap-2 justify-center items-center p-5 mt-10">
            <div>
              {turnSuit ? (
                <Avatar className="w-14 h-14 bg-slate-500 shadow-md">
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600">
                This Round
              </span>
            </div>
          </div>

          {/* Player Avatar */}
          <div className="flex justify-start items-start p-5">
            <Avatar className="w-20 h-20 shadow-md">
              <AvatarImage src={`/assets/user.jpg`} />
              <AvatarFallback>
                <Skeleton className="h-full w-full  rounded-full bg-slate-600" />
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Trump Suit Section */}

          <div className="flex gap-2 flex-col justify-center items-center p-5 mt-10">
            <div>
              {trumpSuit ? (
                <Avatar className="w-14 h-14 bg-slate-500 shadow-md">
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
                    onClick={handleNextRound}
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
