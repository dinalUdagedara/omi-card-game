import Link from "next/link";
import { Button } from "./ui/button";

const ModeSelector = () => {
  return (
    <div className="flex flex-col h-full min-h-screen  justify-center gap-20 items-center">
      <div className="w-80 h-20 ">
        <Link href={"/practise"}>
          <Button className="w-full h-full ">Practise Mode</Button>
        </Link>
      </div>
      <div className="w-80 h-20">
        <Link href={"/multiplayer"}>
          <Button className="w-full h-full ">Multiplayer Mode</Button>
        </Link>
      </div>
    </div>
  );
};

export default ModeSelector;
