import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types";
import { API_URL } from "../config";
import Logo from "../components/Logo";

type LoginProps = {
  onLogin: (user: User) => void;
};

const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, isAdmin: false }),
      });
      if (response.ok) {
        const user = await response.json();
        onLogin(user);
      } else {
        // Handle login error
        console.error("Login failed");
        setError("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred while logging in");
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
