import { io, Socket } from "socket.io-client";
import { SocketData } from "@/utils/types-multiplayer";
import { Card, Suit } from "@/utils/types";

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

  getMySocket() {
    return this.socket;
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

  joinRoom(roomName: string, isRoomPrivate: boolean, userName: string | null) {
    if (this.socket && roomName.trim()) {
      this.socket.emit("joinRoom", roomName, isRoomPrivate, userName);
      this.socket.on("roomFull", (data) => {
        console.log(data.message);
      });
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

  getRoomData(
    roomName: string,
    callback: (data: { creator: SocketData; players: SocketData[] }) => void
  ) {
    if (this.socket) {
      this.socket.emit("getRoomData", roomName);
      this.socket.on(
        "RoomSocketInfoResponse",
        (roomData: { creator: SocketData; players: SocketData[] }) => {
          callback(roomData);
        }
      );
    }
  }

  onPlayerJoined(callback: (data: SocketData[]) => void) {
    if (this.socket) {
      this.socket.on("player-joined", (newRoomData: SocketData[]) => {
        callback(newRoomData);
      });
    }
  }

  onRoomCreated(callback: (data: string[]) => void) {
    if (this.socket) {
      this.socket.on("new-public-room", (newRoomData: string[]) => {
        callback(newRoomData);
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

  getAllPublicRooms(callback: (rooms: string[]) => void) {
    if (this.socket) {
      this.socket.emit("getAllPublicRooms");
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

  // Emit game start event to all players in the room
  emitGameStart(roomName: string) {
    if (this.socket && roomName.trim()) {
      this.socket.emit("startGame", roomName);
    }
  }

  onGameStart(callback: () => void) {
    if (this.socket) {
      this.socket.on("gameStarted", () => {
        callback();
      });
    }
  }

  // Game Play Related Socket messages

  emitTrump(trumpSuit: Suit | null, roomName: string) {
    if (this.socket) {
      this.socket.emit("trumpSelected", trumpSuit, roomName);
    }
  }

  onTrumpSelected(callback: (trumpSuit: Suit) => void) {
    if (this.socket) {
      this.socket.on("onTrumpSelected", (selectedTrumpSuit: Suit) => {
        callback(selectedTrumpSuit);
      });
    }
  }

  emitSelectedCard(selectedCard: Card, roomName: string) {
    if (this.socket) {
      this.socket.emit("selectedCard", selectedCard, roomName);
    }
  }

  onOpponentCardSelect(callback: (selectedCard: Card) => void) {
    if (this.socket) {
      this.socket.on("opponentCard", (selectedCard: Card) => {
        callback(selectedCard);
      });
    }
  }
}

export default new SocketManager();
