import SongDisplay from "../components/SongDisplay";
import UserList from "../components/UserList";
import SongSearch from "../components/SongSearch";
import Live from "../components/Live";
import { User } from "../types";
import { useMainPage } from "../hooks/useMainPage";

type MainPageProps = {
  user: User;
  onLogout: () => void;
};

const MainPage = ({ user, onLogout }: MainPageProps) => {
  const { currentSong, connectedUsers, handleSongSelect } = useMainPage(user);

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

  const renderChooseSongButton = () => {
    if (currentSong) {
      if (user.isAdmin) {
        return (
          <button
            onClick={() => handleSongSelect("")}
            className="button button--full-width"
          >
            Choose Another Song
          </button>
        );
      } else {
        return <Live />;
      }
    }
    return null;
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <div className="header-content">
          <h1>Welcome, {user.username}!</h1>
          <p>Your instrument: {user.instrument}</p>
        </div>
        <button onClick={onLogout} className="button button--outline">
          Logout
        </button>
      </header>
      <div className="main-content">
        <div className="song-section">
          {renderSongContent()}
          {user.isAdmin && !currentSong && (
            <SongSearch onSongSelect={handleSongSelect as any} />
          )}
        </div>
        <div className="user-list-section">
          {renderChooseSongButton()}
          <UserList users={connectedUsers} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
