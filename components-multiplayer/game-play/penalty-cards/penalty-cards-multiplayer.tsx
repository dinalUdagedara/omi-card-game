"use client";
import { PenaltyDeckMobile } from "@/components/decks/penalty-decks/penalty-decks";
import { useStore } from "@/store/state";
import { exampleCardSet } from "@/utils/types";

const PenaltycardsMultiplayer = () => {
  const team1PenaltyCards = useStore((state) => state.team_1_penaltyCards);
  const team2PenaltyCards = useStore((state) => state.team_2_penaltyCards);

  return (
    <div>
      <div className="flex gap-5 mx-5">
        <PenaltyDeckMobile penaltyCardNumber={team1PenaltyCards} />
        <PenaltyDeckMobile penaltyCardNumber={team2PenaltyCards} />
      </div>
    </div>
  );
};

export default PenaltycardsMultiplayer;
