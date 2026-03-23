/*
  Warnings:

  - You are about to drop the `ProductIdea` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `checkoutFriction` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the column `flaws` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the column `pdpStructure` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the column `primaryPromise` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the column `urgencyType` on the `Competitor` table. All the data in the column will be lost.
  - You are about to drop the column `baselineMetrics` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `changedVariable` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `decision` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `durationDays` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `lockedVariables` on the `Experiment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Learning` table. All the data in the column will be lost.
  - You are about to drop the column `whatFailed` on the `Learning` table. All the data in the column will be lost.
  - You are about to drop the column `whatWorked` on the `Learning` table. All the data in the column will be lost.
  - You are about to drop the column `buyingSignal` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `contentSignal` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `decision` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `marketName` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `marketTemperature` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `openAngles` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `proofsCount` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `searchSignal` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `socialSignal` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `topBenefits` on the `MarketValidation` table. All the data in the column will be lost.
  - You are about to drop the column `buyingProximity` on the `VocEntry` table. All the data in the column will be lost.
  - You are about to drop the column `usageRecommendation` on the `VocEntry` table. All the data in the column will be lost.
  - Added the required column `productId` to the `Competitor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variableChanged` to the `Experiment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Learning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Learning` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `MarketValidation` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ProductIdea";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "niche" TEXT,
    "sourceUrl" TEXT,
    "imageUrl" TEXT,
    "painIntensity" INTEGER NOT NULL DEFAULT 0,
    "tam" INTEGER NOT NULL DEFAULT 0,
    "differentiation" INTEGER NOT NULL DEFAULT 0,
    "potentialMargin" INTEGER NOT NULL DEFAULT 0,
    "potentialAov" INTEGER NOT NULL DEFAULT 0,
    "bundleCapacity" INTEGER NOT NULL DEFAULT 0,
    "retentionPotential" INTEGER NOT NULL DEFAULT 0,
    "visualDemo" INTEGER NOT NULL DEFAULT 0,
    "adAngleCount" INTEGER NOT NULL DEFAULT 0,
    "multiSourceValidation" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "verdict" TEXT NOT NULL DEFAULT 'NOT_SCORED',
    "bestPath" TEXT,
    "whatMustBeTrue" TEXT,
    "whatKillsIt" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidence" TEXT NOT NULL DEFAULT '[]',
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "trend" TEXT NOT NULL DEFAULT 'STABLE',
    "niche" TEXT,
    "isAlert" BOOLEAN NOT NULL DEFAULT false,
    "alertMessage" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Avatar" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "identity" TEXT,
    "currentSituation" TEXT,
    "mainPain" TEXT,
    "failedSolutions" TEXT NOT NULL DEFAULT '[]',
    "beliefs" TEXT NOT NULL DEFAULT '[]',
    "hiddenDesire" TEXT,
    "buyingMoment" TEXT,
    "copyTriggers" TEXT NOT NULL DEFAULT '[]',
    "trustTriggers" TEXT NOT NULL DEFAULT '[]',
    "resistanceTriggers" TEXT NOT NULL DEFAULT '[]',
    "tofMessage" TEXT,
    "mofMessage" TEXT,
    "bofMessage" TEXT,
    "hottestMoment" TEXT,
    "whyHotThen" TEXT,
    "bestAngleForMoment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Avatar_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Positioning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "mainEnemy" TEXT,
    "beatenAlternative" TEXT,
    "corePromise" TEXT,
    "differentiatingMechanism" TEXT,
    "mainProof" TEXT,
    "recommendedTone" TEXT,
    "visualTerritory" TEXT,
    "comparisonTerrain" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Positioning_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "basePrice" REAL,
    "bundleStructure" TEXT,
    "freeShippingThreshold" REAL,
    "upsellOffer" TEXT,
    "crossSellOffer" TEXT,
    "rationale" TEXT,
    "expectedFriction" TEXT,
    "expectedGain" TEXT,
    "conversionDanger" TEXT,
    "marginDanger" TEXT,
    "testDecision" TEXT,
    "verdict" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Offer_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Angle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "productNiche" TEXT,
    "avatarRelevance" INTEGER NOT NULL DEFAULT 0,
    "competitorDiff" INTEGER NOT NULL DEFAULT 0,
    "visualDemonstrability" INTEGER NOT NULL DEFAULT 0,
    "emotionalPotential" INTEGER NOT NULL DEFAULT 0,
    "saturationLevel" INTEGER NOT NULL DEFAULT 0,
    "totalScore" INTEGER NOT NULL DEFAULT 0,
    "rank" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'CANDIDATE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CopyAsset" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "angle" TEXT,
    "funnelStage" TEXT,
    "targetEmotion" TEXT,
    "objectionHandled" TEXT,
    "contentSafe" TEXT,
    "contentAggressive" TEXT,
    "objective" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "productNiche" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Creative" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "hypothesis" TEXT,
    "angle" TEXT,
    "persona" TEXT,
    "hookVisual" TEXT,
    "hookVerbal" TEXT,
    "patternInterrupt" TEXT,
    "proofType" TEXT,
    "cta" TEXT,
    "format" TEXT,
    "kpiTarget" TEXT,
    "killThreshold" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Creative_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PdpVersion" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "priorityGoal" TEXT,
    "heroSection" TEXT NOT NULL DEFAULT '{}',
    "problemSection" TEXT NOT NULL DEFAULT '{}',
    "solutionSection" TEXT NOT NULL DEFAULT '{}',
    "socialProofSection" TEXT NOT NULL DEFAULT '{}',
    "howItWorksSection" TEXT NOT NULL DEFAULT '{}',
    "objectionSection" TEXT NOT NULL DEFAULT '{}',
    "finalCtaSection" TEXT NOT NULL DEFAULT '{}',
    "verdict" TEXT NOT NULL DEFAULT 'DRAFT',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PdpVersion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "RetentionFlow" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NOT_YET',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "triggerEvent" TEXT,
    "segments" TEXT NOT NULL DEFAULT '[]',
    "repeatOffer" TEXT,
    "crossSellOpps" TEXT NOT NULL DEFAULT '[]',
    "ambassadorPlan" TEXT,
    "flowContent" TEXT NOT NULL DEFAULT '[]',
    "decision" TEXT NOT NULL DEFAULT 'NOT_YET',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WeeklyPriority" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekStart" DATETIME NOT NULL,
    "moneyMove" TEXT NOT NULL,
    "biggestLeak" TEXT,
    "leakMetric" TEXT,
    "secondaryTasks" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "LaunchChecklist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "productValidated" BOOLEAN NOT NULL DEFAULT false,
    "marketValidated" BOOLEAN NOT NULL DEFAULT false,
    "avatarDefined" BOOLEAN NOT NULL DEFAULT false,
    "positioningValidated" BOOLEAN NOT NULL DEFAULT false,
    "offerArchitected" BOOLEAN NOT NULL DEFAULT false,
    "pdpLive" BOOLEAN NOT NULL DEFAULT false,
    "creativesReady" BOOLEAN NOT NULL DEFAULT false,
    "trackingSetup" BOOLEAN NOT NULL DEFAULT false,
    "cartAbandonActive" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CroAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "bounceRate" REAL,
    "cartAbandonRate" REAL,
    "avgTimeOnSite" REAL,
    "conversionRate" REAL,
    "aov" REAL,
    "atcRate" REAL,
    "biggestLeak" TEXT,
    "secondLeak" TEXT,
    "quickWins" TEXT NOT NULL DEFAULT '[]',
    "heavyWork" TEXT NOT NULL DEFAULT '[]',
    "weeklyMoneyMove" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "WinningPattern" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "evidence" TEXT NOT NULL DEFAULT '[]',
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DeadAngle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "angle" TEXT NOT NULL,
    "niche" TEXT,
    "whyFailed" TEXT NOT NULL,
    "observedSymptom" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "OfferBankEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "offerDescription" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "observedCvr" REAL,
    "observedAov" REAL,
    "observedMargin" REAL,
    "verdict" TEXT NOT NULL DEFAULT 'UNTESTED',
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ObjectionBankEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "objection" TEXT NOT NULL,
    "bestResponse" TEXT,
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "severity" INTEGER NOT NULL DEFAULT 3,
    "usage" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PhraseBankEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "phrase" TEXT NOT NULL,
    "source" TEXT,
    "emotion" TEXT,
    "context" TEXT,
    "usage" TEXT NOT NULL DEFAULT '[]',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KpiSnapshot" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "revenue" REAL,
    "conversionRate" REAL,
    "aov" REAL,
    "atcRate" REAL,
    "cartAbandonRate" REAL,
    "repeatRate" REAL,
    "ltv" REAL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Competitor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT,
    "promise" TEXT,
    "angle" TEXT,
    "offerStructure" TEXT,
    "priceRange" TEXT,
    "pdpAnalysis" TEXT,
    "checkoutAnalysis" TEXT,
    "guarantee" TEXT,
    "urgencyTactic" TEXT,
    "socialProof" TEXT,
    "weaknesses" TEXT,
    "stealItems" TEXT NOT NULL DEFAULT '[]',
    "adaptItems" TEXT NOT NULL DEFAULT '[]',
    "avoidItems" TEXT NOT NULL DEFAULT '[]',
    "counterItems" TEXT NOT NULL DEFAULT '[]',
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Competitor_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Competitor" ("angle", "createdAt", "guarantee", "id", "name", "offerStructure", "socialProof", "updatedAt") SELECT "angle", "createdAt", "guarantee", "id", "name", "offerStructure", "socialProof", "updatedAt" FROM "Competitor";
DROP TABLE "Competitor";
ALTER TABLE "new_Competitor" RENAME TO "Competitor";
CREATE TABLE "new_Experiment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "hypothesis" TEXT NOT NULL,
    "variableChanged" TEXT NOT NULL,
    "keptConstant" TEXT,
    "metricsBefore" TEXT NOT NULL DEFAULT '{}',
    "metricsAfter" TEXT NOT NULL DEFAULT '{}',
    "startDate" DATETIME,
    "endDate" DATETIME,
    "reviewDate" DATETIME,
    "killThreshold" TEXT,
    "verdict" TEXT NOT NULL DEFAULT 'RUNNING',
    "verdictNotes" TEXT,
    "learningGenerated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Experiment_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Experiment" ("createdAt", "hypothesis", "id", "killThreshold", "name", "reviewDate", "updatedAt") SELECT "createdAt", "hypothesis", "id", "killThreshold", "name", "reviewDate", "updatedAt" FROM "Experiment";
DROP TABLE "Experiment";
ALTER TABLE "new_Experiment" RENAME TO "Experiment";
CREATE TABLE "new_Learning" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "productType" TEXT,
    "avatar" TEXT,
    "angle" TEXT,
    "trafficContext" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "impact" TEXT,
    "sourceExperimentId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Learning" ("angle", "avatar", "createdAt", "id", "productType", "tags", "trafficContext", "updatedAt") SELECT "angle", "avatar", "createdAt", "id", "productType", "tags", "trafficContext", "updatedAt" FROM "Learning";
DROP TABLE "Learning";
ALTER TABLE "new_Learning" RENAME TO "Learning";
CREATE TABLE "new_MarketValidation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "temperature" TEXT NOT NULL DEFAULT 'COLD',
    "searchSignals" TEXT NOT NULL DEFAULT '[]',
    "socialSignals" TEXT NOT NULL DEFAULT '[]',
    "purchaseSignals" TEXT NOT NULL DEFAULT '[]',
    "contentSignals" TEXT NOT NULL DEFAULT '[]',
    "proofCount" INTEGER NOT NULL DEFAULT 0,
    "dominantObjections" TEXT NOT NULL DEFAULT '[]',
    "soughtBenefits" TEXT NOT NULL DEFAULT '[]',
    "saturatedAngles" TEXT NOT NULL DEFAULT '[]',
    "freeAngles" TEXT NOT NULL DEFAULT '[]',
    "verdict" TEXT NOT NULL DEFAULT 'NOT_VALIDATED',
    "killCriteria" TEXT NOT NULL DEFAULT '[]',
    "nextMove" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MarketValidation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MarketValidation" ("createdAt", "dominantObjections", "id", "saturatedAngles", "updatedAt") SELECT "createdAt", "dominantObjections", "id", "saturatedAngles", "updatedAt" FROM "MarketValidation";
DROP TABLE "MarketValidation";
ALTER TABLE "new_MarketValidation" RENAME TO "MarketValidation";
CREATE UNIQUE INDEX "MarketValidation_productId_key" ON "MarketValidation"("productId");
CREATE TABLE "new_VocEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "quote" TEXT NOT NULL,
    "source" TEXT,
    "sourceUrl" TEXT,
    "type" TEXT NOT NULL,
    "usage" TEXT NOT NULL DEFAULT '[]',
    "frequency" INTEGER NOT NULL DEFAULT 1,
    "emotionalIntensity" INTEGER NOT NULL DEFAULT 3,
    "purchaseProximity" INTEGER NOT NULL DEFAULT 3,
    "productNiche" TEXT,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_VocEntry" ("createdAt", "emotionalIntensity", "frequency", "id", "quote", "source", "type", "updatedAt") SELECT "createdAt", "emotionalIntensity", "frequency", "id", "quote", "source", "type", "updatedAt" FROM "VocEntry";
DROP TABLE "VocEntry";
ALTER TABLE "new_VocEntry" RENAME TO "VocEntry";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Positioning_productId_key" ON "Positioning"("productId");
