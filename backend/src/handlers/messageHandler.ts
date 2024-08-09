import { WebSocket } from "ws";
import {
  Message,
  JoinSessionMessage,
  UpdateSongMessage,
} from "../types/weMessage";
import { handleJoinSession, handleLeaveSession } from "./connectionHandler";
import { handleSongSelected } from "./songHandler";

export const handleMessage = async (
  message: string,
  ws: WebSocket,
  connections: Map<string, WebSocket>,
  users: Map<string, string>,
  currentUser: string | undefined,
  setCurrentUser: (username: string) => void,
  currentSong: any,
  setCurrentSong: (song: any) => void
) => {
  let userMessage: Message;
  try {
    userMessage = JSON.parse(message) as Message;
  } catch (error) {
    console.error("Invalid JSON message received:", error);
    return;
  }

  console.log(`Received message of type ${userMessage.type}`);

  switch (userMessage.type) {
    case "joinSession":
      await handleJoinSession(
        (userMessage as JoinSessionMessage).username,
        ws,
        connections,
        users,
        setCurrentUser,
        currentSong
      );
      break;
    case "leaveSession":
      handleLeaveSession(currentUser, connections, users);
      break;
    case "songSelected":
      await handleSongSelected(
        userMessage as UpdateSongMessage,
        setCurrentSong,
        connections
      );
      break;
    default:
      console.warn(`Unhandled message type: ${(userMessage as any).type}`);
  }
};
