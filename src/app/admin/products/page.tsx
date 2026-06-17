import { titleMeta } from "@/lib/i18n/metadata";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/ui";
import { ProductsAdmin } from "../AdminClient";
import { getDict } from "@/lib/i18n/server";

export const generateMetadata = titleMeta("商品", "Products");

export const dynamic = "force-dynamic";

export default async function AdminProducts() {
  const { t } = await getDict();
  const rows = await prisma.virtualProduct.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return (
    <div>
      <PageHeader title={t("page.admin.products.title")} subtitle={t("page.admin.products.subtitle")} />
      <ProductsAdmin initial={rows.map((p) => ({ id: p.id, slug: p.slug, name: p.name, kind: p.kind, price: Number(p.price), active: p.active, sortOrder: p.sortOrder }))} />
    </div>
  );
}
