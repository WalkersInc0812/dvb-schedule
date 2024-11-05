/*
  Warnings:

  - You are about to drop the `_FixedUsageDayOfWeekToProgram` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "_FixedUsageDayOfWeekToProgram_B_index";

-- DropIndex
DROP INDEX "_FixedUsageDayOfWeekToProgram_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_FixedUsageDayOfWeekToProgram";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_fixed_usage_day_of_weeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT,
    "endTime" TEXT,
    "needPickup" BOOLEAN NOT NULL,
    "program1Id" TEXT,
    "program1StartTime" TEXT,
    "program1EndTime" TEXT,
    "program2Id" TEXT,
    "program2StartTime" TEXT,
    "program2EndTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "fixed_usage_day_of_weeks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "fixed_usage_day_of_weeks_program1Id_fkey" FOREIGN KEY ("program1Id") REFERENCES "programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "fixed_usage_day_of_weeks_program2Id_fkey" FOREIGN KEY ("program2Id") REFERENCES "programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_fixed_usage_day_of_weeks" ("createdAt", "dayOfWeek", "endTime", "id", "month", "needPickup", "program1EndTime", "program1StartTime", "program2EndTime", "program2StartTime", "startTime", "studentId", "updatedAt") SELECT "createdAt", "dayOfWeek", "endTime", "id", "month", "needPickup", "program1EndTime", "program1StartTime", "program2EndTime", "program2StartTime", "startTime", "studentId", "updatedAt" FROM "fixed_usage_day_of_weeks";
DROP TABLE "fixed_usage_day_of_weeks";
ALTER TABLE "new_fixed_usage_day_of_weeks" RENAME TO "fixed_usage_day_of_weeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
