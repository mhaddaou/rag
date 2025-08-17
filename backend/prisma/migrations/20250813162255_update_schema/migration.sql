/*
  Warnings:

  - You are about to drop the column `create_at` on the `Message` table. All the data in the column will be lost.
  - Changed the type of `content` on the `Doc` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Doc" DROP COLUMN "content",
ADD COLUMN     "content" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "create_at",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
