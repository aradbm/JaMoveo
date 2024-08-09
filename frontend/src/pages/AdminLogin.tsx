// src/components/AdminLogin.tsx
import React, { useState } from "react";
import { User } from "../types";
import { API_URL } from "../config";
interface AdminLoginProps {
  onLogin: (user: User) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(API_URL + "/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      console.log(response);
      if (response.ok) {
        const user = await response.json();
        console.log("Server response:", user);

        if (user.isAdmin) {
          onLogin(user);
        } else {
          console.error("Not an admin user");
        }
      } else {
        console.error("Admin login failed");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Admin Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin Password"
          required
        />
        <button type="submit">Login as Admin</button>
      </form>
    </div>
  );
};

export default AdminLogin;
