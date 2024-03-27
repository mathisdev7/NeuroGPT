import { askAI } from "@/lib/askAI";
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
    const { prompt, messageId } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }
    const reply = await askAI(prompt);
    const newMessage = await prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        reply: reply as string,
      },
    });
    res.status(200).json(newMessage);
  } else {
    res.status(405).end();
  }
}
