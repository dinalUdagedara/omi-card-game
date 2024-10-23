import CreateRoomComponent from "@/components-multiplayer/create-room/create-room";
import CreateRoomContainer from "@/components-multiplayer/create-room/create-room-container";

const Page = () => {
  return (
    <div className=" h-full min-h-screen">
      <CreateRoomContainer />
      {/* <CreateRoomComponent /> */}
    </div>
  );
};

export default Page;
