import { WebSocket } from "ws";
import { broadcastCurrentUsers } from "../utils/broadcastUtils";
import User from "../models/user";

export const handleConnection = (
  ws: WebSocket,
  connections: Map<string, WebSocket>,
  users: Map<string, string>
) => {
  console.log("User connected to music session!");
  let currentUser: string | undefined;

  ws.on("error", (error: Error) => {
    console.error("WebSocket error:", error);
  });

  ws.on("close", () => {
    console.log("User disconnected");
    if (currentUser) {
      connections.delete(currentUser);
      users.delete(currentUser);
      broadcastCurrentUsers(connections, users);
    }
  });

  return {
    currentUser,
    setCurrentUser: (username: string) => {
      currentUser = username;
    },
  };
};

export const handleJoinSession = async (
  username: string,
  ws: WebSocket,
  connections: Map<string, WebSocket>,
  users: Map<string, string>,
  setCurrentUser: (username: string) => void,
  currentSong: any
) => {
  if (connections.has(username)) {
    ws.send(JSON.stringify({ type: "error", message: "User already in" }));
    return;
  }
  connections.set(username, ws);
  setCurrentUser(username);

  try {
    const user = await User.findByUsername(username);
    console.log("User found:", user);
    if (user) {
      users.set(username, user.instrument);
    }

    if (currentSong) {
      ws.send(JSON.stringify({ type: "songSelected", data: currentSong }));
    }

    broadcastCurrentUsers(connections, users);
  } catch (error) {
    console.error("Error finding user:", error);
    ws.send(
      JSON.stringify({ type: "error", message: "Error joining session" })
    );
  }
};

export const handleLeaveSession = (
  currentUser: string | undefined,
  connections: Map<string, WebSocket>,
  users: Map<string, string>
) => {
  if (currentUser) {
    connections.delete(currentUser);
    users.delete(currentUser);
  }
  broadcastCurrentUsers(connections, users);
};
