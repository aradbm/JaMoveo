import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLogin from "./pages/AdminLogin";
import MainPage from "./pages/MainPage";
import { User } from "./types";

const App = () => {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/" /> : <Register onRegister={handleLogin} />
          }
        />
        <Route
          path="/admin"
          element={
            user ? <Navigate to="/" /> : <AdminLogin onLogin={handleLogin} />
          }
        />
        <Route
          path="/"
          element={
            user ? (
              <MainPage user={user} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
