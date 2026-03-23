import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.marketValidation.deleteMany(),
    prisma.competitor.deleteMany(),
    prisma.avatar.deleteMany(),
    prisma.positioning.deleteMany(),
    prisma.offer.deleteMany(),
    prisma.pdpVersion.deleteMany(),
    prisma.creative.deleteMany(),
    prisma.experiment.deleteMany(),
    prisma.product.deleteMany(),
    prisma.vocEntry.deleteMany(),
    prisma.pattern.deleteMany(),
    prisma.copyAsset.deleteMany(),
    prisma.retentionFlow.deleteMany(),
    prisma.weeklyPriority.deleteMany(),
    prisma.launchChecklist.deleteMany(),
    prisma.croAudit.deleteMany(),
    prisma.learning.deleteMany(),
    prisma.winningPattern.deleteMany(),
    prisma.deadAngle.deleteMany(),
    prisma.offerBankEntry.deleteMany(),
    prisma.objectionBankEntry.deleteMany(),
    prisma.phraseBankEntry.deleteMany(),
    prisma.kpiSnapshot.deleteMany(),
    prisma.angle.deleteMany(),
  ]);

  const product = await prisma.product.create({
    data: {
      name: "Sleep Relief Patch",
      niche: "Sleep & Recovery",
      description: "Patch de nuit pour endormissement rapide.",
      painIntensity: 9,
      tam: 8,
      differentiation: 7,
      potentialMargin: 8,
      potentialAov: 7,
      bundleCapacity: 8,
      retentionPotential: 9,
      visualDemo: 7,
      adAngleCount: 8,
      multiSourceValidation: 7,
      totalScore: 78,
      verdict: "GO",
      bestPath: "evergreen",
      whatMustBeTrue: "Preuve percue rapide et credibilite ingredient.",
      whatKillsIt: "Promesse trop medicale non prouvable.",
    },
  });

  await prisma.marketValidation.create({
    data: {
      productId: product.id,
      temperature: "HOT",
      searchSignals: JSON.stringify(["sleep patch trend +31%", "keyword volume stable >10k"]),
      socialSignals: JSON.stringify(["UGC comments recurring", "high saves on insomnia reels"]),
      purchaseSignals: JSON.stringify(["3 stores scaling", "recent reviews weekly"]),
      contentSignals: JSON.stringify(["youtube review cluster", "forum insomnia threads"]),
      proofCount: 4,
      dominantObjections: JSON.stringify(["Does it really work?", "Any side effects?"]),
      soughtBenefits: JSON.stringify(["fall asleep faster", "no morning fog"]),
      saturatedAngles: JSON.stringify(["miracle cure"]),
      freeAngles: JSON.stringify(["routine stacking", "travel sleep rescue"]),
      verdict: "GO",
      killCriteria: JSON.stringify(["If purchase proof drops for 14 days -> NO_GO"]),
      nextMove: "Launch structured angle tests with fixed offer.",
    },
  });

  await prisma.competitor.createMany({
    data: [
      { productId: product.id, name: "DreamTape", angle: "science-backed", priceRange: "29-49" },
      { productId: product.id, name: "CalmNight", angle: "lifestyle", priceRange: "25-45" },
      { productId: product.id, name: "PatchWell", angle: "fast effect", priceRange: "19-39" },
    ],
  });

  await prisma.avatar.create({
    data: {
      productId: product.id,
      name: "Overworked Parent",
      identity: "35-45 parent, busy schedule",
      currentSituation: "Sleeps late, wakes exhausted.",
      mainPain: "Cannot switch off mind at night.",
      hiddenDesire: "Wake up calm and productive.",
      tofMessage: "You are not broken, your routine is.",
      mofMessage: "Simple nightly protocol with measurable outcomes.",
      bofMessage: "Try risk-free for 30 nights.",
    },
  });

  await prisma.positioning.create({
    data: {
      productId: product.id,
      mainEnemy: "Chaotic bedtime routine",
      beatenAlternative: "Melatonin overload",
      corePromise: "Fall asleep faster without morning fog.",
      differentiatingMechanism: "Timed transdermal release",
      mainProof: "Before/after sleep latency logs",
      recommendedTone: "educational",
      visualTerritory: "calm, clinical minimal",
      comparisonTerrain: "sleep latency and morning energy",
    },
  });

  await prisma.offer.createMany({
    data: [
      { productId: product.id, name: "Starter", scenario: "conversion_max", basePrice: 24.9 },
      { productId: product.id, name: "Bundle x2", scenario: "aov_max", basePrice: 44.9 },
      { productId: product.id, name: "Premium Routine", scenario: "margin_max", basePrice: 59.9 },
      { productId: product.id, name: "Monthly Refill", scenario: "ltv_max", basePrice: 29.9 },
    ],
  });

  await prisma.angle.createMany({
    data: [
      { name: "Sleep latency reduction", avatarRelevance: 9, competitorDiff: 7, visualDemonstrability: 7, emotionalPotential: 8, saturationLevel: 4, totalScore: 37 },
      { name: "Morning energy rebound", avatarRelevance: 8, competitorDiff: 8, visualDemonstrability: 8, emotionalPotential: 7, saturationLevel: 3, totalScore: 38 },
      { name: "No-pill sleep routine", avatarRelevance: 8, competitorDiff: 6, visualDemonstrability: 6, emotionalPotential: 8, saturationLevel: 5, totalScore: 33 },
    ],
  });

  await prisma.copyAsset.create({
    data: {
      type: "hook",
      angle: "Morning energy rebound",
      funnelStage: "TOF",
      targetEmotion: "relief",
      contentSafe: "Wake up clear, not crushed.",
      contentAggressive: "Stop surviving mornings.",
      objective: "Scroll stop in first 2 seconds",
    },
  });

  await prisma.creative.create({
    data: {
      productId: product.id,
      name: "UGC Morning Split-screen",
      hypothesis: "Morning-focused angle improves CTR.",
      angle: "Morning energy rebound",
      format: "ugc_video",
      kpiTarget: JSON.stringify({ metric: "CTR", target: 2.0 }),
      killThreshold: JSON.stringify({ metric: "CPC", max: 3.0 }),
    },
  });

  await prisma.pdpVersion.create({
    data: {
      productId: product.id,
      version: 1,
      priorityGoal: "increase_atc",
      heroSection: JSON.stringify({ title: "Sleep Faster Tonight" }),
      problemSection: JSON.stringify({ copy: "Insomnia steals your days." }),
      solutionSection: JSON.stringify({ copy: "Timed transdermal support." }),
      socialProofSection: JSON.stringify({ reviews: 2387 }),
      howItWorksSection: JSON.stringify({ steps: 3 }),
      objectionSection: JSON.stringify({ faq: 6 }),
      finalCtaSection: JSON.stringify({ cta: "Try 30 nights" }),
    },
  });

  await prisma.croAudit.create({
    data: {
      bounceRate: 63,
      cartAbandonRate: 71,
      avgTimeOnSite: 54,
      conversionRate: 2.1,
      aov: 52,
      atcRate: 8.7,
      biggestLeak: "Checkout friction",
      secondLeak: "Hero clarity",
      quickWins: JSON.stringify(["Enable express pay", "Add trust badges", "Shorten checkout form"]),
      heavyWork: JSON.stringify(["PDP hero refactor"]),
      weeklyMoneyMove: "Fix checkout friction before scaling traffic.",
    },
  });

  const experiment = await prisma.experiment.create({
    data: {
      productId: product.id,
      name: "Checkout reassurance v2",
      type: "pdp",
      hypothesis: "Reassurance block increases CVR.",
      variableChanged: "Checkout trust section",
      metricsBefore: JSON.stringify({ cvr: 2.1 }),
      metricsAfter: JSON.stringify({ cvr: 2.6 }),
      killThreshold: JSON.stringify({ cvr_min: 1.8 }),
      verdict: "ITERATE",
      learningGenerated: true,
    },
  });

  await prisma.learning.create({
    data: {
      type: "insight",
      description: "Checkout reassurance improved early conversion signal.",
      productType: "sleep aid",
      avatar: "Overworked Parent",
      angle: "Morning energy rebound",
      trafficContext: "Meta cold",
      tags: JSON.stringify(["checkout", "trust", "conversion"]),
      impact: "medium",
      sourceExperimentId: experiment.id,
    },
  });

  await prisma.winningPattern.create({
    data: {
      category: "hook",
      pattern: "Pain-to-relief contrast in first 2 seconds",
      evidence: JSON.stringify(["CTR above baseline on 3 creatives"]),
      tags: JSON.stringify(["tof", "meta"]),
    },
  });

  await prisma.deadAngle.create({
    data: {
      angle: "Miracle cure promise",
      niche: "Sleep",
      whyFailed: "Low trust and high refund intent.",
      observedSymptom: "High click, low purchase",
    },
  });

  await prisma.weeklyPriority.create({
    data: {
      weekStart: new Date(),
      moneyMove: "Reduce checkout friction and activate express pay.",
      biggestLeak: "Checkout",
      leakMetric: "Cart abandon 71%",
      secondaryTasks: JSON.stringify(["Hero proof refresh", "FAQ objection update"]),
    },
  });

  await prisma.kpiSnapshot.create({
    data: {
      date: new Date(),
      revenue: 42800,
      conversionRate: 2.4,
      aov: 58,
      atcRate: 8.9,
      cartAbandonRate: 72,
      repeatRate: 16,
      ltv: 132,
      notes: "Seed snapshot",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed completed.");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
