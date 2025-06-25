/*
  Warnings:

  - The primary key for the `AudioFile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `AudioFile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `originalName` to the `AudioFile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `AudioFile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AudioFile" DROP CONSTRAINT "AudioFile_pkey",
ADD COLUMN     "originalName" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id");
