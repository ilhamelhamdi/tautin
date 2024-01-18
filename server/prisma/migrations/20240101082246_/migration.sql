/*
  Warnings:

  - The primary key for the `Url` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[short]` on the table `Url` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Url" DROP CONSTRAINT "Url_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Url_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Url_short_key" ON "Url"("short");
