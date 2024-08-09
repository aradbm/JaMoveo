// src/components/Register.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Instrument } from "../types";
import { API_URL } from "../config";

type RegisterProps = {
  onRegister: (user: User) => void;
};

const Register = ({ onRegister }: RegisterProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("guitar");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registering user...");
    try {
      const response = await fetch(API_URL + "/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, instrument }),
      });
      if (response.ok) {
        const user = await response.json();
        onRegister(user);
      } else {
        // Handle registration error
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select
          value={instrument}
          onChange={(e) => setInstrument(e.target.value as Instrument)}
          required
        >
          <option value="guitar">Guitar</option>
          <option value="bass">Bass</option>
          <option value="drums">Drums</option>
          <option value="vocals">Vocals</option>
          <option value="keyboard">Keyboard</option>
          <option value="saxophone">Saxophone</option>
        </select>
        <button type="submit">Register</button>
      </form>
      <Link to="/login">Login</Link>
    </div>
  );
};

export default Register;
