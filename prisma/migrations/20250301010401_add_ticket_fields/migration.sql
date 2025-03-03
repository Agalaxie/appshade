-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "category" TEXT NOT NULL DEFAULT 'other',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ftpHost" TEXT,
    "ftpPort" TEXT,
    "ftpUsername" TEXT,
    "ftpPassword" TEXT,
    "cmsType" TEXT,
    "cmsUrl" TEXT,
    "cmsUsername" TEXT,
    "cmsPassword" TEXT,
    "hostingProvider" TEXT,
    "hostingPlan" TEXT,
    "userId" TEXT NOT NULL,
    "assignedToId" TEXT,
    CONSTRAINT "Ticket_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("assignedToId", "category", "createdAt", "description", "id", "priority", "status", "title", "updatedAt", "userId") SELECT "assignedToId", "category", "createdAt", "description", "id", "priority", "status", "title", "updatedAt", "userId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE INDEX "Ticket_userId_idx" ON "Ticket"("userId");
CREATE INDEX "Ticket_assignedToId_idx" ON "Ticket"("assignedToId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
