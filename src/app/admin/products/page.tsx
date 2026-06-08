import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { ProductsAdmin } from "../AdminClient";

export const metadata = { title: "商品" };

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const rows = await prisma.virtualProduct.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div>
      <PageHeader title="商品" subtitle="Emporion 虚拟商品:新增、改价、上下架。" />
      <ProductsAdmin initial={rows.map((p) => ({ id: p.id, slug: p.slug, name: p.name, kind: p.kind, price: Number(p.price), active: p.active, sortOrder: p.sortOrder }))} />
    </div>
  );
}
