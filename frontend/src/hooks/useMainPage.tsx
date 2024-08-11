import { useState, useEffect } from "react";
import { User, Song, ConnectedUser } from "../types";
import { SOCKET_URL } from "../config";

export const useMainPage = (user: User) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<ConnectedUser[]>([]);
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);

    ws.onopen = () => {
      console.log("WebSocket connected");
      ws.send(JSON.stringify({ type: "joinSession", username: user.username }));
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      switch (message.type) {
        case "songSelected":
          if (message.data === null) {
            setCurrentSong(null);
            return;
          }
          let songContent = message.data.content;
          if (Array.isArray(songContent) || songContent === null) {
            setCurrentSong(songContent);
          } else {
            console.error(
              "Received song data is not in the correct format:",
              songContent
            );
          }
          break;
        case "users":
          setConnectedUsers(message.data);
          break;
        case "error":
          console.error("WebSocket error:", message.message);
          if (message.message === "User already in") window.location.reload();
          socket?.close();
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [user.username]);

  const handleSongSelect = (songId: string) => {
    if (socket && user.isAdmin) {
      socket.send(JSON.stringify({ type: "songSelected", songId }));
    }
  };

  return {
    currentSong,
    connectedUsers,
    handleSongSelect,
  };
};
