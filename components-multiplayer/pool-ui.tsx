import { Button } from "@/components/ui/button";

const PoolUI = () => {
  return (
    <div className="flex flex-col h-screen">
      <div className="pt-20 justify-center flex text-center">
        Available Rooms
      </div>

      <div className=" flex justify-between items-center px-20 flex-grow h-full">
        <div className="h-40 w-40 ">
          <Button className="h-full w-full rounded-2xl">Room 1</Button>
        </div>
        <div className="h-40 w-40">
          <Button className="h-full w-full  rounded-2xl">Room 1</Button>
        </div>
        <div className="h-40 w-40">
          <Button className="h-full w-full  rounded-2xl">Room 1</Button>
        </div>
      </div>

      <div className="flex items-center justify-center flex-grow h-full">
        <Button className=" rounded-md">Create a New Room</Button>
      </div>
    </div>
  );
};

export default PoolUI;
