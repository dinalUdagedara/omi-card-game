import Image from "next/image";

const PenaltyCard = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image
          src={`/assets/cards-vintage/card-back.png`}
          width={20}
          height={20}
          alt="card"
        />
      </div>
    </div>
  );
};

export default PenaltyCard;
