/*
  Warnings:

  - You are about to drop the `AIMessage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AIMessage" DROP CONSTRAINT "AIMessage_chatMessageId_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "reply" TEXT;

-- DropTable
DROP TABLE "AIMessage";
