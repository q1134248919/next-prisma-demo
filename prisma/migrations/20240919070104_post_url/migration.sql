/*
  Warnings:

  - The `url` column on the `post` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "post" DROP COLUMN "url",
ADD COLUMN     "url" TEXT[];
