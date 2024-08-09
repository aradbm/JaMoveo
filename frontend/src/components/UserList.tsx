import { ConnectedUser } from "../types";

type UserListProps = {
  users: ConnectedUser[];
};

const UserList = ({ users }: UserListProps) => {
  console.log(users);
  return (
    <div>
      <h3>Connected Users</h3>
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user[0]} - {user[1]}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
