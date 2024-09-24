import { io, Socket } from "socket.io-client";
import { SocketData } from "@/utils/types-multiplayer";

class SocketManager {
  private socket: Socket | null = null;

  connect(url: string) {
    if (!this.socket) {
      this.socket = io(url);

      this.socket.on("connect", () => {
        console.log("Connected with ID:", this.socket?.id);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  sendMessage(message: string, roomName: string, userName: string | null) {
    if (this.socket && message.trim()) {
      this.socket.emit("message", message, roomName, userName);
    }
  }

  joinRoom(roomName: string, userName: string | null) {
    if (this.socket && roomName.trim()) {
      this.socket.emit("joinRoom", roomName, userName);
    }
  }

  getRoomName(callback: (room: string) => void) {
    if (this.socket) {
      this.socket.emit("getRoomName");
      this.socket.on("roomNameResponse", (rooms) => {
        callback(rooms[0]);
      });
    }
  }

  getRoomData(roomName: string, callback: (data: SocketData[]) => void) {
    if (this.socket) {
      this.socket.emit("getRoomData", roomName);
      this.socket.on("RoomSocketInfoResponse", (roomData: SocketData[]) => {
        callback(roomData);
      });
    }
  }

  getAllSockets(callback: (data: SocketData[]) => void) {
    if (this.socket) {
      this.socket.emit("getAllSocketInfo");
      this.socket.on("allSocketInfoResponse", (socketsData: SocketData[]) => {
        callback(socketsData);
      });
    }
  }

  getAllCustomRooms(callback: (rooms: string[]) => void) {
    if (this.socket) {
      this.socket.emit("getAllCustomRooms");
      this.socket.on("customRoomsList", (rooms: string[]) => {
        callback(rooms);
      });
    }
  }

  onMessage(callback: (data: { username: string; message: string }) => void) {
    if (this.socket) {
      this.socket.on("message", (data) => {
        callback(data);
      });
    }
  }
}

export default new SocketManager();
