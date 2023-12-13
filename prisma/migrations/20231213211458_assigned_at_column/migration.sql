-- AlterTable
ALTER TABLE `collaborator_to_project` ADD COLUMN `assignedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
