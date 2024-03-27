import { prisma } from "@/lib/prismaClient";
import { auth } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const session = await auth(req, res);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const chatMessage = await prisma.chatMessage.create({
      data: {
        title: message.split(" ").slice(0, 3).join(" "),
        userId: user?.id,
      },
    });
    const newMessage = await prisma.message.create({
      data: {
        content: message as string,
        chatMessageId: chatMessage.id,
        userId: user.id,
      },
    });
    const chatData = {
      chatMessage,
      message: newMessage,
    };
    res.status(200).json(chatData);
  } else {
    res.status(405).end();
  }
}
