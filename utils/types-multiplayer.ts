export type SocketData = {
  id: string;
  username: string;
  rooms: string[];
};

export const generateRandomName = () => {
  return `room-${Math.random().toString(36).substr(2, 9)}`;
};
