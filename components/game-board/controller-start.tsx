"use client";
import { FaPlay } from "react-icons/fa";
import { useStore } from "@/store/state";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

interface ControllerStartProps {
  onStart: () => void;
  onShuffleAgain: () => void;
}

const ControllerStart: React.FC<ControllerStartProps> = ({
  onStart,
  onShuffleAgain,
}) => {
  const roundWinners = useStore((state) => state.roundWinners);
  const isCardsGenerated = useStore((state) => state.isCardsGenerated);

if (roundWinners) {
  onShuffleAgain
}

  return (
    <div>
      {roundWinners ?  (
        <div>
          <Button onClick={onShuffleAgain} type="submit">
            Next
          </Button>
        </div>
      ) : (
        <div className="m-10">
          <motion.div
            initial={{ opacity: 0, y: -100, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.05, rotate: 4 }}
          >
            <Button
              disabled={isCardsGenerated}
              className={
                "bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 text-white font-semibold hover:from-gray-700 hover:via-gray-600 hover:to-gray-500 hover:scale-105 hover:shadow-lg transition-transform duration-300 ease-in-out rounded-full px-6 py-3 shadow-md focus:outline-none focus:ring-4 focus:ring-gray-300"
              }
              onClick={onStart}
              size={"default"}
            >
              <FaPlay className="mr-2 h-4 w-4" />
              Play
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ControllerStart;
