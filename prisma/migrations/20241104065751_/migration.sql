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
    "program1StartTime" TEXT,
    "program1EndTime" TEXT,
    "program2StartTime" TEXT,
    "program2EndTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "fixed_usage_day_of_weeks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_fixed_usage_day_of_weeks" ("createdAt", "dayOfWeek", "endTime", "id", "month", "needPickup", "program1EndTime", "program1StartTime", "program2EndTime", "program2StartTime", "startTime", "studentId", "updatedAt") SELECT "createdAt", "dayOfWeek", "endTime", "id", "month", "needPickup", "program1EndTime", "program1StartTime", "program2EndTime", "program2StartTime", "startTime", "studentId", "updatedAt" FROM "fixed_usage_day_of_weeks";
DROP TABLE "fixed_usage_day_of_weeks";
ALTER TABLE "new_fixed_usage_day_of_weeks" RENAME TO "fixed_usage_day_of_weeks";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
