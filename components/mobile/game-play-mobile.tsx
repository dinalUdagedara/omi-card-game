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
} from "@/utils/game-logic";
import {Card, Suit, suits } from "@/utils/types";
import { useState, useEffect } from "react";
import { chooseCard, chooseCardWithoutTurnSuit } from "@/utils/game-play";
import { toast } from "sonner";
import { useStore } from "@/store/state";
import { CardStore } from "@/store/player-card-state";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import ScoreBoardMobile from "../game-board.tsx/score-board/score-board-mobile";
import { OtherDecksMobile } from "../decks/mobile/other-decks-mobile";
import GameBoardMobile from "../game-board.tsx/game-board/game-board-mobile";
import { UserDeckMobile } from "../decks/user-deck-mobile";

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Define the breakpoint for mobile devices
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Mobile breakpoint (768px is typical)
    };

    handleResize(); // Check on initial load

    window.addEventListener("resize", handleResize); // Listen for resize events

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup
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

  const isGameOver = useStore((state) => state.isGameOver);
  const setIsGameOver = useStore((state) => state.setIsGameOver);

  const roundNumber = useStore((state) => state.roundNumber);
  const setRoundNumber = useStore((state) => state.setRoundNumber);

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
      } else {
        setRoundWinners(2);
        toast("This Round is Won by Team 2 ");
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
        const roundNumber = roundsWonbyTeam1 + 1;
        setRoundsWonbyTeam1(roundNumber);
      } else if (roundWinners === 2) {
        const roundNumber = roundsWonbyTeam2 + 1;
        setRoundsWonbyTeam2(roundNumber);
      }
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
        handleNextTurn();
      }, 3000);
    }
  }

  function restartGame() {
    // Reset the points for both teams
    resetTeamPoints();
    setRoundsWonbyTeam1(0);
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

  return (
    <div 
    style={{ backgroundColor: '#023047' }}
    className="w-full h-screen flex flex-col">
      <div>
        <div>
          <ScoreBoardMobile />
        </div>
        <div className="flex justify-between px-20">
          <div className="text-sm">
            Rounds Won:{" "}
            <span className="font-semibold">{roundsWonbyTeam1}</span>
          </div>
          <div className="text-sm">
            Rounds Won:{" "}
            <span className="font-semibold">{roundsWonbyTeam2}</span>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center  mt-10">
        {dealtHands.length > 0 && dealtHands[2]?.hand ? (
          <div className="flex flex-row justify-center items-center">
            <OtherDecksMobile userHand={dealtHands[2].hand} />
            <Avatar className="w-14 h-14 shadow-md">
              <AvatarImage src={`/assets/player3.png`} />
              <AvatarFallback>Dp</AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="flex flex-row justify-between w-full ml-10 mr-5 items-center">
            <Skeleton className="h-[125px] w-[250px] rounded-xl bg-slate-600 my-8" />
            <Skeleton className="h-14 w-14 rounded-full bg-slate-600 mr-10" />
          </div>
        )}
      </div>

      <div className="w-full h-full  flex justify-between mt-5">
        <div className="flex justify-center items-center">
          {dealtHands.length > 0 && dealtHands[3]?.hand ? (
            <div className="flex flex-col justify-center items-center">
              <Avatar className="w-14 h-14 shadow-md">
                <AvatarImage src={`/assets/player4.png`} />
                <AvatarFallback>Dp</AvatarFallback>
              </Avatar>
              <OtherDecksMobile userHand={dealtHands[3].hand} />
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-6 items-center ">
              <Skeleton className="h-[125px] w-[80px] rounded-xl bg-slate-600" />
              <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
            </div>
          )}
        </div>

        <div>
          <div
            className="h-full flex w-full min-w-64 justify-center items-center rounded-3xl  p-6 shadow-lg bg-opacity-75"
            style={{
              backgroundImage: `url('/assets/background.png')`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="w-full h-full justify-center items-center">
              {/* <Button onClick={handleInitialStart}>Start</Button> */}
              <GameBoardMobile
                onRestart={restartGame}
                onStart={handleSelectOtherHands}
                onNextStart={handleNextTurn}
                onShuffleAgain={handleNextTurnofShuffling}
              />
            </div>
          </div>
        </div>
        <div className=" flex justify-center items-center">
          <div className="">
            {dealtHands.length > 0 && dealtHands[1]?.hand ? (
              <div className="flex flex-col justify-center items-center">
                {" "}
                <OtherDecksMobile userHand={dealtHands[1].hand} />
                <Avatar className="w-14 h-14 shadow-md">
                  <AvatarImage src={`/assets/player2.png`} />
                  <AvatarFallback>Dp</AvatarFallback>
                </Avatar>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-6 items-center ">
                <Skeleton className="h-[125px] w-[80px] rounded-xl bg-slate-600" />
                <Skeleton className="h-14 w-14 rounded-full bg-slate-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-60 w-full justify-center items-center">
        <div>
          {dealtHands.length > 0 && dealtHands[0]?.hand ? (
            <div className="flex h-60 w-screen justify-center items-center pl-32">
              <UserDeckMobile
                userHand={dealtHands[0].hand}
                onCardSelect={handleCardSelectDeck}
              />
            </div>
          ) : (
            <div className="flex flex-row justify-between w-full ml-10 mr-5 items-center">
              <Skeleton className="h-[125px] w-[550px] rounded-xl bg-slate-600" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePlayMobile;
