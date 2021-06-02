import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { log } from "./modules/logger";
import "dotenv/config";

const app: express.Application = express();

app.use(cors());
app.use(helmet());
app.use(morgan("short"));

const httpServer = createServer(app);
const io = new Server(httpServer);

let presenter;
io.on("connection", (socket: Socket) => {
  socket.on("presenter", () => {
    presenter = socket.id;
    socket.broadcast.emit("presenter");
  });
  socket.on("watcher", () => {
    socket.to(presenter).emit("watcher", socket.id);
  });

  socket.on("offer", (id, message) => {
    socket.to(id).emit("offer", socket.id, message);
  });
  socket.on("answer", (id, message) => {
    socket.to(id).emit("answer", socket.id, message);
  });
  socket.on("candidate", (id, message) => {
    socket.to(id).emit("candidate", socket.id, message);
  });

  socket.on("stop", () => {
    socket.broadcast.emit("stop");
  });

  socket.on("disconnect", () => {
    if (presenter === socket.id) socket.broadcast.emit("stop");
    socket.to(presenter).emit("disconnectPeer", socket.id);
  });
});

httpServer.listen(3000, () => {
  log.i(`Listening on ${process.env.HTTP_HOST || "localhost"}:${process.env.HTTP_PORT || 3000}`);
});

// app.listen(process.env.HTTP_PORT || 3000, () => {
//   log.i(`Listening on http://${process.env.HTTP_HOST || "localhost"}:${process.env.HTTP_PORT || 3000}`);
// });
