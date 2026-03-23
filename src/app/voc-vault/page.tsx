import { AppHeader } from "@/components/layout/header";
import { AiVocPanel } from "@/components/ui/ai-voc-panel";
import { prisma } from "@/lib/prisma";

export default async function VocVaultPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, niche: true },
  });

  return (
    <>
      <AppHeader screenId="voc-vault" />
      <main className="p-4 md:p-6">
        <AiVocPanel products={products} />
      </main>
    </>
  );
}
