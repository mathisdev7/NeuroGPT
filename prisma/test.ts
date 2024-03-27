import { prisma } from "@/lib/prismaClient";
import { hash } from "bcrypt";

async function main() {
  return await prisma.$executeRaw`TRUNCATE "ChatMessage", "Message" CASCADE;`;
  const hashedPassword = await hash("test123", 10);
  const newUser = await prisma.user.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      password: hashedPassword,
    },
  });
  console.log("New user created:", newUser);

  const allUsers = await prisma.user.findMany();
  console.log("All users:", allUsers);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
