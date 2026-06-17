import { titleMeta } from "@/lib/i18n/metadata";
import Link from "next/link";
import { requireAdminPage } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const generateMetadata = titleMeta("Arete 管理后台", "Arete Admin");

const NAV: [string, string][] = [
  ["/admin", "总览"], ["/admin/users", "用户"], ["/admin/orders", "订单"],
  ["/admin/products", "商品"], ["/admin/memberships", "会员发放"], ["/admin/community", "社区审核"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdminPage();
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-1 border-b border-slate-800 pb-3">
        <span className="mr-2 text-sm font-bold text-indigo-300">⚙ 管理后台</span>
        {NAV.map(([h, l]) => (
          <Link key={h} href={h} className="rounded-lg px-3 py-1.5 text-sm text-slate-300 hover:bg-slate-800">{l}</Link>
        ))}
        <Link href="/dashboard" className="ml-auto text-xs text-slate-500 hover:text-slate-300">← 返回应用</Link>
      </div>
      {children}
    </div>
  );
}
