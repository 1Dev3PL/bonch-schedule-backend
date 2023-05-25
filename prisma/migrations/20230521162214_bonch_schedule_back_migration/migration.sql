-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "avatar" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" SERIAL NOT NULL,
    "faculty" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "dayOfWeek" TEXT NOT NULL,
    "pairNum" TEXT NOT NULL,
    "pairStart" TEXT NOT NULL,
    "pairEnd" TEXT NOT NULL,
    "pairTitle" TEXT NOT NULL,
    "teacher" TEXT NOT NULL,
    "auditory" TEXT NOT NULL,
    "pairType" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
