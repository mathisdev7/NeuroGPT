import { prisma } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = req.query.id as string;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }
    const chatMessage = await prisma.chatMessage.findUnique({
      where: {
        id,
      },
    });
    if (!chatMessage) {
      return res.status(404).json({ message: "No chat found" });
    }
    const messages = await prisma.message.findMany({
      where: {
        chatMessageId: id,
      },
      include: {
        user: true,
      },
    });
    const chatData = {
      ...chatMessage,
      messages,
    };
    res.status(200).json(chatData);
  } else {
    res.status(405).end();
  }
}
