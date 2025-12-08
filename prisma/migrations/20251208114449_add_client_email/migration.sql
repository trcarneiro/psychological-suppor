-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `clientEmail` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Lead` ADD COLUMN `cep` VARCHAR(191) NULL;
