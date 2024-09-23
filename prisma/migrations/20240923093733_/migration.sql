-- CreateTable
CREATE TABLE "meal_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "activeFromDate" TEXT NOT NULL,
    "activeToDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "meal_settings_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "schedule_editable_periods" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "targetMonth" TEXT NOT NULL,
    "fromDate" TEXT NOT NULL,
    "toDate" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "schedule_editable_periods_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "facilityId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "displayStartMonth" TEXT NOT NULL,
    "displayEndMonth" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "announcements_facilityId_fkey" FOREIGN KEY ("facilityId") REFERENCES "facilities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
