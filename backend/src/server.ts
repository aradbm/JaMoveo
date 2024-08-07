import { connectToMongoDB } from "./config/mongoDB";
import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import startWebSocketServer from "./config/websocketServer";
import authRoutes from "./routes/auth";
import searchRoutes from "./routes/search";
const PORT: number = Number(process.env.PORT) || 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.json());
app.use("/search", searchRoutes);
app.use("/auth", authRoutes);

const startServer = async () => {
  try {
    await connectToMongoDB();
    startWebSocketServer(wss);

    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`WebSocket server available at ws://localhost:${PORT}`);
      console.log(`HTTP server available at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("------------Error starting server------------\n", error);
    process.exit(1);
  }
};

startServer();
