/*
  Warnings:

  - You are about to drop the column `ResikoBary` on the `pengelolaanresiko` table. All the data in the column will be lost.
  - Added the required column `ResikoBaru` to the `pengelolaanresiko` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pengelolaanresiko` DROP COLUMN `ResikoBary`,
    ADD COLUMN `ResikoBaru` VARCHAR(191) NOT NULL;
