import { WebSocketServer, WebSocket } from "ws";
import fs from "fs";
import {
  Message,
  JoinSessionMessage,
  LeaveSessionMessage,
  UpdateSongMessage,
} from "../types/weMessage";
import { Song } from "../types/song";
import path from "path";
const songsFilePath = path.join(__dirname, "../data");

const startWebSocketServer = (wss: WebSocketServer): void => {
  const connections = new Map<string, WebSocket>();
  let currentSong: Song | undefined = undefined;

  wss.on("connection", (ws: WebSocket) => {
    console.log("User connected to music session!");
    let currentUser: string | undefined;

    ws.on("message", async (message: string) => {
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
          handleJoinSession(ws, userMessage as JoinSessionMessage);
          break;
        case "leaveSession":
          handleLeaveSession(userMessage as LeaveSessionMessage);
          break;
        case "songSelected":
          await handleSongSelected(userMessage as UpdateSongMessage);
          break;
        default:
          console.warn(`Unhandled message type: ${(userMessage as any).type}`);
      }
    });

    ws.on("error", (error: Error) => {
      console.error("WebSocket error:", error);
    });

    ws.on("close", () => {
      console.log("User disconnected");
      if (currentUser) {
        connections.delete(currentUser);
      }
    });

    function handleJoinSession(ws: WebSocket, message: JoinSessionMessage) {
      const { username } = message;
      if (connections.has(username)) {
        ws.send(
          JSON.stringify({ type: "error", message: "Username already taken" })
        );
        return;
      }
      connections.set(username, ws);
      currentUser = username;
      sendCurrentSong(ws);
    }

    function handleLeaveSession(message: LeaveSessionMessage) {
      if (currentUser) {
        connections.delete(currentUser);
      }
      currentUser = undefined;
    }

    async function handleSongSelected(message: UpdateSongMessage) {
      const { songId } = message;
      if (songId) {
        try {
          currentSong = await fetchSongFromFile(songId);
        } catch (error) {
          console.error("Error fetching song:", error);
          return;
        }
      } else {
        currentSong = undefined;
      }
      broadcastCurrentSong();
    }
  });

  wss.on("error", (error: Error) => {
    console.error("WebSocket server error:", error);
  });

  function sendCurrentSong(ws: WebSocket) {
    if (currentSong) {
      ws.send(JSON.stringify({ type: "songSelected", data: currentSong }));
    } else {
      ws.send(JSON.stringify({ type: "noSongSelected" }));
    }
  }

  function broadcastCurrentSong() {
    const message = JSON.stringify({
      type: "songSelected",
      data: currentSong || null,
    });
    connections.forEach((connection) => {
      connection.send(message);
    });
  }

  async function fetchSongFromFile(songId: string): Promise<Song> {
    return new Promise((resolve, reject) => {
      const filePath = path.join(songsFilePath, `${songId}.json`);
      fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const songData = JSON.parse(data);
          resolve(songData);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }
};

export default startWebSocketServer;
