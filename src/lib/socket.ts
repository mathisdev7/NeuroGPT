import { prisma } from "@/lib/prismaClient";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { askAI } from "./askAI";

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NEXTAUTH_URL,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
server.listen(3010, () => {
  console.log("Socket.io server is running on port 3010");
});

io.on("connection", (socket) => {
  socket.on("ai prompting", async (promptMessage, messageId) => {
    const reply = await askAI(promptMessage);
    await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        reply: reply as string,
      },
    });
    socket.emit("ai prompted", reply);
  });
});
