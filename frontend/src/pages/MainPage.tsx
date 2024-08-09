import { useState, useEffect } from "react";
import { User, Song, ConnectedUser } from "../types";
import SongDisplay from "../components/SongDisplay";
import UserList from "../components/UserList";
import SongSearch from "../components/SongSearch";
import { SOCKET_URL } from "../config";

type MainPageProps = {
  user: User;
  onLogout: () => void;
};

const MainPage = ({ user, onLogout }: MainPageProps) => {
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
          if (Array.isArray(message.data) || message.data === null) {
            setCurrentSong(message.data);
          } else {
            console.error(
              "Received song data is not in the correct format:",
              message.data
            );
          }
          break;
        case "users":
          setConnectedUsers(message.data);
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

  const handleLogout = () => {
    if (socket) {
      socket.send(JSON.stringify({ type: "leaveSession" }));
      socket.close();
    }
    onLogout();
  };

  const handleSongSelect = (songId: string) => {
    if (socket && user.isAdmin) {
      socket.send(JSON.stringify({ type: "songSelected", songId }));
    }
  };

  const renderSongContent = () => {
    if (currentSong) {
      return (
        <SongDisplay song={currentSong} userInstrument={user.instrument} />
      );
    } else {
      if (user.isAdmin) {
        return <p>Please select a song:</p>;
      } else {
        return <p>Waiting for admin to pick a song...</p>;
      }
    }
  };

  return (
    <div>
      <h1>
        Welcome, {user.username}! your instrument: {user.instrument}
      </h1>
      <button onClick={handleLogout}>Logout</button>
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1 }}>
          {renderSongContent()}
          {user.isAdmin && !currentSong && (
            <SongSearch onSongSelect={handleSongSelect} />
          )}
          {user.isAdmin && currentSong && (
            <button onClick={() => handleSongSelect("")}>
              Choose Another Song
            </button>
          )}
        </div>
        <div style={{ width: "200px" }}>
          <UserList users={connectedUsers} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
