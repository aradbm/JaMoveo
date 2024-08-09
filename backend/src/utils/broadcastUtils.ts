import { WebSocket } from "ws";

export const broadcastCurrentSong = (
  connections: Map<string, WebSocket>,
  currentSong: any
) => {
  const message = JSON.stringify({
    type: "songSelected",
    data: currentSong || null,
  });
  connections.forEach((connection) => {
    connection.send(message);
  });
};

export const broadcastCurrentUsers = (
  connections: Map<string, WebSocket>,
  users: Map<string, string>
) => {
  const message = JSON.stringify({
    type: "users",
    data: Array.from(users.entries()),
  });
  connections.forEach((connection) => {
    connection.send(message);
  });
  console.log("Broadcasted current users:", users);
};
