import { AppHeader } from "@/components/layout/header";
import { AiCompetitorPanel } from "@/components/ui/ai-competitor-panel";
import { prisma } from "@/lib/prisma";

export default async function CompetitorBoardPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, niche: true },
  });

  return (
    <>
      <AppHeader screenId="competitor-board" />
      <main className="p-4 md:p-6">
        <AiCompetitorPanel products={products} />
      </main>
    </>
  );
}
