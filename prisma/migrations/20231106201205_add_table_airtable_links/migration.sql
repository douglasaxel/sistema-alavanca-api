-- CreateTable
CREATE TABLE `airtable_links` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idProject` INTEGER NOT NULL,
    `url` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `airtable_links` ADD CONSTRAINT `airtable_links_idProject_fkey` FOREIGN KEY (`idProject`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
