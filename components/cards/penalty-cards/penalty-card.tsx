import Image from "next/image";
import cardBack from "@/public/assets/cards/card-back.jpg";

const PenaltyCard = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image src={cardBack} width={20} height={20} alt="card" />
      </div>
    </div>
  );
};

export default PenaltyCard;
