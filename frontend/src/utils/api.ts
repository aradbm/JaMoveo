import { API_URL } from "../config";
import { encryptPassword } from "./encryption";
import { User, Instrument } from "../types";

export const auth = {
  login: async (
    username: string,
    password: string,
    isAdmin: boolean = false
  ): Promise<User | null> => {
    try {
      const encryptedPassword = encryptPassword(password);
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, encryptedPassword, isAdmin }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error during login:", error);
      return null;
    }
  },

  register: async (
    username: string,
    password: string,
    instrument: Instrument
  ): Promise<User | null> => {
    try {
      const encryptedPassword = encryptPassword(password);
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, encryptedPassword, instrument }),
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error during registration:", error);
      return null;
    }
  },
};
