import Image from "next/image";

import CardBack from "@/public/assets/cards-vintage/card-back.png";

const PenaltyCard = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image src={CardBack} width={20} height={20} alt="card" />
      </div>
    </div>
  );
};

export default PenaltyCard;
