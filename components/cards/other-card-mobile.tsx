import Image from "next/image";

const OtherCardComponentMobile = () => {
  return (
    <div className={`flex flex-row justify-center rounded-md items-center`}>
      <div>
        <Image
        className="rounded-md"
          src={`/assets/cards/card-back.jpg`}
          width={50}
          height={50}
          alt="card"
        />
      </div>
    </div>
  );
};

export default OtherCardComponentMobile;
