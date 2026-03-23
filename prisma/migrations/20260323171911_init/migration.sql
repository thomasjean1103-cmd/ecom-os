-- CreateTable
CREATE TABLE "ProductIdea" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "problemIntensity" INTEGER NOT NULL,
    "tam" INTEGER NOT NULL,
    "differentiation" INTEGER NOT NULL,
    "marginPotential" INTEGER NOT NULL,
    "aovPotential" INTEGER NOT NULL,
    "creatorFit" INTEGER NOT NULL,
    "retentionPotential" INTEGER NOT NULL,
    "visualDemo" INTEGER NOT NULL,
    "adAngleCount" INTEGER NOT NULL,
    "multiSourceValidation" INTEGER NOT NULL,
    "totalScore" INTEGER NOT NULL,
    "recommendedPath" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MarketValidation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "marketName" TEXT NOT NULL,
    "searchSignal" INTEGER NOT NULL,
    "socialSignal" INTEGER NOT NULL,
    "buyingSignal" INTEGER NOT NULL,
    "contentSignal" INTEGER NOT NULL,
    "proofsCount" INTEGER NOT NULL,
    "marketTemperature" TEXT NOT NULL,
    "dominantObjections" TEXT NOT NULL,
    "topBenefits" TEXT NOT NULL,
    "saturatedAngles" TEXT NOT NULL,
    "openAngles" TEXT NOT NULL,
    "decision" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Competitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "primaryPromise" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "offerStructure" TEXT NOT NULL,
    "pdpStructure" TEXT NOT NULL,
    "checkoutFriction" TEXT NOT NULL,
    "guarantee" TEXT NOT NULL,
    "urgencyType" TEXT NOT NULL,
    "socialProof" TEXT NOT NULL,
    "flaws" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VocEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "usageRecommendation" TEXT NOT NULL,
    "frequency" INTEGER NOT NULL,
    "emotionalIntensity" INTEGER NOT NULL,
    "buyingProximity" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT NOT NULL,
    "changedVariable" TEXT NOT NULL,
    "lockedVariables" TEXT NOT NULL,
    "baselineMetrics" TEXT NOT NULL,
    "durationDays" INTEGER NOT NULL,
    "killThreshold" TEXT NOT NULL,
    "reviewDate" DATETIME NOT NULL,
    "decision" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Learning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "whatWorked" TEXT NOT NULL,
    "whatFailed" TEXT NOT NULL,
    "productType" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "trafficContext" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
