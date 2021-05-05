import { Socket } from "socket.io";

let io: any;

export const socketConnection = (server: any) => {
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
