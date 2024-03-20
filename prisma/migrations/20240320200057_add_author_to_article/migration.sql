/*
  Warnings:

  - Added the required column `authorId` to the `articles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "authorId" INTEGER NOT NULL,
ALTER COLUMN "slug" DROP NOT NULL,
ALTER COLUMN "favoritesCount" DROP NOT NULL,
ALTER COLUMN "favoritesCount" SET DEFAULT 0;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
