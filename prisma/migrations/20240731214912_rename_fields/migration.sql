/*
  Warnings:

  - You are about to drop the column `content` on the `Form` table. All the data in the column will be lost.
  - You are about to drop the `FormSubmissions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FormSubmissions" DROP CONSTRAINT "FormSubmissions_formId_fkey";

-- AlterTable
ALTER TABLE "Form" DROP COLUMN "content",
ADD COLUMN     "jsonform" TEXT NOT NULL DEFAULT '';

-- DropTable
DROP TABLE "FormSubmissions";

-- CreateTable
CREATE TABLE "FormSubmission" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submission" TEXT NOT NULL,

    CONSTRAINT "FormSubmission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FormSubmission" ADD CONSTRAINT "FormSubmission_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
