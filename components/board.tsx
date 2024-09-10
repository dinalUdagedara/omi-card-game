"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import { chooseCard } from "@/utils/game-play";
import CardComponent from "./cards/card";
import { toast } from "sonner";
import { SuitDrawer } from "./drawer/trump-suit-selector";
import { useStore } from "@/store/state";
import { UserDeckMobile } from "./decks/user-deck-mobile";
import { OtherDecks } from "./decks/other-decks";
import GameBoard from "./game-board.tsx/game-board/game-board";
import { CardStore } from "@/store/player-card-state";

export default function Board() {
  const [cardSet, setCardSet] = useState<Card[]>([]);
  const [winningCard, setWinningCard] = useState<Card | null>(null);
  // const [trumpSuit, setTrumpSuit] = useState<Suit | null>(null);
  const [turnSuit, setturnSuit] = useState<Suit | null>(null);
  const [cardInput, setCardInput] = useState<number>();
  const [maxCards, setMaxCards] = useState<number>();
  const [generatedCards, setGeneratedCards] = useState<Card[] | null>(null);
  // const [selectedCardByUser, setSelectedCardByUser] = useState<Card | null>(
  //   null
  // );
  const [lastWinner, SetLastWinner] = useState<number | null>(0);
  // const [isCardsGenerated, setIsCardsGenerated] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // const [dealtHands, setDealtHands] = useState<Player[]>([]);

  // const [player_1_card, setPlayer_1_card] = useState<Card | null>(null);
  // const [player_2_card, setPlayer_2_card] = useState<Card | null>(null);
  // const [player_3_card, setPlayer_3_card] = useState<Card | null>(null);
  // const [player_4_card, setPlayer_4_card] = useState<Card | null>(null);

  // const [team1Points, setTeam1Points] = useState<number>(0); // Team 1: Player 1 and Player 3
  const [team2Points, setTeam2Points] = useState<number>(0); // Team 2: Player 2 and Player 4

  const [roundsWonbyTeam1, setRoundsWonbyTeam1] = useState<number | null>(null);
  const [roundsWonbyTeam2, setRoundsWonbyTeam2] = useState<number | null>(null);

  const [roundWinners, setRoundWinners] = useState<number | null>(null);
  const [roundNumber, setRoundNumber] = useState<number>(1);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const trumpSuit = useStore((state) => state.trumpSuit);
  const setTrumpSuit = useStore((state) => state.setTrumpSuit);

  const selectedCardByUser = useStore((state) => state.selectedCardByUser);
  const setSelectedCardByUser = useStore(
    (state) => state.setSelectedCardByUser
  );

  const isCardsGenerated = useStore((state) => state.isCardsGenerated);
  const setIsCardsGenerated = useStore((state) => state.setIsCardsGenerated);

  const isTrumpSelected = useStore((state) => state.trumpSelected);
  const setTrumpSelected = useStore((state) => state.setTrumpSelected);

  const player_1_card = CardStore((state) => state.player_1_card);
  const setPlayer_1_card = CardStore((state) => state.setPlayer_1_card);

  const player_2_card = CardStore((state) => state.player_2_card);
  const setPlayer_2_card = CardStore((state) => state.setPlayer_2_card);

  const player_3_card = CardStore((state) => state.player_3_card);
  const setPlayer_3_card = CardStore((state) => state.setPlayer_3_card);

  const player_4_card = CardStore((state) => state.player_4_card);
  const setPlayer_4_card = CardStore((state) => state.setPlayer_4_card);

  const team1Points = useStore((state) => state.team1Points);
  const setTeam1Points = useStore((state) => state.setTeam1Points);

  const dealtHands = useStore((state) => state.dealtHands);
  const setDealtHands = useStore((state) => state.setDealtHands);

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

  function handleCardSelect() {
    if (cardInput) {
      const player1Hand = dealtHands[0].hand;
      const selectedCard = player1Hand[cardInput - 1];
      setCardSet([...cardSet, selectedCard]);
      // Remove the selected card from the hand
      dealtHands[0].hand = dealtHands[0].hand.filter(
        (card) => card !== selectedCard
      );
      setSelectedCardByUser(selectedCard);

      console.log("selected Card", selectedCard);
      console.log("card set", cardSet);
    }
  }
  function handleCardSelectDeck(cardIndex: number) {
    const player1Hand = dealtHands[0].hand;
    const selectedCard = player1Hand[cardIndex];
    setCardSet([...cardSet, selectedCard]);
    // Remove the selected card from the hand
    dealtHands[0].hand = dealtHands[0].hand.filter(
      (card) => card !== selectedCard
    );
    setSelectedCardByUser(selectedCard);

    console.log("selected Card", selectedCard);
    console.log("card set", cardSet);
  }

  function handleSubmit() {
    setIsSubmitted(true);
    selectWinningCard();
  }

  function handleSelectOtherHands() {
    let selectedCardsByEachPlayer: Card[] = [];
    // Iterate through dealtHands starting from the second hand (index 1)
    const selectedCards = dealtHands.slice(1).map((hand, index) => {
      const chosenCard: Card = chooseCard(hand.hand, "clubs");

      selectedCardsByEachPlayer[index] = chosenCard;
      console.log("Selected Cards:", selectedCardsByEachPlayer);
      setGeneratedCards(selectedCardsByEachPlayer);

      // Remove the chosen card from the hand
      hand.hand = hand.hand.filter((card) => card !== chosenCard);

      return chosenCard;
    });

    setIsCardsGenerated(true);

    // Update the cardSet state by adding the selected cards
    setCardSet([...cardSet, ...selectedCards]);
    setTrumpSelected(false);
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
      dealtHands.forEach((player) => {
        remainingCards = [...remainingCards, ...player.hand];
      });
      console.log("remaining cards: ", remainingCards);

      // Shuffle the remaining cards
      const shuffledDeck = shuffleDeck(remainingCards);

      // Deal the shuffled cards among the players
      const hands = dealCards(shuffledDeck, 4);

      // Update the state with the new hands
      setDealtHands(hands);
      setMaxCards(hands[0].hand.length);
      resetStates();
    }
  }

  function handleNextRoundofShuffling() {
    checkWinner();

    if (isGameOver) {
      console.log("Game over");
    } else {
      if (roundWinners === 1) {
        setRoundsWonbyTeam1((prevRounds) =>
          prevRounds !== null ? prevRounds + 1 : 1
        );
      } else if (roundWinners === 2) {
        setRoundsWonbyTeam2((prevRounds) =>
          prevRounds !== null ? prevRounds + 1 : 1
        );
      }
      setRoundNumber((prevRound) => (prevRound !== null ? prevRound + 1 : 1));
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
      // setLastWinner(winner);
      handleLastWinner(winner);
    }
  }

  function updateTeamPoints(winner: number) {
    if (winner === 0 || winner === 2) {
      const newPoints = team1Points + 1;
      setTeam1Points(newPoints);
    } else if (winner === 1 || winner === 3) {
      setTeam2Points((prevPoints) => prevPoints + 1);
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
    setTrumpSelected(true);
  }

  useEffect(() => {
    initailSetup();
  }, []);

  useEffect(() => {
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

  return (
    <div>
      <div className="h-full w-full">
        <div className="grid grid-rows-3 grid-cols-3 gap-4 h-screen w-screen  ">
          <div className=" col-span-3 bg-blue-200 flex items-center justify-center gap-2">
            {player_3_card && <CardComponent card={player_3_card} />}
            Player 3
            {dealtHands.length > 0 && dealtHands[2]?.hand ? (
              <div className="rela">
                <OtherDecks userHand={dealtHands[2].hand} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <div>
              <div className="relative mt-96 mr-20">{/* <GameBoard/> */}</div>
            </div>
          </div>

          <div className="row-span-1 col-span-1 bg-yellow-100 flex items-center justify-center gap-2">
            {player_4_card && <CardComponent card={player_4_card} />}
            Player 4
            {dealtHands.length > 0 && dealtHands[3]?.hand ? (
              <div className="rela">
                <OtherDecks userHand={dealtHands[3].hand} />
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </div>

          <div className="row-span-1 col-span-1 bg-green-200 flex items-center justify-center">
            {isGameOver ? (
              <> Game Over</>
            ) : (
              <div className="w-full flex flex-col justify-center  items-center gap-10">
                {roundWinners ? (
                  <>
                    <Button onClick={handleNextRoundofShuffling} type="submit">
                      Shuffle Again
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleSelectOtherHands}
                      type="submit"
                      disabled={isCardsGenerated}
                    >
                      Start
                    </Button>
                  </>
                )}

                {/* <div className="flex w-60 items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Card Number"
                    min={1}
                    max={maxCards}
                    onChange={(e) => setCardInput(parseInt(e.target.value))}
                  />
                  <Button
                    onClick={handleCardSelect}
                    disabled={
                      !!selectedCardByUser || !isCardsGenerated || !trumpSuit
                    }
                    type="submit"
                  >
                    Select
                  </Button>
                </div> */}

                <div className="flex justify-center gap-10 m-5">
                  <Button
                    disabled={
                      isSubmitted || !isCardsGenerated || !selectedCardByUser
                    }
                    onClick={handleSubmit}
                    type="submit"
                  >
                    Submit
                  </Button>
                  <Button
                    disabled={!isSubmitted}
                    onClick={handleNextRound}
                    type="submit"
                  >
                    Next Round
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 bg-yellow-100 flex items-center justify-center gap-2">
            {player_2_card && <CardComponent card={player_2_card} />}
            <div className="m-6">
              <div>Player 2</div>
              <div className="m-6">
                {dealtHands.length > 0 && dealtHands[1]?.hand ? (
                  <div className="rela">
                    <OtherDecks userHand={dealtHands[1].hand} />
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-3 bg-blue-200 flex items-center justify-center">
            <div className="flex w-full gap-20 justify-between p-20">
              <div>
                <p>trump suit : {trumpSuit}</p>
                {winningCard ? (
                  <p>
                    Winning Card : {winningCard.value} of {winningCard.suit}
                  </p>
                ) : null}

                {/* {dealtHands[0]?.hand.map((card, cardIndex) => (
                  <p key={cardIndex}>
                    {cardIndex + 1}) {card.value} of {card.suit}
                  </p>
                ))} */}
                <div className="flex flex-col gap-3 items-center">
                  {player_1_card && <CardComponent card={player_1_card} />}
                  Player 1
                </div>
              </div>

              <div>
                {dealtHands.length > 0 && dealtHands[0]?.hand ? (
                  <div className="rela">
                    <UserDeckMobile
                      userHand={dealtHands[0].hand}
                      onCardSelect={handleCardSelectDeck}
                    />
                  </div>
                ) : (
                  <p>Loading...</p>
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

                  {/* <div className="flex w-60 items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Trump Suit"
                      onChange={(e) => setTrumpInput(e.target.value)}
                    />
                    <Button onClick={handleTrumpInput} type="submit">
                      Select
                    </Button>
                  </div> */}
                </div>
              ) : null}

              <div>
                <p>turn suit : {turnSuit}</p>
                <p>Last Winner index : {lastWinner}</p>
                <p>Team 1 (Player 1 & Player 3) Points: {team1Points}</p>
                <p>Team 2 (Player 2 & Player 4) Points: {team2Points}</p>

                <p>Team 1 Rounds Won: {roundsWonbyTeam1}</p>
                <p>Team 2 Rounds Won: {roundsWonbyTeam2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* {dealtHands ? (
            <>
              {dealtHands.map((player, index) => (
                <div className="flex items-center ">
                  <div key={index} className="flex flex-col">
                    <h3 className="my-5">Player {index + 1}</h3>
                    {player.hand.map((card, cardIndex) => (
                      <p key={cardIndex}>
                        {cardIndex + 1}) {card.value} of {card.suit}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p>Hello</p>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <></>
          )} */}
    </div>
  );
}
