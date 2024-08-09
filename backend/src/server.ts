import { connectToMongoDB } from "./config/mongoDB";
import { WebSocketServer } from "ws";
import express from "express";
import http from "http";
import startWebSocketServer from "./config/websocketServer";
import authRoutes from "./routes/auth";
import searchRoutes from "./routes/search";
import cors from "cors";
import path from "path";

const PORT: number = Number(process.env.PORT) || 8080;

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const corsOptions = {
  origin: [
    "http://jamoveo.ddns.net:8080",
    "http://localhost:5173",
    "http://localhost:8080",
  ],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());
app.use("/search", searchRoutes);
app.use("/auth", authRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist", "index.html"));
});

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
