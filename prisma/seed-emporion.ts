// Emporion — virtual-goods catalog seed. Idempotent (upsert by slug).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Kind = "MEMBERSHIP_DAYS" | "CREDITS" | "CONTENT";
type Tier = "PLUS" | "PRO";

const P: { slug: string; name: string; description: string; kind: Kind; price: number;
  grantTier?: Tier; grantDays?: number; grantCredits?: number; grantContentKey?: string; sortOrder: number }[] = [
  { slug: "plus-30d", name: "Plus 会员 · 30天", description: "解锁全部 AI 教练、决策/心智模型/天才建模与周复盘。", kind: "MEMBERSHIP_DAYS", price: 39, grantTier: "PLUS", grantDays: 30, sortOrder: 1 },
  { slug: "pro-30d", name: "Pro 会员 · 30天", description: "在 Plus 基础上解锁数字孪生、卓越适配与全部组织引擎。", kind: "MEMBERSHIP_DAYS", price: 99, grantTier: "PRO", grantDays: 30, sortOrder: 2 },
  { slug: "pro-7d", name: "Pro 体验 · 7天", description: "低门槛体验 Pro 全部能力,到期自动回落。", kind: "MEMBERSHIP_DAYS", price: 29, grantTier: "PRO", grantDays: 7, sortOrder: 3 },
  { slug: "credits-100", name: "智慧点数 ×100", description: "用于 AI 加量运行、报告生成等按次消耗。", kind: "CREDITS", price: 9.9, grantCredits: 100, sortOrder: 4 },
  { slug: "credits-600", name: "智慧点数 ×600", description: "更划算的加量包(约 6.1 折/点)。", kind: "CREDITS", price: 36, grantCredits: 600, sortOrder: 5 },
  { slug: "genius-export", name: "天才蓝图导出包", description: "解锁 20 位天才蓝图的结构化导出(永久)。", kind: "CONTENT", price: 19.9, grantContentKey: "genius-blueprint-export", sortOrder: 6 },
  { slug: "mnemosyne-pack", name: "Mnemosyne 精选听书包", description: "解锁听书成长全部公共领域精选与朗读清单(永久)。", kind: "CONTENT", price: 12.9, grantContentKey: "mnemosyne-premium-pack", sortOrder: 7 },
];

async function main() {
  for (const p of P) {
    await prisma.virtualProduct.upsert({
      where: { slug: p.slug },
      update: { name: p.name, description: p.description, kind: p.kind, price: p.price,
        grantTier: p.grantTier ?? null, grantDays: p.grantDays ?? 0, grantCredits: p.grantCredits ?? 0,
        grantContentKey: p.grantContentKey ?? "", sortOrder: p.sortOrder, active: true },
      create: { slug: p.slug, name: p.name, description: p.description, kind: p.kind, price: p.price,
        grantTier: p.grantTier ?? null, grantDays: p.grantDays ?? 0, grantCredits: p.grantCredits ?? 0,
        grantContentKey: p.grantContentKey ?? "", sortOrder: p.sortOrder },
    });
  }
  console.log(`Seeded ${P.length} virtual products.`);
}

main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
