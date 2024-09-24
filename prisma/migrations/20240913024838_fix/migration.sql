/*
  Warnings:

  - You are about to drop the column `identifier` on the `VerificationRequest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `VerificationRequest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `VerificationRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `VerificationRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "VerificationRequest_identifier_token_key";

-- AlterTable
ALTER TABLE "VerificationRequest" DROP COLUMN "identifier",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "VerificationRequest_email_key" ON "VerificationRequest"("email");
