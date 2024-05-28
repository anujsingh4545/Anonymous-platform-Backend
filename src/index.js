import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app); // Socket.IO needs a raw HTTP server to work, and Express alone does not provide that.

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("New socket", socket.id);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
  socket.on("newFile", (data) => {
    // console.log("called");
    io.emit("newFile", data);
  });

  socket.on("upvote", (data) => {
    const { userId, postId, upvoterId, vote } = data;
    // console.log(data);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    io.emit(`${userId}upvote`, { postId, userId, upvoterId, time: formattedTime, date: formattedDate, vote });
  });
  socket.on("comment", (data) => {
    const { userId, postId, comment } = data;
    // console.log(data);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    io.emit(`${userId}comment`, { postId, userId, comment, time: formattedTime, date: formattedDate });
  });
  socket.on("Dcomment", (data) => {
    const { userId, postId, comment } = data;
    // console.log(data);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();
    io.emit(`${userId}Dcomment`, { postId, userId, comment, time: formattedTime, date: formattedDate });
  });
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json("Hello World");
});

server.listen(4000, () => {
  console.log("Hello from server");
});
