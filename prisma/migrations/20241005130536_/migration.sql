-- CreateTable
CREATE TABLE "programs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "fixed_usage_day_of_weeks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "needPickup" BOOLEAN NOT NULL,
    "program1StartTime" TEXT,
    "program1EndTime" TEXT,
    "program2StartTime" TEXT,
    "program2EndTime" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "fixed_usage_day_of_weeks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_FixedUsageDayOfWeekToProgram" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_FixedUsageDayOfWeekToProgram_A_fkey" FOREIGN KEY ("A") REFERENCES "fixed_usage_day_of_weeks" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_FixedUsageDayOfWeekToProgram_B_fkey" FOREIGN KEY ("B") REFERENCES "programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_FixedUsageDayOfWeekToProgram_AB_unique" ON "_FixedUsageDayOfWeekToProgram"("A", "B");

-- CreateIndex
CREATE INDEX "_FixedUsageDayOfWeekToProgram_B_index" ON "_FixedUsageDayOfWeekToProgram"("B");
