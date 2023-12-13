/*
  Warnings:

  - You are about to drop the column `idProject` on the `collaborators` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `collaborators` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `collaborators` DROP FOREIGN KEY `collaborators_idProject_fkey`;

-- DropIndex
DROP INDEX `collaborators_idProject_email_idx` ON `collaborators`;

-- AlterTable
ALTER TABLE `collaborators` DROP COLUMN `idProject`;

-- CreateTable
CREATE TABLE `_collaborator_to_project` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_collaborator_to_project_AB_unique`(`A`, `B`),
    INDEX `_collaborator_to_project_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `collaborators_email_key` ON `collaborators`(`email`);

-- CreateIndex
CREATE INDEX `collaborators_email_idx` ON `collaborators`(`email`);

-- AddForeignKey
ALTER TABLE `_collaborator_to_project` ADD CONSTRAINT `_collaborator_to_project_A_fkey` FOREIGN KEY (`A`) REFERENCES `collaborators`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_collaborator_to_project` ADD CONSTRAINT `_collaborator_to_project_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
