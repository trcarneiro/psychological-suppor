-- CreateTable
CREATE TABLE `Conversation` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `agentId` VARCHAR(191) NOT NULL,
    `agentName` VARCHAR(191) NOT NULL,
    `agentSnapshot` JSON NOT NULL,
    `needsReferral` BOOLEAN NOT NULL DEFAULT false,
    `isConverted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `role` ENUM('user', 'assistant') NOT NULL,
    `content` LONGTEXT NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Lead` (
    `id` VARCHAR(191) NOT NULL,
    `conversationId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `mainConcern` LONGTEXT NULL,
    `emotionalState` ENUM('low', 'moderate', 'high', 'critical') NULL,
    `urgencyLevel` INTEGER NULL,
    `symptoms` JSON NULL,
    `duration` VARCHAR(191) NULL,
    `previousTherapy` BOOLEAN NULL,
    `preferredContact` ENUM('email', 'phone', 'whatsapp') NULL,
    `availability` VARCHAR(191) NULL,
    `budget` VARCHAR(191) NULL,
    `insuranceProvider` VARCHAR(191) NULL,
    `status` ENUM('new', 'contacted', 'scheduled', 'converted', 'lost') NOT NULL DEFAULT 'new',
    `score` INTEGER NOT NULL DEFAULT 0,
    `suggestedProfessional` VARCHAR(191) NULL,
    `notes` LONGTEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastActivity` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Lead_conversationId_key`(`conversationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agent` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `crp` VARCHAR(191) NOT NULL,
    `specialties` JSON NULL,
    `approach` VARCHAR(191) NULL,
    `experience` VARCHAR(191) NULL,
    `bio` LONGTEXT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `availability` JSON NULL,
    `priceRange` VARCHAR(191) NULL,
    `acceptsInsurance` BOOLEAN NOT NULL DEFAULT false,
    `insuranceProviders` JSON NULL,
    `photo` VARCHAR(191) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AIAgentConfig` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `personality` VARCHAR(191) NOT NULL,
    `description` LONGTEXT NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `systemPrompt` LONGTEXT NOT NULL,
    `greeting` LONGTEXT NOT NULL,
    `conversationStyle` VARCHAR(191) NOT NULL,
    `maxMessageLength` INTEGER NOT NULL,
    `responseDelay` INTEGER NOT NULL,
    `collectDataFields` JSON NOT NULL,
    `autoReferralThreshold` INTEGER NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `active` BOOLEAN NOT NULL,
    `color` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Lead` ADD CONSTRAINT `Lead_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `Conversation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
