-- AlterTable
ALTER TABLE "AppointmentPatientDoctor" ADD COLUMN     "message" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Submitted';
