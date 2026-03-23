import { AppHeader } from "@/components/layout/header";
import { AiAvatarPanel } from "@/components/ui/ai-avatar-panel";
import { prisma } from "@/lib/prisma";

export default async function AvatarStudioPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 30,
    select: { id: true, name: true, niche: true, description: true },
  });

  return (
    <>
      <AppHeader screenId="avatar-studio" />
      <main className="p-4 md:p-6">
        <AiAvatarPanel products={products} />
      </main>
    </>
  );
}
