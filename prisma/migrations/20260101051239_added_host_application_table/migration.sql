-- CreateEnum
CREATE TYPE "ActiveRole" AS ENUM ('TOURIST', 'HOST');

-- CreateEnum
CREATE TYPE "HostApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'BOTH';

-- CreateTable
CREATE TABLE "host_applications" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "status" "HostApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "host_applications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "host_applications_userId_key" ON "host_applications"("userId");

-- AddForeignKey
ALTER TABLE "host_applications" ADD CONSTRAINT "host_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
