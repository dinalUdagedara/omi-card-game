import { Card } from "@/utils/practise/types";
import { useState, useEffect } from "react";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurdataUrl";
import Image from "next/image";

const CardComponentMobile = ({ card }: { card: Card }) => {

  const [blurHash, setBlurHash] = useState<string | undefined>(undefined);
  const imgUrl = `/assets/cards/${card.value}_of_${card.suit}.png`;

  // Fetch the blurHash asynchronously when the component mounts
  useEffect(() => {
    const fetchBlurData = async () => {
      const blurData = await dynamicBlurDataUrl(imgUrl);
      setBlurHash(blurData);
    };
    fetchBlurData();
  }, [imgUrl]);

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
        src={imgUrl}
        width={80}
        height={80}
        alt="card"
        placeholder={blurHash ? "blur" : "empty"}
        blurDataURL={blurHash}
      />
    </div>
  );
};

export default CardComponentMobile;
