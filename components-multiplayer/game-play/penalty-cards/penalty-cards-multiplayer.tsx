"use client";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks-multiplayer";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { MultiplayerStateStore } from "@/store/multiplayer-state";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import ScoreBoardTemplate from "../score-board/score-board-template";
import { useRoundLoseSound, useRoundWonSound } from "@/utils/play-sounds";
import { useStore } from "@/store/state";

interface PenaltycardsMultiplayerProps {
  roomName: string;
  userID: Id<"players">;
}

const PenaltycardsMultiplayer = ({
  roomName,
  userID,
}: PenaltycardsMultiplayerProps) => {
  const myTeam = useQuery(api.gameLogic.getMyTeam, {
    userId: userID,
    roomName: roomName,
  });

  const penaltyCards = useQuery(api.gameLogic.getPenaltyCards, {
    roomName: roomName,
  });
  const [myTeamPenaltyCards, setMyTeamPenaltyCards] = useState<number>(0);
  const [opponentPenaltyCards, setOpponentPenaltyCards] = useState<number>(0);

  const setGameOver = MultiplayerStateStore((state) => state.setGameOver);
  const setGameWon = MultiplayerStateStore((state) => state.setGameWon);
  const { playRoundWon } = useRoundWonSound();
  const { playRoundLose } = useRoundLoseSound();
  const muted = useStore((state) => state.muted);

  useEffect(() => {
    if (penaltyCards) {
      const myCards = penaltyCards.find((player) => player.teamNo === myTeam);
      if (myCards) {
        setMyTeamPenaltyCards(myCards.penaltyCards);
      }

      const opponentInfo = penaltyCards.find(
        (player) => player.teamNo !== myTeam
      );
      if (opponentInfo) {
        setOpponentPenaltyCards(opponentInfo.penaltyCards);
      }

      if (myCards?.penaltyCards === 0) {
        console.log("I lost");
        setGameWon(false);
        setGameOver(true);
        // game lose sound
        playRoundLose(muted);
      } else if (opponentInfo?.penaltyCards === 0) {
        console.log("I Won");
        setGameWon(true);
        setGameOver(true);
        // game won sound
        playRoundWon(muted);
      }
    }
  }, [penaltyCards, userID]); // Run effect when playersInRoom or userID changes

  return (
    <div>
      <div className="hidden lg:flex mt-5">
        <PenaltyDeckMobile penaltyCardNumber={myTeamPenaltyCards} />
        {/* <ScoreBoardMobileMultiplayer userID={userID} roomName={roomName} /> */}
        <ScoreBoardTemplate userID={userID} roomName={roomName} />
        <PenaltyDeckMobile penaltyCardNumber={opponentPenaltyCards} />
      </div>
      <div className="flex lg:hidden flex-col mt-2">
        <ScoreBoardTemplate userID={userID} roomName={roomName} />
        <div className="flex">
          <PenaltyDeckMobile penaltyCardNumber={myTeamPenaltyCards} />
          <PenaltyDeckMobile penaltyCardNumber={opponentPenaltyCards} />
        </div>
      </div>
    </div>
  );
};

export default PenaltycardsMultiplayer;
