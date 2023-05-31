-- CreateTable
CREATE TABLE "Groups" (
    "id" SERIAL NOT NULL,
    "groupId" INTEGER NOT NULL,
    "group" TEXT NOT NULL,
    "faculty" TEXT NOT NULL,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Groups_groupId_key" ON "Groups"("groupId");
