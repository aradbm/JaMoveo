const API_URL =
  import.meta.env.VITE_API_SERVER_LOCATION || "http://localhost:8080";
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_SERVER_LOCATION || "ws://localhost:8080";

export { API_URL, SOCKET_URL };
