"use client";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";

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
    }
  }, [penaltyCards, userID]); // Run effect when playersInRoom or userID changes

  return (
    <div>
      <div className="flex gap-5 mx-5">
        <PenaltyDeckMobile penaltyCardNumber={myTeamPenaltyCards} />
        <PenaltyDeckMobile penaltyCardNumber={opponentPenaltyCards} />
      </div>
    </div>
  );
};

export default PenaltycardsMultiplayer;
