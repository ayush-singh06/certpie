-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "recipientName" TEXT NOT NULL,
    "recipientId" TEXT,
    "organizationName" TEXT NOT NULL,
    "organizationLogo" TEXT,
    "certificateTitle" TEXT NOT NULL,
    "description" TEXT,
    "dateOfIssue" TIMESTAMP(3) NOT NULL,
    "verificationDate" TIMESTAMP(3),
    "certificateImageUrl" TEXT,
    "certificatePdfUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'verified',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_certificateNumber_key" ON "certificates"("certificateNumber");
