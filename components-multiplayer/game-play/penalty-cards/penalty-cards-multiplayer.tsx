"use client";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useStore } from "@/store/state";
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
  const playersInRoom = useQuery(api.gameLogic.getPenaltyCards, {
    roomName: roomName,
  });
  const [myPenaltyCards, setMyPenaltyCards] = useState<number>(0);
  const [opponentPenaltyCards, setOpponentPenaltyCards] = useState<number>(0);
  useEffect(() => {
    if (playersInRoom) {
      const myInfo = playersInRoom.find((player) => player.playerId === userID);
      if (myInfo) {
        setMyPenaltyCards(myInfo.penaltyCards);
      }

      const opponentInfo = playersInRoom.find(
        (player) => player.playerId !== userID
      );
      if (opponentInfo) {
        setOpponentPenaltyCards(opponentInfo.penaltyCards);
      }
    }
  }, [playersInRoom, userID]); // Run effect when playersInRoom or userID changes

  return (
    <div>
      <div className="flex gap-5 mx-5">
        <PenaltyDeckMobile penaltyCardNumber={myPenaltyCards} />
        <PenaltyDeckMobile penaltyCardNumber={opponentPenaltyCards} />
        {/* {playersInRoom?.map((player) => (
          <PenaltyDeckMobile penaltyCardNumber={player.penaltyCards} />
        ))} */}
      </div>
    </div>
  );
};

export default PenaltycardsMultiplayer;
