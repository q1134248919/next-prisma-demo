/*
  Warnings:

  - You are about to drop the column `assignedAt` on the `categories_on_posts` table. All the data in the column will be lost.
  - You are about to drop the column `assignedBy` on the `categories_on_posts` table. All the data in the column will be lost.
  - Added the required column `assignedBy` to the `post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories_on_posts" DROP COLUMN "assignedAt",
DROP COLUMN "assignedBy";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "post" ADD COLUMN     "assignedBy" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
