import { prisma } from "@/lib/prismaClient";
import { hash } from "bcrypt";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, email, password, firstName, lastName, passwordRepeated } =
      req.body;
    if (password !== passwordRepeated) {
      res.status(400).json({ error: "Passwords do not match." });
      return;
    }
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });
    if (user) {
      res.status(400).json({ error: "User already exists." });
      return;
    }
    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: `${String(firstName).trim()} ${String(lastName).trim()}`,
      },
    });
    if (!newUser) {
      res.status(500).json({ error: "Failed to create user." });
      return;
    }
    res.status(201).json({ message: "User created." });
  } else {
    res.status(405).end();
  }
}
