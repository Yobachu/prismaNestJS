/*
  Warnings:

  - You are about to drop the column `base` on the `material_characteristics` table. All the data in the column will be lost.
  - Added the required column `color` to the `material_characteristics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `manufacturer` to the `material_characteristics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material` to the `material_characteristics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `style` to the `material_characteristics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "material_characteristics" DROP COLUMN "base",
ADD COLUMN     "application" TEXT,
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "countryOfOrigin" TEXT,
ADD COLUMN     "manufacturer" TEXT NOT NULL,
ADD COLUMN     "material" TEXT NOT NULL,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "style" TEXT NOT NULL,
ADD COLUMN     "surface" TEXT,
ALTER COLUMN "length" DROP NOT NULL,
ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "thickness" DROP NOT NULL;
