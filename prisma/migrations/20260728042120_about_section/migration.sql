-- CreateTable
CREATE TABLE "AboutSection" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "displayOrder" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "payload" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutSection_displayOrder_key" ON "AboutSection"("displayOrder");

-- CreateIndex
CREATE INDEX "AboutSection_displayOrder_idx" ON "AboutSection"("displayOrder");
