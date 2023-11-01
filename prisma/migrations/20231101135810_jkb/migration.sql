-- CreateTable
CREATE TABLE "Notification" (
    "notificationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "targetRole" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notificationId")
);
