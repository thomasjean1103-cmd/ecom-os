import { AppHeader } from "@/components/layout/header";
import { AiMarketPanel } from "@/components/ui/ai-market-panel";
import { prisma } from "@/lib/prisma";

export default async function MarketIntelPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, niche: true, description: true },
  });

  return (
    <>
      <AppHeader screenId="market-intel" />
      <main className="p-4 md:p-6">
        <AiMarketPanel products={products} />
      </main>
    </>
  );
}
