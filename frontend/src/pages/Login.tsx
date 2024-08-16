import React, { useState } from "react";
import Logo from "../components/Logo";
import { Link } from "react-router-dom";
import { User } from "../types";
import { auth } from "../utils/api";

type LoginProps = {
  onLogin: (user: User) => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = await auth.login(username, password);
    if (user) {
      onLogin(user);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <Logo />
        <h2 className="form-title">Login to Jamoveo</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="button button--full-width">
            Login
          </button>
        </form>
        <div className="link-text">
          New to Jamoveo? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
