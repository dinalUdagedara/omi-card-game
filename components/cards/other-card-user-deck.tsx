import Image from "next/image";

const OtherCardComponentUserDeck = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image
        className="rounded-md"
          src={`/assets/cards/card-back.jpg`}
          width={100}
          height={100}
          alt="card"
        />
      </div>
    </div>
  );
};

export default OtherCardComponentUserDeck;
