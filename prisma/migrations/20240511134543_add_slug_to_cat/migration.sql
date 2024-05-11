/*
  Warnings:

  - A unique constraint covering the columns `[slugCt]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "slugCt" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "categories_slugCt_key" ON "categories"("slugCt");
