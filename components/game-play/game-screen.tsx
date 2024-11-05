import Board from "./game-play";
import GamePlayMobile from "./game-play-mobile";

const GameScreen = () => {

  
  return (
    <div>
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
