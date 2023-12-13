/*
  Warnings:

  - You are about to drop the `_collaborator_to_project` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_collaborator_to_project` DROP FOREIGN KEY `_collaborator_to_project_A_fkey`;

-- DropForeignKey
ALTER TABLE `_collaborator_to_project` DROP FOREIGN KEY `_collaborator_to_project_B_fkey`;

-- DropTable
DROP TABLE `_collaborator_to_project`;

-- CreateTable
CREATE TABLE `collaborator_to_project` (
    `idProject` INTEGER NOT NULL,
    `idCollaborator` INTEGER NOT NULL,

    PRIMARY KEY (`idProject`, `idCollaborator`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `collaborator_to_project` ADD CONSTRAINT `collaborator_to_project_idProject_fkey` FOREIGN KEY (`idProject`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `collaborator_to_project` ADD CONSTRAINT `collaborator_to_project_idCollaborator_fkey` FOREIGN KEY (`idCollaborator`) REFERENCES `collaborators`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
