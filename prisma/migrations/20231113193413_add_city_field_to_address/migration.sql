/*
  Warnings:

  - Added the required column `city` to the `address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` ADD COLUMN `city` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `contacts` ADD COLUMN `idAddress` INTEGER NULL;
