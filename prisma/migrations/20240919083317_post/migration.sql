/*
  Warnings:

  - You are about to drop the column `assignedBy` on the `post` table. All the data in the column will be lost.
  - You are about to drop the `categories_on_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "categories_on_posts" DROP CONSTRAINT "categories_on_posts_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "categories_on_posts" DROP CONSTRAINT "categories_on_posts_postId_fkey";

-- AlterTable
ALTER TABLE "post" DROP COLUMN "assignedBy";

-- DropTable
DROP TABLE "categories_on_posts";

-- CreateTable
CREATE TABLE "_CategoryToPost" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToPost_AB_unique" ON "_CategoryToPost"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToPost_B_index" ON "_CategoryToPost"("B");

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToPost" ADD CONSTRAINT "_CategoryToPost_B_fkey" FOREIGN KEY ("B") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;
