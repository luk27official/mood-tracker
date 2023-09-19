-- CreateTable
CREATE TABLE "MoodReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mood" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "userId" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "anythingNew" TEXT NOT NULL,
    CONSTRAINT "MoodReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
