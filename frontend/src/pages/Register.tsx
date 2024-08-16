import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Instrument } from "../types";
import { auth } from "../utils/api";
import { validateUsername, validatePassword } from "../utils/validation";
import Logo from "../components/Logo";

type RegisterProps = {
  onRegister: (user: User) => void;
};

const Register = ({ onRegister }: RegisterProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [instrument, setInstrument] = useState<Instrument>("guitar");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate username
    const usernameError = validateUsername(username);
    if (usernameError) {
      setError(usernameError);
      return;
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    // If validation passes, proceed with registration
    const user = await auth.register(username, password, instrument);
    if (user) {
      onRegister(user);
    } else {
      setError("Registration failed");
    }
  };

  return (
    <div className="page-container">
      <div className="form-container">
        <Logo />
        <h2 className="form-title">Register to JaMoveo</h2>
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
          <button type="submit" className="button button--full-width">
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
