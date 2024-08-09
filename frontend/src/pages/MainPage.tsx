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
        return <p>Search for a song (lyrics based):</p>;
      } else {
        return <p>Waiting for admin to pick a song...</p>;
      }
    }
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="header-content">
          <h1>Welcome, {user.username}!</h1>
          <p>Your instrument: {user.instrument}</p>
        </div>
        <button onClick={onLogout}>Logout</button>
      </header>
      <div className="main-content">
        <div className="song-section">
          {renderSongContent()}
          {user.isAdmin && !currentSong && (
            <SongSearch onSongSelect={handleSongSelect} />
          )}
          {user.isAdmin && currentSong && (
            <button
              onClick={() => handleSongSelect("")}
              className="change-song-button"
            >
              Choose Another Song
            </button>
          )}
        </div>
        <div className="user-list-section">
          <UserList users={connectedUsers} />
        </div>
      </div>
    </div>
  );
};
export default MainPage;
