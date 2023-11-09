-- DropIndex
DROP INDEX `customers_cnpj_email_phone_idx` ON `customers`;

-- AlterTable
ALTER TABLE `customers` MODIFY `phone` VARCHAR(255) NULL,
    MODIFY `email` VARCHAR(255) NULL;

-- CreateTable
CREATE TABLE `contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `idCustomer` INTEGER NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `customers_cnpj_idx` ON `customers`(`cnpj`);

-- AddForeignKey
ALTER TABLE `contacts` ADD CONSTRAINT `contacts_idCustomer_fkey` FOREIGN KEY (`idCustomer`) REFERENCES `customers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
