import { Card } from "@/utils/types";
import Image from "next/image";

const CardComponentMobile = ({ card }: { card: Card }) => {
  // Choose a color based on the suit
  const suitColor =
    card.suit === "hearts" || card.suit === "diamonds"
      ? "text-red-500"
      : "text-black";

  return (
    <div
      className={`flex flex-row justify-center rounded-md items-center ${suitColor}`}
    >
      <Image
        src={`/assets/cards/${card.value}_of_${card.suit}.png`}
        width={80}
        height={80}
        alt="card"
      />
    </div>
  );
};

export default CardComponentMobile;
