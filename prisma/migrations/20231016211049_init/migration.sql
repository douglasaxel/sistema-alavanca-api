-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `role` ENUM('MASTER', 'ADMIN', 'CUSTOMER', 'BASIC') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `cnpj` VARCHAR(255) NOT NULL,
    `accountable` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `customers_phone_key`(`phone`),
    UNIQUE INDEX `customers_email_key`(`email`),
    UNIQUE INDEX `customers_cnpj_key`(`cnpj`),
    INDEX `customers_cnpj_email_phone_idx`(`cnpj`, `email`, `phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCustomer` INTEGER NULL,
    `name` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `accountable` VARCHAR(255) NOT NULL,
    `value` DOUBLE NOT NULL,
    `airtableUrl` VARCHAR(255) NOT NULL,
    `airtableIframeUrl` VARCHAR(100) NOT NULL,
    `status` ENUM('FINISHED', 'PENDING', 'LATE') NOT NULL DEFAULT 'PENDING',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `collaborators` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `collaborators_email_key`(`email`),
    INDEX `collaborators_email_idx`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CollaboratorToProject` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CollaboratorToProject_AB_unique`(`A`, `B`),
    INDEX `_CollaboratorToProject_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `customers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CollaboratorToProject` ADD CONSTRAINT `_CollaboratorToProject_A_fkey` FOREIGN KEY (`A`) REFERENCES `collaborators`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CollaboratorToProject` ADD CONSTRAINT `_CollaboratorToProject_B_fkey` FOREIGN KEY (`B`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
