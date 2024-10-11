import Link from "next/link";
import { Card, CardFooter, Image, Button, CardHeader } from "@nextui-org/react";

const ModeSelector = () => {
  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen  justify-center gap-20 items-center">
      <Link href={"/practise"}>
        <Button className="w-full h-full bg-inherit hover:bg-inherit">
          <Card
            isFooterBlurred
            radius="lg"
            className="col-span-12 sm:col-span-4 md:h-[300px] md:w-[500px] hover:scale-105 "
          >
            <CardHeader className="absolute z-10 top-1 flex-col !items-start bg-slate-500 bg-opacity-30 rounded-lg">
              <p className="text-tiny text-white/60 uppercase font-bold">
                Practise Mode
              </p>
              <h4 className="text-white font-medium text-large">
                Warm Up Before the Challenge
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={`/assets/images/practise.png`}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 mb-2 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">
                Ready to Test your Limits
              </p>
              <p className="text-tiny text-white bg-black/20 p-2 rounded-lg">
                Jump In
              </p>
            </CardFooter>
          </Card>
        </Button>
      </Link>

      <Link href={"/multiplayer"}>
        <Button className="w-full h-full bg-inherit hover:bg-inherit">
          <Card
            isFooterBlurred
            radius="lg"
            className="col-span-12 sm:col-span-4 md:h-[300px] mdw-[500px] hover:scale-105 "
          >
            <CardHeader className="absolute z-10 top-1 flex-col !items-start bg-slate-500 bg-opacity-30 rounded-lg">
              <p className="text-tiny text-white/60 uppercase font-bold">
                Multiplayer Mode
              </p>
              <h4 className="text-white font-medium text-large">
                Compete with Players Worldwide
              </h4>
            </CardHeader>
            <Image
              removeWrapper
              alt="Card background"
              className="z-0 w-full h-full object-cover"
              src={`/assets/images/multiplayer.png`}
            />
            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 mb-2 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
              <p className="text-tiny text-white/80">Rooms Await..</p>
              <p className="text-tiny text-white bg-black/20 p-2  rounded-lg">
                Dive in
              </p>
            </CardFooter>
          </Card>
        </Button>
      </Link>
    </div>
  );
};

export default ModeSelector;
