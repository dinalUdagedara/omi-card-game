import Image from "next/image";
import cardBack from "@/public/assets/cards-vintage/card-back.png";

const PenaltyCardMobile = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image src={cardBack} width={10} height={10} alt="card" />
      </div>
    </div>
  );
};

export default PenaltyCardMobile;
