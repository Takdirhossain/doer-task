/*
  Warnings:

  - The `class` column on the `students` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "students" DROP COLUMN "class",
ADD COLUMN     "class" INTEGER;

-- CreateIndex
CREATE INDEX "students_class_idx" ON "students"("class");
