/*
  Warnings:

  - You are about to drop the column `bio` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_userId_fkey";

-- DropForeignKey
ALTER TABLE "hosts" DROP CONSTRAINT "hosts_userId_fkey";

-- DropForeignKey
ALTER TABLE "tourists" DROP CONSTRAINT "tourists_userId_fkey";

-- AlterTable
ALTER TABLE "admins" ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "bio",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hosts" ADD CONSTRAINT "hosts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tourists" ADD CONSTRAINT "tourists_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
