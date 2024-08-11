import fs from "fs";
import path from "path";
import User from "../models/user";
import { WebSocketServer, WebSocket } from "ws";
import { Song } from "../types/song";
import {
  Message,
  JoinSessionMessage,
  UpdateSongMessage,
} from "../types/weMessage";
import scrapeSong from "../utils/getSong";

const songsFilePath = path.join(__dirname, "../data");

const startWebSocketServer = (wss: WebSocketServer): void => {
  const connections = new Map<string, WebSocket>(); // username -> WebSocket
  const users = new Map<string, string>(); // username -> instrument
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
          handleJoinSession(userMessage as JoinSessionMessage);
          break;
        case "leaveSession":
          handleLeaveSession();
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
        if (connections.size === 0) {
          currentSong = undefined;
          broadcastCurrentSong();
        }
      }
      if (currentUser == "admin") {
        currentSong = undefined;
        broadcastCurrentSong();
      }
      handleLeaveSession();
    });

    async function handleJoinSession(message: JoinSessionMessage) {
      const { username } = message;
      if (connections.has(username)) {
        ws.send(JSON.stringify({ type: "error", message: "User already in" }));
        return;
      }
      connections.set(username, ws);

      currentUser = username;

      try {
        const user = await User.findByUsername(username);
        console.log("User found:", user);
        if (user) {
          users.set(username, user.instrument);
        }

        if (currentSong) {
          ws.send(JSON.stringify({ type: "songSelected", data: currentSong }));
        }

        broadcastCurrentUsers();
      } catch (error) {
        console.error("Error finding user:", error);
        ws.send(
          JSON.stringify({ type: "error", message: "Error joining session" })
        );
      }
    }

    function handleLeaveSession() {
      if (currentUser) {
        connections.delete(currentUser);
        users.delete(currentUser);
      }
      currentUser = undefined;
      broadcastCurrentUsers();
    }

    async function handleSongSelected(message: UpdateSongMessage) {
      const { songId } = message;
      
      if (songId) {
        try {
          // currentSong = await fetchSongFromFile(songId);
          let song = await scrapeSong(songId);
          currentSong = song;

          // console.log("Selected song:", currentSong);
        } catch (error) {
          console.error("Error fetching song:", error);
          return;
        }
      } else {
        currentSong = undefined;
      }
      broadcastCurrentSong();
      console.log("Broadcasted current song");
    }
  });

  wss.on("error", (error: Error) => {
    console.error("WebSocket server error:", error);
  });

  function broadcastCurrentSong() {
    const message = JSON.stringify({
      type: "songSelected",
      data: currentSong || null,
    });
    connections.forEach((connection) => {
      connection.send(message);
    });
  }

  function broadcastCurrentUsers() {
    const message = JSON.stringify({
      type: "users",
      data: Array.from(users.entries()),
    });
    connections.forEach((connection) => {
      connection.send(message);
    });
    console.log("Broadcasted current users:", users);
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
          const song: Song = {
            title: "SongTitle",
            artist: "SongArtist",
            content: songData,
          };
          resolve(song);
        } catch (parseErr) {
          reject(parseErr);
        }
      });
    });
  }
};

export default startWebSocketServer;
