/*
  Warnings:

  - You are about to drop the column `detectedLanguage` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `finalText` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `previewText` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `sourceLanguage` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `wasTranslated` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `languageCode` to the `Document` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "detectedLanguage",
DROP COLUMN "finalText",
DROP COLUMN "previewText",
DROP COLUMN "sourceLanguage",
DROP COLUMN "updatedAt",
DROP COLUMN "wasTranslated",
ADD COLUMN     "languageCode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt",
ADD COLUMN     "userName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");
