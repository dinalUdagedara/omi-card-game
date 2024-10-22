import Image from "next/image";
import { useEffect, useState } from "react";
import card from "./card";
import { dynamicBlurDataUrl } from "@/utils/dynamicBlurdataUrl";
import cardBack from "@/public/assets/cards/card-back.jpg";

const OtherCardComponentMobile = () => {
  const [blurHash, setBlurHash] = useState<string | undefined>(undefined);
  const imgUrl = `/assets/cards-vintage/card-back.png`;

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
          width={50}
          height={50}
          alt="card"
          placeholder={blurHash ? "blur" : "empty"}
          blurDataURL={blurHash}
        />
      </div>
    </div>
  );
};

export default OtherCardComponentMobile;
