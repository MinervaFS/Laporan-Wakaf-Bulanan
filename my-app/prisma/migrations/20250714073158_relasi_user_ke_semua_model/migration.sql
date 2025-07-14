-- AlterTable
ALTER TABLE `digitalisasidok` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `infoumum` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `inventarisasi` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `kepatuhanhukum` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `pelaporantransaparasi` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `pemanfaatanasset` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `pengelolaanasset` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `pengelolaanresiko` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `penilaianassetwakaf` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `peningkatankapasitassdm` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `rangkumanrekomendasi` ADD COLUMN `userId` INTEGER NULL;

-- AlterTable
ALTER TABLE `sisteminformasiteknologi` ADD COLUMN `userId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `infoumum` ADD CONSTRAINT `infoumum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inventarisasi` ADD CONSTRAINT `inventarisasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digitalisasidok` ADD CONSTRAINT `digitalisasidok_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kepatuhanhukum` ADD CONSTRAINT `kepatuhanhukum_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pelaporantransaparasi` ADD CONSTRAINT `pelaporantransaparasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pemanfaatanasset` ADD CONSTRAINT `pemanfaatanasset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengelolaanasset` ADD CONSTRAINT `pengelolaanasset_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pengelolaanresiko` ADD CONSTRAINT `pengelolaanresiko_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `penilaianassetwakaf` ADD CONSTRAINT `penilaianassetwakaf_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `peningkatankapasitassdm` ADD CONSTRAINT `peningkatankapasitassdm_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rangkumanrekomendasi` ADD CONSTRAINT `rangkumanrekomendasi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sisteminformasiteknologi` ADD CONSTRAINT `sisteminformasiteknologi_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
