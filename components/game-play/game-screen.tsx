import Link from "next/link";
import Board from "./game-play";
import GamePlayMobile from "./game-play-mobile";
import { IoArrowBackOutline } from "react-icons/io5";

const GameScreen = () => {
  return (
    <div>
      <div className="absolute  top-5 left-5">
        <Link href={"/"}>
          <div className="flex justify-between items-center gap-2 hover:scale-110">
            <IoArrowBackOutline /> Exit
          </div>
        </Link>
      </div>
      <div className="flex sm:hidden">
        <GamePlayMobile />
      </div>

      <div className="hidden sm:flex">
        <Board />
      </div>
    </div>
  );
};

export default GameScreen;
