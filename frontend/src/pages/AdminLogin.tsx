import React, { useState } from "react";
import { User } from "../types";
import { auth } from "../utils/api";

type AdminLoginProps = {
  onLogin: (user: User) => void;
};

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const user = await auth.login(username, password, true);
    if (user) {
      if (user.isAdmin) {
        onLogin(user);
      } else {
        setError("Not an admin user. Please use admin credentials.");
      }
    } else {
      setError("Admin login failed. Please check your credentials.");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <h2 className="form-title">Admin Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Admin Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin Password"
              required
            />
          </div>
          <button type="submit" className="button button--full-width">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
