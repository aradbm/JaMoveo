import { WebSocketServer, WebSocket } from "ws";
import { handleConnection } from "../handlers/connectionHandler";
import { handleMessage } from "../handlers/messageHandler";
import { Song } from "../types/song";

const startWebSocketServer = (wss: WebSocketServer): void => {
  const connections = new Map<string, WebSocket>();
  const users = new Map<string, string>();
  let currentSong: Song | undefined = undefined;

  wss.on("connection", (ws: WebSocket) => {
    const { currentUser, setCurrentUser } = handleConnection(
      ws,
      connections,
      users
    );

    ws.on("message", async (message: string) => {
      await handleMessage(
        message,
        ws,
        connections,
        users,
        currentUser,
        setCurrentUser,
        currentSong,
        (song: Song | undefined) => {
          currentSong = song;
        }
      );
    });
  });

  wss.on("error", (error: Error) => {
    console.error("WebSocket server error:", error);
  });
};

export default startWebSocketServer;
