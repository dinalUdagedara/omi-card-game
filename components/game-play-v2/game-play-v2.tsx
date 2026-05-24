"use client";
import {
  checkWinnerForTurn,
  createDeck,
  dealCards,
  determineTrickWinner,
  setTrump,
  setTurnSuit,
  getLastWinner,
  shuffleDeck,
  setLastWinner,
} from "@/utils/practise/game-logic";
import { Player, Card, Suit, suits } from "@/utils/practise/types";
import { useState, useEffect } from "react";
import { chooseCard, chooseCardWithoutTurnSuit } from "@/utils/practise/game-play";
import { toast } from "sonner";
import { useStore } from "@/store/state";
import { CardStore } from "@/store/player-card-state";
import { FinishStateStore } from "@/store/finish-round-state";
import { useCollectingCardSound } from "@/utils/play-sounds";
import { RoundOverDialogMobile } from "@/components/game-board/dialogs/round-over-dialog-mobile";
import { GameOverDialog } from "@/components/game-board/game-over/game-over-win";
import { GameOverDialogLose } from "@/components/game-board/game-over/game-over-lose";
import { SuitDrawer } from "@/components/drawer/trump-suit-selector";
import { motion } from "framer-motion";
import Image from "next/image";

import ScoreboardV2 from "./scoreboard-v2";
import PlayerPanelV2 from "./player-panel-v2";
import GameTableV2 from "./game-table-v2";
import InfoStripV2 from "./info-strip-v2";
import UserHandV2 from "./user-hand-v2";

export default function GamePlayV2() {
  const [turnSuit, setturnSuit] = useState<Suit | null>(null);

  // ── Store reads ──────────────────────────────────────────────────
  const cardSet              = useStore((s) => s.cardSet);
  const setCardSet           = useStore((s) => s.setCardSet);
  const generatedCards       = useStore((s) => s.generatedCards);
  const setGeneratedCards    = useStore((s) => s.setGeneratedCards);
  const lastWinner           = useStore((s) => s.lastWinner);
  const SetLastWinner        = useStore((s) => s.setLastWinner);
  const dealtHands           = useStore((s) => s.dealtHands);
  const setDealtHands        = useStore((s) => s.setDealtHands);
  const turnNumber           = useStore((s) => s.turnNumber);
  const setTurnNumber        = useStore((s) => s.setTurnNumber);
  const trumpSuit            = useStore((s) => s.trumpSuit);
  const setTrumpSuit         = useStore((s) => s.setTrumpSuit);
  const selectedCardByUser   = useStore((s) => s.selectedCardByUser);
  const setSelectedCardByUser = useStore((s) => s.setSelectedCardByUser);
  const isCardsGenerated     = useStore((s) => s.isCardsGenerated);
  const setIsCardsGenerated  = useStore((s) => s.setIsCardsGenerated);
  const isSubmitted          = useStore((s) => s.isSubmitted);
  const setIsSubmitted       = useStore((s) => s.setIsSubmitted);
  const isTrumpSelected      = useStore((s) => s.trumpSelected);
  const setTrumpSelected     = useStore((s) => s.setTrumpSelected);
  const setPlayer_1_card     = CardStore((s) => s.setPlayer_1_card);
  const setPlayer_2_card     = CardStore((s) => s.setPlayer_2_card);
  const setPlayer_3_card     = CardStore((s) => s.setPlayer_3_card);
  const setPlayer_4_card     = CardStore((s) => s.setPlayer_4_card);
  const team1Points          = useStore((s) => s.team1Points);
  const setTeam1Points       = useStore((s) => s.setTeam1Points);
  const team2Points          = useStore((s) => s.team2Points);
  const setTeam2Points       = useStore((s) => s.setTeam2Points);
  const roundsWonbyTeam1     = useStore((s) => s.roundsWonbyTeam1);
  const setRoundsWonbyTeam1  = useStore((s) => s.setRoundsWonbyTeam1);
  const roundsWonbyTeam2     = useStore((s) => s.roundsWonbyTeam2);
  const setRoundsWonbyTeam2  = useStore((s) => s.setRoundsWonbyTeam2);
  const winningCard          = useStore((s) => s.winningCard);
  const setWinningCard       = useStore((s) => s.setWinningCard);
  const setThisRoundWinner   = useStore((s) => s.setThisRoundWinner);
  const roundWinners         = useStore((s) => s.roundWinners);
  const setRoundWinners      = useStore((s) => s.setRoundWinners);
  const isGameOver           = useStore((s) => s.isGameOver);
  const setIsGameOver        = useStore((s) => s.setIsGameOver);
  const gameWinner           = useStore((s) => s.gameWinner);
  const setGameWinner        = useStore((s) => s.setGameWinner);
  const roundNumber          = useStore((s) => s.roundNumber);
  const setRoundNumber       = useStore((s) => s.setRoundNumber);
  const team1PenaltyCards    = useStore((s) => s.team_1_penaltyCards);
  const setTeam_1_penaltyCards = useStore((s) => s.setTeam_1_penaltyCards);
  const team2PenaltyCards    = useStore((s) => s.team_2_penaltyCards);
  const setTeam_2_penaltyCards = useStore((s) => s.setTeam_2_penaltyCards);
  const trumpSetter          = useStore((s) => s.trumpSetter);
  const setTrumpSetter       = useStore((s) => s.setTrumpSetter);
  const setIsUserTurn        = useStore((s) => s.setIsUserTurn);
  const muted                = useStore((s) => s.muted);

  const setRoundOver         = FinishStateStore((s) => s.setRoundOver);
  const isRoundOver          = FinishStateStore((s) => s.isRoundOver);
  const setwonCallingTrumps  = FinishStateStore((s) => s.setwonCallingTrumps);
  const setwonWithoutCallingTrumps = FinishStateStore((s) => s.setwonWithoutCallingTrumps);
  const setlostCallingTrumps = FinishStateStore((s) => s.setlostCallingTrumps);
  const setlostWithoutCallingTrumps = FinishStateStore((s) => s.setlostWithoutCallingTrumps);
  const isDialogOpen         = FinishStateStore((s) => s.isDialogOpen);
  const setDialogOpen        = FinishStateStore((s) => s.setDialogOpen);
  const { playCollectCards } = useCollectingCardSound();

  // ── Game logic (identical to game-play.tsx) ──────────────────────
  function initailSetup() {
    const deck = createDeck();
    const shuffledDeck = shuffleDeck(deck);
    const hands = dealCards(shuffledDeck, 4);
    setDealtHands(hands);
  }

  function handleCardSelectDeck(cardIndex: number) {
    setIsUserTurn(false);
    const player1Hand = dealtHands[0].hand;
    const selectedCard = player1Hand[cardIndex];
    const updatedCardSet = [selectedCard, ...useStore.getState().cardSet];
    setCardSet(updatedCardSet);
    dealtHands[0].hand = dealtHands[0].hand.filter((card) => card !== selectedCard);
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
      selectOtherhandsWithTurnSuit(turnSuit);
    } else {
      setTrumpSelected(false);
      setIsCardsGenerated(true);
      if (lastWinner === 1) {
        const chosenCard = chooseCardWithoutTurnSuit(dealtHands[1].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 1);
      } else if (lastWinner === 2) {
        const chosenCard = chooseCardWithoutTurnSuit(dealtHands[2].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 2);
      } else if (lastWinner === 3) {
        const chosenCard = chooseCardWithoutTurnSuit(dealtHands[3].hand);
        selectOtherHandsWithoutTurnSuit(chosenCard, 3);
      }
    }
    if (selectedCardByUser) setIsUserTurn(false);
    else setIsUserTurn(true);
  }

  function selectOtherhandsWithTurnSuit(ts: Suit) {
    let selectedCardsByEachPlayer: Card[] = [];
    const selectedCards = dealtHands.slice(1).map((hand, index) => {
      const chosenCard = chooseCard(hand.hand, ts);
      selectedCardsByEachPlayer[index] = chosenCard;
      setGeneratedCards(selectedCardsByEachPlayer);
      hand.hand = hand.hand.filter((card) => card !== chosenCard);
      return chosenCard;
    });
    const updatedCardSet = [...cardSet, ...selectedCards];
    setCardSet(updatedCardSet);
    setTrumpSelected(false);
    setIsCardsGenerated(true);
  }

  function selectOtherHandsWithoutTurnSuit(selectedCard: Card, turnOwnerindex: number) {
    let selectedCardsByEachPlayer: Card[] = [];
    const selectedCards = dealtHands.slice(1).map((hand, index) => {
      const chosenCard = chooseCard(hand.hand, selectedCard.suit);
      selectedCardsByEachPlayer[turnOwnerindex - 1] = selectedCard;
      selectedCardsByEachPlayer[index] = chosenCard;
      setGeneratedCards(selectedCardsByEachPlayer);
      hand.hand = hand.hand.filter((card) => card !== chosenCard);
      return chosenCard;
    });
    setTrumpSelected(false);
    setIsCardsGenerated(true);
    setCardSet([...cardSet, ...selectedCards]);
  }

  function handleNextTurn() {
    if (dealtHands[0].hand.length < 1) {
      if (team1Points > team2Points) {
        setRoundWinners(1);
        toast("This Round is Won by Team 1");
        setRoundOver(true);
      } else {
        setRoundWinners(2);
        toast("This Round is Won by Team 2");
        setRoundOver(true);
      }
      resetStates();
    } else {
      setTurnNumber(turnNumber + 1);
      resetStates();
    }
  }

  function handleNextTurnofShuffling() {
    checkWinner();
    if (isGameOver) return;
    if (roundWinners === 1) {
      if (trumpSetter === 1) {
        setwonCallingTrumps(true);
        setTeam_2_penaltyCards(team2PenaltyCards - 1);
      } else {
        setwonWithoutCallingTrumps(true);
        setTeam_2_penaltyCards(team2PenaltyCards - 2);
      }
      setRoundsWonbyTeam1(roundsWonbyTeam1 + 1);
    } else if (roundWinners === 2) {
      if (trumpSetter === 2) {
        setlostWithoutCallingTrumps(true);
        setTeam_1_penaltyCards(team1PenaltyCards - 1);
      } else {
        setlostCallingTrumps(true);
        setTeam_1_penaltyCards(team1PenaltyCards - 2);
      }
      setRoundsWonbyTeam2(roundsWonbyTeam2 + 1);
    }
    setDialogOpen(true);
    setTurnNumber(1);
    setRoundNumber(roundNumber !== null ? roundNumber + 1 : 1);
    resetTeamPoints();
    setStarterForRound();
    initailSetup();
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
    const playerCycle = [1, 2, 3, 0];
    const trumpSetterCycle = [2, 1];
    const starterPlayer = playerCycle[(roundNumber - 1) % 4];
    const trumpSetterNumber = trumpSetterCycle[(roundNumber - 1) % 2];
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
    SetLastWinner(index);
    setLastWinner(index);
  }

  function getLastWinnerNumber() {
    const lw = getLastWinner();
    if (lw) handleLastWinner(lw);
  }

  function selectWinningCard() {
    if (cardSet.length > 0) {
      const wc = determineTrickWinner(cardSet);
      setWinningCard(wc);
      playCollectCards(muted);
    }
  }

  function setWinner() {
    if (selectedCardByUser && generatedCards && winningCard) {
      const winner = checkWinnerForTurn(selectedCardByUser, generatedCards, winningCard);
      updateTeamPoints(winner);
      setThisRoundWinner(winner);
      handleLastWinner(winner);
    }
  }

  function updateTeamPoints(winner: number) {
    if (winner === 0 || winner === 2) setTeam1Points(team1Points + 1);
    else if (winner === 1 || winner === 3) setTeam2Points(team2Points + 1);
  }

  function handleSuitChange(suit: string | null) {
    setTrumpSuit(suit as Suit);
    setTrump(suit as Suit);
  }

  function checkWinner() {
    if (team1PenaltyCards === 0) { setGameWinner(2); setIsGameOver(true); }
    if (team2PenaltyCards === 0) { setGameWinner(1); setIsGameOver(true); }
  }

  function handleCloseDrawer() {
    handleSuitChange(trumpSuit);
    setTrumpSelected(true);
  }

  function handleAutomaticSubmit() {
    if (!isSubmitted && isCardsGenerated && selectedCardByUser) {
      setTimeout(handleSubmit, 3000);
    }
  }

  function handleAutomaticNextRound() {
    if (isSubmitted) setTimeout(handleNextTurn, 3000);
  }

  function restartGame() {
    resetTeamPoints();
    setRoundsWonbyTeam1(0);
    setRoundsWonbyTeam2(0);
    setTeam_1_penaltyCards(10);
    setTeam_2_penaltyCards(10);
    setRoundNumber(1);
    setTurnNumber(1);
    resetCards();
    resetStates();
    SetLastWinner(0);
    handleLastWinner(0);
    setIsGameOver(false);
    toast("Game restarted! Let's play again.");
  }

  // ── Effects (identical to game-play.tsx) ─────────────────────────
  useEffect(() => { initailSetup(); }, []);

  useEffect(() => {
    if (turnSuit || lastWinner !== null) handleSelectOtherHands();
  }, [turnNumber]);

  useEffect(() => {
    if (!generatedCards) return;
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
    if (cardSet.length > 2) handleAutomaticSubmit();
  }, [isCardsGenerated, isSubmitted, selectedCardByUser, cardSet]);

  useEffect(() => {
    if (isSubmitted) handleAutomaticNextRound();
  }, [isSubmitted]);

  useEffect(() => { checkWinner(); }, [roundsWonbyTeam1, roundsWonbyTeam2]);

  useEffect(() => {
    if (turnSuit && cardSet.length < 2) handleSelectOtherHands();
  }, [turnSuit, isCardsGenerated]);

  useEffect(() => {
    if (isRoundOver && isSubmitted) handleNextTurnofShuffling();
  }, [isSubmitted]);

  useEffect(() => { checkWinner(); }, [team1PenaltyCards, team2PenaltyCards, gameWinner]);

  // ── Render ────────────────────────────────────────────────────────
  const showTrumpDrawer =
    lastWinner === 0 &&
    dealtHands[0]?.hand.length > 7 &&
    !isTrumpSelected &&
    !isRoundOver;

  return (
    <div className="hidden sm:flex flex-col w-full h-screen overflow-hidden bg-zinc-950">
      {/* Background image */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: "url('/assets/images/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Round-over dialog */}
      {isDialogOpen && <RoundOverDialogMobile />}

      {/* Game-over overlays */}
      {isGameOver && gameWinner === 1 && <GameOverDialog onRestart={restartGame} />}
      {isGameOver && gameWinner === 2 && <GameOverDialogLose onRestart={restartGame} />}

      {/* Trump selector drawer */}
      {showTrumpDrawer && (
        <SuitDrawer userHand={dealtHands[0].hand} onClose={handleCloseDrawer} />
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 flex flex-col h-full w-full p-3 gap-2">

        {/* Row 1 — Player 3 (top center) + Scoreboard (top right) */}
        <div className="flex items-start justify-between px-4">
          {/* spacer left */}
          <div className="w-1/4" />

          {/* Player 3 — top center */}
          <div className="flex justify-center w-1/3">
            {dealtHands.length > 0 && dealtHands[2]?.hand ? (
              <PlayerPanelV2
                name="Player 3"
                avatarSrc="/assets/images/user-avatars/person8.png"
                cardCount={dealtHands[2].hand.length}
                isActive={lastWinner === 2}
                position="top"
              />
            ) : (
              <div className="h-24 w-32 rounded-xl bg-zinc-800/60 animate-pulse" />
            )}
          </div>

          {/* Scoreboard — top right */}
          <div className="flex justify-end w-1/3">
            <ScoreboardV2 />
          </div>
        </div>

        {/* Row 2 — Player 4 | Table | Player 2 */}
        <div className="flex flex-1 items-center gap-3 min-h-0">
          {/* Player 4 — left */}
          <div className="flex justify-center w-[14%]">
            {dealtHands.length > 0 && dealtHands[3]?.hand ? (
              <PlayerPanelV2
                name="Player 4"
                avatarSrc="/assets/images/user-avatars/person8.png"
                cardCount={dealtHands[3].hand.length}
                isActive={lastWinner === 3}
                position="left"
              />
            ) : (
              <div className="h-32 w-20 rounded-xl bg-zinc-800/60 animate-pulse" />
            )}
          </div>

          {/* Game table — center */}
          <div className="flex-1 h-full">
            <GameTableV2
              onStart={handleSelectOtherHands}
              onNextStart={handleNextTurn}
              onShuffleAgain={handleNextTurnofShuffling}
              onRestart={restartGame}
            />
          </div>

          {/* Player 2 — right */}
          <div className="flex justify-center w-[14%]">
            {dealtHands.length > 0 && dealtHands[1]?.hand ? (
              <PlayerPanelV2
                name="Player 2"
                avatarSrc="/assets/images/user-avatars/person8.png"
                cardCount={dealtHands[1].hand.length}
                isActive={lastWinner === 1}
                position="right"
              />
            ) : (
              <div className="h-32 w-20 rounded-xl bg-zinc-800/60 animate-pulse" />
            )}
          </div>
        </div>

        {/* Row 3 — User hand + Info strip */}
        <div className="flex items-end justify-between gap-4 pb-2 px-2">
          {/* User's hand */}
          <div className="flex-1 flex justify-center">
            {dealtHands.length > 0 && dealtHands[0]?.hand ? (
              <UserHandV2
                userHand={dealtHands[0].hand}
                onCardSelect={handleCardSelectDeck}
              />
            ) : (
              <div className="h-20 w-80 rounded-xl bg-zinc-800/60 animate-pulse" />
            )}
          </div>

          {/* Info strip */}
          <div className="flex-shrink-0">
            <InfoStripV2
              avatarSrc="/assets/user-avatars/player1.png"
              roundNumber={roundNumber}
              turnNumber={turnNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
