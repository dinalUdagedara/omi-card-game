import Image from "next/image";
import { useEffect, useState } from "react";
import card from "./card";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurdataUrl";
import cardBack from "@/public/assets/cards-vintage/card-back.png";

const OtherCardComponent = () => {
  const [blurHash, setBlurHash] = useState<string | undefined>(undefined);
  const imgUrl = `/assets/assets/cards-vintage/card-back.png`;

  // Fetch the blurHash asynchronously when the component mounts
  useEffect(() => {
    const fetchBlurData = async () => {
      const blurData = await dynamicBlurDataUrl(imgUrl);
      setBlurHash(blurData);
    };
    fetchBlurData();
  }, [imgUrl]);
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image
          className="rounded-md"
          src={cardBack}
          width={80}
          height={80}
          alt="card"
          placeholder={blurHash ? "blur" : "empty"}
          blurDataURL={blurHash}
        />
      </div>
    </div>
  );
};

export default OtherCardComponent;
