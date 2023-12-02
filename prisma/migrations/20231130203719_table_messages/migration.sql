-- CreateTable
CREATE TABLE `messages` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProject` INTEGER NOT NULL,
    `message` LONGTEXT NOT NULL,
    `sender` VARCHAR(255) NOT NULL,
    `sentDate` DATETIME(3) NOT NULL,
    `attatchment` TINYTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_idProject_fkey` FOREIGN KEY (`idProject`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
