export const suits: string[] = ["hearts", "diamonds", "clubs", "spades"];
export const values: string[] = ["7", "8", "9", "10", "J", "Q", "K", "A"];

export type SocketData = {
  id: string;
  username: string;
  rooms: string[];
};

export const generateRandomName = () => {
  return `room-${Math.random().toString(36).substr(2, 9)}`;
};

export type StartGamePoolPrivateProps = {
  roomId: string;
};

export type cardMultiplayer = {
  suit: string;
  value: string;
};

function getValueRank(value: string): number {
  return values.indexOf(value);
}
