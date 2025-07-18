-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'director') NOT NULL DEFAULT 'admin';
