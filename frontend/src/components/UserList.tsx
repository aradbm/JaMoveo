// src/components/UserList.tsx
import { ConnectedUser, Instrument } from "../types";
import "./UserList.css";
import {
  GiSaxophone,
  GiGuitar,
  GiDrumKit,
  GiMicrophone,
  GiGrandPiano,
  GiGuitarBassHead,
} from "react-icons/gi";

type UserListProps = {
  users: ConnectedUser[];
};

const instrumentIcons: Record<Instrument, React.ComponentType> = {
  guitar: GiGuitar,
  bass: GiGuitarBassHead,
  drums: GiDrumKit,
  vocals: GiMicrophone,
  keyboard: GiGrandPiano,
  saxophone: GiSaxophone,
};

const instrumentColors: Record<Instrument, string> = {
  guitar: "#e74c3c",
  bass: "#3498db",
  drums: "#f39c12",
  vocals: "#9b59b6",
  keyboard: "#1abc9c",
  saxophone: "#e67e22",
};

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="user-list">
      <h3>Connected Users</h3>
      <ul>
        {users.map((user, index) => {
          const [username, instrument] = user;
          const IconComponent = instrumentIcons[instrument as Instrument];
          const color = instrumentColors[instrument as Instrument];
          return (
            <li key={index} className="user-item">
              <div className="user-avatar" style={{ backgroundColor: color }}>
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="username">{username}</span>
              {IconComponent && (
                <span className="instrument-icon-wrapper" style={{ color }}>
                  <IconComponent />
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserList;
