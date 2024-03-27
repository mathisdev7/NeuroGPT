import { prisma } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { chatId, message } = req.body;
    if (!chatId || !message) {
      return res
        .status(400)
        .json({ message: "ChatId and message are required" });
    }
    const chat = await prisma.chatMessage.findUnique({
      where: {
        id: chatId,
      },
    });
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    const newMessage = await prisma.message.create({
      data: {
        content: message as string,
        chatMessageId: chatId,
        userId: chat.userId,
      },
    });
    const chatData = {
      ...chat,
      message: newMessage,
    };
    res.status(200).json(chatData);
  } else {
    res.status(405).end();
  }
}
