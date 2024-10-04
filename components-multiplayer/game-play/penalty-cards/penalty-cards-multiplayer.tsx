"use client";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks";
import { api } from "@/convex/_generated/api";
import { useStore } from "@/store/state";
import { useQuery } from "convex/react";

interface PenaltycardsMultiplayerProps {
  roomName: string;
}

const PenaltycardsMultiplayer = ({
  roomName,
}: PenaltycardsMultiplayerProps) => {
  const playersInRoom = useQuery(api.gameLogic.getPenaltyCards, {
    roomName: roomName,
  });

  return (
    <div>
      <div className="flex gap-5 mx-5">
        {playersInRoom?.map((player) => (
          <PenaltyDeckMobile penaltyCardNumber={player.penaltyCards} />
        ))}
      </div>
    </div>
  );
};

export default PenaltycardsMultiplayer;
