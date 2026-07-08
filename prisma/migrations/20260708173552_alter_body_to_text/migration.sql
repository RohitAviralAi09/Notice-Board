/*
  Warnings:

  - You are about to alter the column `category` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `priority` on the `Notice` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `Notice` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `body` TEXT NOT NULL,
    MODIFY `category` VARCHAR(100) NOT NULL,
    MODIFY `priority` VARCHAR(50) NOT NULL,
    MODIFY `image` TEXT NULL;
