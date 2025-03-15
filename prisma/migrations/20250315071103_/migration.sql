/*
  Warnings:

  - You are about to drop the column `parentId` on the `students` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "_StudentToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToUser_AB_unique" ON "_StudentToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToUser_B_index" ON "_StudentToUser"("B");

-- AddForeignKey
ALTER TABLE "_StudentToUser" ADD CONSTRAINT "_StudentToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToUser" ADD CONSTRAINT "_StudentToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Copy to StudentToUser 
INSERT INTO "_StudentToUser" ("A", "B") SELECT "id", "parentId" FROM "students";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_parentId_fkey";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "parentId";