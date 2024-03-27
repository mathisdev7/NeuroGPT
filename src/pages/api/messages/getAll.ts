import { prisma } from "@/lib/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const session = await auth(req, res);
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const chatMessage = await prisma.chatMessage.findMany({
      where: {
        userId: user?.id as string,
      },
    });
    if (!chatMessage) {
      return res.status(404).json({ message: "No chat found" });
    }
    res.status(200).json(chatMessage);
  } else {
    res.status(405).end();
  }
}
