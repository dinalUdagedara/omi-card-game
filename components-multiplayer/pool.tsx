"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SocketData } from "@/utils/types-multiplayer";
import SocketManager from "@/services/web-socket-service";

const Pool = () => {
  const [inbox, setInbox] = useState<{ username: string; message: string }[]>(
    []
  );
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [connectedRoom, setConnectedRoomName] = useState<string>("");
  const [userName, setUserName] = useState<string | null>(null);
  const [userNameInput, setUserNameInput] = useState<string | null>(null);
  const [roomSocketData, setRoomSocketData] = useState<SocketData[] | null>(
    null
  );

  const webSocketURL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    if (webSocketURL)
      // Connect to socket on mount
      SocketManager.connect(webSocketURL);

    // Listen for incoming messages
    SocketManager.onMessage((data) => {
      setInbox((prevInbox) => [...prevInbox, data]);
    });

    return () => {
      // Disconnect socket when component unmounts
      SocketManager.disconnect();
    };
  }, [webSocketURL]);

  const handleSendMessage = () => {
    SocketManager.sendMessage(message, roomName, userName);
    setMessage(""); // Clear the input after sending
  };

  const handleJoinRoom = () => {
    SocketManager.joinRoom(roomName, userName);
    SocketManager.getRoomName((room) => {
      setConnectedRoomName(room);
    });
  };

  const handleEnterUserName = () => {
    setUserName(userNameInput);
  };

  const getRoomInfo = () => {
    SocketManager.getRoomData(roomName, (roomData) => {
      setRoomSocketData(roomData);
    });
  };

  const getAllSockets = () => {
    SocketManager.getAllSockets((socketsData) => {
      console.log("Sockets Data", socketsData);
    });
  };

  useEffect(() => {
    if (connectedRoom || userName) {
      getAllSockets();
      getRoomInfo();
    }
  }, [connectedRoom, userName]);

  return (
    <div className="min-h-screen  bg-slate-500 flex w-full justify-center gap-20 p-20">
      <div className="ml-20 mt-20 flex justify-start w-full flex-col gap-5">
        <div className="flex gap justify-between">
          <div className="mb-10">
            <p className="font-bold">Room name:</p>
            <p className="  text-center mt-6 ">{connectedRoom}</p>
          </div>
          <div className="mb-10">
            <p className="font-bold"> User name :</p>
            <p className="  text-center mt-6 "> {userName}</p>
          </div>
          <div className="mb-10 ">
            <p className="font-bold">Users in the room :</p>
            <div className="text-center ">
              {roomSocketData?.map((socket, index) => (
                <div key={index} className=" text-justify mt-6">
                  <p className="font-semibold">Name: {socket.username} </p>
                  <p className="">Id: {socket.id} </p>
                  <p className="">rooms: {socket.rooms} </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 bg-slate-300 rounded-xl p-10">
          {inbox.map((msg, index) => (
            <div key={index}>
              <p className="font-bold">{msg.username}:</p>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>

        <div
          className={`${
            connectedRoom ? "hidden" : "flex"
          }  rounded-2xl flex-col gap-5 items-center  w-full `}
        >
          <Input
            className="flex justify-center text-end w-1/2"
            type="text"
            value={roomName}
            onChange={(e) => {
              setRoomName(e.target.value);
            }}
          />
          <Button
            disabled={!roomName}
            className=" rounded-lg p-4"
            onClick={handleJoinRoom}
          >
            Join Room
          </Button>
        </div>
      </div>

      <div className=" w-1/2 m-20 flex flex-col gap-20">
        <div className={`${!userName ? "flex flex-col" : " hidden"} gap-5 `}>
          <Input
            className="flex justify-center text-end"
            type="text"
            onChange={(e) => {
              setUserNameInput(e.target.value);
            }}
          />
          <Button className=" rounded-lg" onClick={handleEnterUserName}>
            Enter Your Name
          </Button>
        </div>

        <div className={`${!userName ? "hidden" : "flex"}  flex-col gap-5 `}>
          <Input
            className="flex justify-center text-end"
            type="text"
            name="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
          />
          <Button className="rounded-lg" onClick={handleSendMessage}>
            send message
          </Button>
        </div>
        {/* <Button onClick={getAllSockets}>Get Sockets Info</Button> */}

        <Button
          className={`${roomName ? "flex" : "hidden"}`}
          onClick={getRoomInfo}
        >
          Get Room Info
        </Button>
      </div>
    </div>
  );
};

export default Pool;
