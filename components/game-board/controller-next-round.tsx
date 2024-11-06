"use client"
import { useStore } from "@/store/state";
import { Button } from "../ui/button";

interface ControllerStartProps {
  onNextStart: () => void;
}

const ControllerNextRound: React.FC<ControllerStartProps> = ({
  onNextStart,
}) => {
  const isSubmitted = useStore((state) => state.isSubmitted);
  return (
    <div>
      <Button disabled={!isSubmitted} onClick={onNextStart}>
        Next Round
      </Button>
    </div>
  );
};

export default ControllerNextRound;
