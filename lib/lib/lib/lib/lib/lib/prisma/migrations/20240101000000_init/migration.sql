-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "displayName" TEXT,
    "tonePreference" TEXT NOT NULL DEFAULT 'professional',
    "defaultScene" TEXT NOT NULL DEFAULT 'business_first_meeting',
    "bannedTopics" TEXT NOT NULL DEFAULT '[]',
    "sessionId" TEXT
);

-- CreateTable
CREATE TABLE "Pun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "inputText" TEXT NOT NULL,
    "scene" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "candidatesJson" JSON NOT NULL,
    "selectedText" TEXT NOT NULL,
    "professionalFitScore" INTEGER NOT NULL,
    "safetyFlag" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "savedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publishedAt" DATETIME,
    "likeStatus" TEXT,
    "usedInRealLife" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isHidden" BOOLEAN NOT NULL DEFAULT false,
    "communityLikeCount" INTEGER NOT NULL DEFAULT 0,
    "communitySaveCount" INTEGER NOT NULL DEFAULT 0,
    "reportCount" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Pun_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommunityLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "punId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CommunityLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CommunitySave" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "punId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CommunityReport" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "punId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "detail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_sessionId_key" ON "User"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityLike_userId_punId_key" ON "CommunityLike"("userId", "punId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunitySave_userId_punId_key" ON "CommunitySave"("userId", "punId");

-- CreateIndex
CREATE UNIQUE INDEX "CommunityReport_userId_punId_key" ON "CommunityReport"("userId", "punId");
