-- CreateTable
CREATE TABLE "AudioFile" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AudioFile_pkey" PRIMARY KEY ("id")
);
