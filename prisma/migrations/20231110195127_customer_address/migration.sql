-- AlterTable
ALTER TABLE `customers` ADD COLUMN `companyName` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCustomer` INTEGER NOT NULL,
    `zipCode` VARCHAR(30) NOT NULL,
    `street` VARCHAR(255) NOT NULL,
    `number` INTEGER NOT NULL,
    `complement` VARCHAR(255) NOT NULL,
    `neighborhood` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `country` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
