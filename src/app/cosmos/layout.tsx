import DomainTabs from "@/components/DomainTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DomainTabs
        tabs={[
          { href: "/cosmos", zh: "世界观", en: "Worldview" },
          { href: "/cosmos/dashboard", zh: "仪表盘", en: "Dashboard" },
          { href: "/cosmos/archetypes", zh: "原型", en: "Archetypes" },
          { href: "/cosmos/constellation", zh: "星座图", en: "Constellation" },
        ]}
      />
      {children}
    </>
  );
}
