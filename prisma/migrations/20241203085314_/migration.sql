-- AlterTable
ALTER TABLE "fixed_usage_day_of_weeks" ADD COLUMN     "program3EndTime" TEXT,
ADD COLUMN     "program3Id" TEXT,
ADD COLUMN     "program3StartTime" TEXT;

-- AddForeignKey
ALTER TABLE "fixed_usage_day_of_weeks" ADD CONSTRAINT "fixed_usage_day_of_weeks_program3Id_fkey" FOREIGN KEY ("program3Id") REFERENCES "programs"("id") ON DELETE SET NULL ON UPDATE CASCADE;
