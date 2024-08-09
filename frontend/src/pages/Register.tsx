import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Instrument } from "../types";
import { API_URL } from "../config";
import Logo from "../components/Logo";

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
        console.error("Registration failed");
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <Logo />
        <h2 className="form-title">Register to JaMoveo</h2>
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
          <div className="input-group">
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
          </div>
          <button type="submit" className="submit-button">
            Register
          </button>
        </form>
        <div className="link-text">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
