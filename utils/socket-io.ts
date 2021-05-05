import { Socket } from "socket.io";
import * as http from "http";

let io: any;

export const socketConnection = (server: http.Server) => {
  io = require("socket.io")(server);
  io.on("connection", (socket: Socket) => {
    console.log(`Client connected [id=${socket.id}]`);
    socket.on("join", async ({ user, room }, callback) => {
      socket.join(room);
    });
    socket.on("disconnect", () => {
      console.info(`Client disconnected [id=${socket.id}]`);
    });
  });
};

export const sendMessage = (key: string, message: string) =>
  io.emit(key, { text: message });
