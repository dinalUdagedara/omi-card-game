import Image from "next/image";

const PenaltyCardMobile = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image
          src={`/assets/cards/card-back.jpg`}
          width={10}
          height={10}
          alt="card"
        />
      </div>
    </div>
  );
};

export default PenaltyCardMobile;
