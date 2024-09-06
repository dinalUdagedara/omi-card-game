import { Card } from "@/utils/types";
import Image from "next/image";

const CardComponent = ({ card }: { card: Card }) => {
  // Define suit symbols for a more visual representation
  const suitSymbols = {
    hearts: "♥",
    diamonds: "♦",
    clubs: "♣",
    spades: "♠",
  };

  // Choose a color based on the suit
  const suitColor =
    card.suit === "hearts" || card.suit === "diamonds"
      ? "text-red-500"
      : "text-black";

  return (
    // <div
    //   className={`border border-gray-300 bg-white p-2 w-24 h-32 flex flex-row justify-center rounded-md items-center ${suitColor}`}
    // >
    //   <div className="h-full">
    //     <div className="font-bold  flex flex-col">
    //       <div className="h-4">{card.value}</div>
    //       <div>{suitSymbols[card.suit]}</div>
    //     </div>
    //   </div>
    //   <div className=" h-full w-full flex justify-center items-center">
    //     <div className="text-4xl">{suitSymbols[card.suit]}</div>
    //   </div>
    //   <div className="flex flex-col h-full justify-end ">
    //     <div className="font-bold  flex flex-col ">
    //       <div className="transform rotate-180">{suitSymbols[card.suit]}</div>
    //       <div className="h-4 transform rotate-180">{card.value}</div>
    //     </div>
    //   </div>
    // </div>
    <div
      className={`flex flex-row justify-center rounded-md items-center ${suitColor}`}
    >
      <Image
        src={`/assets/cards/${card.value}_of_${card.suit}.png`}
        width={100}
        height={100}
        alt="card"
      />
    </div>
  );
};

export default CardComponent;
